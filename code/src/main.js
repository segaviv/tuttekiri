import { state } from './state.js';
import { render } from './renderer.js';
import { setupInteractions } from './controls.js';
import { setupOptimizationControls } from './optimization_controls.js';

// --- DOM Elements ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// --- Initialization ---
let animationFrameId; // Track frame ID

export function requestDraw() {
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(() => {
      render(ctx, canvas, state);
      animationFrameId = null;
    });
  }
}

function resize() {
  const container = canvas.parentElement;
  const width = container.clientWidth;
  const height = container.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  // Set actual size in memory (scaled to account for extra pixel density)
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  // Make it visually fill the positioned parent
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  // Normalize coordinate system to use CSS pixels.
  // Context drawing commands will now treat 1 unit as 1 CSS pixel.
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
  ctx.scale(dpr, dpr);

  requestDraw();
}

// Setup
window.addEventListener('resize', resize);
setupInteractions(canvas, state, requestDraw);
setupOptimizationControls(canvas, state, requestDraw);
resize(); // Initial sizing and draw
