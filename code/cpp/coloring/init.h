#pragma once
#include "../geometry/unit_pattern.h"
#include "../utils/Hmesh.h"
#include <vector>

namespace coloring {

std::vector<int> initialized_two_face_coloring_greedy(const utils::Hmesh &mesh);

std::vector<std::vector<int>>
find_all_good_colorings(const kirigami::UnitPattern &pattern);

int compute_edges(const utils::Hmesh &mesh, const std::vector<int> &coloring);

std::vector<int> initialized_two_face_coloring(const utils::Hmesh &mesh);

} // namespace coloring