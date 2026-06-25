#include "deployment.h"
#include <Optiz/NewtonSolver/Common.h>
#include <Optiz/NewtonSolver/Problem.h>

namespace opt {

Eigen::MatrixXd
optimize_for_conformal_tvar(const kirigami::UnitPattern &pattern,
                            const Eigen::MatrixXd &kernel) {
  if (kernel.cols() == 0) {
    std::cout << "Empty kernel" << std::endl;
    return pattern.mesh.V;
  }

  Eigen::MatrixXd V = pattern.mesh.V;

  // Parameterize the space by the coefficients of the kernel vectors, i.e., V +
  // sum_i x_i * kernel.col(i). x_i is of dimension 2 for x and y directions.
  auto add_kernel = [&](const auto &x) {
    using T = FACTORY_TYPE(x);
    Eigen::Matrix<T, Eigen::Dynamic, Eigen::Dynamic> new_verts = pattern.mesh.V;
    for (int i = 0; i < kernel.cols(); i++) {
      new_verts.col(0) += x(i, 0) * kernel.col(i);
      new_verts.col(1) += x(i, 1) * kernel.col(i);
    }
    return new_verts;
  };

  Optiz::Problem prob(Eigen::MatrixXd::Zero(kernel.cols(), 2));
  prob.add_element_energy(1, [&](int i, auto &x) {
    using T = FACTORY_TYPE(x);
    auto new_verts = add_kernel(x);
    // Calculate the edges of the unit parallelogram at opening angle 0.
    auto periodicity = calculate_periodicity_at_tvar(pattern, new_verts, 0.0);

    // The Jacobian is identity since we calculate periodicity at opening angle
    // 0 (we're interested in its derivative).
    Eigen::Matrix2<Optiz::TVar<T, 1>> J =
        pattern.periodicity.inverse() * periodicity;

    // Penalize non-zero derivative of the conformal distortion. This turns out
    // to be a quadratic function in x, so the Newton solver can solve it in one
    // iteration (TODO: compute/setup the system matrix and solve it directly
    // instead of using autodiff).
    return Optiz::sqr((J(0, 0) - J(1, 1)).grad()(0)) +
           Optiz::sqr((J(0, 1) + J(1, 0)).grad()(0));
  });

  Eigen::MatrixXd new_x = prob.optimize().x();
  V = add_kernel(new_x);
  return V;
}
} // namespace opt