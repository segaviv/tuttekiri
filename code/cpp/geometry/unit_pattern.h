#pragma once
#include "../utils/Hmesh.h"
#include "../utils/conversions.h"
#include <Eigen/Eigen>
#include <emscripten/bind.h>

namespace kirigami {

struct UnitPattern {
  utils::Hmesh mesh;
  Eigen::Matrix2d periodicity;
  std::vector<int> face_colors;
  UnitPattern &make_periodic();
  UnitPattern replicate(int rep_x, int rep_y) const;
  UnitPattern simplify();
  UnitPattern deploy(float angle, bool add_holes = false,
                     bool merge_verts = true) const;
  struct Hole {
    struct Vertex {
      int face;
      int fvi;
      int shift_x;
      int shift_y;
    };
    std::vector<Vertex> vertices;
  };
  std::vector<Hole> get_holes() const;

  static UnitPattern from_js_mesh(const emscripten::val &mesh) {
    auto verts = convert::js_verts_to_eig<double>(mesh["vertices"]);
    if (verts.col(2).norm() < 1e-3) {
      verts = verts.leftCols(2).eval();
    }
    auto faces = convert::js_array_to_vec_vec<int>(mesh["faces"]);
    Eigen::Matrix2d periodicity;
    if (mesh.hasOwnProperty("periodicity")) {
      periodicity = convert::js_array_to_eig<double>(mesh["periodicity"]);
    } else {
      periodicity = Eigen::Matrix2d::Zero();
    }
    std::vector<int> face_colors;
    if (mesh.hasOwnProperty("face_colors")) {
      face_colors = convert::js_array_to_vec<int>(mesh["face_colors"]);
    } else {
      face_colors = std::vector<int>(faces.size(), 0);
    }
    return UnitPattern{utils::Hmesh(verts, faces), periodicity, face_colors};
  }

  inline emscripten::val to_js_mesh() const {
    auto js_mesh = emscripten::val::object();
    js_mesh.set("vertices", convert::eig_to_js_verts(mesh.V));
    js_mesh.set("faces", convert::vec_vec_to_js_array(mesh.F));
    js_mesh.set("periodicity", convert::eig_to_js_array(periodicity));
    js_mesh.set("face_colors", convert::vec_to_js_array(face_colors));
    return js_mesh;
  }

  UnitPattern make_non_periodic(int rep_x, int rep_y) const;
  UnitPattern make_non_periodic(double min_x, double min_y, double max_x,
                                double max_y) const;

  UnitPattern deform() const;
  UnitPattern scale(double factor) const;
};

} // namespace kirigami