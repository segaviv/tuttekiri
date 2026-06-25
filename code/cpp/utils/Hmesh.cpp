#include "Hmesh.h"

#include <assert.h>

#include <queue>
#include <set>
#include <vector>

#include "conversions.h"
#include "utils.h"

namespace utils {

// Hmesh::Face &Hmesh::face(int i) {
//   assert(i < faces.size() && i >= 0 && "Face index out of bounds");
//   return faces[i];
// }
// Hmesh::Vertex &Hmesh::vertex(int i) {
//   assert(i < verts.size() && i >= 0 && "Vertex index out of bounds");
//   return verts[i];
// }
// Hmesh::Edge &Hmesh::edge(int i) {
//   assert(i < edges.size() && i >= 0 && "Edge index out of bounds");
//   return edges[i];
// }

Hmesh::Edge *Hmesh::Face::edge() const { return &mesh->edge(ei); }

Eigen::Vector2d Hmesh::Face::to_local_coords(const Eigen::Vector3d &vec) const {
  return frame.transpose() * (vec - edge()->origin()->coords());
}
Eigen::Vector2d
Hmesh::Face::bary_to_local_coords(const Eigen::Vector3d &bary) const {
  return to_local_coords(bary(0) * mesh->V.row(mesh->F[index][0]) +
                         bary(1) * mesh->V.row(mesh->F[index][1]) +
                         bary(2) * mesh->V.row(mesh->F[index][2]));
}
Eigen::Vector3d Hmesh::Face::to_bary_coords(const Eigen::Vector3d &vec) const {
  Eigen::Matrix<double, 3, 2> A;
  A << edge()->prev()->vec(), -edge()->next()->vec();
  Eigen::Vector3d res;
  res.head(2) = (A.transpose() * A).inverse() * A.transpose() *
                (vec - edge()->prev()->origin()->coords());
  res(2) = 1 - res(0) - res(1);
  return res;
}
Eigen::Vector3d
Hmesh::Face::to_global_coords(const Eigen::Vector2d &vec) const {
  return frame * vec + edge()->origin()->coords();
}

Eigen::VectorXd Hmesh::Face::center() const {
  Edge *orig_e = edge();
  Edge *e = orig_e;
  Eigen::VectorXd center = Eigen::VectorXd::Zero(mesh->V.cols());
  int count = 0;
  do {
    center += e->origin()->coords();
    count++;
    e = e->next();
  } while (e != orig_e);
  return center / count;
}

double Hmesh::Face::area() const {
  auto &face = mesh->F[index];
  if (mesh->V.cols() == 3) {
    Eigen::Vector3d vec_area = Eigen::Vector3d::Zero();
    for (int i = 0; i < nf(); i++) {
      vec_area +=
          ((Eigen::Vector3d)mesh->V.row(face[i]))
              .cross((Eigen::Vector3d)mesh->V.row(face[(i + 1) % nf()]));
    }
    return vec_area.norm() / 2;
  }
  double area = 0;
  for (int i = 1; i < nf() - 1; i++) {
    Eigen::Vector2d v0 = mesh->V.row(face[0]);
    Eigen::Vector2d v1 = mesh->V.row(face[i]);
    Eigen::Vector2d v2 = mesh->V.row(face[i + 1]);
    Eigen::Vector2d e0 = v1 - v0, e1 = v2 - v0;
    area += 0.5 * std::abs(e0.x() * e1.y() - e0.y() * e1.x());
  }
  return area;
}

Eigen::Vector3d Hmesh::Face::normal() const {
  auto &face = mesh->F[index];
  Eigen::Vector3d vec_area = Eigen::Vector3d::Zero();
  for (int i = 0; i < nf(); i++) {
    vec_area += ((Eigen::Vector3d)mesh->V.row(face[i]))
                    .cross((Eigen::Vector3d)mesh->V.row(face[(i + 1) % nf()]));
  }
  return vec_area.normalized();
}

Hmesh::Edge *Hmesh::Vertex::edge() const { return &mesh->edge(ei); }

Eigen::VectorXd Hmesh::Vertex::coords() const { return mesh->V.row(index); }
Eigen::VectorXd Hmesh::Vertex::normal() const {
  Eigen::VectorXd normal = Eigen::VectorXd::Zero(mesh->V.cols());
  double total_area = 0;
  Edge *e = edge();
  do {
    normal += e->face()->normal() * e->face()->area();
    total_area += e->face()->area();
    e = e->prev()->twin();
  } while (e != edge() && e != nullptr);
  return (normal / total_area).normalized();
}

bool Hmesh::Face::is_boundary() {
  Edge *orig_e = edge();
  Edge *e = orig_e;
  do {
    if (!e->twin())
      return true;
    e = e->next();
  } while (e != orig_e);
  return false;
}

static std::vector<std::vector<int>> convert_faces(const Eigen::MatrixXi &F,
                                                   const Eigen::VectorXi &D) {
  std::vector<std::vector<int>> faces(F.rows());
  for (int i = 0; i < F.rows(); i++) {
    for (int j = 0; j < D(i); j++) {
      faces[i].push_back(F(i, j));
    }
  }
  return faces;
}

Hmesh::Hmesh(const Eigen::MatrixXd &V, const Eigen::MatrixXi &F,
             const Eigen::VectorXi &D)
    : Hmesh(V, convert_faces(F, D)) {}

Hmesh::Hmesh(const Eigen::MatrixXd &V, const std::vector<std::vector<int>> &F)
    : V(V), F(F) {
  int nv = V.rows(), nf = F.size();
  verts.reserve(nv);
  faces.reserve(nf);
  int num_edges = 0;
  for (int i = 0; i < F.size(); i++) {
    num_edges += F[i].size();
  }
  edges.reserve(num_edges);
  verts_edges.resize(nv);

  // Push vertices.
  for (int i = 0; i < nv; i++) {
    verts.push_back(Vertex{.index = i, .ei = -1, .mesh = this});
  }

  // Faces and edges.
  int cur_edge_index = 0;
  for (int i = 0; i < nf; i++) {
    // Push face.
    faces.push_back(Face{.index = i, .ei = cur_edge_index, .mesh = this});
    // Push face edges.
    int verts_per_face = F[i].size();
    for (int j = 0; j < verts_per_face; j++) {
      int vi = F[i][j], vip1 = F[i][(j + 1) % verts_per_face];
      int ei = cur_edge_index + j;
      // Edge ei is from vertex vi to vip1.
      edges.push_back(
          Edge{.index = ei,
               .vi = vi,
               .fi = i,
               .fvi = j,
               .ti = -1,
               .ni = cur_edge_index + (j + 1) % verts_per_face,
               .pi = cur_edge_index + (j - 1 + verts_per_face) % verts_per_face,
               .mesh = this});
      // Update vertex edge.
      if (vertex(vi).ei == -1) {
        verts[vi].ei = ei;
      }
      // Update verts_edges.
      verts_edges[vi][vip1] = ei;
      auto it = verts_edges[vip1].find(vi);
      if (it != verts_edges[vip1].end()) {
        edges[ei].ti = it->second;
        edges[it->second].ti = ei;
      }
    }
    cur_edge_index += verts_per_face;
  }
  // Calculate frames.
  if (V.cols() == 3) {
    for (auto &face : faces) {
      face.frame.col(0) = face.edge()->vec().normalized();
      face.frame.col(1) = face.normal().cross(face.frame.col(0)).normalized();
    }
    for (auto &edge : edges) {
      if (edge.twin()) {
        edge.frame_rot =
            edge.twin()->face()->frame.transpose() * edge.face()->frame;
      }
    }
  }
  // Make the boundary edge the first in each vertex.
  for (int i = 0; i < nv; i++) {
    if (verts[i].ei == -1)
      continue;

    Edge *e = verts[i].edge();
    if (!e || !e->twin()) {
      continue;
    }
    do {
      e = e->twin()->next();
    } while (e != verts[i].edge() && e->twin());
    verts[i].ei = e->index;
  }
  // compute_vertex_normals();
}

int Hmesh::max_face_degree() {
  int max_degree = 0;
  for (int i = 0; i < F.size(); i++)
    max_degree = std::max(max_degree, (int)F[i].size());
  return max_degree;
}

Hmesh &Hmesh::operator=(const Hmesh &other) {
  V = other.V;
  F = other.F;
  Vn = other.Vn;
  verts = other.verts;
  faces = other.faces;
  edges = other.edges;
  verts_edges = other.verts_edges;
  for (auto &v : verts) {
    v.mesh = this;
  }
  for (auto &f : faces) {
    f.mesh = this;
  }
  for (auto &e : edges) {
    e.mesh = this;
  }
  return *this;
}

inline std::vector<std::vector<int>> to_vector(const Eigen::MatrixXi &F) {
  std::vector<std::vector<int>> F_vec(F.rows());
  for (int i = 0; i < F.rows(); i++) {
    F_vec[i].resize(F.cols());
    for (int j = 0; j < F.cols(); j++) {
      F_vec[i][j] = F(i, j);
    }
  }
  return std::move(F_vec);
}

Hmesh::Hmesh(const Hmesh &other)
    : V(other.V), F(other.F), Vn(other.Vn), verts(other.verts),
      faces(other.faces), edges(other.edges), verts_edges(other.verts_edges) {
  for (auto &v : verts) {
    v.mesh = this;
  }
  for (auto &f : faces) {
    f.mesh = this;
  }
  for (auto &e : edges) {
    e.mesh = this;
  }
}

Hmesh Hmesh::merge_close_verts() const {
  std::vector<Eigen::VectorXd> new_verts;
  std::vector<int> old_to_new(V.rows(), -1);
  double elen = avg_edge_len();
  for (int i = 0; i < V.rows(); i++) {
    if (old_to_new[i] != -1)
      continue;
    old_to_new[i] = new_verts.size();
    new_verts.push_back(V.row(i));

    for (int j = i + 1; j < V.rows(); j++) {
      if ((V.row(i) - V.row(j)).norm() < elen * 0.1) {
        old_to_new[j] = old_to_new[i];
      }
    }
  }

  std::vector<std::vector<int>> new_faces;
  for (auto &face : F) {
    std::vector<int> new_face;
    for (int j = 0; j < face.size(); j++) {
      if (!new_face.empty() && (new_face.back() == old_to_new[face[j]] ||
                                new_face.front() == old_to_new[face[j]]))
        continue;
      new_face.push_back(old_to_new[face[j]]);
    }
    std::set<int> new_face_set(new_face.begin(), new_face.end());
    if (new_face_set.size() < new_face.size()) {
      std::cout << "Duplicate vertex in face " << std::endl;
      for (int i = 0; i < new_face.size(); i++) {
        std::cout << new_face[i] << " ";
      }
      std::cout << std::endl;
    }
    if (new_face.size() > 2)
      new_faces.push_back(new_face);
  }
  return Hmesh(convert::to_eig_mat(new_verts), new_faces);
}

std::pair<Hmesh, std::vector<int>> Hmesh::merge_close_verts_face_mapping() {
  std::vector<Eigen::VectorXd> new_verts;
  std::vector<int> old_to_new(V.rows(), -1);
  double elen = avg_edge_len();
  for (int i = 0; i < V.rows(); i++) {
    if (old_to_new[i] != -1)
      continue;
    old_to_new[i] = new_verts.size();
    new_verts.push_back(V.row(i));

    for (int j = i + 1; j < V.rows(); j++) {
      if ((V.row(i) - V.row(j)).norm() < elen * 0.1) {
        old_to_new[j] = old_to_new[i];
      }
    }
  }

  std::vector<std::vector<int>> new_faces;
  std::vector<int> new_to_old;
  for (int f = 0; f < F.size(); f++) {
    auto &face = F[f];
    std::vector<int> new_face;
    for (int j = 0; j < face.size(); j++) {
      if (!new_face.empty() && (new_face.back() == old_to_new[face[j]] ||
                                new_face.front() == old_to_new[face[j]]))
        continue;
      new_face.push_back(old_to_new[face[j]]);
    }
    std::set<int> new_face_set(new_face.begin(), new_face.end());
    if (new_face_set.size() < new_face.size()) {
      std::cout << "Duplicate vertex in face " << std::endl;
      for (int i = 0; i < new_face.size(); i++) {
        std::cout << new_face[i] << " ";
      }
      std::cout << std::endl;
    }
    if (new_face.size() > 2) {
      new_faces.push_back(new_face);
      new_to_old.push_back(f);
    }
  }
  return {Hmesh(convert::to_eig_mat(new_verts), new_faces), new_to_old};
}

Hmesh::Hmesh(const Eigen::MatrixXd &V, const Eigen::MatrixXi &F)
    : Hmesh(V, to_vector(F)) {}

Hmesh &Hmesh::with_external_boundary_edges() {
  for (Edge &e : edges) {
    if (!e.twin()) {
      edges.push_back(Edge{.index = (int)edges.size(),
                           .vi = e.next()->vi,
                           .fi = -1,
                           .ti = e.index,
                           .ni = -1,
                           .pi = -1});
      e.ti = edges.size() - 1;
      verts_edges[e.twin()->vi][e.vi] = e.twin()->index;
    }
  }
  return *this;
}

Hmesh Hmesh::dual() {
  Eigen::MatrixXd new_v(F.size(), 3);
  std::vector<std::vector<int>> new_faces;
  for (int i = 0; i < faces.size(); i++) {
    new_v.row(i) = faces[i].center();
  }
  for (auto &vert : verts) {
    if (is_boundary_vertex(vert.index))
      continue;
    std::vector<int> new_face;
    for (auto e : Hmesh::NodeEdges(vert)) {
      new_face.push_back(e->fi);
    }
    if (new_face.size() > 2)
      new_faces.push_back(new_face);
  }
  return Hmesh(new_v, new_faces);
}

Hmesh Hmesh::remove_unused_verts() const {
  std::map<int, int> new_vert_map;
  std::vector<int> new_to_old;
  std::vector<std::vector<int>> faces = F;
  for (auto &face : faces) {
    for (int j = 0; j < face.size(); j++) {
      auto res = new_vert_map.insert({face[j], new_to_old.size()});
      if (res.second)
        new_to_old.push_back(face[j]);
      face[j] = res.first->second;
    }
  }
  return Hmesh(V(new_to_old, Eigen::all), faces);
}

Hmesh Hmesh::split_faces() const {
  std::vector<Eigen::VectorXd> new_verts;
  std::vector<std::vector<int>> new_faces;
  for (int f = 0; f < faces.size(); f++) {
    std::vector<int> new_face;
    for (int v = 0; v < F[f].size(); v++) {
      new_verts.push_back(V.row(F[f][v]));
      new_face.push_back(new_verts.size() - 1);
    }
    new_faces.push_back(new_face);
  }
  return Hmesh(convert::to_eig_mat(new_verts), new_faces);
}

Eigen::MatrixX3d utils::Hmesh::Face::Xf() const {
  return mesh->V(mesh->F[index], Eigen::all);
}
Eigen::MatrixXd utils::Hmesh::Face::Df() const {
  Eigen::MatrixXd res = -Eigen::MatrixXd::Identity(nf(), nf());
  for (int i = 0; i < nf(); i++)
    res(i, (i + 1) % nf()) = 1;
  return res;
}
Eigen::MatrixXd utils::Hmesh::Face::Af() const {
  Eigen::MatrixXd res = Eigen::MatrixXd::Identity(nf(), nf()) * 0.5;
  for (int i = 0; i < nf(); i++)
    res(i, (i + 1) % nf()) = 0.5;
  return res;
}

Eigen::MatrixXd utils::Hmesh::Face::Ef() const { return Df() * Xf(); }
Eigen::MatrixXd utils::Hmesh::Face::Bf() const { return Af() * Xf(); }

Eigen::MatrixX3d utils::Hmesh::Face::Nf() const {
  Eigen::MatrixX3d res = Eigen::MatrixX3d::Zero(nf(), 3);
  for (int i = 0; i < nf(); i++) {
    res.row(i) = mesh->Vn.row(mesh->F[index][i]);
  }
  return res;
}

Eigen::Vector3d utils::Hmesh::Face::af() const {
  Eigen::Vector3d res = Eigen::Vector3d::Zero();
  for (int i = 0; i < nf(); i++) {
    Eigen::Vector3d vi = mesh->V.row(mesh->F[index][i]),
                    vip1 = mesh->V.row(mesh->F[index][(i + 1) % nf()]);
    res += vi.cross(vip1);
  }
  return res / 2;
}

Eigen::Matrix3Xd utils::Hmesh::Face::Gf() const {
  auto area_vec = af();
  auto normal = area_vec.normalized();
  return -cross_prod_mat(normal) * Ef().transpose() * Af() / area_vec.norm();
}

Eigen::Matrix2d utils::Hmesh::Face::Sf() const {
  auto G = Gf();
  auto N = Nf();
  auto T = frame;

  return 0.5 * T.transpose() * (G * N + N.transpose() * G.transpose()) * T;
}

Hmesh Hmesh::triangulate() {
  std::vector<std::vector<int>> new_faces;
  for (int i = 0; i < F.size(); i++) {
    for (int j = 1; j < F[i].size() - 1; j++) {
      new_faces.push_back({F[i][0], F[i][j], F[i][j + 1]});
    }
  }
  return Hmesh(V, new_faces);
}

Hmesh Hmesh::triangulate_avoid_overlap() {
  std::vector<std::vector<int>> new_faces;
  for (int i = 0; i < F.size(); i++) {
    Eigen::MatrixXd face_verts = V(F[i], Eigen::all);
    auto projection = convert::project_to_common_plane_mat(face_verts);
    // Vertices in 2D.
    Eigen::MatrixXd proj_verts = projection.project(face_verts);
    Eigen::MatrixXi indices = Eigen::VectorXi::Map(F[i].data(), F[i].size());
    // While there are still at least 4 vertices, remove ear vertex.
    while (proj_verts.rows() > 3) {
      int ear_index = -1;
      double min_dist = std::numeric_limits<double>::max();
      for (int j = 0; j < proj_verts.rows(); j++) {
        Eigen::Vector2d p_prev =
            proj_verts.row((j - 1 + proj_verts.rows()) % proj_verts.rows());
        Eigen::Vector2d p_next = proj_verts.row((j + 1) % proj_verts.rows());
        // Check if p1 is an ear vertex.
        if (utils::is_inside_polygon(proj_verts, (p_next + p_prev) / 2) &&
            !utils::segment_intersects_poly(proj_verts, p_prev, p_next)) {
          double dist = (p_next - p_prev).norm();
          if (dist < min_dist) {
            min_dist = dist;
            ear_index = j;
          }
        }
      }
      // Assert ear_index != -1 && "No ear found in triangulation";
      assert(ear_index != -1 &&
             "No ear found in polygon, must be a non-simple polygon");
      // Add triangle to new faces.
      int prev_index = (ear_index - 1 + proj_verts.rows()) % proj_verts.rows();
      int next_index = (ear_index + 1) % proj_verts.rows();
      new_faces.push_back({(int)indices(prev_index), (int)indices(ear_index),
                           (int)indices(next_index)});
      // Remove ear vertex.
      proj_verts = utils::slice_row(proj_verts, ear_index);
      indices = utils::slice_row(indices, ear_index);
    }
    // Add the last triangle.
    new_faces.push_back({(int)indices(0), (int)indices(1), (int)indices(2)});
  }
  return Hmesh(V, new_faces);
}

std::pair<std::vector<int>, std::vector<int>>
Hmesh::remove_unused_verts_mapping() {
  std::vector<int> old_to_new(verts.size(), -1);
  std::vector<int> new_to_old;
  for (auto &face : F) {
    for (int j = 0; j < face.size(); j++) {
      if (old_to_new[face[j]] == -1) {
        old_to_new[face[j]] = new_to_old.size();
        new_to_old.push_back(face[j]);
      }
    }
  }
  return {old_to_new, new_to_old};
}

double Hmesh::avg_edge_len() const {
  double sum = 0;
  int count = 0;
  for (const Edge &e : edges) {
    if (!e.twin() || e.vi < e.next()->vi) {
      sum += e.vec().norm();
      count++;
    }
  }
  return sum / count;
}

double Hmesh::area() const {
  double sum = 0;
  for (auto &f : faces) {
    sum += f.area();
  }
  return sum;
}

bool Hmesh::is_boundary_vertex(int index) {
  for (auto ei : verts_edges[index]) {
    auto e = edges[ei.second];
    if (e.twin() == nullptr || e.twin()->fi == -1) {
      return true;
    }
  }
  return false;
}

int Hmesh::next_boundary_vert(int index) {
  return verts[index].edge()->next()->vi;
}

int Hmesh::prev_boundary_vert(int index) {
  auto e = verts[index].edge();
  while (!e->prev()->is_boundary())
    e = e->prev()->twin();
  return e->prev()->vi;
}

Hmesh::VertexStarIterator::VertexStarIterator(Edge *e)
    : VertexStarIterator(e, true) {}
Hmesh::VertexStarIterator::VertexStarIterator(Edge *e, bool is_begin)
    : e(e), is_begin(is_begin) {}
const Hmesh::VertexStarIterator &Hmesh::VertexStarIterator::operator++() {
  e = e->prev()->twin();
  is_begin = false;
  return *this;
}
bool Hmesh::VertexStarIterator::operator==(
    const VertexStarIterator &other) const {
  return !e || !e->face() || (e == other.e && is_begin == other.is_begin);
}
bool Hmesh::VertexStarIterator::operator!=(
    const VertexStarIterator &other) const {
  return !(operator==(other));
}

Hmesh::Vertex *Hmesh::Edge::origin() const { return &mesh->vertex(vi); }
Hmesh::Face *Hmesh::Edge::face() const { return &mesh->face(fi); }
Hmesh::Edge *Hmesh::Edge::prev() const { return &mesh->edge(pi); }
Hmesh::Edge *Hmesh::Edge::next() const { return &mesh->edge(ni); }
Hmesh::Edge *Hmesh::Edge::twin() const {
  if (ti == -1)
    return nullptr;
  return &mesh->edge(ti);
}

double Hmesh::Edge::cos_theta() {
  return -next()->vec().normalized().dot(prev()->vec().normalized());
}
double Hmesh::Edge::sin_theta() {
  return static_cast<Eigen::Vector3d>(next()->vec().normalized())
      .cross(static_cast<Eigen::Vector3d>(prev()->vec().normalized()))
      .norm();
}
double Hmesh::Edge::cot_theta() {
  // return cos_theta() / sin_theta();
  Eigen::Vector3d prev_vec = prev()->vec();
  Eigen::Vector3d next_vec = next()->vec();
  return -prev_vec.dot(next_vec) / prev_vec.cross(next_vec).norm();
}
double Hmesh::Edge::theta() { return acos(cos_theta()); }
Hmesh::Vertex *Hmesh::Edge::target() const { return next()->origin(); }
Eigen::VectorXd Hmesh::Edge::vec() const {
  return next()->origin()->coords() - origin()->coords();
}
Eigen::Vector2d Hmesh::Edge::local_vec() const {
  return face()->frame.transpose() * vec();
}
double Hmesh::Edge::length() { return vec().norm(); }

std::vector<std::set<int>> Hmesh::vertex_neighbors() const {
  std::vector<std::set<int>> neighbors(V.rows());
  for (int i = 0; i < F.size(); i++) {
    for (int j = 0; j < F[i].size(); j++) {
      int v0 = F[i][j], v1 = F[i][(j + 1) % F[i].size()];
      neighbors[v0].insert(v1);
      neighbors[v1].insert(v0);
    }
  }
  return neighbors;
}

Eigen::Vector3d Hmesh::Edge::normal() const {
  if (!twin())
    return face()->normal();
  return (face()->normal() * face()->area() +
          twin()->face()->normal() * twin()->face()->area())
      .normalized();
}

void Hmesh::compute_vertex_normals() {
  Vn = Eigen::MatrixXd::Zero(V.rows(), V.cols());
  for (int i = 0; i < F.size(); i++) {
    auto face_normal = faces[i].normal();
    for (int j = 0; j < F[i].size(); j++) {
      Vn(F[i][j], 0) += face_normal(0);
      Vn(F[i][j], 1) += face_normal(1);
      Vn(F[i][j], 2) += face_normal(2);
    }
  }
  Vn.rowwise().normalize();
}

Hmesh::Point Hmesh::Point::operator+(const Eigen::Vector2d &vec) const {
  return add(vec).first;
}

std::pair<utils::Hmesh::Point, bool>
utils::Hmesh::Point::add(const Eigen::Vector2d &vec) const {
  Hmesh::Point res(*this);
  Eigen::Vector2d dir = vec.normalized();
  double len = vec.norm();
  while (len > 1e-6) {
    // Find closest edge.
    double min_t = std::numeric_limits<double>::max();
    Edge *min_edge = nullptr;
    auto &f = mesh->face(res.face);
    auto origin = f.edge()->origin()->coords();
    Edge *e = f.edge();
    for (int i = 0; i < 3; i++) {
      Eigen::Vector2d p0 =
          f.frame.transpose() * (e->origin()->coords() - origin);
      Eigen::Vector2d p1 =
          f.frame.transpose() * (e->next()->origin()->coords() - origin);
      Eigen::Vector2d d = (p1 - p0).normalized();
      // res.local_coords + t * dir = p0 + s * d
      // [dir, -d] \ [p0 - res.local_doords]
      double det = dir.y() * d.x() - dir.x() * d.y();
      // If det > 0, we're walking 'into' this triangle (coming from this edge).
      if (-det > 1e-6) {
        double t = Eigen::RowVector2d(-d.y() / det, d.x() / det) *
                   (p0 - res.local_coords);
        if (t < min_t) {
          min_t = t;
          min_edge = e;
        }
      }
      e = e->next();
    }

    // If we don't need to cross another triangle.
    if (min_t >= len) {
      // Update coords and return.
      res.local_coords += len * dir;
      return {res, true};
    }
    // Otherwise, update the direction, length, and new local_coords.
    if (min_edge->twin() == nullptr) {
      res.local_coords += min_t * dir;
      return {res, false};
    }
    res.face = min_edge->twin()->fi;
    // Optimize this...
    res.local_coords = mesh->face(res.face).to_local_coords(
        f.to_global_coords(res.local_coords + min_t * dir));
    dir = (min_edge->frame_rot * dir).normalized();
    len -= min_t;
  }
  return {res, true};
}

std::pair<utils::Hmesh::Point, Eigen::Vector2d>
utils::Hmesh::Point::transport(const Eigen::Vector2d &vec,
                               const Eigen::Vector2d &transport_vec) const {
  Hmesh::Point res(*this);
  Eigen::Vector2d dir = vec.normalized();
  Eigen::Vector2d transported = transport_vec.normalized();
  double len = vec.norm();
  while (len > 1e-6) {
    // Find closest edge.
    double min_t = std::numeric_limits<double>::max();
    Edge *min_edge = nullptr;
    auto &f = mesh->face(res.face);
    auto origin = f.edge()->origin()->coords();
    Edge *e = f.edge();
    for (int i = 0; i < 3; i++) {
      Eigen::Vector2d p0 =
          f.frame.transpose() * (e->origin()->coords() - origin);
      Eigen::Vector2d p1 =
          f.frame.transpose() * (e->next()->origin()->coords() - origin);
      Eigen::Vector2d d = (p1 - p0).normalized();
      // res.local_coords + t * dir = p0 + s * d
      // [dir, -d] \ [p0 - res.local_doords]
      double det = dir.y() * d.x() - dir.x() * d.y();
      // If det > 0, we're walking 'into' this triangle (coming from this edge).
      if (-det > 1e-6) {
        double t = Eigen::RowVector2d(-d.y() / det, d.x() / det) *
                   (p0 - res.local_coords);
        if (t < min_t) {
          min_t = t;
          min_edge = e;
        }
      }
      e = e->next();
    }

    // If we don't need to cross another triangle.
    if (min_t >= len) {
      // Update coords and return.
      res.local_coords += len * dir;
      return {res, transported};
    }
    // Otherwise, update the direction, length, and new local_coords.
    if (min_edge->twin() == nullptr) {
      res.local_coords += min_t * dir;
      return {res, transported};
    }
    res.face = min_edge->twin()->fi;
    // Optimize this...
    res.local_coords = mesh->face(res.face).to_local_coords(
        f.to_global_coords(res.local_coords + min_t * dir));
    dir = (min_edge->frame_rot * dir).normalized();
    transported = (min_edge->frame_rot * transported).normalized();
    len -= min_t;
  }
  return {res, transported};
}

Hmesh::Point Hmesh::closest_point(const Eigen::Vector3d &p) const {
  double closest_dist = std::numeric_limits<double>::max();
  Hmesh::Point closest_point{.face = -1};
  // Very hacky...
  for (auto &v : verts) {
    if ((v.coords() - p).norm() < closest_dist) {
      closest_dist = (v.coords() - p).norm();
      closest_point = v.edge()->face()->project_point(v.coords());
    }
  }
  for (auto &f : faces) {
    auto proj_p = f.project_point(p);
    Eigen::Vector3d coords = proj_p.global_coords();
    auto bary = f.to_bary_coords(coords);
    if (bary.x() >= 0 && bary.y() >= 0 && bary.z() >= 0 && bary.x() <= 1 &&
        bary.y() <= 1 && bary.z() <= 1 && (coords - p).norm() < closest_dist) {
      closest_dist = (coords - p).norm();
      closest_point = proj_p;
    }
  }
  return closest_point;
}

Hmesh Hmesh::merge(const Hmesh &other) {
  Eigen::MatrixXd new_V(V.rows() + other.V.rows(), V.cols());
  new_V << V, other.V;
  std::vector<std::vector<int>> new_F = F;
  for (auto &face : other.F) {
    std::vector<int> new_face;
    for (int i = 0; i < face.size(); i++) {
      new_face.push_back(face[i] + V.rows());
    }
    new_F.push_back(new_face);
  }
  return Hmesh(new_V, new_F);
}

} // namespace utils