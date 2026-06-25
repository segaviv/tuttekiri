#include "kirigami.h"
#include "../utils/conversions.h"
#include <Eigen/src/Geometry/Rotation2D.h>
#include <Eigen/src/Geometry/Transform.h>
#include <iostream>

namespace kirigami {

utils::Hmesh repeat_2x2(const utils::Hmesh &mesh,
                        const Eigen::Matrix2d &periodicity) {
  Eigen::MatrixXd V(mesh.V.rows() * 4, 2);
  std::vector<std::vector<int>> F;
  int cnt = 0, nv = mesh.V.rows();
  for (int x = 0; x < 2; x++) {
    for (int y = 0; y < 2; y++) {
      V.block(cnt * nv, 0, nv, 2) = mesh.V;
      V.block(cnt * nv, 0, nv, 2).rowwise() += x * periodicity.row(0);
      V.block(cnt * nv, 0, nv, 2).rowwise() += y * periodicity.row(1);
      for (int fi = 0; fi < mesh.F.size(); fi++) {
        std::vector<int> new_face;
        for (int v : mesh.F[fi]) {
          new_face.push_back(v + cnt * nv);
        }
        F.push_back(new_face);
      }
      cnt++;
    }
  }
  return utils::Hmesh(V, F).merge_close_verts();
}

std::pair<utils::Hmesh, Eigen::Matrix2d>
replicate_2x2(const utils::Hmesh &mesh, const Eigen::Matrix2d &periodicity) {
  return std::make_pair(repeat_2x2(mesh, periodicity), periodicity * 2);
}

static bool is_inner_face_edge(utils::Hmesh::Edge *edge,
                               const std::vector<int> &face_colors) {
  if (!edge->twin())
    return false;
  if (face_colors[edge->fi] == 0 && edge->prev()->twin() &&
      edge->twin()->fi == edge->prev()->twin()->fi) {
    return true;
  }
  if (face_colors[edge->fi] == 1 && edge->next()->twin() &&
      edge->twin()->fi == edge->next()->twin()->fi) {
    return true;
  }
  return false;
}

std::pair<utils::Hmesh, Eigen::Matrix2d>
deploy(const utils::Hmesh &orig_mesh, const std::vector<int> &orig_face_colors,
       const Eigen::Matrix2d &periodicity, float angle) {
  bool is_periodic = periodicity.norm() > 1e-6;
  // Repeat the face colors.
  std::vector<int> face_colors;
  if (is_periodic) {
    for (int i = 0; i < 4; i++)
      face_colors.insert(face_colors.end(), orig_face_colors.begin(),
                         orig_face_colors.end());
  } else {
    face_colors = orig_face_colors;
  }
  utils::Hmesh mesh =
      is_periodic ? repeat_2x2(orig_mesh, periodicity) : orig_mesh;

  utils::Hmesh res = mesh.split_faces();
  std::queue<std::pair<int, Eigen::Isometry2d>> q;
  q.push({0, Eigen::Isometry2d::Identity()});
  std::vector<bool> visited(res.F.size(), false);
  visited[0] = true;
  while (!q.empty()) {
    auto [fi, T] = q.front();
    q.pop();
    utils::Hmesh::Edge *edge = mesh.face(fi).edge(), *orig_edge = edge;
    do {
      if (!edge->twin() || face_colors[fi] == face_colors[edge->twin()->fi] ||
          visited[edge->twin()->fi] || is_inner_face_edge(edge, face_colors))
        continue;
      // Check if the hinge is the source or target vertex of the edge.
      int vi;
      double rotation_angle;
      if (face_colors[fi] == 0 ||
          (face_colors[fi] == 2 && face_colors[edge->twin()->fi] == 1)) {
        vi = mesh.F[fi][edge->fvi];
        rotation_angle = -angle;
      } else {
        vi = mesh.F[fi][edge->next()->fvi];
        rotation_angle = angle;
      }
      // if (mesh.is_boundary_vertex(vi))
      //   continue;
      // Compute the transformation matrix.
      Eigen::Isometry2d T2 = T;
      T2.translate((Eigen::Vector2d)mesh.V.row(vi))
          .rotate(Eigen::Rotation2Dd(rotation_angle))
          .translate((Eigen::Vector2d)-mesh.V.row(vi));
      // Apply the transformation to the vertices of the twin face.
      for (int v = 0; v < res.F[edge->twin()->fi].size(); v++) {
        Eigen::Vector2d vertex = mesh.V.row(mesh.F[edge->twin()->fi][v]);
        res.V.row(res.F[edge->twin()->fi][v]) = T2 * vertex;
      }
      // Push the twin face to the queue.
      q.push({edge->twin()->fi, T2});
      visited[edge->twin()->fi] = true;
    } while ((edge = edge->next()) != orig_edge);
  }
  res.V.rowwise() -= res.V.colwise().mean();
  res.V *=
      Eigen::Rotation2Dd(face_colors[0] == 0 ? -angle / 2 : angle / 2).matrix();
  utils::Hmesh res_mesh(res.V, convert::slice(res.F, 0, orig_mesh.F.size()));
  res_mesh = res_mesh.remove_unused_verts();
  res_mesh.V.rowwise() -= res_mesh.V.colwise().mean();
  // Compute new periodicity.
  if (is_periodic) {
    Eigen::Matrix2d new_periodicity;
    new_periodicity.row(1) =
        res.V.row(res.F[orig_mesh.nf()][0]) - res.V.row(res.F[0][0]);
    new_periodicity.row(0) =
        res.V.row(res.F[orig_mesh.nf() * 2][0]) - res.V.row(res.F[0][0]);
    return std::make_pair(res_mesh, new_periodicity);
  }
  return std::make_pair(res_mesh, Eigen::Matrix2d::Zero());
}

utils::Hmesh::Edge *find_matching_edge(utils::Hmesh::Edge *e0,
                                       utils::Hmesh::Edge *e1) {
  utils::Hmesh::Edge *matching_edge = e1;
  do {
    if ((e0->vec() - matching_edge->vec()).norm() < 1e-3)
      return matching_edge;
    matching_edge = matching_edge->next();
  } while (matching_edge != e1);
  return nullptr;
}

// Check if two polygons are the same.
bool is_same_polygon(utils::Hmesh::Edge *e0, utils::Hmesh::Edge *e1) {
  utils::Hmesh::Edge *edge = e0;
  do {
    if ((edge->vec() - e1->vec()).norm() > 1e-3)
      return false;
    edge = edge->next();
    e1 = e1->next();
  } while (edge != e0);
  return true;
}

bool is_repeating_polygon(utils::Hmesh::Edge *e0, utils::Hmesh::Edge *e1) {
  e1 = find_matching_edge(e0, e1);
  if (!e1)
    return false;
  if (!is_same_polygon(e0, e1))
    return false;
  utils::Hmesh::Edge *edge = e0;
  do {
    if (edge->twin() && e1->twin() &&
        !is_same_polygon(edge->twin(), e1->twin()))
      return false;
    edge = edge->next();
    e1 = e1->next();
  } while (edge != e0);
  return true;
}

std::pair<utils::Hmesh, Eigen::Matrix2d>
detect_unit_pattern(const utils::Hmesh &mesh) {
  std::vector<int> faces;
  std::vector<bool> visited(mesh.F.size(), false);
  visited[0] = true;
  std::queue<int> q;
  q.push(0);
  Eigen::Matrix2d periodicity = Eigen::Matrix2d::Zero();
  while (!q.empty()) {
    int fi = q.front();
    q.pop();
    utils::Hmesh::Edge *edge = mesh.face(fi).edge(), *orig_edge = edge;
    // Check if the face belongs to the unit pattern.
    bool unique = true;
    for (auto uf : faces) {
      if (is_repeating_polygon(edge, mesh.face(uf).edge())) {
        auto e1 = find_matching_edge(edge, mesh.face(uf).edge());
        Eigen::RowVector2d diff =
            edge->origin()->coords() - e1->origin()->coords();
        bool same_abs = std::abs(std::abs(diff(0)) - std::abs(diff(1))) < 1e-3;
        if (same_abs) {
          // Nothing assigned yet to the 'x' periodicity.
          if (periodicity.row(0).norm() < 1e-3) {
            periodicity.row(0) = diff;
          } else if ((periodicity.row(0) - diff).norm() > 1e-3) {
            // Nothing assigned yet to the 'y' periodicity, and it's different
            // than the 'x' periodicity.
            periodicity.row(1) = diff;
          }
        } else if (std::abs(diff(0)) > std::abs(diff(1))) {
          periodicity.row(0) = diff;
        } else {
          periodicity.row(1) = diff;
        }
        unique = false;
        break;
      }
    }
    // If it is unique, add it to the unit pattern.
    if (unique) {
      faces.push_back(fi);
    } else {
      continue;
    }
    // Push neighbors.
    do {
      if (edge->twin() && !visited[edge->twin()->fi]) {
        visited[edge->twin()->fi] = true;
        q.push(edge->twin()->fi);
      }
      edge = edge->next();
    } while (edge != orig_edge);
  }

  utils::Hmesh unit_pattern =
      utils::Hmesh(mesh.V, convert::slice(mesh.F, faces)).remove_unused_verts();

  // Detect periodicity.
  if (periodicity(0, 0) < 0) {
    periodicity.row(0) *= -1;
  }
  if (periodicity(1, 1) < 0) {
    periodicity.row(1) *= -1;
  }
  unit_pattern.V.rowwise() -= unit_pattern.V.colwise().mean();
  return std::make_pair(unit_pattern, periodicity);
}

utils::Hmesh replicate(const utils::Hmesh &mesh,
                       const Eigen::Matrix2d &periodicity, int repX, int repY) {
  std::vector<Eigen::VectorXd> new_v;
  std::vector<std::vector<int>> new_f;
  int offset = 0;
  for (int i = 0; i < repX; i++) {
    for (int j = 0; j < repY; j++) {
      for (int vi = 0; vi < mesh.V.rows(); vi++) {
        Eigen::RowVector2d v = mesh.V.row(vi);
        v += i * periodicity.row(0);
        v += j * periodicity.row(1);
        new_v.push_back(v);
      }
      for (int fi = 0; fi < mesh.F.size(); fi++) {
        std::vector<int> new_fi;
        for (int v : mesh.F[fi]) {
          new_fi.push_back(v + offset);
        }
        new_f.push_back(new_fi);
      }
      offset += mesh.V.rows();
    }
  }
  return utils::Hmesh(convert::to_eig_mat(new_v), new_f).merge_close_verts();
}

static double cross2d(const Eigen::Vector2d &a, const Eigen::Vector2d &b) {
  return a.x() * b.y() - a.y() * b.x();
}

// Calculates the angle between the edge and the next edge.
static double edge_next_edge_angle(const utils::Hmesh::Edge *e) {
  auto next_edge = e->next();
  Eigen::Vector2d next_vec = next_edge->vec();
  Eigen::Vector2d vec = -e->vec();
  return std::atan2(cross2d(next_vec, vec), vec.dot(next_vec));
}

double max_opening_angle(const kirigami::UnitPattern &pattern) {
  auto rep_pattern =
      pattern.periodicity.norm() < 1e-3 ? pattern : pattern.replicate(3, 3);
  auto &colors = rep_pattern.face_colors;
  double min_angle = M_PI * 2;
  for (auto &edge : rep_pattern.mesh.edges) {
    // Ignore boundary edges.
    if (edge.is_boundary() || edge.is_periodic())
      continue;
    // And fully separated faces.
    if (colors[edge.fi] == colors[edge.twin()->fi])
      continue;
    // If we're here there's a hinge.
    if (colors[edge.fi] == 0) {
      // Hinge is the tail vertex.
      double ang1 = edge_next_edge_angle(edge.prev());
      double ang2 = edge_next_edge_angle(edge.twin());
      min_angle = std::min(min_angle, 2 * M_PI - (ang1 + ang2));
    } else {
      // Hinge is the head vertex.
      double ang1 = edge_next_edge_angle(&edge);
      double ang2 = edge_next_edge_angle(edge.twin()->prev());
      min_angle = std::min(min_angle, 2 * M_PI - (ang1 + ang2));
    }
  }
  return min_angle;
}

} // namespace kirigami