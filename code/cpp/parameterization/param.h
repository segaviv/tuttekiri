#pragma once
#include "../utils/Hmesh.h"
#include <Eigen/Eigen>

namespace param {
Eigen::MatrixXd isometric_param(utils::Hmesh &mesh);
}