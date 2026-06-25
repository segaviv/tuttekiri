#pragma once
#include "../utils/Hmesh.h"

namespace coloring {

utils::Hmesh dissolve_edge(const utils::Hmesh &mesh, int edge_index);

std::pair<utils::Hmesh, utils::Hmesh>
make_mesh_2_colorable(const utils::Hmesh &mesh,
                      const utils::Hmesh &uv_mesh = utils::Hmesh());

} // namespace coloring