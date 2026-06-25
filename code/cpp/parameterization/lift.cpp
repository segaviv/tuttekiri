#include "lift.h"
#include <Eigen/src/Core/Matrix.h>
#include <igl/AABB.h>

namespace param {

static Eigen::RowVector3d find_bary(const Eigen::MatrixXd &V,
                                    const std::vector<std::vector<int>> &F,
                                    int f, const Eigen::RowVector2d &p) {
  Eigen::RowVector3d bary;
  Eigen::RowVector2d v0 = V.row(F[f][0]);
  Eigen::RowVector2d v1 = V.row(F[f][1]);
  Eigen::RowVector2d v2 = V.row(F[f][2]);
  Eigen::RowVector2d e0 = v1 - v0;
  Eigen::RowVector2d e1 = v2 - v0;
  Eigen::RowVector2d e2 = p - v0;
  double d00 = e0.dot(e0);
  double d01 = e0.dot(e1);
  double d11 = e1.dot(e1);
  double d20 = e2.dot(e0);
  double d21 = e2.dot(e1);
  double denom = d00 * d11 - d01 * d01;
  bary(1) = (d11 * d20 - d01 * d21) / denom;
  bary(2) = (d00 * d21 - d01 * d20) / denom;
  bary(0) = 1.0 - bary(1) - bary(2);
  return bary;
}

std::tuple<utils::Hmesh::Edge *, double, double>
find_intersection(const Eigen::RowVector2d &p0, const Eigen::RowVector2d &p1,
                  const utils::Hmesh &uv_mesh, int f) {
  utils::Hmesh::Edge *edge = uv_mesh.face(f).edge(), *cur = edge;
  do {
    // Check if (p0 - p1) intersects with the edge.
    Eigen::RowVector2d v0 = uv_mesh.V.row(cur->vi);
    Eigen::RowVector2d v1 = uv_mesh.V.row(cur->next()->vi);

    // Segment p0-p1 vs Segment v0-v1
    Eigen::RowVector2d s1 = p1 - p0;
    Eigen::RowVector2d s2 = v1 - v0;

    double s, t;
    double det = -s2(0) * s1(1) + s1(0) * s2(1);

    if (std::abs(det) > 1e-9) {
      s = (-s1(1) * (p0(0) - v0(0)) + s1(0) * (p0(1) - v0(1))) / det;
      t = (s2(0) * (p0(1) - v0(1)) - s2(1) * (p0(0) - v0(0))) / det;

      if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        return {cur, s, t};
      }
    }
  } while ((cur = cur->next()) != edge);
  return {nullptr, 0, 0};
}

std::pair<utils::Hmesh::Edge *, double>
find_boundary_intersection(Eigen::RowVector2d p0, const Eigen::RowVector2d &p1,
                           const utils::Hmesh &uv_mesh, int f) {
  for (int i = 0; i < 100; i++) {
    auto [edge, s, t] = find_intersection(p0, p1, uv_mesh, f);
    if (!edge) {
      std::cout << "This should not happen (i=" << i
                << ")! no intersection found." << std::endl;
      return {nullptr, 0};
    }
    if (!edge->twin()) {
      return {edge, s};
    }
    t += 1e-4;
    p0 = (p0 * (1 - t) + p1 * t);
    f = edge->twin()->fi;
  }
  std::cout << "This should not happen (i==100)! no intersection found."
            << std::endl;
  return {nullptr, 0};
}

