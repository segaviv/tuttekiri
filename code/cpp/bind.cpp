#include "coloring/even_valency.h"
#include "coloring/init.h"
#include "geometry/deployment.h"
#include "geometry/kirigami.h"
#include "geometry/unit_pattern.h"
#include "opt/TVar.h"
#include "opt/deployment.h"
#include "opt/fully_close.h"
#include "opt/opt.h"
#include "opt/prevent_intersections.h"
#include "parameterization/lift.h"
#include "parameterization/param.h"
#include "utils/Hmesh.h"
#include "utils/conversions.h"
#include <Eigen/src/Core/Matrix.h>
#include <Eigen/src/Core/util/Constants.h>
#include <Eigen/src/Geometry/Rotation2D.h>
#include <algorithm>
#include <cmath>
#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

val init_coloring(val mesh) {
  auto verts = convert::verts_2d_to_eig<double>(mesh["vertices"]);
  auto faces = convert::js_array_to_vec_vec<int>(mesh["faces"]);
  utils::Hmesh hmesh(verts, faces);
  std::vector<int> colors = coloring::initialized_two_face_coloring(hmesh);
  return convert::vec_to_js_array(colors);
}

Eigen::Matrix2d
get_rotation_to_align_x_periodicity(const Eigen::Matrix2d &periodicity) {
  double x_periodicty_angle = std::atan2(periodicity(0, 1), periodicity(0, 0));
  return Eigen::Rotation2Dd(x_periodicty_angle).toRotationMatrix();
}

static inline void SSVD2x2(const Eigen::Matrix2d &J, Eigen::Matrix2d &U,
                           Eigen::Matrix2d &S, Eigen::Matrix2d &V) {
  double e = (J(0) + J(3)) * 0.5;
  double f = (J(0) - J(3)) * 0.5;
  double g = (J(1) + J(2)) * 0.5;
  double h = (J(1) - J(2)) * 0.5;
  double q = sqrt((e * e) + (h * h));
  double r = sqrt((f * f) + (g * g));
  double a1 = atan2(g, f);
  double a2 = atan2(h, e);
  double rho = (a2 - a1) * 0.5;
  double phi = (a2 + a1) * 0.5;

  S(0) = q + r;
  S(1) = 0;
  S(2) = 0;
  S(3) = q - r;

  double c = cos(phi);
  double s = sin(phi);
  U(0) = c;
  U(1) = s;
  U(2) = -s;
  U(3) = c;

  c = cos(rho);
  s = sin(rho);
  V(0) = c;
  V(1) = -s;
  V(2) = s;
  V(3) = c;
}

val deploy(val mesh, float angle, bool align_periodicity) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  auto [res, new_periodicity] =
      kirigami::deploy(unit_pattern.mesh, unit_pattern.face_colors,
                       unit_pattern.periodicity, angle);
  // Rotate to align x_periodicity with the x axis.
  if (align_periodicity) {
    Eigen::Matrix2d rotation =
        get_rotation_to_align_x_periodicity(new_periodicity);
    new_periodicity = (new_periodicity * rotation).eval();
    res.V *= rotation;
    res.V = (res.V.rowwise() - res.V.row(0)).eval();
  }
  auto new_unit_pattern =
      kirigami::UnitPattern{res, new_periodicity, unit_pattern.face_colors};
  auto res_obj = new_unit_pattern.to_js_mesh();

  Eigen::Matrix2d J = unit_pattern.periodicity.inverse() * new_periodicity;
  Eigen::Matrix2d U, S, V;
  SSVD2x2(J, U, S, V);

  res_obj.set("singular_values", convert::eig_to_js_array(S));
  res_obj.set("U", convert::eig_to_js_array(U));
  res_obj.set("V", convert::eig_to_js_array(V));

  return res_obj;
}

