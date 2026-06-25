const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });

let resolveInit;
const initPromise = new Promise(resolve => resolveInit = resolve);

let messageId = 0;
const pending = new Map();

worker.onmessage = (e) => {
  const { type, id, result, error } = e.data;
  if (type === 'initialized') {
    resolveInit();
    return;
  }

  if (pending.has(id)) {
    const { resolve, reject } = pending.get(id);
    pending.delete(id);
    if (error) reject(new Error(error));
    else resolve(result);
  }
};

async function run(method, ...args) {
  await initPromise;
  const id = messageId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    worker.postMessage({ id, method, args });
  });
}

export async function initColoring(mesh) { return run('init_coloring', mesh); }
export async function deploy(mesh, angle, alignPeriodicity) { return run('deploy', mesh, angle, alignPeriodicity); }
export async function detectUnitPattern(mesh) { return run('detect_unit_pattern', mesh); }
export async function replicate2x2(mesh) { return run('replicate_2x2', mesh); }
export async function testMakeDeployable(mesh, map_to_unit_disk) { return run('test_make_deployable', mesh, map_to_unit_disk); }
export async function changePeriodicity(mesh, newPeriodicity) { return run('change_periodicity', mesh, newPeriodicity); }
export async function dual(mesh) { return run('dual', mesh); }
export async function findGoodColorings(mesh) { return run('find_all_good_colorings', mesh); }
export async function deployUnitWithHoles(mesh, angle) { return run('deploy_unit_with_holes', mesh, angle); }
export async function makeNonPeriodic(mesh, repX, repY) { return run('make_non_periodic', mesh, repX, repY); }
export async function makeNonPeriodicInBox(mesh, minX, minY, maxX, maxY) { return run('make_non_periodic_in_box', mesh, minX, minY, maxX, maxY); }
export async function replicate(mesh, repX, repY) { return run('replicate', mesh, repX, repY); }
export async function lift(mesh, deployedAngle, targetMesh, scale, rotation, intersectBoundary, removeLeaves) { return run('lift', mesh, deployedAngle, targetMesh, scale, rotation, intersectBoundary, removeLeaves); }
export async function initOptimization(initMesh, liftedMesh, targetMesh) { return run('init_optimization', initMesh, liftedMesh, targetMesh); }
export async function optimize() { return run('optimize'); }
export async function get_optimized_patterns() { return run('get_optimized_patterns'); }
export async function mesh_area(mesh) { return run('mesh_area', mesh); }
export async function reset_optimization() { return run('reset_optimization'); }
export async function get_fabrication_edges() { return run('get_fabrication_edges'); }
export async function max_opening_angle(mesh, detectCollisions) { return run('max_opening_angle', mesh, detectCollisions); }

export async function get_optimization_errors() { return run('get_optimization_errors'); }

export async function get_optimization_parameters() { return run('get_optimization_parameters'); }
export async function set_optimization_parameters(params) { return run('set_optimization_parameters', params); }

export async function conformalize(mesh) { return run('conformalize', mesh); }

export async function optimizeFullyClosed(mesh) { return run('optimize_fully_closed', mesh); }

export async function preventIntersections(mesh, barrier, barrier_strength, close_to_original_weight) { return run('prevent_intersections', mesh, barrier, barrier_strength, close_to_original_weight); }

export async function meshToPattern(mesh, map_to_unit_disk) { return run('mesh_to_pattern', mesh, map_to_unit_disk); }

export async function make2Colorable(mesh) { return run('make_2_colorable', mesh); }

export async function getPeriodicInfo(mesh) { return run('get_periodic_info', mesh); }