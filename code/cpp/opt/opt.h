#pragma once
#include "../geometry/unit_pattern.h"

namespace opt {

extern float rigid_weight, closeness_weight, planarity_weight,
    close_to_init_weight, orig_close_to_init_weight;

void init(const utils::Hmesh &init_mesh, const utils::Hmesh &lifted_mesh,
          const std::vector<int> &face_colors, const utils::Hmesh &target_mesh);
void optimize_rigidity();
void reset_optimization();

std::pair<kirigami::UnitPattern, kirigami::UnitPattern> get_patterns();

std::pair<Eigen::MatrixXd, Eigen::MatrixXd> get_folding_and_cutting_edges();

void get_errors(double *rigid_avg, double *rigid_max, double *close_avg,
                double *close_max, double *planarity_avg,
                double *planarity_max);
} // namespace opt