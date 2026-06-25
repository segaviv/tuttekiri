#pragma once
#include <Eigen/Eigen>

namespace utils {
bool is_inside_polygon(const Eigen::MatrixXd &poly,
                       const Eigen::Vector2d &point);
bool segment_intersects_poly(const Eigen::MatrixXd &poly,
                             const Eigen::Vector2d &p1,
                             const Eigen::Vector2d &p2);
bool segments_intersect(const Eigen::Vector2d &p1, const Eigen::Vector2d &p2,
                        const Eigen::Vector2d &q1, const Eigen::Vector2d &q2);

template <typename T>
Eigen::MatrixX<T> slice_row(const Eigen::MatrixX<T> &verts, int row) {
  Eigen::MatrixX<T> res(verts.rows() - 1, verts.cols());
  for (int i = 0; i < row; i++) {
    res.row(i) = verts.row(i);
  }
  for (int i = row + 1; i < verts.rows(); i++) {
    res.row(i - 1) = verts.row(i);
  }
  return res;
}

template <int dim, typename... Args>
Eigen::MatrixXd matcat(const Args &...args) {
  int other_dim = 0, this_dim = 0;
  if constexpr (dim == 0) {
    (
        [&] {
          other_dim += args.rows();
          this_dim = args.cols();
        }(),
        ...);
    Eigen::MatrixXd res(other_dim, this_dim);
    int cur = 0;
    (
        [&] {
          res.block(cur, 0, args.rows(), args.cols()) = args;
          cur += args.rows();
        }(),
        ...);
    return res;
  } else {
    (
        [&] {
          other_dim += args.cols();
          this_dim = args.rows();
        }(),
        ...);
    Eigen::MatrixXd res(this_dim, other_dim);
    int cur = 0;
    (
        [&] {
          res.block(0, cur, args.rows(), args.cols()) = args;
          cur += args.cols();
        }(),
        ...);
    return res;
  }
}

} // namespace utils