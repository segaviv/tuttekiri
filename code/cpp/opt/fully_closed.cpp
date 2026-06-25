#include "fully_close.h"
#include <Optiz/NewtonSolver/Problem.h>

namespace opt {

template <typename T>
static T cross2d(const Eigen::Vector2<T> &a, const Eigen::Vector2<T> &b) {
  return a.x() * b.y() - a.y() * b.x();
}

static auto edge_next_edge_angle(const utils::Hmesh::Edge *e, auto &x) {
  using T = FACTORY_TYPE(x);
  auto next_edge = e->next();
  Eigen::Vector2<T> next_vec =
      x.row(next_edge->next()->vi) - x.row(next_edge->vi);
  Eigen::Vector2<T> vec = x.row(e->vi) - x.row(next_edge->vi);
  return atan2(cross2d(next_vec, vec), vec.dot(next_vec));
}

// Calculate the average of the maximum deployment angle for each hinge.
double calculate_avg_angle(const kirigami::UnitPattern &pattern,
                           const Eigen::MatrixXd &V) {
  double sum = 0;
  int count = 0;
  for (auto &edge : pattern.mesh.edges) {
    if (edge.is_boundary() || edge.index > edge.twin()->index ||
        pattern.face_colors[edge.fi] == pattern.face_colors[edge.twin()->fi]) {
      continue;
    }
    if (pattern.face_colors[edge.fi] == 0) {
      double ang1 = edge_next_edge_angle(edge.prev(), V);
      double ang2 = edge_next_edge_angle(edge.twin(), V);
      sum += ang1 + ang2;
      count += 1;
    } else {
      double ang1 = edge_next_edge_angle(&edge, V);
      double ang2 = edge_next_edge_angle(edge.twin()->prev(), V);
      sum += ang1 + ang2;
      count += 1;
    }
  }
  return sum / count;
}

Eigen::MatrixXd
optimize_for_fully_closed(const kirigami::UnitPattern &orig_pattern,
                          const Eigen::MatrixXd &kernel) {
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
  double avg_angle = calculate_avg_angle(pattern, V);
  // Update the average angle.
  prob.set_end_iteration_callback([&]() {
    auto cur_v = add_kernel(prob.x());
    avg_angle = calculate_avg_angle(pattern, cur_v);
  });

  // Same edge lengths.
  prob.add_element_energy(pattern.mesh.edges.size(), [&](int ei, auto &x_vars) {
    using T = FACTORY_TYPE(x_vars);
    auto &edge = pattern.mesh.edge(ei);
    // Cover edges only once, avoiding boundary or split edges.
    if (edge.is_boundary() || edge.index > edge.twin()->index ||
        pattern.face_colors[edge.fi] == pattern.face_colors[edge.twin()->fi]) {
      return T(0);
    }
    auto x = add_kernel(x_vars);

    // Depending on whether the faces hinge at the head/tail of the edge,
    // penalize difference in the lengths of the edges that should meet at the
    // fully deployed configuration.
    if (pattern.face_colors[edge.fi] == 0) {
      Eigen::RowVector2<T> e0 = x.row(edge.vi) - x.row(edge.prev()->vi);
      Eigen::RowVector2<T> e1 = x.row(edge.twin()->next()->next()->vi) -
                                x.row(edge.twin()->next()->vi);
      return Optiz::sqr(e0.norm() - e1.norm());
    } else {
      Eigen::RowVector2<T> e0 =
          x.row(edge.next()->next()->vi) - x.row(edge.next()->vi);
      Eigen::RowVector2<T> e1 =
          x.row(edge.twin()->vi) - x.row(edge.twin()->prev()->vi);
      return Optiz::sqr(e0.norm() - e1.norm());
    }
  });

  // All angles should be close to the average max deployment angle - we want
  // all the edges to meet at the same deployment angle (i.e. the maximum
  // deployment angle for each hinge should be the same).
  prob.add_element_energy(pattern.mesh.edges.size(), [&](int ei, auto &x_vars) {
    using T = FACTORY_TYPE(x_vars);
    auto &edge = pattern.mesh.edge(ei);
    if (edge.is_boundary() || edge.index > edge.twin()->index ||
        pattern.face_colors[edge.fi] == pattern.face_colors[edge.twin()->fi]) {
      return T(0);
    }
    auto x = add_kernel(x_vars);
    if (pattern.face_colors[edge.fi] == 0) {
      T ang1 = edge_next_edge_angle(edge.prev(), x);
      T ang2 = edge_next_edge_angle(edge.twin(), x);
      return Optiz::sqr(ang1 + ang2 - avg_angle);
    } else {
      T ang1 = edge_next_edge_angle(&edge, x);
      T ang2 = edge_next_edge_angle(edge.twin()->prev(), x);
      return Optiz::sqr(ang1 + ang2 - avg_angle);
    }
  });
  prob.options().set_line_search_iters(100);
  prob.options().set_report_level(Optiz::Problem::Options::EVERY_STEP);
  Eigen::MatrixXd new_x = prob.optimize().x();
  V = add_kernel(new_x);
  return V;
}

} // namespace opt