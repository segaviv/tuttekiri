import { CONFIG } from './constants.js';
import { initColoring, deploy, detectUnitPattern, replicate2x2, testMakeDeployable, changePeriodicity, dual, findGoodColorings, deployUnitWithHoles, makeNonPeriodic, makeNonPeriodicInBox, lift, max_opening_angle, conformalize, optimizeFullyClosed, preventIntersections, meshToPattern, make2Colorable, getPeriodicInfo, get_optimized_patterns } from './kirigami_cpp_bridge.js';
import { parseOBJ, normalizeMesh, parseUKP, exportToOBJ, exportToUKP, parseMTL } from './loader.js';
import { centerMesh, standardizeMesh } from './utils.js';
import { Viewer3D } from './viewer3d.js';
import { CurveEditor } from './curve_editor.js';
import { exportToSVG } from './export.js';
import { resetState } from './state.js';

export function setupInteractions(canvas, state, requestDraw) {
  // Initialize Curve Editor
  let curveEditor = new CurveEditor(state, requestDraw);

  const repXInput = document.getElementById('rep-x');
  const repYInput = document.getElementById('rep-y');
  const repXVal = document.getElementById('rep-x-val');
  const repYVal = document.getElementById('rep-y-val');
  const deployAngleInput = document.getElementById('deploy-angle');
  const deployAngleVal = document.getElementById('deploy-angle-val');
  const showIndicesCheckbox = document.getElementById('chk-show-indices');
  const showBaseMeshCheckbox = document.getElementById('chk-show-base-mesh');
  const uploadDropZone = document.getElementById('upload-drop-zone');
  const kernelControls = document.getElementById('kernel-controls');
  const periodicityControls = document.getElementById('periodicity-controls');
  const btnConformalize = document.getElementById('btn-conformalize');

  // Render Mode Controls
  const renderModeRadios = document.getElementsByName('render-mode');
  const bboxControls = document.getElementById('bbox-controls');
  const bboxWidthInput = document.getElementById('bbox-width');
  const bboxHeightInput = document.getElementById('bbox-height');
  const svgAverageEdgeSizeInput = document.getElementById('svg-average-edge-size');
  const svgAverageEdgeSizeVal = document.getElementById('svg-average-edge-size-val');
  const svgHingeSizeInput = document.getElementById('svg-hinge-size');
  const svgHingeSizeVal = document.getElementById('svg-hinge-size-val');

  const circleControls = document.getElementById('circle-controls');

  // Attach listeners to radio buttons
  renderModeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.renderMode = e.target.value;
      const repControls = document.getElementById('repetition-controls');
      if (state.renderMode === 'bbox') {
        bboxControls.style.display = 'flex';
        repControls.style.display = 'none';
        circleControls.style.display = 'none';

      } else if (state.renderMode === 'circle') {
        bboxControls.style.display = 'none';
        repControls.style.display = 'none';
        circleControls.style.display = 'flex';
      } else {
        bboxControls.style.display = 'none';
        repControls.style.display = 'flex';
        circleControls.style.display = 'none';
      }
      requestDraw();
    });
  });

  bboxWidthInput.addEventListener('input', (e) => {
    state.bboxWidth = parseFloat(e.target.value) || 10;
    requestDraw();
  });

  bboxHeightInput.addEventListener('input', (e) => {
    state.bboxHeight = parseFloat(e.target.value) || 10;
    requestDraw();
  });

  const bindSyncedNumberInputs = (rangeInput, numberInput, stateKey, fallbackValue, onChange) => {
    const updateValue = (rawValue) => {
      const parsedValue = parseFloat(rawValue);
      const nextValue = Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
      state[stateKey] = nextValue;
      rangeInput.value = nextValue;
      numberInput.value = nextValue;
      onChange();
    };

    rangeInput.addEventListener('input', (e) => updateValue(e.target.value));
    numberInput.addEventListener('input', (e) => updateValue(e.target.value));
  };

  bindSyncedNumberInputs(
    svgAverageEdgeSizeInput,
    svgAverageEdgeSizeVal,
    'svgAverageEdgeSizeMm',
    40,
    () => requestDraw()
  );

  bindSyncedNumberInputs(
    svgHingeSizeInput,
    svgHingeSizeVal,
    'svgHingeSizeMm',
    2,
    () => requestDraw()
  );

  document.getElementById('circle-radius').addEventListener('input', (e) => {
    state.circleRadius = parseFloat(e.target.value) || 10;
    requestDraw();
  });

  document.getElementById('circle-shift-x').addEventListener('input', (e) => {
    state.circleShiftX = parseFloat(e.target.value) || 0;
    requestDraw();
  });

  document.getElementById('circle-shift-y').addEventListener('input', (e) => {
    state.circleShiftY = parseFloat(e.target.value) || 0;
    requestDraw();
  });


  const updatePeriodicityControls = () => {
    periodicityControls.innerHTML = '';
    if (state.baseMesh && state.baseMesh.periodicity) {
      const details = document.createElement('details');
      details.open = false;
      details.style.width = '100%';

      const summary = document.createElement('summary');
      summary.textContent = 'Periodicity (2x2)';
      summary.style.cursor = 'pointer';
      summary.style.fontSize = '0.8rem';
      summary.style.marginBottom = '8px';
      summary.style.userSelect = 'none';
      details.appendChild(summary);

      const grid = document.createElement('div');
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = '1fr 1fr';
      grid.style.gap = '8px';
      grid.style.paddingLeft = '8px';

      const createInput = (r, c, val) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '4px';

        const input = document.createElement('input');
        input.type = 'range';
        input.min = '-5';
        input.max = '5';
        input.step = '0.1';
        input.value = val;
        input.style.width = '100%';

        const valSpan = document.createElement('span');
        valSpan.style.fontSize = '0.7rem';
        valSpan.style.width = '35px';
        valSpan.style.textAlign = 'right';
        valSpan.textContent = val.toFixed(1);

        input.addEventListener('input', async (e) => {
          const newVal = parseFloat(e.target.value);
          valSpan.textContent = newVal.toFixed(1);

          let new_periodicity = JSON.parse(JSON.stringify(state.baseMesh.periodicity));
          new_periodicity[r][c] = newVal;

          let new_mesh = await changePeriodicity(state.baseMesh, new_periodicity);
          updateBaseMesh(new_mesh, false);

          // Re-deploy
          const angleRad = (state.deployAngle * Math.PI) / 180;
          state.mesh = await deploy(state.baseMesh, angleRad, state.alignUnitParallelogram);
          state.mesh.face_colors = state.baseMesh.face_colors;
          requestDraw();
        });

        container.appendChild(input);
        container.appendChild(valSpan);
        return container;
      };

      // Helper labels
      const labels = ['Px X', 'Px Y', 'Py X', 'Py Y'];

      const wrapWithLabel = (label, element) => {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.marginBottom = '4px';

        const title = document.createElement('span');
        title.textContent = label;
        title.style.fontSize = '0.7rem';
        title.style.color = '#aaa';

        wrapper.appendChild(title);
        wrapper.appendChild(element);
        return wrapper;
      };

      grid.appendChild(wrapWithLabel('Px X', createInput(0, 0, state.baseMesh.periodicity[0][0])));
      grid.appendChild(wrapWithLabel('Px Y', createInput(0, 1, state.baseMesh.periodicity[0][1])));
      grid.appendChild(wrapWithLabel('Py X', createInput(1, 0, state.baseMesh.periodicity[1][0])));
      grid.appendChild(wrapWithLabel('Py Y', createInput(1, 1, state.baseMesh.periodicity[1][1])));

      details.appendChild(grid);
      periodicityControls.appendChild(details);
    }
  };

  const updateKernelControls = (keepOriginal = false) => {
    if (!keepOriginal || !state.baseMesh.originalVertices) {
      state.baseMesh.originalVertices = JSON.parse(JSON.stringify(state.baseMesh.vertices));
    }
    kernelControls.style.display = 'none';
    if (state.baseMesh && state.baseMesh.kernel && state.baseMesh.kernel.length > 0) {
      kernelControls.style.display = 'flex';
      if (kernelControls.children.length > 0) {
        kernelControls.innerHTML = '';
      }

      // Ensure weights array matches kernel size and format (Array of [x, y])
      if (
        state.kernelWeights.length !== state.baseMesh.kernel.length ||
        (state.kernelWeights.length > 0 && !Array.isArray(state.kernelWeights[0]))
      ) {
        state.kernelWeights = Array.from({ length: state.baseMesh.kernel.length }, () => [0, 0]);
      }

      const details = document.createElement('details');
      details.style.width = '100%';
      // details.open = true;

      const summary = document.createElement('summary');
      summary.textContent = `Kernel Controls (${state.baseMesh.kernel.length})`;
      summary.style.cursor = 'pointer';
      summary.style.fontSize = '0.8rem';
      summary.style.marginBottom = '8px';
      summary.style.userSelect = 'none';
      details.appendChild(summary);

      const slidersContainer = document.createElement('div');
      slidersContainer.style.display = 'flex';
      slidersContainer.style.flexDirection = 'column';
      slidersContainer.style.gap = '12px';
      slidersContainer.style.paddingLeft = '8px'; // Indent slightly

      state.baseMesh.kernel.forEach((vec, idx) => {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '4px';

        const label = document.createElement('span');
        label.style.fontSize = '0.8rem';
        label.style.fontWeight = 'bold';
        label.textContent = `Kernel ${idx}:`;
        wrapper.appendChild(label);

        // Helper to create a row for X or Y
        const createRow = (axisIndex, axisLabel) => {
          const row = document.createElement('div');
          row.style.display = 'flex';
          row.style.alignItems = 'center';
          row.style.gap = '8px';

          const subLabel = document.createElement('span');
          subLabel.style.fontSize = '0.7rem';
          subLabel.style.width = '15px';
          subLabel.textContent = axisLabel;

          const input = document.createElement('input');
          input.type = 'range';
          input.min = '-1';
          input.max = '1';
          input.step = '0.01';
          input.value = state.kernelWeights[idx][axisIndex];
          input.style.flex = '1';

          const valSpan = document.createElement('span');
          valSpan.style.fontSize = '0.7rem';
          valSpan.style.width = '30px';
          valSpan.style.textAlign = 'right';
          valSpan.textContent = state.kernelWeights[idx][axisIndex];

          input.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            state.kernelWeights[idx][axisIndex] = val;
            valSpan.textContent = val;
            applyKernelDeformation();
          });

          row.appendChild(subLabel);
          row.appendChild(input);
          row.appendChild(valSpan);
          return row;
        };

        wrapper.appendChild(createRow(0, 'X'));
        wrapper.appendChild(createRow(1, 'Y'));
        slidersContainer.appendChild(wrapper);
      });

      details.appendChild(slidersContainer);
      kernelControls.appendChild(details);
    } else {
      state.kernelWeights = [];
    }
  };

  const updateBaseMesh = async (mesh, update_periodicity = true, updateUnitPatternBaseMesh = true) => {
    if (!state.baseMesh) state.baseMesh = {};
    Object.assign(state.baseMesh, JSON.parse(JSON.stringify(mesh)));
    centerMesh(state.baseMesh);
    if (updateUnitPatternBaseMesh) {
      state.unitPatternBaseMesh = JSON.parse(JSON.stringify(state.baseMesh));
    }
    state.baseMesh.originalVertices = JSON.parse(JSON.stringify(state.baseMesh.vertices));
    state.periodicInfo = await getPeriodicInfo(state.baseMesh);
    let angle = await max_opening_angle(state.baseMesh, state.detectCollisions);
    state.max_angle = angle;
    deployAngleInput.max = Math.round(angle / Math.PI * 180);
    deployAngleInput.value = Math.min(deployAngleInput.value, deployAngleInput.max);
    state.deployAngle = deployAngleInput.value;
    deployAngleVal.value = state.deployAngle;

    state.mesh = await deploy(state.baseMesh, state.deployAngle * Math.PI / 180, state.alignUnitParallelogram);
    requestDraw();

    updateKernelControls();
    if (update_periodicity)
      updatePeriodicityControls();
  };

  const applyKernelDeformation = async () => {
    if (!state.baseMesh || !state.baseMesh.kernel) return;

    if (!state.baseMesh.originalVertices) {
      // Fallback if not set (should be set on load)
      state.baseMesh.originalVertices = JSON.parse(JSON.stringify(state.baseMesh.vertices));
    }

    // Reset to original
    state.baseMesh.vertices = JSON.parse(JSON.stringify(state.baseMesh.originalVertices));

    // Apply weights
    for (let k = 0; k < state.baseMesh.kernel.length; k++) {
      const weight = state.kernelWeights[k]; // [wx, wy]
      if (weight[0] === 0 && weight[1] === 0) continue;

      const offsetVec = state.baseMesh.kernel[k];

      for (let i = 0; i < state.baseMesh.vertices.length; i++) {
        state.baseMesh.vertices[i].x += offsetVec[i] * weight[0];
        state.baseMesh.vertices[i].y += offsetVec[i] * weight[1];
      }
    }

    const angleRad = (state.deployAngle * Math.PI) / 180;
    state.mesh = await deploy(state.baseMesh, angleRad, state.alignUnitParallelogram);
    state.mesh.face_colors = state.baseMesh.face_colors;

    requestDraw();
  };

  // Pan
  canvas.addEventListener('mousedown', (e) => {
    // If shift is pressed, pan.
    if (e.shiftKey) {
      state.isDragging = true;
      canvas.style.cursor = 'grabbing';
    }
    state.lastMouse = { x: e.clientX, y: e.clientY };
    state.dragStart = { x: e.clientX, y: e.clientY }; // Track start for click detection
  });

  window.addEventListener('mousemove', (e) => {
    if (state.isDragging) {
      const dx = e.clientX - state.lastMouse.x;
      const dy = e.clientY - state.lastMouse.y;

      state.camera.x -= dx / state.camera.zoom;
      state.camera.y += dy / state.camera.zoom;

      state.lastMouse = { x: e.clientX, y: e.clientY };
      requestDraw();
    }
  });

  // Toggle Edge Picking
  const btnPickEdge = document.getElementById('btn-pick-edge-style');
  btnPickEdge.addEventListener('click', () => {
    state.isPickingEdge = !state.isPickingEdge;
    btnPickEdge.style.background = state.isPickingEdge ? '#4a54ff' : '';
    btnPickEdge.textContent = state.isPickingEdge ? 'Stop Picking' : 'Apply to Edge';
  });

  window.addEventListener('mouseup', async (e) => {
    state.isDragging = false;
    canvas.style.cursor = 'default';

    // Click detection
    const dx = e.clientX - state.dragStart.x;
    const dy = e.clientY - state.dragStart.y;
    if (Math.hypot(dx, dy) < 5 && state.mesh) {
      // It's a click!
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      const worldX = state.camera.x + (mouseX - cx) / state.camera.zoom;
      const worldY = state.camera.y + (cy - mouseY) / state.camera.zoom;
      const localP = { x: worldX, y: worldY };

      // Edge Picking
      if (state.isPickingEdge) {
        let minD = Infinity;
        let bestEdge = null;
        let bestFaceIndex = -1, faceEdgeIndex = -1;
        const threshold = 0.5 / (state.camera.zoom / CONFIG.defaultZoom); // Scale threshold

        const distToSeg = (p, v, w) => {
          const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
          if (l2 == 0) return Math.hypot(p.x - v.x, p.y - v.y);
          let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
          t = Math.max(0, Math.min(1, t));
          return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
        };

        for (let faceIndex = 0; faceIndex < state.mesh.faces.length; faceIndex++) {
          const face = state.mesh.faces[faceIndex];
          for (let i = 0; i < face.length; i++) {
            const idx1 = face[i];
            const idx2 = face[(i + 1) % face.length];
            const v1 = state.mesh.vertices[idx1];
            const v2 = state.mesh.vertices[idx2];
            const d = distToSeg(localP, v1, v2);
            if (d < minD) {
              minD = d;
              bestEdge = [idx1, idx2];
              bestFaceIndex = faceIndex;
              faceEdgeIndex = i;
            }
          }
        }

        let getTwinKey = (face_index, edge_index) => {
          if (state.periodicInfo[face_index][edge_index].length == 0) {
            return '';
          }
          const [twin_face_index, twin_edge_index] = state.periodicInfo[face_index][edge_index];
          let v1 = state.mesh.faces[twin_face_index][twin_edge_index];
          let v2 = state.mesh.faces[twin_face_index][(twin_edge_index + 1) % state.mesh.faces[twin_face_index].length];
          return `${v1}_${v2}`;
        };

        if (minD < threshold && bestEdge) {
          const key = `${bestEdge[0]}_${bestEdge[1]}`;
          const twinKey = getTwinKey(bestFaceIndex, faceEdgeIndex);
          if (state.edgeStyleMap[key]) {
            let { styleIdx, flip } = state.edgeStyleMap[key];
            if (styleIdx != state.selectedStyleIndex) {
              state.edgeStyleMap[key] = { styleIdx: state.selectedStyleIndex, flip: 0 };
              state.edgeStyleMap[twinKey] = { styleIdx: state.selectedStyleIndex, flip: 3 };
            } else if (flip < 3) {
              // Set flip to true.
              state.edgeStyleMap[key] = { styleIdx, flip: flip + 1 };
              state.edgeStyleMap[twinKey] = { styleIdx, flip: 3 - (flip + 1) };
            } else {
              // Remove
              state.edgeStyleMap[key] = undefined;
              state.edgeStyleMap[twinKey] = undefined;
            }
          } else {
            state.edgeStyleMap[key] = { styleIdx: state.selectedStyleIndex, flip: 0 };
            state.edgeStyleMap[twinKey] = { styleIdx: state.selectedStyleIndex, flip: 3 };
          }
          requestDraw();
        }
        return;
      }

      // Loop in reverse draw order (FACE CLICK)
      for (let i = state.mesh.faces.length - 1; i >= 0; i--) {
        if (isPointInFace(localP, state.mesh, i)) {
          // Toggle color
          // const newColor = 1 - state.baseMesh.face_colors[i];
          const newColor = (state.baseMesh.face_colors[i] + 1) % (state.enableThirdColor ? 3 : 2);
          state.baseMesh.face_colors[i] = newColor;

          // Update current mesh
          if (state.deployAngle && state.deployAngle !== 0) {
            const angleRad = (state.deployAngle * Math.PI) / 180;
            const deployedMesh = await deploy(state.baseMesh, angleRad, state.alignUnitParallelogram);
            deployedMesh.face_colors = state.baseMesh.face_colors;
            deployedMesh.width = state.baseMesh.width;
            deployedMesh.height = state.baseMesh.height;
            state.mesh = deployedMesh;
          } else {
            state.mesh.face_colors[i] = newColor;
          }
          requestDraw();
          return; // Stop after first hit
        }
      }
    }
  });

  function isPointInFace(point, mesh, faceIndex) {
    const face = mesh.faces[faceIndex];
    const vs = mesh.vertices;
    const x = point.x, y = point.y;
    let inside = false;

    for (let i = 0, j = face.length - 1; i < face.length; j = i++) {
      const xi = vs[face[i]].x, yi = vs[face[i]].y;
      const xj = vs[face[j]].x, yj = vs[face[j]].y;

      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // Zoom (Wheel)
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const direction = e.deltaY < 0 ? 1 : -1;
    const factor = 1 + (CONFIG.zoomSensitivity * direction);

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    const mouseWorldX = state.camera.x + (mouseX - cx) / state.camera.zoom;
    const mouseWorldY = state.camera.y + (cy - mouseY) / state.camera.zoom;

    let newZoom = state.camera.zoom * factor;
    newZoom = Math.max(CONFIG.minZoom, Math.min(CONFIG.maxZoom, newZoom));
    state.camera.zoom = newZoom;

    // Adjust Camera to keep mouse world pos static
    state.camera.x = mouseWorldX - (mouseX - cx) / newZoom;
    state.camera.y = mouseWorldY - (cy - mouseY) / newZoom;

    requestDraw();
  }, { passive: false });

  // UI Buttons
  document.getElementById('btn-zoom-in').addEventListener('click', () => {
    state.camera.zoom = Math.min(CONFIG.maxZoom, state.camera.zoom * 1.2);
    requestDraw();
  });

  document.getElementById('btn-zoom-out').addEventListener('click', () => {
    state.camera.zoom = Math.max(CONFIG.minZoom, state.camera.zoom / 1.2);
    requestDraw();
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    state.camera.x = 0;
    state.camera.y = 0;
    state.camera.zoom = CONFIG.defaultZoom;

    requestDraw();
  });

  document.getElementById('btn-replicate-2x2').addEventListener('click', async () => {
    if (!state.mesh) return;
    let new_mesh = await replicate2x2(state.baseMesh);
    updateBaseMesh(new_mesh);
    state.baseMesh.face_colors = await initColoring(state.baseMesh);
    state.mesh = await deploy(state.baseMesh, state.deployAngle * Math.PI / 180, state.alignUnitParallelogram);
    state.mesh.face_colors = state.baseMesh.face_colors;
    requestDraw();
  });

  document.getElementById('btn-test-make-deployable').addEventListener('click', async () => {
    const mapToUnitDisk = document.getElementById('chk-map-to-unit-disk').checked;
    let new_mesh = await testMakeDeployable(state.baseMesh, mapToUnitDisk);
    updateBaseMesh(new_mesh);

    state.mesh = await deploy(state.baseMesh, state.deployAngle * Math.PI / 180, state.alignUnitParallelogram);
    state.mesh.face_colors = state.baseMesh.face_colors;
    requestDraw();
  });

  document.getElementById('btn-dual').addEventListener('click', async () => {
    let new_mesh = await dual(state.baseMesh);
    updateBaseMesh(new_mesh);

    state.mesh = await deploy(state.baseMesh, state.deployAngle * Math.PI / 180, state.alignUnitParallelogram);
    state.mesh.face_colors = state.baseMesh.face_colors;
    requestDraw();
  });

  document.getElementById('btn-find-colorings').addEventListener('click', async () => {
    const coloringControls = document.getElementById('coloring-controls');
    coloringControls.innerHTML = '';
    coloringControls.style.display = 'none';

    // Call C++ binding
    const resultMesh = await findGoodColorings(state.baseMesh);

    // If we got colorings
    if (resultMesh.colorings && resultMesh.colorings.length > 0) {
      state.baseMesh.colorings = resultMesh.colorings;
      if (resultMesh.face_colors && resultMesh.face_colors.length > 0) {
        state.baseMesh.face_colors = resultMesh.face_colors;
      }

      // Create UI
      coloringControls.style.display = 'flex';
      const label = document.createElement('span');
      label.textContent = `Found ${resultMesh.colorings.length} colorings:`;
      label.style.fontSize = '0.8rem';
      label.style.marginBottom = '4px';
      coloringControls.appendChild(label);

      const select = document.createElement('select');
      select.style.width = '100%';
      select.style.background = '#222';
      select.style.color = 'white';
      select.style.border = '1px solid #444';
      select.style.padding = '4px';

      resultMesh.colorings.forEach((coloring, idx) => {
        const option = document.createElement('option');
        option.value = idx;
        option.textContent = `Coloring ${idx + 1}`;
        select.appendChild(option);
      });

      select.addEventListener('change', async (e) => {
        const idx = parseInt(e.target.value);
        state.baseMesh.face_colors = state.baseMesh.colorings[idx];

        const angleRad = (state.deployAngle * Math.PI) / 180;
        state.mesh = await deploy(state.baseMesh, angleRad, state.alignUnitParallelogram);
        state.mesh.face_colors = state.baseMesh.face_colors;
        requestDraw();
      });

      coloringControls.appendChild(select);

    } else {
      alert("No valid colorings found.");
    }

    const angleRad = (state.deployAngle * Math.PI) / 180;
    state.mesh = await deploy(state.baseMesh, angleRad, state.alignUnitParallelogram);
    state.mesh.face_colors = state.baseMesh.face_colors;
    requestDraw();
  });

  document.getElementById('btn-deploy-unit-with-holes').addEventListener('click', async () => {
    const angleRad = (state.deployAngle * Math.PI) / 180;
    state.mesh = await deployUnitWithHoles(state.baseMesh, angleRad);
    requestDraw();
  });

  document.getElementById('btn-export-svg').addEventListener('click', () => {
    if (!state.mesh) return;

    const filename = prompt("Enter filename for export:", "tessellation_export");
    if (!filename) return;

    // Export SVG
    const exportOptions = {};
    if (state.renderMode === 'bbox') {
      const w = state.bboxWidth || 10;
      const h = state.bboxHeight || 10;
      exportOptions.bbox = {
        minX: -w / 2,
        maxX: w / 2,
        minY: -h / 2,
        maxY: h / 2
      };
    } else if (state.renderMode === 'circle') {
      exportOptions.bbox = {
        minX: -state.circleRadius,
        maxX: state.circleRadius,
        minY: -state.circleRadius,
        maxY: state.circleRadius
      };
    } else {
      exportOptions.repX = state.repX;
      exportOptions.repY = state.repY;
    }

    exportToSVG(state.mesh, {
      ...exportOptions,
      edgeStyles: state.edgeStyles,
      edgeStyleMap: state.edgeStyleMap,
      periodicInfo: state.periodicInfo,
      averageEdgeSizeMm: state.svgAverageEdgeSizeMm,
      hingeSizeMm: state.svgHingeSizeMm,
      filename: `${filename}.svg`
    });
  });

  document.getElementById('btn-export-fabrication-svg').addEventListener('click', async () => {
    let result = await get_optimized_patterns();
    result.ground.periodicity = [[0, 0], [0, 0]];

    const filename = prompt("Enter filename for export:", "tessellation_export");
    if (!filename) return;

    const exportOptions = {};
    exportOptions.repX = 1;
    exportOptions.repY = 1;
    exportToSVG(result.ground, {
      ...exportOptions,
      edgeStyles: state.edgeStyles,
      edgeStyleMap: state.edgeStyleMap,
      periodicInfo: state.periodicInfo,
      averageEdgeSizeMm: state.svgAverageEdgeSizeMm,
      hingeSizeMm: state.svgHingeSizeMm,
      filename: `${filename}.svg`
    });
  });

  document.getElementById('btn-export-obj').addEventListener('click', () => {
    if (!state.mesh) return;

    const filename = prompt("Enter filename for export:", "tessellation_export");
    if (!filename) return;

    // Export OBJ and MTL
    const exportOptions = {
      mtlFileName: `${filename}.mtl`
    };

    if (state.renderMode === 'bbox') {
      const w = state.bboxWidth || 10;
      const h = state.bboxHeight || 10;
      exportOptions.bbox = {
        minX: -w / 2,
        maxX: w / 2,
        minY: -h / 2,
        maxY: h / 2
      };
    } else if (state.renderMode === 'circle') {
      exportOptions.bbox = {
        minX: -state.circleRadius,
        maxX: state.circleRadius,
        minY: -state.circleRadius,
        maxY: state.circleRadius
      };
    } else {
      exportOptions.repX = state.repX;
      exportOptions.repY = state.repY;
    }

    const { obj, mtl } = exportToOBJ(state.baseMesh, {
      ...exportOptions,
      edgeStyles: state.edgeStyles,
      edgeStyleMap: state.edgeStyleMap,
      periodicInfo: state.periodicInfo
    });

    // Download OBJ
    const blobObj = new Blob([obj], { type: 'text/plain' });
    const urlObj = URL.createObjectURL(blobObj);
    const aObj = document.createElement('a');
    aObj.href = urlObj;
    aObj.download = `${filename}.obj`;
    document.body.appendChild(aObj);
    aObj.click();
    document.body.removeChild(aObj);
    URL.revokeObjectURL(urlObj);

    // Download MTL
    const blobMtl = new Blob([mtl], { type: 'text/plain' });
    const urlMtl = URL.createObjectURL(blobMtl);
    const aMtl = document.createElement('a');
    aMtl.href = urlMtl;
    aMtl.download = `${filename}.mtl`;
    document.body.appendChild(aMtl);
    aMtl.click();
    document.body.removeChild(aMtl);
    URL.revokeObjectURL(urlMtl);
  });

  document.getElementById('btn-export-ukp').addEventListener('click', () => {
    if (!state.baseMesh) return;

    // Export the base unit pattern
    const ukpContent = exportToUKP(state.baseMesh);
    const blob = new Blob([ukpContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'unit_pattern.ukp';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  document.getElementById('mtl-brightness').addEventListener('input', (e) => {
    state.mtlBrightness = parseFloat(e.target.value);
    requestDraw();
  });

  document.getElementById('mtl-interpolation').addEventListener('input', (e) => {
    state.mtlInterpolation = parseFloat(e.target.value);
    requestDraw();
  });

  // Restore unit pattern.
  document.getElementById('btn-restore-unit-pattern').addEventListener('click', async () => {
    if (!state.unitPatternBaseMesh) return;
    state.baseMesh = JSON.parse(JSON.stringify(state.unitPatternBaseMesh));
    state.mesh = await deploy(state.baseMesh, state.deployAngle * Math.PI / 180, state.alignUnitParallelogram);
    requestDraw();
  });
  // Save State
  document.getElementById('btn-save-state').addEventListener('click', () => {
    const stateToSave = { ...state };
    delete stateToSave.viewer3D;

    const stateStr = JSON.stringify(stateToSave);
    const blob = new Blob([stateStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kirigami_state.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Load State
  const loadStateFromFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const loadedState = JSON.parse(event.target.result);

        // Reset state to default values
        resetState();

        // Apply loaded state properties
        Object.assign(state, loadedState);
        // Ensure certain things are reset or ignored
        state.viewer3D = null;

        // Restore UI
        repXInput.value = state.repX;
        repXVal.textContent = state.repX;
        repYInput.value = state.repY;
        repYVal.textContent = state.repY;
        deployAngleInput.value = state.deployAngle;
        deployAngleVal.value = state.deployAngle;

        showIndicesCheckbox.checked = state.showIndices;
        showBaseMeshCheckbox.checked = state.showBaseMesh;
        enableThirdColorCheckbox.checked = state.enableThirdColor;

        document.getElementById('chk-show-unit-parallelogram').checked = state.showUnitParallelogram;
        document.getElementById('chk-align-unit-parallelogram').checked = state.alignUnitParallelogram;
        document.getElementById('chk-split-screen').checked = state.splitScreen;
        document.getElementById('chk-detect-collisions').checked = state.detectCollisions || false;

        // Inverse Design UI
        const scaleIn = document.getElementById('scale');
        if (scaleIn) scaleIn.value = state.scale;
        const rotationIn = document.getElementById('rotation');
        if (rotationIn) rotationIn.value = state.rotation;
        // const depAngleIn = document.getElementById('deployed-angle');
        // if (depAngleIn) depAngleIn.value = state.deployedAngle;
        const lftBtn = document.getElementById('btn-lift');
        if (lftBtn && state.targetMesh) lftBtn.disabled = false;

        bboxWidthInput.value = state.bboxWidth || 20;
        bboxHeightInput.value = state.bboxHeight || 20;
        svgAverageEdgeSizeInput.value = state.svgAverageEdgeSizeMm ?? 40;
        svgAverageEdgeSizeVal.value = state.svgAverageEdgeSizeMm ?? 40;
        svgHingeSizeInput.value = state.svgHingeSizeMm ?? 2;
        svgHingeSizeVal.value = state.svgHingeSizeMm ?? 2;

        // Render Mode Radio
        renderModeRadios.forEach(r => {
          if (r.value === state.renderMode) r.checked = true;
        });

        // Toggle visibility
        const repControls = document.getElementById('repetition-controls');
        if (state.renderMode === 'bbox') {
          bboxControls.style.display = 'flex';
          repControls.style.display = 'none';
          circleControls.style.display = 'none';
        } else if (state.renderMode === 'circle') {
          bboxControls.style.display = 'none';
          repControls.style.display = 'none';
          circleControls.style.display = 'flex';
        } else {
          bboxControls.style.display = 'none';
          repControls.style.display = 'flex';
          circleControls.style.display = 'none';
        }

        const splitViewContainer = document.getElementById('split-view-container');
        if (state.splitScreen) {
          splitViewContainer.style.display = 'block';
          const splitScreenCheckbox = document.getElementById('chk-split-screen');
          if (splitScreenCheckbox) splitScreenCheckbox.checked = state.splitScreen;
        } else {
          const splitScreenCheckbox = document.getElementById('chk-split-screen');
          if (splitScreenCheckbox) splitScreenCheckbox.checked = false;
          splitViewContainer.style.display = 'none';
        }

        // Split screen internal logic requires firing resize event
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 0);


        // Update Kernel & Periodicity
        updateKernelControls(true);
        updatePeriodicityControls();

        // Regenerate/Redraw
        if (state.baseMesh) {
          if (!state.baseMesh.originalVertices) {
            state.baseMesh.originalVertices = JSON.parse(JSON.stringify(state.baseMesh.vertices));
          }

          const angleRad = (state.deployAngle * Math.PI) / 180;
          if (state.optimizedGround) {
            state.mesh = state.optimizedGround;
          } else {
            state.mesh = await deploy(state.baseMesh, angleRad, state.alignUnitParallelogram);
          }
          // Re-apply face colors just in case
          state.mesh.face_colors = state.baseMesh.face_colors;
          requestDraw();
          if (!state.unitPatternBaseMesh) {
            state.unitPatternBaseMesh = JSON.parse(JSON.stringify(state.baseMesh));
          }
        }

        // If split screen and target mesh, might want to show it.
        if (state.splitScreen && state.targetMesh) {
          const splitViewContent = document.getElementById('split-view-content');
          if (!state.viewer3D) {
            state.viewer3D = new Viewer3D(splitViewContent);
          }
          if (state.optimizedLifted) {
            state.viewer3D.updateMesh(state.optimizedLifted);
          } else {
            state.viewer3D.updateMesh(state.targetMesh);
          }
        }

        curveEditor.renderList();

      } catch (err) {
        console.error("Failed to load state", err);
        alert("Failed to load state file.");
      }
    };
    reader.readAsText(file);
  };
  const fileLoadState = document.getElementById('file-load-state');
  document.getElementById('btn-load-state').addEventListener('click', () => {
    fileLoadState.click();
  });

  fileLoadState.addEventListener('change', (e) => {
    const file = e.target.files[0];
    loadStateFromFile(file);
    // basic reset so same file can be selected again
    fileLoadState.value = '';
  });

  // MTL loading.
  const loadMTL = async (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      state.color_map = parseMTL(text);
      requestDraw();
    };
    reader.readAsText(file);
  };

  // File Loading Logic
  const loadOBJ = async (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const mesh = parseOBJ(text);
      const unitPatternMesh = await detectUnitPattern(mesh);
      if (unitPatternMesh.periodicity[0][0] != 0 || unitPatternMesh.periodicity[0][1] != 0) {
        mesh.vertices = unitPatternMesh.vertices;
        mesh.faces = unitPatternMesh.faces;
      }
      mesh.periodicity = unitPatternMesh.periodicity;
      if (mesh.face_colors.length == 0) {
        mesh.face_colors = await initColoring(mesh);
      }
      const bounds = normalizeMesh(mesh);
      state.deployAngle = 0;
      deployAngleInput.value = 0;
      deployAngleVal.value = 0;
      state.mesh = mesh;
      updateBaseMesh(mesh);

      state.camera.x = 0;
      state.camera.y = 0;
      state.mesh = await deploy(state.baseMesh, state.deployAngle * Math.PI / 180, state.alignUnitParallelogram);

      requestDraw();
    };
    reader.readAsText(file);
  };

  const loadUKPFromText = async (text) => {
    state.mesh = parseUKP(text);
    normalizeMesh(state.mesh);
    if (state.mesh.repX > 1) {
      state.mesh = await replicate2x2(state.mesh);
    }
    if (!state.mesh.face_colors || state.mesh.face_colors.length == 0) {
      state.mesh.face_colors = await initColoring(state.mesh);
    }
    state.baseMesh = {}
    updateBaseMesh(state.mesh);
    requestDraw();
  };

  const loadUKP = async (file) => {
    // ukpFileNameDisplay.textContent = file.name; // Display removed
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      await loadUKPFromText(text);
    };
    reader.readAsText(file);
  };

  // Pattern Selector Logic
  const patternListVal = import.meta.glob('/data/unit_patterns/*.ukp', { as: 'url', eager: true });
  const patternListDiv = document.getElementById('pattern-list');
  if (patternListDiv) {
    patternListDiv.innerHTML = '';
    for (const path in patternListVal) {
      const name = path.split('/').pop();
      const url = patternListVal[path];
      const btn = document.createElement('div');
      btn.textContent = name;
      btn.style.cursor = 'pointer';
      btn.style.fontSize = '0.8rem';
      btn.style.padding = '4px';
      btn.style.width = '100%';
      btn.style.borderBottom = '1px solid #333';
      btn.addEventListener('mouseenter', () => btn.style.background = '#333');
      btn.addEventListener('mouseleave', () => btn.style.background = 'transparent');

      btn.addEventListener('click', async () => {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch ${url}`);
          const text = await response.text();
          await loadUKPFromText(text);
          return;
        } catch (e) {
          console.error(e);
        }
      });
      patternListDiv.appendChild(btn);
    }


  }

  // Drag and Drop
  uploadDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadDropZone.classList.add('drag-over');
  });

  uploadDropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadDropZone.classList.remove('drag-over');
  });

  uploadDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadDropZone.classList.remove('drag-over');

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'obj') {
      loadOBJ(file);
    } else if (extension === 'ukp') {
      loadUKP(file);
    } else if (extension === 'mtl') {
      loadMTL(file);
    } else if (extension === 'json') {
      loadStateFromFile(file);
    } else {
      alert('Unsupported file format. Please upload .obj or .ukp files.');
    }
  });

  // Sliders
  repXInput.addEventListener('input', (e) => {
    state.repX = parseInt(e.target.value, 10);
    repXVal.textContent = state.repX;
    requestDraw();
  });

  repYInput.addEventListener('input', (e) => {
    state.repY = parseInt(e.target.value, 10);
    repYVal.textContent = state.repY;
    requestDraw();
  });

  bindSyncedNumberInputs(deployAngleInput, deployAngleVal,
    "deployAngle", 0, async () => {
      let angle = state.deployAngle;
      if (state.baseMesh) {
        let angleRad = (angle * Math.PI) / 180;
        angleRad = Math.min(angleRad, state.max_angle);
        let deployedMesh = await deploy(state.baseMesh, angleRad, state.alignUnitParallelogram);
        deployedMesh.face_colors = state.baseMesh.face_colors;

        state.mesh = deployedMesh;
        requestDraw();
      }
    });


  document.getElementById('chk-detect-collisions').addEventListener('change', async (e) => {
    state.detectCollisions = e.target.checked;
    if (state.baseMesh) {
      let angle = await max_opening_angle(state.baseMesh, state.detectCollisions);
      state.max_angle = angle;
      const keyMax = Math.round(angle / Math.PI * 180);
      deployAngleInput.max = keyMax;

      if (state.deployAngle > keyMax) {
        state.deployAngle = keyMax;
        deployAngleInput.value = keyMax;
        deployAngleVal.value = keyMax;
      }

      let angleRad = (state.deployAngle * Math.PI) / 180;
      let deployedMesh = await deploy(state.baseMesh, angleRad, state.alignUnitParallelogram);
      deployedMesh.face_colors = state.baseMesh.face_colors;
      state.mesh = deployedMesh;
      requestDraw();
    }
  });

  showIndicesCheckbox.addEventListener('change', (e) => {
    state.showIndices = e.target.checked;
    requestDraw();
  });

  document.getElementById('chk-show-unit-parallelogram').addEventListener('change', async (e) => {
    state.showUnitParallelogram = e.target.checked;
    if (state.baseMesh) {
      state.mesh = await deploy(state.baseMesh, state.deployAngle * Math.PI / 180, state.alignUnitParallelogram);
    }
    requestDraw();
  });

  document.getElementById('chk-align-unit-parallelogram').addEventListener('change', async (e) => {
    state.alignUnitParallelogram = e.target.checked;
    if (state.baseMesh) {
      state.mesh = await deploy(state.baseMesh, state.deployAngle * Math.PI / 180, state.alignUnitParallelogram);
    }
    requestDraw();
  });

  showBaseMeshCheckbox.addEventListener('change', (e) => {
    state.showBaseMesh = e.target.checked;
    requestDraw();
  });

  const enableThirdColorCheckbox = document.getElementById('chk-enable-third-color');
  enableThirdColorCheckbox.addEventListener('change', (e) => {
    state.enableThirdColor = e.target.checked;
    requestDraw();
  });

  document.getElementById('btn-make-non-periodic').addEventListener('click', async () => {
    if (!state.baseMesh) return;

    if (state.renderMode != 'bbox') {
      const nonPeriodicMesh = await makeNonPeriodic(state.baseMesh, state.repX, state.repY);
      updateBaseMesh(nonPeriodicMesh);
      state.mesh = await deploy(state.baseMesh, state.deployAngle * Math.PI / 180, state.alignUnitParallelogram);
      requestDraw();
    } else {
      const nonPeriodicMesh = await makeNonPeriodicInBox(state.mesh, -state.bboxWidth / 2, -state.bboxHeight / 2, state.bboxWidth / 2, state.bboxHeight / 2);
      updateBaseMesh(nonPeriodicMesh);
      state.mesh = await deploy(state.baseMesh, state.deployAngle * Math.PI / 180, state.alignUnitParallelogram);
      requestDraw();
    }
  });

  // Split Screen Logic
  const splitScreenCheckbox = document.getElementById('chk-split-screen');
  const splitViewContainer = document.getElementById('split-view-container');
  const splitViewContent = document.getElementById('split-view-content');

  splitScreenCheckbox.addEventListener('change', (e) => {
    state.splitScreen = e.target.checked;
    if (state.splitScreen) {
      splitViewContainer.style.display = 'block';
      if (!state.viewer3D) {
        state.viewer3D = new Viewer3D(splitViewContent);
      }
    } else {
      splitViewContainer.style.display = 'none';
    }

    // Force layout update/resize
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      if (state.splitScreen && state.viewer3D) {
        state.viewer3D.onResize();
      }
    }, 0);
  });

  // Target Mesh Drag & Drop
  const targetMeshDropZone = document.getElementById('target-mesh-drop-zone');

  targetMeshDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    targetMeshDropZone.classList.add('drag-over');
  });

  targetMeshDropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    targetMeshDropZone.classList.remove('drag-over');
  });

  targetMeshDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    targetMeshDropZone.classList.remove('drag-over');

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.name.split('.').pop().toLowerCase() === 'obj') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target.result;
        let mesh = parseOBJ(text);
        mesh = await standardizeMesh(mesh);
        state.targetMesh = mesh;
        if (state.targetMesh.uvs.length > 0) {
          const newBaseMesh = JSON.parse(JSON.stringify(state.targetMesh));
          newBaseMesh.vertices = state.targetMesh.uvs;
          newBaseMesh.faces = state.targetMesh.uv_faces;
          newBaseMesh.periodicity = [[0, 0], [0, 0]];
          newBaseMesh.face_colors = await initColoring(newBaseMesh);
          updateBaseMesh(newBaseMesh);
        }

        // Enable lift button
        const liftBtn = document.getElementById('btn-lift');
        if (liftBtn) liftBtn.disabled = false;

        // Ensure split view is active
        if (!state.splitScreen) {
          splitScreenCheckbox.checked = true;
          // Trigger change event manually or duplicate logic
          state.splitScreen = true;
          splitViewContainer.style.display = 'block';
          if (!state.viewer3D) {
            state.viewer3D = new Viewer3D(splitViewContent);
          }
          // Resize update
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            if (state.viewer3D) state.viewer3D.onResize();
          }, 0);
        }

        // Display in right viewer
        if (state.viewer3D) {
          state.viewer3D.updateMesh(mesh);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload an .obj file');
    }
  });

  // Click to upload support for target mesh
  targetMeshDropZone.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.obj';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const mesh = parseOBJ(text);

        // Ensure split view is active
        if (!state.splitScreen) {
          splitScreenCheckbox.checked = true;
          state.splitScreen = true;
          splitViewContainer.style.display = 'block';
          if (!state.viewer3D) {
            state.viewer3D = new Viewer3D(splitViewContent);
          }
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            if (state.viewer3D) state.viewer3D.onResize();
          }, 0);
        }

        if (state.viewer3D) {
          state.viewer3D.updateMesh(mesh);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });

  const lift_status = { running: false, refresh: false }; // Use an object to hold the state so it can be modified inside async function
  const do_lift = async () => {
    const has_zero_periodicity = mesh => !mesh.periodicity || (mesh.periodicity[0][0] === 0 && mesh.periodicity[0][1] === 0 && mesh.periodicity[1][0] === 0 && mesh.periodicity[1][1] === 0);
    if (!state.mesh || !state.targetMesh || !state.unitPatternBaseMesh ||
      has_zero_periodicity(state.unitPatternBaseMesh)
    ) {
      alert("Please load a periodic pattern.");
      return;
    }
    // Avoid race conditions by checking if a lift operation is already running. If it is, set a flag to refresh after the current operation completes.
    if (lift_status.running) {
      lift_status.refresh = true;
      return;
    }
    lift_status.running = true;

    // Call lift with radians
    const depRad = (state.deployAngle * Math.PI) / 180;
    const intersectBoundary = document.getElementById('chk-intersect-boundary').checked;
    const removeLeaves = document.getElementById('chk-remove-single-neighbor').checked;
    const rotationRad = (state.rotation * Math.PI) / 180;
    const result = await lift(state.unitPatternBaseMesh, depRad, state.targetMesh, state.scale, rotationRad, intersectBoundary, removeLeaves);
    state.liftedMesh = result.lifted;
    state.initMesh = result.init_mesh;
    await updateBaseMesh(result.init_mesh, true, false);

    state.viewer3D.updateMesh(state.liftedMesh);

    document.getElementById('btn-optimize-init').disabled = false;
    document.getElementById('btn-optimize-start').disabled = false;

    lift_status.running = false;
    if (lift_status.refresh) {
      lift_status.refresh = false;
      setTimeout(do_lift, 0); // Schedule another lift operation
    }
  };
  const rotationInput = document.getElementById('rotation');
  const rotationVal = document.getElementById('rotation-val');
  bindSyncedNumberInputs(rotationInput, rotationVal, "rotation", 0, async () => {
    do_lift();
  });
  const scaleInput = document.getElementById('scale-slider');
  const scaleVal = document.getElementById('scale');
  bindSyncedNumberInputs(scaleInput, scaleVal, "scale", 1, async () => {
    do_lift();
  });
  const liftBtn = document.getElementById('btn-lift');
  liftBtn.addEventListener('click', async () => {
    do_lift();
  });

  btnConformalize.addEventListener('click', async () => {
    if (!state.baseMesh.kernel || state.baseMesh.kernel.length === 0) {
      updateBaseMesh(await testMakeDeployable(state.baseMesh, false));
    }
    let result = await conformalize(state.baseMesh);
    updateBaseMesh(result);
  });

  document.getElementById('btn-mesh-to-pattern').addEventListener('click', async () => {
    if (!state.targetMesh) return;

    const mapToUnitDisk = document.getElementById('chk-map-to-unit-disk').checked;
    const result = await meshToPattern(state.targetMesh, mapToUnitDisk);
    if (result.target_mesh_vertices) {
      state.targetMesh.vertices = result.target_mesh_vertices;
      state.targetMesh.faces = result.target_mesh_faces;
      state.targetMesh.face_colors = result.face_colors;
      state.viewer3D.updateMesh(state.targetMesh);
    }
    await updateBaseMesh(result);
    state.initMesh = state.baseMesh;
    state.liftedMesh = state.targetMesh;
  });

  document.getElementById('btn-optimize-fully-closed').addEventListener('click', async () => {
    if (!state.baseMesh.kernel || state.baseMesh.kernel.length === 0) {
      updateBaseMesh(await testMakeDeployable(state.baseMesh, false));
    }
    const result = await optimizeFullyClosed(state.baseMesh);
    updateBaseMesh(result);
  });

  document.getElementById('btn-prevent-intersections').addEventListener('click', async () => {
    if (!state.baseMesh.kernel || state.baseMesh.kernel.length === 0) {
      updateBaseMesh(await testMakeDeployable(state.baseMesh, false));
    }
    const result = await preventIntersections(state.baseMesh, state.barrier, state.barrier_strength, state.close_to_original_weight);
    updateBaseMesh(result);
  });

  // Barrier Input Logic.
  const barrierInput = document.getElementById('barrier');
  const barrierVal = document.getElementById('barrier-val');
  barrierInput.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 0;
    state.barrier = value;
    barrierVal.value = value;
  });
  barrierVal.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 0;
    state.barrier = value;
    barrierInput.value = value.toFixed(2);
  });

  // Barrier strength input logic
  const barrierStrengthInput = document.getElementById('barrier-strength');
  const barrierStrengthVal = document.getElementById('barrier-strength-val');
  barrierStrengthInput.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 0;
    state.barrier_strength = value;
    barrierStrengthVal.value = value;
  });
  barrierStrengthVal.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 0;
    state.barrier_strength = value;
    barrierStrengthInput.value = value.toFixed(2);
  });

  // Close to original input logic
  const closeToOriginalInput = document.getElementById('close-to-original');
  const closeToOriginalVal = document.getElementById('close-to-original-val');
  closeToOriginalInput.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 0;
    state.close_to_original_weight = value;
    closeToOriginalVal.value = value;
  });
  closeToOriginalVal.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 0;
    state.close_to_original_weight = value;
    closeToOriginalInput.value = value.toFixed(2);
  });

}
