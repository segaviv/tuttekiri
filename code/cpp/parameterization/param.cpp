#include "param.h"
#include "../utils/conversions.h"
#include "../utils/utils.h"
#include <Optiz/Linear/QuadraticObjectiveD.h>
#include <Optiz/Meta/MetaMat.h>
#include <Optiz/Optiz.h>

namespace param {

static Eigen::Matrix2d get_local_frame(const Eigen::MatrixXd &verts,
                                       const Eigen::MatrixXi &faces, int i) {
  int v0 = faces(i, 0), v1 = faces(i, 1), v2 = faces(i, 2);
  const Eigen::Vector3d &e1 = (verts.row(v1) - verts.row(v0)),
                        e2 = verts.row(v2) - verts.row(v1);
  const Eigen::Vector3d &e1_rot = e1.cross(e2).cross(e1).normalized();

  Eigen::Matrix2d local_mat;
  local_mat << e1.norm(), e2.dot(e1) / e1.norm(), 0,
      e2.cross(e1).norm() / e1.norm();
  return local_mat;
}

static Eigen::MatrixXd init_vf(utils::Hmesh &mesh) {
  Optiz::QuadraticObjectiveD obj(std::vector<int>{mesh.nf(), 2});
  obj.add_weighted_equations(
      mesh.edges.size(), [&](int i, auto &x, auto &add_eq) {
        auto &e = mesh.edges[i];
        if (e.is_boundary() || e.vi > e.next()->vi)
          return; // Edge will be covered elsewhere.
        int fj = e.fi, fk = e.twin()->fi;

        // The vector field in the local frames of faces fj, fk.
        Optiz::MetaVec fj_vec(x(fj, 0), x(fj, 1)), fk_vec(x(fk, 0), x(fk, 1));

        // Penalize the difference between the vector at fj parallel transported
        // to fk and the vector at fk.
        Optiz::MetaVec diff = e.frame_rot * fj_vec - fk_vec;
        double weight =
            3 * e.vec().norm() / (mesh.face(fj).area() + mesh.face(fk).area());
        add_eq(weight, diff.template get<0>());
        add_eq(weight, diff.template get<1>());
      });
  // Fix the vector at an arbitrary face to avoid trivial solution.
  Eigen::Vector2i known_inds(0, mesh.nf());
  Eigen::Vector2d known_vals(1, 0);
  obj.set_knowns(known_inds, known_vals);
  // Solve the least squares problem and normalize the vectors.
  Eigen::MatrixXd res = obj.solve();
  res.rowwise().normalize();
  return res;
}

static Eigen::MatrixXd init_uv(utils::Hmesh &mesh) {
  auto vf = init_vf(mesh);
  Eigen::MatrixXd vf_rot90 = utils::matcat<1>(-vf.col(1), vf.col(0));

  // Least squares to integrate vf, vf_rot90 into a global parameterization.
  Optiz::QuadraticObjectiveD obj(mesh.nv(), 2);

  // Grad matrix (in the local face frame) for face i.
  auto face_grad = [&](int i) {
    auto v = [&](int j) { return mesh.V.row(mesh.F[i][j]); };
    Eigen::Matrix2d Gtl =
        (utils::matcat<0>(v(0) - v(2), v(1) - v(2)) * mesh.face(i).frame)
            .inverse();
    return utils::matcat<1>(Gtl, -Gtl.rowwise().sum());
  };

  // Least squares integration.
  obj.add_weighted_equations_with_rhs(
      mesh.faces.size(), [&](int i, auto &x, auto &add_eq) {
        // Calculate the gradient of the parameterization in face i.
        Eigen::Matrix<double, 2, 3> G = face_grad(i);
        Optiz::MetaVec uv(x(mesh.F[i][0]), x(mesh.F[i][1]), x(mesh.F[i][2]));
        Optiz::MetaVec grad = G * uv;

        // The gradient should align with the vector fields.
        double weight = mesh.face(i).area();
        add_eq(weight, grad.template get<0>(),
               Eigen::Vector2d(vf(i, 0), vf_rot90(i, 0)));
        add_eq(weight, grad.template get<1>(),
               Eigen::Vector2d(vf(i, 1), vf_rot90(i, 1)));
      });
  // Set the parameterization at an arbitrary vertex to (0, 0) to fix
  // translation.
  Eigen::VectorXi known_inds(1);
  known_inds(0) = mesh.F[0][0];
  Eigen::MatrixXd known_vals(1, 2);
  known_vals << 0, 0;
  obj.set_knowns(known_inds, known_vals);
  Eigen::MatrixXd res = obj.solve();
  return res;
}

Eigen::MatrixXd isometric_param(utils::Hmesh &mesh) {
  auto &V = mesh.V;
  auto F = convert::to_eig_mat(mesh.F);
  Eigen::MatrixXd uv = init_uv(mesh);
  // Store the local frame projections.
  std::vector<Eigen::Matrix2d> frame_projections;
  frame_projections.reserve(F.rows());
  for (int i = 0; i < F.rows(); i++) {
    frame_projections.emplace_back(get_local_frame(V, F, i).inverse());
  }

  Optiz::Problem prob(uv);
  prob.options().set_report_level(Optiz::Problem::Options::NONE);
  prob.add_element_energy<6>(F.rows(), [&]<typename T>(int i, auto &x) {
    auto v0 = x.row(F(i, 0)), v1 = x.row(F(i, 1)), v2 = x.row(F(i, 2));
    auto e1 = v1 - v0, e2 = v2 - v1;
    Eigen::Matrix2<T> mat{{e1(0), e2(0)}, {e1(1), e2(1)}};
    Eigen::Matrix2<T> jacobian = mat * frame_projections[i];

    return (jacobian.squaredNorm() + jacobian.inverse().squaredNorm());
  });
  prob.optimize();
  return prob.x();
}

} // namespace param