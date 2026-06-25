#pragma once
#include "../geometry/unit_pattern.h"

namespace opt {
Eigen::MatrixXd optimize_for_fully_closed(const kirigami::UnitPattern &pattern,
                                          const Eigen::MatrixXd &kernel);

} // namespace opt