#include "unit_pattern.h"
#include "kirigami.h"
#include <Eigen/src/Core/Matrix.h>
#include <complex>

namespace kirigami {

UnitPattern &UnitPattern::make_periodic() {
  for (auto &edge : mesh.edges) {
    if (edge.twin())
      continue;
    for (auto &other_edge : mesh.edges) {
      if (other_edge.twin())
        continue;
      bool found = false;
      for (int x = -2; x <= 2 && !found; x++) {
        for (int y = -2; y <= 2 && !found; y++) {
          Eigen::Vector2d shift =
              x * periodicity.row(0) + y * periodicity.row(1);
          if ((edge.origin()->coords() + shift -
               other_edge.next()->origin()->coords())
                      .norm() < 1e-3 &&
              (edge.next()->origin()->coords() + shift -
               other_edge.origin()->coords())
                      .norm() < 1e-3) {
            edge.ti = other_edge.index;
            edge.shift_x = x;
            edge.shift_y = y;
            other_edge.ti = edge.index;
            other_edge.shift_x = -x;
            other_edge.shift_y = -y;
            found = true;
          }
        }
      }
    }
    if (!edge.twin()) {
      std::cout << "No twin for edge " << edge.index << std::endl;
    }
  }
  return *this;
}

UnitPattern UnitPattern::simplify() {
  UnitPattern simplified = *this;
  bool b_simplified = true;
  while (b_simplified) {
    utils::Hmesh new_mesh = simplified.mesh;
    int min_nv = simplified.mesh.nv();
    b_simplified = false;
    for (int f = 0; f < simplified.mesh.faces.size() && !b_simplified; f++) {
      for (int rep_x = -1; rep_x <= 1 && !b_simplified; rep_x++) {
        for (int rep_y = -1; rep_y <= 1 && !b_simplified; rep_y++) {
          Eigen::RowVector2d shift =
              rep_x * periodicity.row(0) + rep_y * periodicity.row(1);
          std::vector<Eigen::VectorXd> new_verts;
          // Copy verts.
          for (int vi = 0; vi < simplified.mesh.nv(); vi++) {
            new_verts.push_back(simplified.mesh.V.row(vi));
          }
          std::vector<std::vector<int>> new_faces = simplified.mesh.F;
          // Shift face.
          for (int j = 0; j < simplified.mesh.F[f].size(); j++) {
            new_faces[f][j] = new_verts.size();
            new_verts.push_back(simplified.mesh.V.row(simplified.mesh.F[f][j]) +
                                shift);
          }
          utils::Hmesh tmp_mesh =
              utils::Hmesh(convert::to_eig_mat(new_verts), new_faces)
                  .merge_close_verts()
                  .remove_unused_verts();
          if (tmp_mesh.nv() < min_nv) {
            min_nv = tmp_mesh.nv();
            new_mesh = tmp_mesh;
            b_simplified = true;
          }
        }
      }
    }
    simplified.mesh = new_mesh;
  }
  return simplified;
}

UnitPattern UnitPattern::deploy(float angle, bool add_holes,
                                bool merge_verts) const {
  UnitPattern deployed = *this;
  std::tie(deployed.mesh, deployed.periodicity) = kirigami::deploy(
      deployed.mesh, deployed.face_colors, deployed.periodicity, angle);
  if (add_holes) {
    std::vector<Eigen::MatrixXd> new_verts;
    for (int i = 0; i < deployed.mesh.nv(); i++) {
      new_verts.push_back(deployed.mesh.V.row(i));
    }
    std::vector<std::vector<int>> new_faces = deployed.mesh.F;
    auto holes = get_holes();
    for (auto &hole : holes) {
      std::vector<int> new_face;
      for (auto &v : hole.vertices) {
        new_face.push_back(new_verts.size());
        new_verts.push_back(deployed.mesh.V.row(new_faces[v.face][v.fvi]) +
                            v.shift_x * deployed.periodicity.row(0) +
                            v.shift_y * deployed.periodicity.row(1));
      }
      new_faces.push_back(new_face);
      deployed.face_colors.push_back(2);
    }
    deployed.mesh = utils::Hmesh(convert::to_eig_mat(new_verts), new_faces);
  }
  if (merge_verts)
    deployed.mesh = deployed.mesh.merge_close_verts().remove_unused_verts();
  return deployed;
}

std::vector<UnitPattern::Hole> UnitPattern::get_holes() const {
  UnitPattern pattern = *this;
  pattern.make_periodic();
  std::vector<UnitPattern::Hole> holes;

  std::vector<int> used_edges(pattern.mesh.edges.size(), 0);
  for (auto &edge : pattern.mesh.edges) {
    if (used_edges[edge.index])
      continue;
    UnitPattern::Hole hole;
    int shift_x = 0, shift_y = 0;
    utils::Hmesh::Edge *cur_edge = &edge;
    while (!used_edges[cur_edge->index]) {
      used_edges[cur_edge->index] = 1;
      // Push the hole vertex.
      hole.vertices.push_back(UnitPattern::Hole::Vertex{
          cur_edge->fi, cur_edge->fvi, shift_x, shift_y});

      // Move to the next edge in the hole.
      if (!cur_edge->twin())
        break;
      if (pattern.face_colors[cur_edge->fi] == 0) {
        if (pattern.face_colors[cur_edge->twin()->fi] == 0) {
          cur_edge = cur_edge->prev();
        } else {
          shift_x -= cur_edge->shift_x;
          shift_y -= cur_edge->shift_y;
          cur_edge = cur_edge->twin();
        }
      } else {
        // Color == 1.
        cur_edge = cur_edge->prev();
        if (pattern.face_colors[cur_edge->twin()->fi] == 0) {
          shift_x -= cur_edge->shift_x;
          shift_y -= cur_edge->shift_y;
          cur_edge = cur_edge->twin()->prev();
        }
      }
    }
    // If we returned to the starting edge, we have a hole.
    if (cur_edge == &edge) {
      holes.push_back(hole);
    }
  }

  // for (auto &hole : holes) {
  //   std::cout << "Hole:\n";
  //   for (auto &v : hole.vertices) {
  //     std::cout << "face: " << v.face << " fvi: " << v.fvi
  //               << " shift_x: " << v.shift_x << " shift_y: " << v.shift_y
  //               << " ";
  //   }
  //   std::cout << std::endl;
  // }

  return holes;
}

UnitPattern UnitPattern::make_non_periodic(int rep_x, int rep_y) const {
  UnitPattern res = replicate(rep_x, rep_y);
  res.periodicity = Eigen::Matrix2d::Zero();
  return res;
}

UnitPattern UnitPattern::replicate(int rep_x, int rep_y) const {
  std::vector<Eigen::VectorXd> new_verts;
  std::vector<std::vector<int>> new_faces;
  std::vector<int> new_face_colors;

  for (int i = 0; i < rep_x; i++) {
    for (int j = 0; j < rep_y; j++) {
      Eigen::RowVector2d shift =
          i * periodicity.row(0) + j * periodicity.row(1);
      int vert_offset = new_verts.size();

      for (int k = 0; k < mesh.nv(); k++) {
        new_verts.push_back(mesh.V.row(k) + shift);
      }

      for (const auto &face : mesh.F) {
        std::vector<int> new_face;
        for (int idx : face) {
          new_face.push_back(idx + vert_offset);
        }
        new_faces.push_back(new_face);
      }

      new_face_colors.insert(new_face_colors.end(), face_colors.begin(),
                             face_colors.end());
    }
  }

  Eigen::Matrix2d new_periodicity;
  new_periodicity.row(0) = periodicity.row(0) * rep_x;
  new_periodicity.row(1) = periodicity.row(1) * rep_y;

  utils::Hmesh new_mesh(convert::to_eig_mat(new_verts), new_faces);
  new_mesh = new_mesh.merge_close_verts().remove_unused_verts();

  return UnitPattern{new_mesh, new_periodicity, new_face_colors};
}

UnitPattern UnitPattern::make_non_periodic(double min_x, double min_y,
                                           double max_x, double max_y) const {
  // Periodicity matrix
  Eigen::Vector2d px = periodicity.row(0);
  Eigen::Vector2d py = periodicity.row(1);
  double det = px(0) * py(1) - px(1) * py(0);
  if (std::abs(det) < 1e-6) {
    UnitPattern res = *this;
    res.periodicity = Eigen::Matrix2d::Zero();
    return res;
  }

  // Inverse periodicity matrix
  Eigen::Matrix2d P_inv;
  P_inv << py(1), -py(0), -px(1), px(0);
  P_inv /= det;

  auto projectToUV = [&](double x, double y) {
    Eigen::Vector2d res;
    res(0) = P_inv(0, 0) * x + P_inv(0, 1) * y;
    res(1) = P_inv(1, 0) * x + P_inv(1, 1) * y;
    return res;
  };

  // Check corners
  double minU = std::numeric_limits<double>::infinity();
  double maxU = -std::numeric_limits<double>::infinity();
  double minV = std::numeric_limits<double>::infinity();
  double maxV = -std::numeric_limits<double>::infinity();

  std::vector<Eigen::Vector2d> corners = {
      {min_x, min_y}, {max_x, min_y}, {max_x, max_y}, {min_x, max_y}};

  // Add padding based on mesh radius relative to origin
  double meshRadius = 0;
  for (int i = 0; i < mesh.nv(); i++) {
    meshRadius = std::max(meshRadius, mesh.V.row(i).norm());
  }

  for (const auto &p : corners) {
    std::vector<Eigen::Vector2d> offsets = {{0, 0},
                                            {meshRadius, 0},
                                            {-meshRadius, 0},
                                            {0, meshRadius},
                                            {0, -meshRadius}};
    for (const auto &off : offsets) {
      Eigen::Vector2d uv = projectToUV(p(0) + off(0), p(1) + off(1));
      minU = std::min(minU, uv(0));
      maxU = std::max(maxU, uv(0));
      minV = std::min(minV, uv(1));
      maxV = std::max(maxV, uv(1));
    }
  }

  int startRx = std::floor(minU);
  int endRx = std::ceil(maxU);
  int startRy = std::floor(minV);
  int endRy = std::ceil(maxV);

  std::vector<Eigen::VectorXd> new_verts;
  std::vector<std::vector<int>> new_faces;
  std::vector<int> new_face_colors;

  for (int rx = startRx; rx <= endRx; rx++) {
    for (int ry = startRy; ry <= endRy; ry++) {
      Eigen::RowVector2d shift =
          rx * periodicity.row(0) + ry * periodicity.row(1);

      // Check if faces align inside the box
      // We will perform the check per face
      std::vector<int> facesToKeep;

      // Temporary verts for this repetition
      std::vector<Eigen::RowVector2d> repVerts;
      for (int k = 0; k < mesh.nv(); k++) {
        repVerts.push_back(mesh.V.row(k) + shift);
      }

      for (int f = 0; f < mesh.F.size(); f++) {
        bool allInside = true;
        for (int idx : mesh.F[f]) {
          const auto &v = repVerts[idx];
          if (v(0) < min_x || v(0) > max_x || v(1) < min_y || v(1) > max_y) {
            allInside = false;
            break;
          }
        }
        if (allInside) {
          facesToKeep.push_back(f);
        }
      }

      if (facesToKeep.empty())
        continue;

      int vert_offset = new_verts.size();
      for (const auto &v : repVerts) {
        new_verts.push_back(v);
      }

      for (int f : facesToKeep) {
        std::vector<int> new_face;
        for (int idx : mesh.F[f]) {
          new_face.push_back(idx + vert_offset);
        }
        new_faces.push_back(new_face);
        new_face_colors.push_back(face_colors[f]);
      }
    }
  }

  utils::Hmesh new_mesh(convert::to_eig_mat(new_verts), new_faces);
  new_mesh = new_mesh.merge_close_verts().remove_unused_verts();

  return UnitPattern{new_mesh, Eigen::Matrix2d::Zero(), new_face_colors};
}

UnitPattern UnitPattern::deform() const {
  UnitPattern deformed = *this;
  deformed.periodicity = Eigen::Matrix2d::Zero();

  for (int i = 0; i < deformed.mesh.nv(); i++) {
    double x = deformed.mesh.V(i, 0);
    double y = deformed.mesh.V(i, 1);
    std::complex<double> z(x, y);

    // Apply Mobius transformation w = (z + 1) / (z - 20)
    if (std::abs(z - 10.0) < 1e-6) {
      z += 1e-6; // Handle singularity
    }

    std::complex<double> w = (20.0 * z + 60.0) / (2.0 * z + 60.0);

    deformed.mesh.V(i, 0) = w.real();
    deformed.mesh.V(i, 1) = w.imag();
  }

  return deformed;
}

UnitPattern UnitPattern::scale(double factor) const {
  UnitPattern res = *this;
  res.mesh.V *= factor;
  res.periodicity *= factor;
  return res;
}

} // namespace kirigami
