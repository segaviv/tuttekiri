#include "prevent_intersections.h"

namespace opt {

Eigen::MatrixXd prevent_intersections_small_pattern(
    const kirigami::UnitPattern &orig_pattern, const Eigen::MatrixXd &kernel,
    double barrier, double barrier_strength, double close_to_original_weight) {
  Eigen::MatrixXd V = orig_pattern.mesh.V;
  auto pattern = orig_pattern;
  if (pattern.periodicity.norm() > 1e-6) {
    pattern.make_periodic();
  }
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
  prob.options().set_line_search_iters(100);
  prob.options().set_iters(100);
  prob.add_element_energy(pattern.mesh.edges.size(), [&](int ei, auto &x_vars) {
    using T = FACTORY_TYPE(x_vars);
    auto &edge = pattern.mesh.edge(ei);
    // Only cover split edges (no hinge between face and twin face).
    if (edge.is_boundary() || edge.index > edge.twin()->index ||
        pattern.face_colors[edge.fi] != pattern.face_colors[edge.twin()->fi]) {
      return T(0);
    }
    auto x = add_kernel(x_vars);
    // Diff is negative if the gradient of the twin edge points towards the
    // edge, which means the faces will intersect upon deployment.
    //
    // The absolute value of diff indicates how strong the twin edges are pushed
    // into/away from each other.
    //
    // Setting the soft barrier at a value higher than 0 will make the edges
    // more separated, which can help avoiding intersections at higher
    // deployment angles.
    // TODO: it's probably possible to better characterize the relative motion
    // between the edges and know precisely whether they will intersect at any
    // point. This can be used to improve the energy formulation and guarantee
    // no intersections.
    auto diff = trace_hole(&edge, pattern, x);
    return exp((barrier - diff) * barrier_strength);
  });

  prob.add_element_energy(pattern.mesh.nv(), [&](int i, auto &x_vars) {
    auto x = add_kernel(x_vars);
    return close_to_original_weight *
           (x.row(i) - pattern.mesh.V.row(i)).squaredNorm();
  });

  Eigen::MatrixXd new_x = prob.optimize().x();
  V = add_kernel(new_x);
  return V;
}

Eigen::MatrixXd prevent_intersections_big_pattern(
    const kirigami::UnitPattern &orig_pattern, const Eigen::MatrixXd &kernel,
    double barrier, double barrier_strength, double close_to_original_weight) {
  Eigen::MatrixXd V = orig_pattern.mesh.V;
  int current_col = 0;
  auto pattern = orig_pattern;
  if (pattern.periodicity.norm() > 1e-6) {
    pattern.make_periodic();
  }

  auto add_kernel = [&](const auto &x) {
    using T = FACTORY_TYPE(x);
    Eigen::Matrix<T, Eigen::Dynamic, Eigen::Dynamic> new_verts = V;
    new_verts.col(0) += x(0) * kernel.col(current_col);
    new_verts.col(1) += x(1) * kernel.col(current_col);
    return new_verts;
  };

  for (int i = 0; i < kernel.cols(); i++) {
    Optiz::Problem prob(Eigen::MatrixXd::Zero(1, 2));
    prob.options().set_line_search_iters(100);
    prob.options().set_iters(10);
    prob.add_element_energy(
        pattern.mesh.edges.size(), [&](int ei, auto &x_vars) {
          using T = FACTORY_TYPE(x_vars);
          auto &edge = pattern.mesh.edge(ei);
          // Only cover split edges (no hinge between face and twin face).
          if (edge.is_boundary() || edge.index > edge.twin()->index ||
              pattern.face_colors[edge.fi] !=
                  pattern.face_colors[edge.twin()->fi]) {
            return T(0);
          }
          auto x = add_kernel(x_vars);
          auto diff = trace_hole(&edge, pattern, x);
          return exp((barrier - diff) * barrier_strength);
        });

    prob.add_element_energy(pattern.mesh.nv(), [&](int i, auto &x_vars) {
      auto x = add_kernel(x_vars);
      return close_to_original_weight *
             (x.row(i) - pattern.mesh.V.row(i)).squaredNorm();
    });
    Eigen::MatrixXd new_x = prob.optimize().x();
    V = add_kernel(new_x);
    current_col = (current_col + 1) % kernel.cols();
  }
  return V;
}

Eigen::MatrixXd prevent_intersections(const kirigami::UnitPattern &orig_pattern,
                                      const Eigen::MatrixXd &kernel,
                                      double barrier, double barrier_strength,
                                      double close_to_original_weight) {
  if (kernel.cols() < 15) {
    return prevent_intersections_small_pattern(orig_pattern, kernel, barrier,
                                               barrier_strength,
                                               close_to_original_weight);
  }

  return prevent_intersections_big_pattern(orig_pattern, kernel, barrier,
                                           barrier_strength,
                                           close_to_original_weight);
}

} // namespace opt