val detect_unit_pattern(val mesh) {
  auto verts = convert::verts_2d_to_eig<double>(mesh["vertices"]);
  auto faces = convert::js_array_to_vec_vec<int>(mesh["faces"]);
  utils::Hmesh hmesh(verts, faces);
  auto [unit_pattern, periodicity] =
      kirigami::detect_unit_pattern(hmesh.merge_close_verts());
  val obj = convert::hmesh_to_js_object(unit_pattern);
  obj.set("periodicity", convert::eig_to_js_array(periodicity));
  return obj;
}

val dual(const val &mesh) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  utils::Hmesh rep_mesh =
      kirigami::replicate(unit_pattern.mesh, unit_pattern.periodicity, 5, 5)
          .dual();
  auto [new_mesh, periodicity] = kirigami::detect_unit_pattern(rep_mesh);

  kirigami::UnitPattern new_unit_pattern{new_mesh, periodicity};
  new_unit_pattern.make_periodic();
  // Initialize face coloring with the periodic mesh.
  auto coloring =
      coloring::initialized_two_face_coloring(new_unit_pattern.mesh);
  return kirigami::UnitPattern{new_mesh, periodicity, coloring}
      .simplify()
      .to_js_mesh();
}

val replicate_2x2(val mesh) {
  auto verts = convert::verts_2d_to_eig<double>(mesh["vertices"]);
  auto faces = convert::js_array_to_vec_vec<int>(mesh["faces"]);
  utils::Hmesh hmesh(verts, faces);
  Eigen::Matrix2d periodicity =
      convert::js_array_to_eig<double>(mesh["periodicity"]);
  auto [res, new_periodicity] = kirigami::replicate_2x2(hmesh, periodicity);
  val obj = convert::hmesh_to_js_object(res);
  obj.set("periodicity", convert::eig_to_js_array(new_periodicity));
  return obj;
}

val test_make_deployable(const val &mesh, bool map_to_unit_disk) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  auto [res, kernel] =
      kirigami::make_deployable(unit_pattern, map_to_unit_disk);

  auto obj = res.to_js_mesh();
  if (kernel.norm() > 1e-4) {
    obj.set("kernel", convert::eig_to_js_array(kernel.transpose()));
  }
  return obj;
}

val change_periodicity(val mesh, val new_periodicity) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  Eigen::Matrix2d new_periodicity_eig =
      convert::js_array_to_eig<double>(new_periodicity);
  unit_pattern.mesh.V *=
      unit_pattern.periodicity.inverse() * new_periodicity_eig;
  unit_pattern.periodicity = new_periodicity_eig;
  return unit_pattern.to_js_mesh();
}

val find_all_good_colorings(val mesh) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  auto colorings = coloring::find_all_good_colorings(unit_pattern);
  auto obj = unit_pattern.to_js_mesh();
  if (colorings.size() > 0) {
    obj.set("face_colors", convert::vec_to_js_array(colorings[0]));
    obj.set("colorings", convert::vec_vec_to_js_array(colorings));
  }
  return obj;
}

val deploy_unit_with_holes(val mesh, float angle) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  return unit_pattern.deploy(angle, true).simplify().to_js_mesh();
}

val make_non_periodic(val mesh, int rep_x, int rep_y) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  auto new_unit_pattern = unit_pattern.make_non_periodic(rep_x, rep_y);
  return new_unit_pattern.to_js_mesh();
}

val make_non_periodic_in_box(val mesh, double min_x, double min_y, double max_x,
                             double max_y) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  auto new_unit_pattern =
      unit_pattern.make_non_periodic(min_x, min_y, max_x, max_y);
  return new_unit_pattern.to_js_mesh();
  return unit_pattern.to_js_mesh();
}

val replicate(val mesh, int rep_x, int rep_y) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  return unit_pattern.replicate(rep_x, rep_y).to_js_mesh();
}