bool add_face(const utils::Hmesh &uv_mesh, const utils::Hmesh &mesh,
              const std::vector<Eigen::RowVector2d> &points,
              const std::vector<Eigen::RowVector2d> &init_points,
              const std::vector<int> &uv_faces,
              std::vector<Eigen::Vector3d> &new_verts,
              std::vector<std::vector<int>> &new_faces,
              std::vector<Eigen::Vector2d> &init_mesh_verts) {
  // 1. Find a vertex inside the paramterization (assuming there's at least one inside).
  int init = 0;
  for (; uv_faces[init] == -1 && init < uv_faces.size(); init++)
    ;
  if (init >= uv_faces.size()) {
    std::cout << "No vertex found inside the paramterization." << std::endl;
    return false;
  }
  // 2. Iterate over the face, handling UV boundary.
  auto prev = [&](int i) { return (i - 1 + points.size()) % points.size(); };
  auto next = [&](int i) { return (i + 1) % points.size(); };
  std::vector<int> new_face;
  int p = init;
  do {
    int f = uv_faces[p];
    if (f != -1) {
      Eigen::RowVector3d bary = find_bary(uv_mesh.V, uv_mesh.F, f, points[p]);
      new_verts.push_back(bary * mesh.V(mesh.F[f], Eigen::all));
      init_mesh_verts.push_back(init_points[p]);
      new_face.push_back(new_verts.size() - 1);
      p = next(p);
    } else {
      // Start from the previous point (inside the UV domain).
      int inside_p = prev(p);
      int other_f = uv_faces[inside_p];
      Eigen::RowVector2d prev_point = points[inside_p];
      // Find the intersection of prev_points and points[p] with one of the
      // edges of prev_f.
      auto [edge, inter_t] =
          find_boundary_intersection(prev_point, points[p], uv_mesh, other_f);
      if (!edge || edge->twin()) {
        std::cout << "This should not happen! no intersection found."
                  << std::endl;
        return false;
      }
      // Push lifted intersection vertex.
      new_verts.push_back(
          mesh.V.row(mesh.F[edge->fi][edge->fvi]) * (1 - inter_t) +
          mesh.V.row(mesh.F[edge->fi][edge->next()->fvi]) * inter_t);
      init_mesh_verts.push_back(
          uv_mesh.V.row(uv_mesh.F[edge->fi][edge->fvi]) * (1 - inter_t) +
          uv_mesh.V.row(uv_mesh.F[edge->fi][edge->next()->fvi]) * inter_t);
      // init_mesh_verts.push_back(points[p]);
      new_face.push_back(new_verts.size() - 1);
      int old_p = p;

      // Find next intersection with the uv boundary.
      while (uv_faces[next(p)] == -1)
        p = next(p);
      other_f = uv_faces[next(p)]; // != -1.
      // Find intersection.
      auto [edge2, inter_t2] = find_boundary_intersection(
          points[next(p)], points[p], uv_mesh, other_f);
      if (!edge2 || edge2->twin()) {
        std::cout << "This should not happen (2)! no intersection found."
                  << std::endl;
        return false;
      }
      // Push lifted intersection vertex.
      new_verts.push_back(
          mesh.V.row(mesh.F[edge2->fi][edge2->fvi]) * (1 - inter_t2) +
          mesh.V.row(mesh.F[edge2->fi][edge2->next()->fvi]) * inter_t2);
      init_mesh_verts.push_back(
          uv_mesh.V.row(uv_mesh.F[edge2->fi][edge2->fvi]) * (1 - inter_t2) +
          uv_mesh.V.row(uv_mesh.F[edge2->fi][edge2->next()->fvi]) * inter_t2);
      new_face.push_back(new_verts.size() - 1);
      p = next(p);
    }
  } while (p != init);
  new_faces.push_back(new_face);
  return true;
}

