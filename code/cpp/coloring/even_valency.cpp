#include "even_valency.h"
#include <iostream>

namespace coloring {
utils::Hmesh dissolve_edge(const utils::Hmesh &mesh, int edge_index) {
  auto &edge = mesh.edge(edge_index);
  if (!edge.twin())
    return mesh;

  std::vector<int> new_face;
  // Merge the two faces.
  utils::Hmesh::Edge *cur = edge.next();
  // Add vertices from edge.fi.
  do {
    new_face.push_back(cur->vi);
    cur = cur->next();
  } while (cur != &edge);
  // Add vertices from edge.twin()->fi.
  cur = cur->twin()->next();
  do {
    new_face.push_back(cur->vi);
    cur = cur->next();
  } while (cur != edge.twin());
  std::vector<std::vector<int>> new_faces = mesh.F;
  new_faces[edge.fi] = new_face;
  new_faces.erase(new_faces.begin() + edge.twin()->fi);
  return utils::Hmesh(mesh.V, new_faces);
}

static std::vector<int> get_vertex_valency(const utils::Hmesh &mesh) {
  std::vector<int> valency(mesh.V.rows(), 0);
  for (auto &edge : mesh.edges) {
    if (edge.twin() && edge.index > edge.twin()->index)
      continue;

    valency[edge.vi]++;
    valency[edge.next()->vi]++;
  }
  return valency;
}

static int
find_edge_to_dissolve(utils::Hmesh &mesh, const std::vector<int> &valency,
                      const std::vector<std::set<int>> &vertex_neighbors,
                      const std::vector<std::set<int>> &adjacent_faces, int v) {
  std::queue<int> q;
  q.push(v);
  std::vector<int> parent(mesh.V.rows(), -1);
  while (!q.empty()) {
    int cur = q.front();
    q.pop();
    if (cur != v && (mesh.is_boundary_vertex(cur) || valency[cur] % 2 != 0)) {
      // Found a boundary vertex or another vertex with odd valency.
      // Return the edge between cur and its parent.
      if (mesh.verts_edges[cur].count(parent[cur]) == 0) {
        std::cout << "parent " << parent[cur] << " is not a neighbor of " << cur
                  << " v= " << v << std::endl;
        throw std::runtime_error("Parent is not a neighbor of current vertex");
      }
      return mesh.verts_edges[cur][parent[cur]];
    }
    for (auto &neighbor : vertex_neighbors[cur]) {
      if (mesh.verts_edges[cur].count(neighbor) == 0) {
        std::cout << "neighbor " << neighbor << " is not a neighbor of " << cur
                  << " v= " << v << std::endl;
        throw std::runtime_error(
            "Neighbor is not a neighbor of current vertex");
      }
      auto &edge = mesh.edge(mesh.verts_edges[cur][neighbor]);
      if (!edge.twin()) {
        std::cout << "Edge " << edge.index << " is not a twin of "
                  << edge.twin() << " v= " << v << std::endl;
        throw std::runtime_error("Edge is not a twin");
      }
      // If intersection of adjacent_faces[edge.fi] and
      // adjacent_faces[edge.twin()->fi] is not empty, continue.
      std::set<int> intersection;
      std::set_intersection(adjacent_faces[edge.fi].begin(),
                            adjacent_faces[edge.fi].end(),
                            adjacent_faces[edge.twin()->fi].begin(),
                            adjacent_faces[edge.twin()->fi].end(),
                            std::inserter(intersection, intersection.begin()));
      if (!intersection.empty()) {
        continue;
      }
      if (parent[neighbor] == -1) {
        parent[neighbor] = cur;
        q.push(neighbor);
      }
    }
  }
  std::cout << "No edge found to dissolve" << std::endl;
  throw std::runtime_error("No edge found to dissolve");
}

static std::vector<std::set<int>>
find_adjacent_faces(const utils::Hmesh &mesh) {
  std::vector<std::set<int>> adjacent_face(mesh.V.rows());
  for (auto &edge : mesh.edges) {
    if (edge.twin() && edge.index > edge.twin()->index)
      continue;
    adjacent_face[edge.vi].insert(edge.fi);
    adjacent_face[edge.next()->vi].insert(edge.fi);
  }
  return adjacent_face;
}

std::pair<utils::Hmesh, utils::Hmesh>
make_mesh_2_colorable(const utils::Hmesh &mesh, const utils::Hmesh &uv_mesh) {
  auto valency = get_vertex_valency(mesh);
  auto vertex_neighbors = mesh.vertex_neighbors();
  auto adjacent_faces = find_adjacent_faces(mesh);
  utils::Hmesh res_mesh = mesh;
  utils::Hmesh res_uv_mesh = uv_mesh;
  bool all_even = false;
  while (!all_even) {
    all_even = true;
    for (int i = 0; i < valency.size(); i++) {
      if (valency[i] % 2 == 0 || res_mesh.is_boundary_vertex(i))
        continue;
      all_even = false;
      while (valency[i] % 2 != 0) {
        std::cout << "Vertex " << i << " has odd valency " << valency[i]
                  << std::endl;
        int edge_to_dissolve = find_edge_to_dissolve(
            res_mesh, valency, vertex_neighbors, adjacent_faces, i);
        auto &edge = res_mesh.edge(edge_to_dissolve);
        // Update valency and vertex neighbors.
        vertex_neighbors[edge.vi].erase(edge.next()->vi);
        vertex_neighbors[edge.next()->vi].erase(edge.vi);
        valency[edge.vi]--;
        valency[edge.next()->vi]--;
        // Dissolve the edge and update the mesh.
        res_mesh = dissolve_edge(res_mesh, edge_to_dissolve);
        if (res_uv_mesh.V.rows() > 0) {
          res_uv_mesh = dissolve_edge(res_uv_mesh, edge_to_dissolve);
        }
      }
    }
  }
  return {res_mesh, res_uv_mesh};
}
} // namespace coloring