val lift(const val &mesh, float deployed_angle, const val &target_mesh,
         float scale, float rotation, bool intersect_boundary,
         bool remove_leaves) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  auto target = convert::js_object_to_hmesh(target_mesh);
  Eigen::MatrixXd uv = param::isometric_param(target);
  auto [init_mesh, lifted] =
      param::lift(unit_pattern, deployed_angle, target, uv, scale, rotation,
                  intersect_boundary, remove_leaves);

  auto result = emscripten::val::object();
  result.set("lifted", lifted.to_js_mesh());
  result.set("init_mesh", init_mesh.to_js_mesh());
  return result;
}

void init_optimization(const val &init_mesh, const val &lifted_mesh,
                       const val &target_mesh) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(init_mesh);
  auto lifted = convert::js_object_to_hmesh(lifted_mesh);
  auto target = convert::js_object_to_hmesh(target_mesh);
  opt::init(unit_pattern.mesh.merge_close_verts().remove_unused_verts(), lifted,
            unit_pattern.face_colors, target.triangulate_avoid_overlap());
}

val optimize() {
  opt::optimize_rigidity();
  auto [lifted, ground] = opt::get_patterns();
  auto result = emscripten::val::object();
  result.set("ground", ground.to_js_mesh());
  result.set("lifted", lifted.to_js_mesh());
  double rigid_avg, rigid_max, close_avg, close_max, planarity_avg,
      planarity_max;
  opt::get_errors(&rigid_avg, &rigid_max, &close_avg, &close_max,
                  &planarity_avg, &planarity_max);
  result.set("rigid_avg", rigid_avg);
  result.set("rigid_max", rigid_max);
  result.set("close_avg", close_avg);
  result.set("close_max", close_max);
  result.set("planarity_avg", planarity_avg);
  result.set("planarity_max", planarity_max);
  return result;
}

val get_optimization_errors() {
  auto result = emscripten::val::object();
  double rigid_avg, rigid_max, close_avg, close_max, planarity_avg,
      planarity_max;
  opt::get_errors(&rigid_avg, &rigid_max, &close_avg, &close_max,
                  &planarity_avg, &planarity_max);
  result.set("rigid_avg", rigid_avg);
  result.set("rigid_max", rigid_max);
  result.set("close_avg", close_avg);
  result.set("close_max", close_max);
  result.set("planarity_avg", planarity_avg);
  result.set("planarity_max", planarity_max);
  return result;
}

val get_optimized_patterns() {
  auto [lifted, ground] = opt::get_patterns();
  auto result = emscripten::val::object();
  result.set("ground", ground.to_js_mesh());
  result.set("lifted", lifted.to_js_mesh());
  return result;
}

float mesh_area(const val &js_mesh) {
  auto mesh = convert::js_object_to_hmesh(js_mesh);
  return mesh.area();
}

void reset_optimziation() { opt::reset_optimization(); }

val get_fabrication_edges() {
  auto [folding, cutting] = opt::get_folding_and_cutting_edges();
  auto result = emscripten::val::object();
  result.set("folding", convert::eig_to_js_array(folding));
  result.set("cutting", convert::eig_to_js_array(cutting));
  return result;
}