std::pair<kirigami::UnitPattern, kirigami::UnitPattern>
lift(const kirigami::UnitPattern &unit_pattern, float deployed_angle,
     const utils::Hmesh &mesh, Eigen::MatrixXd uv, float scale, float rotation,
     bool intersect_boundary, bool remove_single_faces) {
  kirigami::UnitPattern deployed_pattern = unit_pattern.deploy(deployed_angle),
                        // init_pattern = unit_pattern.deploy(init_angle);
      init_pattern = unit_pattern;
  deployed_pattern.mesh.V.rowwise() -= deployed_pattern.mesh.V.colwise().mean();

  uv.rowwise() -= uv.colwise().mean();
  uv = (uv * Eigen::Rotation2Dd(rotation).matrix()).eval();
  utils::Hmesh uv_mesh(uv, mesh.F);
  double area_ratio = uv_mesh.area() / deployed_pattern.mesh.area();
  // uv_mesh.V = (uv * 10 * scale / area_ratio).eval();
  // uv = (uv * 10 * scale / area_ratio).eval();
  double factor = area_ratio / (10 * scale);
  deployed_pattern = deployed_pattern.scale(factor);
  init_pattern = init_pattern.scale(factor);

  igl::AABB<Eigen::MatrixXd, 2> tree;
  // Initialize the tree with the original mesh.
  Eigen::MatrixXi F = convert::to_eig_mat(mesh.F);
  tree.init(uv, F);
  // Calculate repetition bounds.
  Eigen::Matrix2d inverse_periodicity = deployed_pattern.periodicity.inverse();
  Eigen::MatrixXd uv_in_p = uv * inverse_periodicity;
  Eigen::Vector2i min_rep =
      uv_in_p.colwise().minCoeff().array().floor().cast<int>();
  Eigen::Vector2i max_rep =
      uv_in_p.colwise().maxCoeff().array().ceil().cast<int>();
  min_rep.array() -= 1;
  max_rep.array() += 1;

  std::vector<Eigen::Vector3d> new_verts;
  std::vector<std::vector<int>> new_faces;
  std::vector<int> face_colors;
  std::vector<Eigen::Vector2d> init_mesh_verts;
  for (int i = min_rep(0); i <= max_rep(0); i++) {
    for (int j = min_rep(1); j <= max_rep(1); j++) {
      Eigen::RowVector2d shift = i * deployed_pattern.periodicity.row(0) +
                                 j * deployed_pattern.periodicity.row(1);
      Eigen::RowVector2d init_shift = i * init_pattern.periodicity.row(0) +
                                      j * init_pattern.periodicity.row(1);
      // Iterate over the faces of the mesh.
      for (int f = 0; f < deployed_pattern.mesh.F.size(); f++) {
        std::vector<int> uv_faces;
        std::vector<Eigen::RowVector2d> points, init_points;
        bool any_inside = false, all_inside = true;
        // Iterate over the vertices of the face.
        // for (auto &v : deployed_pattern.mesh.F[f]) {
        for (int vi = 0; vi < deployed_pattern.mesh.F[f].size(); vi++) {
          int v = deployed_pattern.mesh.F[f][vi];
          int init_v = init_pattern.mesh.F[f][vi];
          Eigen::RowVector2d p = deployed_pattern.mesh.V.row(v) + shift;
          points.push_back(p);
          init_points.push_back(init_pattern.mesh.V.row(init_v) + init_shift);
          std::vector<int> faces = tree.find(uv, F, p);
          if (!faces.empty()) {
            any_inside = true;
          } else {
            all_inside = false;
          }
          uv_faces.push_back(faces.empty() ? -1 : faces[0]);
        }
        // Add the face if all_inside and new vertices.
        if (!any_inside || (!intersect_boundary && !all_inside))
          continue;
        if (add_face(uv_mesh, mesh, points, init_points, uv_faces, new_verts,
                     new_faces, init_mesh_verts)) {
          face_colors.push_back(deployed_pattern.face_colors[f]);
        }
      }
    }
  }
  auto [lifted, new_to_old] =
      utils::Hmesh(convert::to_eig_mat(new_verts), new_faces)
          .merge_close_verts_face_mapping();
  std::vector<int> new_face_colors;
  for (int f = 0; f < new_to_old.size(); f++) {
    new_face_colors.push_back(face_colors[new_to_old[f]]);
  }
  auto [init_mesh, init_to_old] =
      utils::Hmesh(convert::to_eig_mat(init_mesh_verts), new_faces)
          .merge_close_verts_face_mapping();
  auto res = keep_biggest_connected_component(
      kirigami::UnitPattern{init_mesh.remove_unused_verts(),
                            Eigen::Matrix2d::Zero(), new_face_colors},
      kirigami::UnitPattern{lifted.remove_unused_verts(),
                            Eigen::Matrix2d::Zero(), new_face_colors});
  if (remove_single_faces) {
    return remove_leaves(res);
  }
  return res;
}

