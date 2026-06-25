#pragma once
#include "../geometry/unit_pattern.h"
#include "TVar.h"
#include <Optiz/NewtonSolver/Problem.h>
namespace opt {

template <typename Mat1, typename Mat2>
static auto cross2d(const Mat1 &v, const Mat2 &w) {
  return v(0) * w(1) - v(1) * w(0);
}

auto trace_clockwise(utils::Hmesh::Edge *edge,
                     const kirigami::UnitPattern &pattern, auto &x) {
  using Scalar = FACTORY_TYPE(x);
  using TScalar = Optiz::TVar<Scalar, 1>;
  using Transform = Eigen::Transform<TScalar, 2, Eigen::Isometry>;
  auto &coloring = pattern.face_colors;
  auto &periodicity = pattern.periodicity;
  Transform T = Transform::Identity();
  TScalar angle = TScalar(Scalar(0.0), 0);
  utils::Hmesh::Edge *cur_edge = edge;
  Eigen::RowVector2d shift = Eigen::RowVector2d::Zero();
  int num_edge = 0;
  while (cur_edge != edge->twin()) {
    num_edge++;
    if (!cur_edge->twin()) {
      // This can happen if the pattern is not periodic.
      break;
    }
    // Case 1. Red face (orientation = 1).
    if (coloring[cur_edge->fi] == 1) {
      if (coloring[cur_edge->twin()->fi] == 0) {
        // cur_edge->next()->vi is the hinge vertex.
        // Update the transformation
        int vi = cur_edge->next()->vi;
        Eigen::Vector2<TScalar> v = x.row(vi).template cast<TScalar>();
        v += shift.transpose();
        // Rotating anticlockwise around vi.
        T.translate(v).rotate(Eigen::Rotation2D<TScalar>(angle)).translate(-v);
        shift -= cur_edge->shift_x * periodicity.row(0) +
                 cur_edge->shift_y * periodicity.row(1);
        cur_edge = cur_edge->twin();
      } else {
        // Completely cut, just move to next edge.
        cur_edge = cur_edge->next();
      }
      continue;
    }
    // Case 2. Blue face (orientation = 0).
    cur_edge = cur_edge->next();
    if (!cur_edge->twin()) {
      // This can happen if the pattern is not periodic.
      break;
    }
    if (coloring[cur_edge->twin()->fi] == 0)
      continue;
    // The twin face is red, rotate clockwise around soruce of cur_edge.
    int vi = cur_edge->vi;
    Eigen::Vector2<TScalar> v = x.row(vi).template cast<TScalar>();
    v += shift.transpose();
    T.translate(v).rotate(Eigen::Rotation2D<TScalar>(-angle)).translate(-v);
    shift -= cur_edge->shift_x * periodicity.row(0) +
             cur_edge->shift_y * periodicity.row(1);
    cur_edge = cur_edge->twin()->next();
  }

  if (cur_edge != edge->twin()) {
    return std::make_tuple(T, shift, 1000, cur_edge);
  }

  return std::make_tuple(T, shift, num_edge, cur_edge);
}

auto trace_counterclockwise(utils::Hmesh::Edge *edge,
                            const kirigami::UnitPattern &pattern, auto &x) {
  using Scalar = FACTORY_TYPE(x);
  using TScalar = Optiz::TVar<Scalar, 1>;
  using Transform = Eigen::Transform<TScalar, 2, Eigen::Isometry>;
  auto &coloring = pattern.face_colors;
  auto &periodicity = pattern.periodicity;
  Transform T = Transform::Identity();
  TScalar angle = TScalar(Scalar(0.0), 0);
  utils::Hmesh::Edge *cur_edge = edge;
  Eigen::RowVector2d shift = Eigen::RowVector2d::Zero();
  int num_edge = 0;
  while (cur_edge != edge->twin()) {
    num_edge++;
    if (!cur_edge->twin()) {
      // This can happen if the pattern is not periodic.
      break;
    }
    // Case 1. Red face (orientation = 1).
    if (coloring[cur_edge->fi] == 1) {
      if (!cur_edge->prev()->twin()) {
        // This can happen if the pattern is not periodic.
        break;
      }
      if (coloring[cur_edge->prev()->twin()->fi] == 0) {
        cur_edge = cur_edge->prev();
        // cur_edge->next()->vi is the hinge vertex.
        // Update the transformation
        int vi = cur_edge->next()->vi;
        Eigen::Vector2<TScalar> v = x.row(vi).template cast<TScalar>();
        v += shift.transpose();
        // Rotating anticlockwise around vi.
        T.translate(v).rotate(Eigen::Rotation2D<TScalar>(angle)).translate(-v);
        shift -= cur_edge->shift_x * periodicity.row(0) +
                 cur_edge->shift_y * periodicity.row(1);
        cur_edge = cur_edge->twin()->prev();
      } else {
        // Completely cut, just move to next edge.
        cur_edge = cur_edge->prev();
      }
      continue;
    }
    // Case 2. Blue face (orientation = 0).
    if (coloring[cur_edge->twin()->fi] == 0) {
      cur_edge = cur_edge->prev();
      continue;
    }
    // The twin face is red, rotate clockwise around soruce of cur_edge.
    int vi = cur_edge->vi;
    Eigen::Vector2<TScalar> v = x.row(vi).template cast<TScalar>();
    v += shift.transpose();
    T.translate(v).rotate(Eigen::Rotation2D<TScalar>(-angle)).translate(-v);
    shift -= cur_edge->shift_x * periodicity.row(0) +
             cur_edge->shift_y * periodicity.row(1);
    cur_edge = cur_edge->twin();
  }

  if (cur_edge != edge->twin()) {
    return std::make_tuple(T, shift, 1000, cur_edge);
  }

  return std::make_tuple(T, shift, num_edge, cur_edge);
}

auto trace_hole(utils::Hmesh::Edge *edge, const kirigami::UnitPattern &pattern,
                auto &x) {
  using Scalar = FACTORY_TYPE(x);
  using TScalar = Optiz::TVar<Scalar, 1>;
  // Trace hole until reaching the twin edge (cur_edge == edge->twin()).
  auto [T, shift, num_edge, cur_edge] =
      trace_counterclockwise(edge, pattern, x);
  auto [T2, shift2, num_edge2, cur_edge2] = trace_clockwise(edge, pattern, x);
  // Pick the shorter path to the twin edge.
  if (num_edge2 < num_edge) {
    T = T2;
    shift = shift2;
  }
  if (num_edge2 == 1000 && num_edge == 1000) {
    std::cout << "Could not trace hole" << std::endl;
    return Scalar(0.0);
  }

  // T is the final transformation.
  Eigen::Vector2<TScalar> twin_v =
      (x.row(cur_edge->next()->vi).template cast<TScalar>().transpose());
  twin_v += shift.transpose();
  twin_v = (T * twin_v).eval();
  Eigen::Vector2<TScalar> v = (x.row(edge->vi).template cast<TScalar>());

  // Diff = (0, 0) since we do forward kinematics at opening angle 0.
  Eigen::Vector2<TScalar> diff = twin_v - v;

  Eigen::Vector2<Scalar> grad(diff(0).grad()(0), diff(1).grad()(0));
  Eigen::Vector2<Scalar> edge_vec = x.row(edge->next()->vi) - x.row(edge->vi);

  // Check whether the gradient of the relative motion points outside of the
  // edge_vec - the value would be positive if the twin edge is moving away from
  // the edge, and negative if it is moving towards the edge.
  return cross2d(grad, edge_vec.normalized());
}

Eigen::MatrixXd prevent_intersections(const kirigami::UnitPattern &pattern,
                                      const Eigen::MatrixXd &kernel,
                                      double barrier = 0.1,
                                      double barrier_strength = 10,
                                      double close_to_original_weight = 0.1);

} // namespace opt