static bool do_polygons_intersect(const Eigen::MatrixXd &p1,
                                  const Eigen::MatrixXd &p2) {
  auto orient = [](const Eigen::Vector2d &p, const Eigen::Vector2d &q,
                   const Eigen::Vector2d &r) {
    double val =
        (q.x() - p.x()) * (r.y() - p.y()) - (q.y() - p.y()) * (r.x() - p.x());
    if (std::abs(val) < 1e-9)
      return 0.0;
    return val;
  };

  auto on_segment = [&](const Eigen::Vector2d &p, const Eigen::Vector2d &a,
                        const Eigen::Vector2d &b) {
    if (orient(a, b, p) != 0.0)
      return false;
    return p.x() >= std::min(a.x(), b.x()) - 1e-9 &&
           p.x() <= std::max(a.x(), b.x()) + 1e-9 &&
           p.y() >= std::min(a.y(), b.y()) - 1e-9 &&
           p.y() <= std::max(a.y(), b.y()) + 1e-9;
  };

  auto intersect_proper =
      [&](const Eigen::Vector2d &a, const Eigen::Vector2d &b,
          const Eigen::Vector2d &c, const Eigen::Vector2d &d) {
        double o1 = orient(a, b, c);
        double o2 = orient(a, b, d);
        double o3 = orient(c, d, a);
        double o4 = orient(c, d, b);

        if (((o1 > 0 && o2 < 0) || (o1 < 0 && o2 > 0)) &&
            ((o3 > 0 && o4 < 0) || (o3 < 0 && o4 > 0))) {
          return true;
        }
        return false;
      };

  auto is_strictly_inside = [&](const Eigen::Vector2d &p,
                                const Eigen::MatrixXd &poly) {
    bool inside = false;
    int n = poly.rows();
    for (int i = 0, j = n - 1; i < n; j = i++) {
      Eigen::Vector2d u = poly.row(i);
      Eigen::Vector2d v = poly.row(j);

      if (on_segment(p, u, v))
        return false;

      if (((u.y() > p.y()) != (v.y() > p.y())) &&
          (p.x() <
           (v.x() - u.x()) * (p.y() - u.y()) / (v.y() - u.y()) + u.x())) {
        inside = !inside;
      }
    }
    return inside;
  };

  int n1 = p1.rows();
  int n2 = p2.rows();

  for (int i = 0; i < n1; ++i) {
    Eigen::Vector2d a = p1.row(i);
    Eigen::Vector2d b = p1.row((i + 1) % n1);
    for (int j = 0; j < n2; ++j) {
      Eigen::Vector2d c = p2.row(j);
      Eigen::Vector2d d = p2.row((j + 1) % n2);
      if (intersect_proper(a, b, c, d))
        return true;

      // Check for collinear overlap
      if (orient(a, b, c) == 0.0 && orient(a, b, d) == 0.0) {
        Eigen::Vector2d u = b - a;
        double len_sq = u.squaredNorm();
        if (len_sq > 1e-12) {
          double sc = (c - a).dot(u) / len_sq;
          double sd = (d - a).dot(u) / len_sq;
          double s_min = std::max(0.0, std::min(sc, sd));
          double s_max = std::min(1.0, std::max(sc, sd));

          if (s_max - s_min > 1e-6) {
            Eigen::Vector2d mid = a + u * (s_min + s_max) * 0.5;
            Eigen::Vector2d normal(-u.y(), u.x());
            normal.normalize();
            double eps = 1e-4;
            if (is_strictly_inside(mid + normal * eps, p1)) {
              if (is_strictly_inside(mid + normal * eps, p2))
                return true;
            }
            if (is_strictly_inside(mid - normal * eps, p1)) {
              if (is_strictly_inside(mid - normal * eps, p2))
                return true;
            }
          }
        }
      }
    }
  }

  for (int i = 0; i < n1; ++i) {
    if (is_strictly_inside(p1.row(i), p2))
      return true;
    Eigen::Vector2d a = p1.row(i);
    Eigen::Vector2d b = p1.row((i + 1) % n1);
    if (is_strictly_inside((a + b) * 0.5, p2))
      return true;
  }
  for (int i = 0; i < n2; ++i) {
    if (is_strictly_inside(p2.row(i), p1))
      return true;
    Eigen::Vector2d a = p2.row(i);
    Eigen::Vector2d b = p2.row((i + 1) % n2);
    if (is_strictly_inside((a + b) * 0.5, p1))
      return true;
  }

  return false;
}