std::pair<std::vector<int>, std::vector<int>>
face_to_connected_component(const kirigami::UnitPattern &pattern) {
  std::vector<int> connected_components_sizes;
  std::vector<int> face_to_connected_component(pattern.face_colors.size(), -1);
  for (int i = 0; i < pattern.face_colors.size(); i++) {
    if (face_to_connected_component[i] != -1) {
      continue;
    }
    int current_component_index = connected_components_sizes.size();
    face_to_connected_component[i] = current_component_index;
    int component_size = 0;
    std::queue<int> q;
    q.push(i);

    while (!q.empty()) {
      int f_idx = q.front();
      q.pop();
      component_size++;

      const auto &face = pattern.mesh.faces[f_idx];
      auto *start_edge = face.edge();
      auto *curr = start_edge;
      do {
        if (curr->twin()) {
          int neighbor_idx = curr->twin()->fi;
          if (face_to_connected_component[neighbor_idx] == -1) {
            if (pattern.face_colors[f_idx] !=
                pattern.face_colors[neighbor_idx]) {
              face_to_connected_component[neighbor_idx] =
                  current_component_index;
              q.push(neighbor_idx);
            }
          }
        }
        curr = curr->next();
      } while (curr != start_edge);
    }
    connected_components_sizes.push_back(component_size);
  }
  return {connected_components_sizes, face_to_connected_component};
}

std::pair<kirigami::UnitPattern, kirigami::UnitPattern>
keep_biggest_connected_component(const kirigami::UnitPattern &ground,
                                 const kirigami::UnitPattern &lifted) {
  auto [components_size, face_to_component] =
      face_to_connected_component(ground);
  int max_idx =
      std::max_element(components_size.begin(), components_size.end()) -
      components_size.begin();
  // Only keep faces in ground.mesh and lifted.mesh that are in the biggest
  // connected component.
  std::vector<int> new_face_colors;
  std::vector<std::vector<int>> new_ground_faces, new_lifted_faces;
  for (int i = 0; i < face_to_component.size(); i++) {
    if (face_to_component[i] == max_idx) {
      new_face_colors.push_back(ground.face_colors[i]);
      new_ground_faces.push_back(ground.mesh.F[i]);
      new_lifted_faces.push_back(lifted.mesh.F[i]);
    }
  }
  return {
      kirigami::UnitPattern{
          utils::Hmesh(ground.mesh.V, new_ground_faces).remove_unused_verts(),
          ground.periodicity, new_face_colors},
      kirigami::UnitPattern{
          utils::Hmesh(lifted.mesh.V, new_lifted_faces).remove_unused_verts(),
          lifted.periodicity, new_face_colors}};
}

std::pair<kirigami::UnitPattern, kirigami::UnitPattern> remove_leaves(
    const std::pair<kirigami::UnitPattern, kirigami::UnitPattern> &patterns) {
  auto &[ground, lifted] = patterns;
  std::vector<int> keep_face(ground.mesh.faces.size(), 1);
  bool changed = true;
  int i = 0;
  while (changed && i++ < 100) {
    std::cout << "Remove leaves iteration " << i << std::endl;
    changed = false;
    for (int f = 0; f < ground.mesh.F.size(); f++) {
      if (!keep_face[f])
        continue;

      // Check if the face has at least 2 neighbors with different color with
      // keep_Face = 1.
      auto *start_edge = ground.mesh.face(f).edge();
      auto *curr = start_edge;
      int num_neighbors = 0;
      do {
        if (curr->twin() && keep_face[curr->twin()->fi] &&
            ground.face_colors[f] != ground.face_colors[curr->twin()->fi]) {
          num_neighbors++;
        }
        curr = curr->next();
      } while (curr != start_edge);
      if (num_neighbors < 2) {
        keep_face[f] = 0;
        changed = true;
      }
    }
  }
  std::vector<std::vector<int>> new_ground_faces, new_lifted_faces;
  std::vector<int> face_colors;
  for (int i = 0; i < keep_face.size(); i++) {
    if (keep_face[i]) {
      new_ground_faces.push_back(ground.mesh.F[i]);
      new_lifted_faces.push_back(lifted.mesh.F[i]);
      face_colors.push_back(ground.face_colors[i]);
    }
  }
  return {
      kirigami::UnitPattern{
          utils::Hmesh(ground.mesh.V, new_ground_faces).remove_unused_verts(),
          ground.periodicity, face_colors},
      kirigami::UnitPattern{
          utils::Hmesh(lifted.mesh.V, new_lifted_faces).remove_unused_verts(),
          lifted.periodicity, face_colors}};
}
} // namespace param