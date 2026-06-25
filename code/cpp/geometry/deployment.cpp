#include "deployment.h"
#include "unit_pattern.h"
#include <Eigen/src/Core/Matrix.h>
#include <Eigen/src/QR/HouseholderQR.h>
#include <Eigen/src/SparseCholesky/SimplicialCholesky.h>
#include <Eigen/src/SparseCore/SparseMatrix.h>
#include <Eigen/src/SparseLU/SparseLU.h>
#include <Eigen/src/SparseQR/SparseQR.h>
#include <Optiz/Linear/QuadraticObjectiveD.h>
#include <igl/harmonic.h>
#include <initializer_list>

namespace kirigami {

Eigen::SparseMatrix<double> speye(int n) {
  Eigen::SparseMatrix<double> A(n, n);
  A.setIdentity();
  return A;
}

template <typename... Args> Eigen::MatrixXd vcat(Args... args) {
  int num_rows = 0;
  int num_cols = 0;
  (
      [&] {
        num_rows += args.rows();
        num_cols = std::max(num_cols, (int)args.cols());
      }(),
      ...);
  Eigen::MatrixXd A = Eigen::MatrixXd::Zero(num_rows, num_cols);
  int row_shift = 0;
  (
      [&] {
        A.block(row_shift, 0, args.rows(), args.cols()) = args;
        row_shift += args.rows();
      }(),
      ...);
  return A;
}

Eigen::SparseMatrix<double>
spcat(const std::initializer_list<
      std::initializer_list<Eigen::SparseMatrix<double>>> &args) {
  std::vector<Eigen::Triplet<double>> triplets;
  int col_shift = 0, row_shift = 0;
  int last_arg_rows = 0, max_cols = 0;
  for (auto &arg : args) {
    for (auto &mat : arg) {
      for (int k = 0; k < mat.outerSize(); ++k) {
        for (Eigen::SparseMatrix<double>::InnerIterator it(mat, k); it; ++it) {
          triplets.push_back(Eigen::Triplet<double>(
              it.row() + row_shift, it.col() + col_shift, it.value()));
        }
      }
      col_shift += mat.cols();
      max_cols = std::max(max_cols, col_shift);
      last_arg_rows = std::max(last_arg_rows, (int)mat.rows());
    }
    col_shift = 0;
    row_shift += last_arg_rows;
    last_arg_rows = 0;
  }
  Eigen::SparseMatrix<double> A(row_shift, max_cols);
  A.setFromTriplets(triplets.begin(), triplets.end());
  return A;
}

std::pair<Eigen::SparseMatrix<double>, Eigen::MatrixXd>
remove_zero_cols(const Eigen::SparseMatrix<double> &mat,
                 const Eigen::MatrixXd &rhs) {
  std::vector<int> old_to_new_inds(mat.cols(), -1);
  int new_col = 0;
  for (int k = 0; k < mat.outerSize(); ++k) {
    bool any_non_zeros = false;
    for (Eigen::SparseMatrix<double>::InnerIterator it(mat, k); it; ++it) {
      if (std::abs(it.value()) > 1e-6) {
        any_non_zeros = true;
        break;
      }
    }
    if (any_non_zeros) {
      old_to_new_inds[k] = new_col;
      new_col++;
    }
  }
  std::vector<Eigen::Triplet<double>> triplets;
  for (int k = 0; k < mat.outerSize(); ++k) {
    if (old_to_new_inds[k] == -1)
      continue;
    for (Eigen::SparseMatrix<double>::InnerIterator it(mat, k); it; ++it) {
      if (old_to_new_inds[it.row()] == -1 || old_to_new_inds[it.col()] == -1)
        continue;
      triplets.push_back(Eigen::Triplet<double>(
          old_to_new_inds[it.row()], old_to_new_inds[it.col()], it.value()));
    }
  }
  Eigen::SparseMatrix<double> A(new_col, new_col);
  A.setFromTriplets(triplets.begin(), triplets.end());
  Eigen::MatrixXd new_rhs(new_col, rhs.cols());
  for (int i = 0; i < rhs.rows(); i++) {
    if (old_to_new_inds[i] == -1)
      continue;
    new_rhs.row(old_to_new_inds[i]) = rhs.row(i);
  }
  return std::make_pair(A, new_rhs);
}

std::tuple<Eigen::SparseMatrix<double>, Eigen::VectorXi, Eigen::MatrixXd>
get_constraints(const UnitPattern &unit_pattern) {
  auto &mesh = unit_pattern.mesh;
  const utils::Hmesh::Edge *boundary_edge = nullptr;
  for (auto &edge : mesh.edges) {
    if (!edge.twin()) {
      boundary_edge = &edge;
      break;
    }
  }
  if (!boundary_edge) {
    throw std::runtime_error("No boundary edge found");
  }
  // 1. Find how many vertices are on the boundary.
  int num_boundary_vertices = 0;
  const utils::Hmesh::Edge *edge = boundary_edge->next()->origin()->edge();
  while (num_boundary_vertices++ < 1000 && edge != boundary_edge) {
    edge = edge->next()->origin()->edge();
  }
  if (num_boundary_vertices >= 1000) {
    throw std::runtime_error("Too many boundary vertices");
  }
  std::vector<Eigen::Triplet<double>> triplets;
  Eigen::VectorXi boundary_vertices(num_boundary_vertices);
  Eigen::MatrixXd rhs(num_boundary_vertices, 2);
  // 2. Add constraints.
  for (int i = 0; i < num_boundary_vertices;
       i++, edge = edge->next()->origin()->edge()) {
    triplets.push_back(Eigen::Triplet<double>(i, edge->vi, 1));
    double theta = (2.0 * M_PI * i) / num_boundary_vertices;
    rhs.row(i) = 4 * Eigen::RowVector2d(cos(theta), sin(theta));
    boundary_vertices(i) = edge->vi;
  }
  Eigen::SparseMatrix<double> A(num_boundary_vertices, mesh.nv());
  A.setFromTriplets(triplets.begin(), triplets.end());
  return std::make_tuple(A, boundary_vertices, rhs);
}

Eigen::MatrixXd tutte(const utils::Hmesh &mesh,
                      const Eigen::VectorXi &known_inds,
                      const Eigen::MatrixXd &known_vals) {
  Optiz::QuadraticObjectiveD objective(mesh.nv(), 2);
  objective.add_weighted_equations(
      mesh.edges.size(), [&](int i, auto &x, auto add_eq) {
        auto &edge = mesh.edges[i];
        if (edge.twin() && edge.index > edge.twin()->index)
          return;

        add_eq(1, x(edge.vi) - x(edge.next()->vi));
      });
  objective.set_knowns(known_inds, known_vals);
  return objective.solve();
}

std::tuple<UnitPattern, Eigen::MatrixXd>
make_deployable(const UnitPattern &unit_pattern,
                bool map_boundary_to_unit_disk) {
  UnitPattern pattern = unit_pattern;
  if (pattern.periodicity.norm() > 1e-6) {
    pattern.make_periodic();
  }
  auto &mesh = pattern.mesh;

  // 1. Initialize holes.
  std::vector<std::set<int>> holes;
  std::vector<int> vertex_to_hole(mesh.nv(), -1);
  for (int i = 0; i < mesh.nv(); i++) {
    holes.push_back(std::set<int>());
    holes.back().insert(i);
    vertex_to_hole[i] = holes.size() - 1;
  }

  // 2. Merge holes.
  auto merge_holes = [&](int v0, int v1) {
    int hole1 = vertex_to_hole[v0];
    int hole2 = vertex_to_hole[v1];
    if (hole1 > hole2) {
      std::swap(hole1, hole2);
    }
    holes[hole1].insert(holes[hole2].begin(), holes[hole2].end());
    for (int i : holes[hole2]) {
      vertex_to_hole[i] = hole1;
    }
    holes[hole2].clear();
  };
  for (auto &edge : mesh.edges) {
    if (!edge.twin())
      continue;
    if (pattern.face_colors[edge.fi] == pattern.face_colors[edge.twin()->fi] &&
        vertex_to_hole[edge.vi] != vertex_to_hole[edge.next()->vi]) {
      // Both vertex belong to the same hole, merge the holes.
      merge_holes(edge.vi, edge.next()->vi);
    }

    // If the edge is periodic, merge the holes of the source vertex.
    if (edge.vi != edge.twin()->next()->vi &&
        vertex_to_hole[edge.vi] != vertex_to_hole[edge.twin()->next()->vi]) {
      merge_holes(edge.vi, edge.twin()->next()->vi);
    }
  }

  // 3. Keep only non-empty holes.
  std::vector<std::set<int>> non_empty_holes;
  for (int i = 0; i < holes.size(); i++) {
    if (!holes[i].empty()) {
      non_empty_holes.push_back(holes[i]);
      for (auto v : holes[i]) {
        vertex_to_hole[v] = non_empty_holes.size() - 1;
      }
    }
  }
  holes = non_empty_holes;

  // 4. print holes.
  // for (auto &hole : holes) {
  //   std::cout << "Hole: ";
  //   for (auto &v : hole) {
  //     std::cout << v << " ";
  //   }
  //   std::cout << std::endl;
  // }

  // 5. Build linear system.
  std::vector<Eigen::Triplet<double>> triplets;
  std::vector<Eigen::Triplet<double>> constraints_triplets;
  int num_constraints = 0;
  std::vector<Eigen::Vector2d> constraints_rhs;
  for (auto &edge : mesh.edges) {
    if (!edge.twin())
      continue;
    if (pattern.face_colors[edge.fi] == 0 ||
        (pattern.face_colors[edge.fi] == 2 &&
         pattern.face_colors[edge.twin()->fi] == 1)) {
      // Cutting into the tail vertex.
      if (!mesh.is_boundary_vertex(edge.next()->vi)) {
        int hole = vertex_to_hole[edge.next()->vi];
        triplets.push_back(Eigen::Triplet<double>(hole, edge.vi, 1));
        triplets.push_back(Eigen::Triplet<double>(hole, edge.next()->vi, -1));
      }
    } else {
      // Cutting into the head vertex.
      if (!mesh.is_boundary_vertex(edge.vi)) {
        int hole = vertex_to_hole[edge.vi];
        triplets.push_back(Eigen::Triplet<double>(hole, edge.vi, -1));
        triplets.push_back(Eigen::Triplet<double>(hole, edge.next()->vi, 1));
      }
    }

    // Periodic edge.
    if (edge.vi != edge.twin()->next()->vi) {
      Eigen::Vector2d diff =
          mesh.V.row(edge.vi) - mesh.V.row(edge.twin()->next()->vi);
      triplets.push_back(
          Eigen::Triplet<double>(holes.size() + num_constraints, edge.vi, 1));
      triplets.push_back(Eigen::Triplet<double>(holes.size() + num_constraints,
                                                edge.twin()->next()->vi, -1));
      constraints_rhs.push_back(diff);
      num_constraints++;
    }

    // Same colors, only add constraint once for one of the vertices.
    // if (pattern.face_colors[edge.fi] == pattern.face_colors[edge.twin()->fi])
    // {
    //   triplets.push_back(
    //       Eigen::Triplet<double>(holes.size() + num_constraints, edge.vi,
    //       1));
    //   constraints_rhs.push_back(mesh.V.row(edge.vi));
    //   num_constraints++;
    // }
  }
  if (!map_boundary_to_unit_disk) {
    triplets.push_back(
        Eigen::Triplet<double>(holes.size() + num_constraints, 0, 1));
    constraints_rhs.push_back(mesh.V.row(0));
    num_constraints++;
  }
  Eigen::SparseMatrix<double> A(holes.size() + num_constraints, mesh.nv());
  A.setFromTriplets(triplets.begin(), triplets.end());
  Eigen::MatrixXd b(num_constraints + holes.size(), 2);
  b.topRows(holes.size()).setZero();
  b.bottomRows(num_constraints) = convert::to_eig_mat(constraints_rhs);

  // 6. Solve.
  Eigen::MatrixXd kernel = A.toDense().fullPivLu().kernel();

  Eigen::MatrixXd orig_V = mesh.V;
  if (map_boundary_to_unit_disk) {
    std::cout << "Mapping boundary to unit disk" << std::endl;
    auto [A_pos, boundary_verts, b_pos] = get_constraints(unit_pattern);
    std::cout << "Boundary verts size: " << boundary_verts.size() << std::endl;
    // igl::harmonic(mesh.V, convert::to_eig_mat(mesh.F), boundary_verts, b_pos,
    // 1,
    //               orig_V);
    orig_V = tutte(mesh, boundary_verts, b_pos);

    A = spcat({{A}, {A_pos}});
    b = vcat(b, b_pos);
  }
  auto system = spcat({//
                       {speye(mesh.nv()), A.transpose()},
                       {A}});
  auto rhs = vcat(orig_V, b);
  // std::tie(system, rhs) = remove_zero_cols(system, rhs);
  std::cout << "Solving system, num_constraints:" << num_constraints
            << ", num_holes:" << holes.size() << ", nv :" << mesh.nv()
            << std::endl;
  // Eigen::SparseLU<Eigen::SparseMatrix<double>> solver;
  // solver.compute(system);
  // if (solver.info() != Eigen::Success) {
  //   std::cout << "solver log: " << solver.info() << std::endl;
  //   std::cout << "solver message: " << solver.lastErrorMessage() <<
  //   std::endl;
  // }
  Eigen::MatrixXd x =
      // Eigen::SimplicialLDLT<Eigen::SparseMatrix<double>>(system)
      // Eigen::SparseLU<Eigen::SparseMatrix<double>>(system)
      Eigen::SparseQR<Eigen::SparseMatrix<double>, Eigen::COLAMDOrdering<int>>(
          system)
          .solve(rhs)
          .eval()
          .topRows(mesh.nv());
  std::cout << "Solved system" << std::endl;
  UnitPattern res = UnitPattern{utils::Hmesh(x, mesh.F), pattern.periodicity,
                                pattern.face_colors};
  return std::make_tuple(res, kernel);
}

} // namespace kirigami