double max_opening_angle(const val &mesh, bool detect_collisions) {
  auto pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  double max_angle = kirigami::max_opening_angle(pattern);
  if (!detect_collisions) {
    return max_angle;
  }
  for (double t = 0.01; t < 1; t += 0.01) {
    auto deployed = pattern.deploy(max_angle * t);
    deployed =
        pattern.periodicity.norm() < 1e-3 ? deployed : deployed.replicate(2, 2);
    auto mesh = deployed.mesh.merge_close_verts().remove_unused_verts();
    for (int f0 = 0; f0 < mesh.nf(); f0++) {
      for (int f1 = f0 + 1; f1 < mesh.nf(); f1++) {
        if (do_polygons_intersect(
                mesh.V(mesh.F[f0], Eigen::placeholders::all),
                mesh.V(mesh.F[f1], Eigen::placeholders::all))) {
          return max_angle * (t - 0.01);
        }
      }
    }
  }
  return max_angle;
}

val get_optimization_parameters() {
  auto result = emscripten::val::object();
  result.set("rigid_weight", opt::rigid_weight);
  result.set("closeness_weight", opt::closeness_weight);
  result.set("planarity_weight", opt::planarity_weight);
  result.set("close_to_init_weight", opt::close_to_init_weight);
  return result;
}

void set_optimization_parameters(const val &params) {
  opt::rigid_weight = params["rigid_weight"].as<float>();
  opt::closeness_weight = params["closeness_weight"].as<float>();
  opt::planarity_weight = params["planarity_weight"].as<float>();
  opt::close_to_init_weight = params["close_to_init_weight"].as<float>();
}

val conformalize(const val &mesh) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  Eigen::MatrixXd kernel =
      convert::js_array_to_eig<double>(mesh["kernel"]).transpose();
  auto new_verts = opt::optimize_for_conformal_tvar(unit_pattern, kernel);

  unit_pattern.mesh.V = new_verts;
  auto obj = unit_pattern.to_js_mesh();
  obj.set("kernel", convert::eig_to_js_array(kernel.transpose()));
  return obj;
}

val optimize_fully_closed(const val &mesh) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  Eigen::MatrixXd kernel =
      convert::js_array_to_eig<double>(mesh["kernel"]).transpose();
  auto new_verts = opt::optimize_for_fully_closed(unit_pattern, kernel);
  unit_pattern.mesh.V = new_verts;
  auto obj = unit_pattern.to_js_mesh();
  obj.set("kernel", convert::eig_to_js_array(kernel.transpose()));
  return obj;
}

val prevent_intersections(const val &mesh, double barrier,
                          double barrier_strength,
                          double close_to_original_weight) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  Eigen::MatrixXd kernel =
      convert::js_array_to_eig<double>(mesh["kernel"]).transpose();
  auto new_verts =
      opt::prevent_intersections(unit_pattern, kernel, barrier,
                                 barrier_strength, close_to_original_weight);
  unit_pattern.mesh.V = new_verts;
  auto obj = unit_pattern.to_js_mesh();
  obj.set("kernel", convert::eig_to_js_array(kernel.transpose()));
  return obj;
}

val mesh_to_pattern(const val &mesh, bool map_to_unit_disk) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  std::vector<int> colors =
      coloring::initialized_two_face_coloring(unit_pattern.mesh);
  unit_pattern.face_colors = colors;

  auto uv_pattern = unit_pattern;
  // If mesh has UVs, use them as initialization to make_deployable.
  bool has_uvs = false;
  if (mesh.hasOwnProperty("uvs") && mesh["uvs"]["length"].as<unsigned>() > 0) {
    auto uvs = convert::js_verts_to_eig<double>(mesh["uvs"]);
    auto faces = convert::js_array_to_vec_vec<int>(mesh["uv_faces"]);
    
    uv_pattern.mesh = utils::Hmesh(uvs, faces);
    has_uvs = true;
  } else {
    Eigen::MatrixXd uvs = param::isometric_param(unit_pattern.mesh);
    uvs.rowwise() -= uvs.colwise().mean();
    uv_pattern.mesh = utils::Hmesh(uvs, unit_pattern.mesh.F);
    has_uvs = true;
  }
  auto [res, kernel] = kirigami::make_deployable(uv_pattern, map_to_unit_disk);

  double mesh_area = unit_pattern.mesh.area();
  double pattern_area = res.mesh.area();
  double scale = std::sqrt(mesh_area / pattern_area);
  res.mesh.V *= scale;

  auto obj = res.to_js_mesh();
  if (kernel.norm() > 1e-4) {
    obj.set("kernel", convert::eig_to_js_array(kernel.transpose()));
  }
  if (has_uvs) {
    obj.set("target_mesh_vertices",
            convert::eig_to_js_verts(unit_pattern.mesh.V));
    obj.set("target_mesh_faces",
            convert::vec_vec_to_js_array(unit_pattern.mesh.F));
  }
  return obj;
}

