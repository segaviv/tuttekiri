#pragma once
#include "../geometry/unit_pattern.h"
#include "../utils/Hmesh.h"

namespace param {
std::pair<kirigami::UnitPattern, kirigami::UnitPattern>
lift(const kirigami::UnitPattern &pattern, float deployed_angle,
     const utils::Hmesh &mesh, Eigen::MatrixXd uv, float scale, float rotation,
     bool intersect_boundary, bool remove_leaves);

std::pair<kirigami::UnitPattern, kirigami::UnitPattern>
keep_biggest_connected_component(const kirigami::UnitPattern &ground,
                                 const kirigami::UnitPattern &lifted);
std::pair<kirigami::UnitPattern, kirigami::UnitPattern> remove_leaves(
    const std::pair<kirigami::UnitPattern, kirigami::UnitPattern> &patterns);
} // namespace param