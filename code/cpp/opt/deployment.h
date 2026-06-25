#pragma once
#include "../geometry/kirigami.h"
#include "../geometry/unit_pattern.h"
#include "Optiz/NewtonSolver/Problem.h"
#include "TVar.h"
#include <cstddef>

namespace opt {

/**
 * @brief Calculate the periodicity (edges of the unit parallelogram) at the
 * given opening angle.
 *
 * @tparam Scalar
 * @param pattern
 * @param unit_x
 * @param angle_double
 * @return Eigen::Matrix2<Optiz::TVar<Scalar, 1>>
 */
template <typename Scalar>
Eigen::Matrix2<Optiz::TVar<Scalar, 1>>
calculate_periodicity_at_tvar(const kirigami::UnitPattern &pattern,
                              const Eigen::MatrixX<Scalar> &unit_x,
                              double angle_double) {
  // Differentiable variable with value of type Scalar (which can also be a
  // differentiable variable).
  using TScalar = Optiz::TVar<Scalar, 1>;
  TScalar angle = TScalar(Scalar(angle_double), 0);
  utils::Hmesh mesh =
      kirigami::replicate_2x2(pattern.mesh, pattern.periodicity).first;
  std::vector<int> face_colors;
  for (int i = 0; i < 4; i++)
    face_colors.insert(face_colors.end(), pattern.face_colors.begin(),
                       pattern.face_colors.end());
  // Replicate the unit_x to the replicated mesh.
  Eigen::Matrix<Scalar, Eigen::Dynamic, 2> x(unit_x.rows() * 4, 2);
  std::vector<std::vector<int>> F;
  int cnt = 0, nv = unit_x.rows();
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
      x.block(cnt * nv, 0, nv, 2) = unit_x;
      x.block(cnt * nv, 0, nv, 2).rowwise() += i * pattern.periodicity.row(0);
      x.block(cnt * nv, 0, nv, 2).rowwise() += j * pattern.periodicity.row(1);
      for (int fi = 0; fi < pattern.mesh.F.size(); fi++) {
        std::vector<int> new_face;
        for (int v : pattern.mesh.F[fi]) {
          new_face.push_back(v + cnt * nv);
        }
        F.push_back(new_face);
      }
      cnt++;
    }
  }
  // BFS.
  using Transform = Eigen::Transform<Scalar, 2, Eigen::Isometry>;
  using TTransform =
      Eigen::Transform<Optiz::TVar<Scalar, 1>, 2, Eigen::Isometry>;
  std::queue<std::pair<int, TTransform>> q;
  q.push({0, TTransform::Identity()});
  std::vector<bool> visited(mesh.F.size(), false);
  std::vector<TTransform> face_transformations(F.size());
  visited[0] = true;
  while (!q.empty()) {
    auto [fi, T] = q.front();
    q.pop();
    utils::Hmesh::Edge *edge = mesh.face(fi).edge(), *orig_edge = edge;
    do {
      if (!edge->twin() || visited[edge->twin()->fi] ||
          face_colors[fi] == face_colors[edge->twin()->fi]) {
        continue;
      }
      // Check if the hinge is the source or target vertex of the edge.
      int vi;
      double sign;
      if (face_colors[fi] == 0) {
        vi = F[fi][edge->fvi];
        sign = -1;
      } else {
        vi = F[fi][edge->next()->fvi];
        sign = 1;
      }
      // Compute the transformation matrix.
      TTransform T2 = T;
      T2.translate(x.row(vi).transpose().template cast<TScalar>())
          .rotate(Eigen::Rotation2D<TScalar>(sign * angle))
          .translate(-x.row(vi).transpose().template cast<TScalar>());
      face_transformations[edge->twin()->fi] = T2;
      // Push the twin face to the queue.
      q.push({edge->twin()->fi, T2});
      visited[edge->twin()->fi] = true;
    } while ((edge = edge->next()) != orig_edge);
  }

  Eigen::Matrix2<Optiz::TVar<Scalar, 1>> periodicity;
  periodicity.row(0) = (face_transformations[pattern.mesh.nf() * 2] *
                            x.row(F[pattern.mesh.nf() * 2][0])
                                .template cast<TScalar>()
                                .transpose() -
                        x.row(F[0][0]).template cast<TScalar>().transpose())
                           .eval();
  periodicity.row(1) = (face_transformations[pattern.mesh.nf() * 1] *
                            x.row(F[pattern.mesh.nf() * 1][0])
                                .template cast<TScalar>()
                                .transpose() -
                        x.row(F[0][0]).template cast<TScalar>().transpose())
                           .eval();
  return periodicity;
}

Eigen::MatrixXd
optimize_for_conformal_tvar(const kirigami::UnitPattern &pattern,
                            const Eigen::MatrixXd &kernel);

} // namespace opt