val make_2_colorable(val mesh) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  if (unit_pattern.periodicity.norm() > 1e-4) {
    unit_pattern.make_periodic();
  }
  auto [new_mesh, new_uv_mesh] =
      coloring::make_mesh_2_colorable(unit_pattern.mesh);
  unit_pattern.mesh = new_mesh;
  unit_pattern.face_colors =
      coloring::initialized_two_face_coloring(unit_pattern.mesh);
  return unit_pattern.to_js_mesh();
}

val get_periodic_info(val mesh) {
  auto unit_pattern = kirigami::UnitPattern::from_js_mesh(mesh);
  if (unit_pattern.periodicity.norm() > 1e-3) {
    unit_pattern.make_periodic();
  }
  val js_array = val::array();
  for (int i = 0; i < unit_pattern.mesh.nf(); i++) {
    auto &face = unit_pattern.mesh.face(i);
    val row_js = val::array();
    for (int j = 0; j < unit_pattern.mesh.F[i].size(); j++) {
      row_js.call<void>("push", val::array());
    }
    utils::Hmesh::Edge *edge = unit_pattern.mesh.face(i).edge(), *cur = edge;
    do {
      if (edge->twin()) {
        row_js[edge->fvi].call<void>("push", edge->twin()->fi);
        row_js[edge->fvi].call<void>("push", edge->twin()->fvi);
      }
      edge = edge->next();
    } while (edge != cur);
    js_array.call<void>("push", row_js);
  }
  return js_array;
}

EMSCRIPTEN_BINDINGS(my_module) {
  function("init_coloring", &init_coloring);
  function("deploy", &deploy);
  function("detect_unit_pattern", &detect_unit_pattern);
  function("replicate_2x2", &replicate_2x2);
  function("test_make_deployable", &test_make_deployable);
  function("change_periodicity", &change_periodicity);
  function("dual", &dual);
  function("find_all_good_colorings", &find_all_good_colorings);
  function("deploy_unit_with_holes", &deploy_unit_with_holes);
  function("make_non_periodic", &make_non_periodic);
  function("make_non_periodic_in_box", &make_non_periodic_in_box);
  function("replicate", &replicate);
  function("lift", &lift);
  function("init_optimization", &init_optimization);
  function("optimize", &optimize);
  function("get_optimization_errors", &get_optimization_errors);
  function("get_optimized_patterns", &get_optimized_patterns);
  function("mesh_area", &mesh_area);
  function("reset_optimization", &reset_optimziation);
  function("get_fabrication_edges", &get_fabrication_edges);
  function("max_opening_angle", &max_opening_angle);
  function("get_optimization_parameters", &get_optimization_parameters);
  function("set_optimization_parameters", &set_optimization_parameters);
  function("conformalize", &conformalize);
  function("optimize_fully_closed", &optimize_fully_closed);
  function("prevent_intersections", &prevent_intersections);
  function("mesh_to_pattern", &mesh_to_pattern);
  function("make_2_colorable", &make_2_colorable);
  function("get_periodic_info", &get_periodic_info);
}
