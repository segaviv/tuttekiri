#pragma once

#include "Hmesh.h"
#include <Eigen/Eigen>
#include <emscripten/bind.h>
#include <iostream>
#include <unordered_map>
#include <vector>
using namespace emscripten;

namespace convert {

template <typename T, int R, int C>
Eigen::MatrixX<T> to_eig_mat(const std::vector<Eigen::Matrix<T, R, C>> &v) {
  Eigen::MatrixX<T> m(v.size(), v[0].size());
  for (int i = 0; i < v.size(); ++i) {
    m.row(i) = v[i];
  }
  return m;
}
template <typename T>
Eigen::MatrixX<T> to_eig_mat(const std::vector<std::vector<T>> &mat) {
  Eigen::MatrixX<T> m(mat.size(), mat[0].size());
  for (int i = 0; i < mat.size(); ++i) {
    for (int j = 0; j < mat[0].size(); ++j) {
      m(i, j) = mat[i][j];
    }
  }
  return m;
}

template <typename T> Eigen::MatrixX<T> js_array_to_eig(const val &js_array) {
  int rows = js_array["length"].as<unsigned>();
  if (rows == 0)
    return Eigen::MatrixX<T>::Zero(0, 2);

  int cols = js_array[0]["length"].as<unsigned>();
  Eigen::MatrixX<T> mat(rows, cols);

  for (int i = 0; i < rows; i++) {
    val row = js_array[i];
    for (int j = 0; j < cols; j++) {
      mat(i, j) = row[j].as<T>();
    }
  }
  return mat;
}

template <typename T> Eigen::MatrixX<T> verts_2d_to_eig(const val &js_array) {
  int rows = js_array["length"].as<unsigned>();
  if (rows == 0)
    return Eigen::MatrixX<T>::Zero(0, 2);

  Eigen::MatrixX<T> mat(rows, 2);

  for (int i = 0; i < rows; i++) {
    val row = js_array[i];
    mat.row(i) << row["x"].as<T>(), row["y"].as<T>();
  }
  return mat;
}


template <typename T> Eigen::MatrixX<T> js_verts_to_eig(const val &js_array) {
  int rows = js_array["length"].as<unsigned>();
  if (rows == 0)
    return Eigen::MatrixX<T>::Zero(0, 3);

  int num_cols = js_array[0].hasOwnProperty("z") ? 3 : 2;
  Eigen::MatrixX<T> mat(rows, num_cols);

  for (int i = 0; i < rows; i++) {
    val row = js_array[i];
    mat(i, 0) = row["x"].as<T>();
    mat(i, 1) = row["y"].as<T>();
    if (num_cols == 3) {
      mat(i, 2) = row["z"].as<T>();
    }
  }
  return mat;
}

template <typename T> val eig_to_js_verts(const Eigen::MatrixX<T> &mat) {
  val js_array = val::array();
  for (int i = 0; i < mat.rows(); i++) {
    val row = val::object();
    row.set("x", mat(i, 0));
    row.set("y", mat(i, 1));
    if (mat.cols() == 3) {
      row.set("z", mat(i, 2));
    }
    js_array.call<void>("push", row);
  }
  return js_array;
}

template <typename T> std::vector<T> js_array_to_vec(const val &js_array) {
  int rows = js_array["length"].as<unsigned>();
  if (rows == 0)
    return std::vector<T>();

  std::vector<T> vec(rows);

  for (int i = 0; i < rows; i++) {
    vec[i] = js_array[i].as<T>();
  }
  return vec;
}

template <typename T>
std::vector<std::vector<T>> js_array_to_vec_vec(const val &js_array) {
  int rows = js_array["length"].as<unsigned>();
  if (rows == 0)
    return std::vector<std::vector<T>>();

  std::vector<std::vector<T>> mat(rows, std::vector<T>());

  for (int i = 0; i < rows; i++) {
    val row = js_array[i];
    int cols = row["length"].as<unsigned>();
    mat[i].resize(cols);
    for (int j = 0; j < cols; j++) {
      mat[i][j] = row[j].as<T>();
    }
  }
  return mat;
}

template <typename T>
val vec_vec_to_js_array(const std::vector<std::vector<T>> &mat) {
  val js_array = val::array();
  for (const auto &row : mat) {
    val row_js = val::array();
    for (const auto &v : row) {
      row_js.call<void>("push", v);
    }
    js_array.call<void>("push", row_js);
  }
  return js_array;
}

template <typename T> val eig_to_js_array(const T &mat) {
  val js_array = val::array();
  for (int i = 0; i < mat.rows(); i++) {
    val row = val::array();
    for (int j = 0; j < mat.cols(); j++) {
      row.call<void>("push", mat(i, j));
    }
    js_array.call<void>("push", row);
  }
  return js_array;
}

template <typename T> val vec_to_js_array(const std::vector<T> &vec) {
  val js_array = val::array();
  for (const auto &v : vec) {
    js_array.call<void>("push", v);
  }
  return js_array;
}

inline val hmesh_to_js_object(const utils::Hmesh &hmesh) {
  val js_object = val::object();
  js_object.set("vertices", eig_to_js_verts(hmesh.V));
  js_object.set("faces", vec_vec_to_js_array(hmesh.F));
  return js_object;
}

template <typename T>
std::vector<T> slice(const std::vector<T> &vec,
                     const std::vector<int> &indices) {
  std::vector<T> res;
  for (const auto &i : indices) {
    res.push_back(vec[i]);
  }
  return res;
}

template <typename T>
std::vector<T> slice(const std::vector<T> &vec, int start, int size) {
  std::vector<T> res;
  for (int i = start; i < start + size; i++) {
    res.push_back(vec[i]);
  }
  return res;
}

struct Projection {
  // 2 x 3 projection matrix.
  Eigen::MatrixXd mat;
  Eigen::RowVector3d translation;

  Eigen::MatrixXd project(const Eigen::MatrixXd &V) const {
    return V * mat.transpose();
  }

  Eigen::MatrixXd unproject(const Eigen::MatrixXd &V) const {
    Eigen::MatrixXd res = V * mat;
    res.rowwise() += translation;
    return res;
  }
};

inline Projection project_to_common_plane_mat(const Eigen::MatrixXd &V) {
  Eigen::MatrixXd res(2, 3);
  Eigen::RowVector3d mean = V.colwise().mean();
  Eigen::MatrixXd V_centered = V.rowwise() - mean;
  Eigen::SelfAdjointEigenSolver<Eigen::MatrixXd> eigensolver(
      V_centered.transpose() * V_centered);
  if (eigensolver.info() != Eigen::Success) {
    throw std::runtime_error("Eigen decomposition failed");
  }
  Eigen::MatrixXd basis = eigensolver.eigenvectors().rightCols(2);
  res.row(0) = basis.col(0);
  res.row(1) = basis.col(1);
  return {res, eigensolver.eigenvectors().col(0).dot(mean) *
                   eigensolver.eigenvectors().col(0)};
}

inline utils::Hmesh js_object_to_hmesh(const emscripten::val &obj) {
  auto verts = convert::js_verts_to_eig<double>(obj["vertices"]);
  auto faces = convert::js_array_to_vec_vec<int>(obj["faces"]);
  return utils::Hmesh(verts, faces);
}

} // namespace convert