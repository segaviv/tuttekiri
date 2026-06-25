import { CONFIG } from './constants.js';

const createInitialState = () => ({
  mesh: null, // { vertices: [], faces: [], width: 0, height: 0, face_colors: [] }
  camera: {
    x: 0,
    y: 0,
    zoom: CONFIG.defaultZoom,
  },
  repX: 1,
  repY: 1,
  isDragging: false,
  lastMouse: { x: 0, y: 0 },
  dragStart: { x: 0, y: 0 },
  baseMesh: null,
  unitPatternBaseMesh: null,
  showIndices: false,
  showBaseMesh: false,
  deployAngle: 0,
  kernelWeights: [],
  renderMode: 'bbox', // 'repetition' or 'bbox'
  bboxWidth: 20,
  bboxHeight: 20,
  circleRadius: 10,
  circleShiftX: 0,
  circleShiftY: 0,
  enableThirdColor: false,
  showUnitParallelogram: false,
  alignUnitParallelogram: false,
  splitScreen: false,
  detectCollisions: false,
  max_angle: Math.PI,
  color_map: {},
  mtlBrightness: 1.0,
  mtlInterpolation: 1.0,

  svgAverageEdgeSizeMm: 40,
  svgHingeSizeMm: 2,

  barrier: 0.1,
  barrier_strength: 10,
  close_to_original_weight: 0.1,

  // Inverse design stuff.
  targetMesh: null,
  scale: 1,
  rotation: 0,
  deployedAngle: 0,
  viewer3D: null,
  initMesh: null,
  liftedMesh: null,
  optimizedGround: null,
  optimizedLifted: null,

  // Edge styling.
  edgeStyles: [],
  edgeStyleMap: {}, // 'min_max': styleIndex
  selectedStyleIndex: -1,
  isPickingEdge: false,
  periodicInfo: null,
});

export const state = createInitialState();

export function resetState() {
  const initial = createInitialState();
  Object.assign(state, initial);
}