#include "init.h"
#include "Optiz/NewtonSolver/Problem.h"
#include <Optiz/NewtonSolver/Common.h>

namespace coloring {

std::vector<int> initialized_two_face_coloring_greedy(const utils::Hmesh &mesh) {
  std::vector<int> colors(mesh.nf(), -1);
  colors[0] = 0;
  std::queue<int> q;
  q.push(0);
  while (!q.empty()) {
    int fi = q.front();
    q.pop();
    utils::Hmesh::Edge *edge = mesh.face(fi).edge(), *cur_edge = edge;
    do {
      if (cur_edge->twin() && colors[cur_edge->twin()->fi] == -1) {
        colors[cur_edge->twin()->fi] = 1 - colors[fi];
        q.push(cur_edge->twin()->fi);
      }
    } while ((cur_edge = cur_edge->next()) != edge);
  }
  return colors;
}

bool is_good_coloring(const kirigami::UnitPattern &pattern,
                      const std::vector<int> &coloring) {
  // DFS from the first face, check:
  // 1. If all faces are visited.
  // 2. If each face has at least 2 neighbors with a different color.
  std::queue<int> q;
  q.push(0);
  std::vector<bool> visited(pattern.mesh.faces.size(), false);
  visited[0] = true;
  int num_visited = 1;
  while (!q.empty()) {
    int fi = q.front();
    q.pop();
    utils::Hmesh::Edge *edge = pattern.mesh.face(fi).edge(), *cur_edge = edge;
    int num_neighbors = 0;
    do {
      if (cur_edge->twin()) {
        if (coloring[fi] != coloring[cur_edge->twin()->fi]) {
          if (!visited[cur_edge->twin()->fi] &&
              // Uncomment to allow disconnected components in the unit tile.
              cur_edge->vi == cur_edge->twin()->next()->vi) {
            visited[cur_edge->twin()->fi] = true;
            num_visited++;
            q.push(cur_edge->twin()->fi);
          }
          num_neighbors++;
        }
      }
    } while ((cur_edge = cur_edge->next()) != edge);
    if (num_neighbors < 2)
      return false;
  }
  return num_visited == pattern.mesh.faces.size();
}

std::vector<std::vector<int>>
find_all_good_colorings(const kirigami::UnitPattern &pattern) {
  std::vector<std::vector<int>> colorings;
  kirigami::UnitPattern periodic = pattern;
  periodic.make_periodic();
  std::vector<int> current_coloring(pattern.mesh.faces.size(), 0);
  // Iterate over all possible colorings, check each one if it is good.
  auto next_coloring = [&]() {
    for (int i = 0; i < current_coloring.size(); i++) {
      current_coloring[i] = 1 - current_coloring[i];
      if (current_coloring[i] == 1)
        return true; // Flipped to 1.
    }
    return false;
  };

  while (next_coloring()) {
    if (is_good_coloring(periodic, current_coloring)) {
      colorings.push_back(current_coloring);
    }
  }

  return colorings;
}

int compute_edges(const utils::Hmesh &mesh, const std::vector<int> &coloring) {
  int num_edges = 0;
  for (auto &edge : mesh.edges) {
    if (!edge.twin() || edge.index > edge.twin()->index) {
      continue;
    }
    if (coloring[edge.fi] != coloring[edge.twin()->fi]) {
      num_edges++;
    }
  }
  return num_edges;
}

std::vector<int> initialized_two_face_coloring(const utils::Hmesh &mesh) {

  Eigen::VectorXd thetas = Eigen::VectorXd::Random(mesh.nf()) * 2 * M_PI;
  // Ensure thetas are in [0, 2pi).
  auto regularize_angle = [](double angle) {
    return std::fmod(std::fmod(angle, 2 * M_PI) + 2 * M_PI, 2 * M_PI);
  };
  Optiz::Problem prob(thetas);
  prob.add_element_energy(mesh.edges.size(), [&](int i, auto &x) {
    using T = FACTORY_TYPE(x);
    auto &edge = mesh.edge(i);
    if (!edge.twin() || edge.index > edge.twin()->index) {
      return T(0.0);
    }
    int fi = edge.fi;
    int ft = edge.twin()->fi;
    return Eigen::RowVector2<T>(cos(x(fi)), sin(x(fi)))
        .dot(Eigen::RowVector2<T>(cos(x(ft)), sin(x(ft))));
  });
  prob.options().set_line_search_iters(100);
  prob.set_end_iteration_callback([&]() {
    for (int i = 0; i < thetas.size(); i++) {
      prob.x()(i) = regularize_angle(prob.x()(i));
    }
  });
  prob.options().set_report_level(Optiz::Problem::Options::NONE);
  prob.optimize();
  thetas = prob.x();
  std::vector<int> best_coloring = initialized_two_face_coloring_greedy(mesh);
  int best_num_edges = compute_edges(mesh, best_coloring);
  for (int t = 0; t < 100; t++) {
    std::vector<int> new_coloring;
    double ang = t * 2 * M_PI / 100;
    for (int i = 0; i < thetas.size(); i++) {
      new_coloring.push_back(regularize_angle(thetas[i] + ang) < M_PI);
    }
    int num_edges = compute_edges(mesh, new_coloring);
    if (num_edges > best_num_edges) {
      best_num_edges = num_edges;
      best_coloring = new_coloring;
    }
  }
  return best_coloring;
}

} // namespace coloring