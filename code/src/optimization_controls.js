import { deploy, get_optimization_errors, get_optimized_patterns, initOptimization, optimize, get_optimization_parameters, set_optimization_parameters, conformalize } from "./kirigami_cpp_bridge";
import { export_fabrication_svg, export_optimized_obj } from "./export.js";
import { exportToOBJ, exportToOBJAndDownload } from "./loader.js";


export function setupOptimizationControls(canvas, state, requestDraw) {
  const btnOptimizeInit = document.getElementById('btn-optimize-init');
  const btnOptimizeStart = document.getElementById('btn-optimize-start');

  // Optimization Parameters Inputs
  const paramInputs = {
    rigid_weight: document.getElementById('opt-param-rigid'),
    closeness_weight: document.getElementById('opt-param-closeness'),
    planarity_weight: document.getElementById('opt-param-planarity'),
    close_to_init_weight: document.getElementById('opt-param-close-init'),
  };

  const updateParamUI = async () => {
    const params = await get_optimization_parameters();
    if (paramInputs.rigid_weight) paramInputs.rigid_weight.value = params.rigid_weight;
    if (paramInputs.closeness_weight) paramInputs.closeness_weight.value = params.closeness_weight;
    if (paramInputs.planarity_weight) paramInputs.planarity_weight.value = params.planarity_weight;
    if (paramInputs.close_to_init_weight) paramInputs.close_to_init_weight.value = params.close_to_init_weight;
  };

  const pushParamUpdate = async () => {
    const params = {
      rigid_weight: parseFloat(paramInputs.rigid_weight.value),
      closeness_weight: parseFloat(paramInputs.closeness_weight.value),
      planarity_weight: parseFloat(paramInputs.planarity_weight.value),
      close_to_init_weight: parseFloat(paramInputs.close_to_init_weight.value),
    };
    await set_optimization_parameters(params);
  };

  Object.values(paramInputs).forEach(input => {
    if (input) {
      input.addEventListener('change', pushParamUpdate);
    }
  });

  const btnExportOptimized = document.getElementById('btn-export-optimized-meshes');
  btnExportOptimized.addEventListener('click', async () => {
    let result = await get_optimized_patterns();
    exportToOBJAndDownload(result.ground, "optimized_ground");
    exportToOBJAndDownload(result.lifted, "optimized_lifted");
  });

  let report_errors = async (result) => {
    const statsContainer = document.getElementById('optimization-stats');
    const rigidMax = document.getElementById('opt-stat-rigid-max');
    const rigidAvg = document.getElementById('opt-stat-rigid-avg');
    const planarMax = document.getElementById('opt-stat-planar-max');
    const planarAvg = document.getElementById('opt-stat-planar-avg');

    if (statsContainer && rigidMax && rigidAvg && planarMax && planarAvg) {
      statsContainer.style.display = 'block';
      rigidMax.textContent = result.rigid_max?.toFixed(4) || "0.00";
      rigidAvg.textContent = result.rigid_avg?.toFixed(4) || "0.00";
      planarMax.textContent = result.planarity_max?.toFixed(4) || "0.00";
      planarAvg.textContent = result.planarity_avg?.toFixed(4) || "0.00";
    }
  };

  let isOptimizing = false;

  const stopOptimization = () => {
    isOptimizing = false;
    btnOptimizeStart.textContent = "Start optimization";
  };

  btnOptimizeInit.addEventListener('click', async () => {
    stopOptimization();
    const depRad = (state.deployAngle * Math.PI) / 180;
    let deployed_init_mesh = await deploy(state.initMesh, depRad, state.deployAngle * Math.PI / 180, state.alignUnitParallelogram);
    await initOptimization(deployed_init_mesh, state.liftedMesh, state.targetMesh);
    let result = await get_optimized_patterns();
    state.mesh = result.ground;
    state.optimizedGround = result.ground;
    state.optimizedLifted = result.lifted;
    state.viewer3D.updateMesh(result.lifted);
    requestDraw();
    updateParamUI();
    report_errors(await get_optimization_errors());
  });

  btnOptimizeStart.addEventListener('click', async () => {
    if (isOptimizing) {
      stopOptimization();
      return;
    }

    isOptimizing = true;
    btnOptimizeStart.textContent = "Stop optimization";

    while (isOptimizing) {
      let result = await optimize();
      state.mesh = result.ground;
      state.optimizedGround = result.ground;
      state.optimizedLifted = result.lifted;
      state.viewer3D.updateMesh(result.lifted);
      requestDraw();
      updateParamUI();
      report_errors(result);
      // Yield to event loop to allow UI updates and clicks
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  });

}