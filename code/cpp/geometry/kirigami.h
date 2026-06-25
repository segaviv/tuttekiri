#pragma once
#include "../utils/Hmesh.h"
#include "unit_pattern.h"
#include <Eigen/Eigen>
#include <tuple>

namespace kirigami {
std::pair<utils::Hmesh, Eigen::Matrix2d>
deploy(const utils::Hmesh &mesh, const std::vector<int> &face_colors,
       const Eigen::Matrix2d &periodicity, float angle);

std::pair<utils::Hmesh, Eigen::Matrix2d>
detect_unit_pattern(const utils::Hmesh &mesh);

std::pair<utils::Hmesh, Eigen::Matrix2d>
replicate_2x2(const utils::Hmesh &mesh, const Eigen::Matrix2d &periodicity);

utils::Hmesh replicate(const utils::Hmesh &mesh,
                       const Eigen::Matrix2d &periodicity, int repX, int repY);

double max_opening_angle(const kirigami::UnitPattern &pattern);

} // namespace kirigami