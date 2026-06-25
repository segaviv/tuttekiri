#pragma once
#include "unit_pattern.h"

namespace kirigami {

std::tuple<UnitPattern, Eigen::MatrixXd>
make_deployable(const UnitPattern &unit_pattern,
                bool map_boundary_to_unit_disk = false);

}