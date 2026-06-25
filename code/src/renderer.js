import { CONFIG } from './constants.js';

function hexToRgb(hex) {
  // Handle short hex like #123
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 128, g: 128, b: 128 };
}

export function drawGrid(ctx, state) {
  const width = ctx.canvas.clientWidth;
  const height = ctx.canvas.clientHeight;
  const cx = width / 2;
  const cy = height / 2;
  const { x: camX, y: camY, zoom } = state.camera;

  // Calculate grid spacing based on zoom
  let step = 1;
  while (step * zoom < 50) step *= 2; // Increase step if too dense
  while (step * zoom > 200) step /= 2; // Decrease step if too sparse

  ctx.strokeStyle = CONFIG.gridColor;
  ctx.lineWidth = 1;

  // Vertical lines
  const startX = Math.floor((-cx / zoom + camX) / step) * step;
  const endX = Math.ceil((cx / zoom + camX) / step) * step;

  ctx.beginPath();
  for (let x = startX; x <= endX; x += step) {
    const screenX = cx + (x - camX) * zoom;
    ctx.moveTo(screenX, 0);
    ctx.lineTo(screenX, height);
  }

  // Horizontal lines
  const startY = Math.floor((-cy / zoom + camY) / step) * step;
  const endY = Math.ceil((cy / zoom + camY) / step) * step;

  for (let y = startY; y <= endY; y += step) {
    const screenY = cy - (y - camY) * zoom;
    ctx.moveTo(0, screenY);
    ctx.lineTo(width, screenY);
  }
  ctx.stroke();

  // Axis lines
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();

  // X Axis
  const axisY = cy - (0 - camY) * zoom;
  if (axisY >= 0 && axisY <= height) {
    ctx.moveTo(0, axisY);
    ctx.lineTo(width, axisY);
  }

  // Y Axis
  const axisX = cx + (0 - camX) * zoom;
  if (axisX >= 0 && axisX <= width) {
    ctx.moveTo(axisX, 0);
    ctx.lineTo(axisX, height);
  }
  ctx.stroke();
}



function drawStyledFace(ctx, mesh, face_index, offX, offY, toScreen, state, drawStyle) {
  let face = mesh.faces[face_index];
  ctx.beginPath();
  const startV = mesh.vertices[face[0]];
  const pStart = toScreen(startV, offX, offY);
  ctx.moveTo(pStart.x, pStart.y);

  for (let i = 0; i < face.length; i++) {
    const idx1 = face[i];
    const idx2 = face[(i + 1) % face.length];
    const vNext = mesh.vertices[idx2];
    const pNext = toScreen(vNext, offX, offY);

    const key = `${idx1}_${idx2}`;
    const { styleIdx, flip } = state.edgeStyleMap && state.edgeStyleMap[key] || { styleIdx: undefined, flip: 0 };

    if (styleIdx !== undefined && state.edgeStyles[styleIdx]) {
      const style = state.edgeStyles[styleIdx];
      const points = style.points;

      let pMin, pMax;
      let flip_x = (flip % 2 == 1);
      let flip_y = (Math.floor(flip / 2) == 1) ^ flip_x;
      if (flip_x) {
        pMin = toScreen(mesh.vertices[idx1], offX, offY);
        pMax = pNext;
      } else {
        pMin = pNext;
        pMax = toScreen(mesh.vertices[idx1], offX, offY);
      }

      const dx = pMax.x - pMin.x;
      const dy = pMax.y - pMin.y;
      const nx = -dy;
      const ny = dx;

      const performMap = (pt) => ({
        x: pMin.x + pt.x * dx + (flip_y ? -1 : 1) * pt.y * nx,
        y: pMin.y + pt.x * dy + (flip_y ? -1 : 1) * pt.y * ny
      });

      const mapStruct = (pt) => {
        const res = performMap(pt);
        if (pt.hIn) res.hIn = performMap(pt.hIn);
        else res.hIn = { ...res }; // degenerate
        if (pt.hOut) res.hOut = performMap(pt.hOut);
        else res.hOut = { ...res };
        return res;
      };

      const mappedPoints = points.map(mapStruct);
      const drawPts = flip_x ? mappedPoints : mappedPoints.slice().reverse();

      for (let k = 0; k < drawPts.length - 1; k++) {
        const pCurr = drawPts[k];
        const pNext = drawPts[k + 1];

        // If not reversed: pCurr -> pNext uses pCurr.hOut and pNext.hIn
        // If reversed: pCurr -> pNext uses pCurr.hIn and pNext.hOut
        const cp1 = flip_x ? pCurr.hOut : pCurr.hIn;
        const cp2 = flip_x ? pNext.hIn : pNext.hOut;

        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, pNext.x, pNext.y);
      }
    } else {
      ctx.lineTo(pNext.x, pNext.y);
    }
  }
  ctx.closePath();
  if (drawStyle === 'stroke') {
    ctx.stroke();
  } else if (drawStyle === 'fill') {
    ctx.fill();
  }
}

export function drawMesh(ctx, state) {
  if (!state.mesh || !state.baseMesh) return;

  const width = ctx.canvas.clientWidth;
  const height = ctx.canvas.clientHeight;
  const cx = width / 2;
  const cy = height / 2;
  const { x: camX, y: camY, zoom } = state.camera;

  // Helper to transform world to screen
  const toScreen = (v, offsetX, offsetY) => ({
    x: cx + (v.x + offsetX[0] + offsetY[0] - camX) * zoom,
    y: cy - (v.y + offsetX[1] + offsetY[1] - camY) * zoom // Flip Y
  });

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const repX = state.repX;
  const repY = state.repY;

  let mesh = state.mesh;
  if (state.showBaseMesh) {
    mesh = state.baseMesh;
  }

  // Loop for Repetitions
  for (let rx = repX - 1; rx >= 0; rx--) {
    for (let ry = repY - 1; ry >= 0; ry--) {
      const offX = mesh.periodicity[0].map(v => v * rx);
      const offY = mesh.periodicity[1].map(v => v * ry);

      // Draw Faces (Fill)
      if (mesh.faces.length > 0) {
        for (let i = 0; i < mesh.faces.length; i++) {
          const face = mesh.faces[i];

          let fillColor = CONFIG.fillColor;
          if (mesh.face_colors && mesh.face_colors[i] === 1) {
            fillColor = (rx == 0 && ry == 0) ? CONFIG.unitFaceColor1 : CONFIG.faceColor1;
          } else if (mesh.face_colors && mesh.face_colors[i] === 0) {
            fillColor = (rx == 0 && ry == 0) ? CONFIG.unitFaceColor0 : CONFIG.faceColor0;
          } else if (mesh.face_colors && mesh.face_colors[i] === 2) {
            fillColor = (rx == 0 && ry == 0) ? CONFIG.unitFaceColor2 : CONFIG.faceColor2;
          }

          if (state.color_map && state.baseMesh && state.baseMesh.mtl_face_color_names && state.baseMesh.mtl_face_color_names[i] in state.color_map) {
            const mtlColorRaw = state.color_map[state.baseMesh.mtl_face_color_names[i]];
            const brightness = state.mtlBrightness !== undefined ? state.mtlBrightness : 1.0;
            const interpolation = state.mtlInterpolation !== undefined ? state.mtlInterpolation : 1.0;

            const baseRgb = hexToRgb(fillColor);
            const mtlR = mtlColorRaw[0] * brightness;
            const mtlG = mtlColorRaw[1] * brightness;
            const mtlB = mtlColorRaw[2] * brightness;

            const r = baseRgb.r * (1 - interpolation) + mtlR * interpolation;
            const g = baseRgb.g * (1 - interpolation) + mtlG * interpolation;
            const b = baseRgb.b * (1 - interpolation) + mtlB * interpolation;

            ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
          } else {
            ctx.fillStyle = fillColor;
          }

          drawStyledFace(ctx, mesh, i, offX, offY, toScreen, state, 'fill');
        }
      }

      // Draw Edges (Stroke)
      const scaleFactor = state.camera.zoom / CONFIG.defaultZoom;
      if (rx == 0 && ry == 0) {
        ctx.strokeStyle = CONFIG.unitLineColor;
        ctx.lineWidth = Math.max(0.7, 3 * scaleFactor); // Scale width
      } else {
        ctx.strokeStyle = CONFIG.lineColor;
        ctx.lineWidth = Math.max(0.5, 2 * scaleFactor); // Scale width
      }

      for (let i = 0; i < mesh.faces.length; i++) {
        drawStyledFace(ctx, mesh, i, offX, offY, toScreen, state, 'stroke');
      }

      // Draw Vertices (Dots)
      // ctx.fillStyle = CONFIG.pointColor;
      // const pointRadius = Math.max(1, CONFIG.vertexSize * scaleFactor);

      // Optimization: Only draw vertices if not too many
      // if (mesh.vertices.length * repX * repY < 10000) {
      //   for (const v of mesh.vertices) {
      //     const p = toScreen(v, offX, offY);

      //     // Simple culling
      //     if (p.x < -10 || p.x > width + 10 || p.y < -10 || p.y > height + 10) continue;

      //     ctx.beginPath();
      //     ctx.arc(p.x, p.y, pointRadius, 0, Math.PI * 2);
      //     ctx.fill();
      //   }
      // }
      if (state.showIndices && rx === 0 && ry === 0) {
        ctx.fillStyle = '#000000ff';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < mesh.vertices.length; i++) {
          const v = mesh.vertices[i];
          const p = toScreen(v, offX, offY);

          // Simple culling
          if (p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) continue;

          ctx.fillText(i.toString(), p.x + 4, p.y - 4);
        }
      }
    }
  }
}

export function drawMeshInBoxOrCircle(ctx, state, boundingBox) {
  if (!state.mesh || !state.baseMesh) return;

  const width = ctx.canvas.clientWidth;
  const height = ctx.canvas.clientHeight;
  const cx = width / 2;
  const cy = height / 2;
  const { x: camX, y: camY, zoom } = state.camera;

  // Helper to transform world to screen
  const toScreen = (v, offsetX, offsetY) => ({
    x: cx + (v.x + offsetX[0] + offsetY[0] - camX) * zoom,
    y: cy - (v.y + offsetX[1] + offsetY[1] - camY) * zoom // Flip Y
  });

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  let mesh = state.mesh;
  if (state.showBaseMesh) {
    mesh = state.baseMesh;
  }


  const minX = boundingBox.minX;
  const maxX = boundingBox.maxX;
  const minY = boundingBox.minY;
  const maxY = boundingBox.maxY;

  // Periodicity matrix
  const px = state.baseMesh.periodicity[0];
  const py = state.baseMesh.periodicity[1];
  const det = px[0] * py[1] - px[1] * py[0];

  let minU = Infinity, maxU = -Infinity;
  let minV = Infinity, maxV = -Infinity;

  if (Math.abs(det) < 1e-6) {
    minU = 0;
    maxU = 1;
    minV = 0;
    maxV = 1;
  } else {



    // Inverse periodicity matrix
    const P_inv = [
      [py[1] / det, -py[0] / det],
      [-px[1] / det, px[0] / det]
    ];

    const projectToUV = (x, y) => {
      return {
        u: P_inv[0][0] * x + P_inv[0][1] * y,
        v: P_inv[1][0] * x + P_inv[1][1] * y
      };
    };

    // Check corners of the bounding box
    const corners = [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY }
    ];

    // Add some padding to search range to account for mesh extent (vertices are dispersed around origin)
    // Mesh bounding box radius?
    let meshRadius = 0;
    for (const v of mesh.vertices) {
      meshRadius = Math.max(meshRadius, Math.hypot(v.x, v.y));
    }
    // This is a rough heuristic. A better one would use mesh bounds.
    // Let's expand the search box in UV space.

    corners.forEach(p => {
      // We check p +/- meshRadius to cover cases where origin is outside box but part of mesh is inside
      const offsets = [
        { x: 0, y: 0 }, { x: meshRadius, y: 0 }, { x: -meshRadius, y: 0 }, { x: 0, y: meshRadius }, { x: 0, y: -meshRadius }
      ];
      offsets.forEach(off => {
        const uv = projectToUV(p.x + off.x, p.y + off.y);
        minU = Math.min(minU, uv.u);
        maxU = Math.max(maxU, uv.u);
        minV = Math.min(minV, uv.v);
        maxV = Math.max(maxV, uv.v);
      });
    });
  }
  const startRx = Math.floor(minU);
  const endRx = Math.ceil(maxU);
  const startRy = Math.floor(minV);
  const endRy = Math.ceil(maxV);

  let checkInside = (v) => {
    if (state.renderMode === 'bbox') {
      return v.x >= minX && v.x <= maxX && v.y >= minY && v.y <= maxY;
    } else {
      return Math.hypot(v.x - state.circleShiftX, v.y - state.circleShiftY) <= state.circleRadius;
    }
  };


  let draw_rep = (rx, ry) => {
    const offX = mesh.periodicity[0].map(v => v * rx);
    const offY = mesh.periodicity[1].map(v => v * ry);
    const baseMeshOffX = state.baseMesh.periodicity[0].map(v => v * rx);
    const baseMeshOffY = state.baseMesh.periodicity[1].map(v => v * ry);

    const facesToDraw = [];
    const transformedVerts = state.baseMesh.vertices.map(v => ({
      x: v.x + baseMeshOffX[0] + baseMeshOffY[0],
      y: v.y + baseMeshOffX[1] + baseMeshOffY[1]
    }));

    for (let i = 0; i < state.baseMesh.faces.length; i++) {
      const face = state.baseMesh.faces[i];
      let allInside = true;
      for (const idx of face) {
        const v = transformedVerts[idx];
        if (!checkInside(v)) {
          allInside = false;
          break;
        }
      }
      if (allInside) {
        facesToDraw.push(i);
      }
    }

    if (facesToDraw.length === 0) return;

    // Draw Faces
    for (const i of facesToDraw) {
      const face = mesh.faces[i];
      let fillColor = CONFIG.fillColor;
      if (mesh.face_colors && mesh.face_colors[i] === 1) {
        fillColor = (rx == 0 && ry == 0) ? CONFIG.unitFaceColor1 : CONFIG.faceColor1;
      } else if (mesh.face_colors && mesh.face_colors[i] === 0) {
        fillColor = (rx == 0 && ry == 0) ? CONFIG.unitFaceColor0 : CONFIG.faceColor0;
      } else if (mesh.face_colors && mesh.face_colors[i] === 2) {
        fillColor = (rx == 0 && ry == 0) ? CONFIG.unitFaceColor2 : CONFIG.faceColor2;
      }

      if (state.color_map && state.baseMesh && state.baseMesh.mtl_face_color_names && state.baseMesh.mtl_face_color_names[i] in state.color_map) {
        const mtlColorRaw = state.color_map[state.baseMesh.mtl_face_color_names[i]];
        const brightness = state.mtlBrightness !== undefined ? state.mtlBrightness : 1.0;
        const interpolation = state.mtlInterpolation !== undefined ? state.mtlInterpolation : 1.0;

        const baseRgb = hexToRgb(fillColor);
        const mtlR = mtlColorRaw[0] * brightness;
        const mtlG = mtlColorRaw[1] * brightness;
        const mtlB = mtlColorRaw[2] * brightness;

        const r = baseRgb.r * (1 - interpolation) + mtlR * interpolation;
        const g = baseRgb.g * (1 - interpolation) + mtlG * interpolation;
        const b = baseRgb.b * (1 - interpolation) + mtlB * interpolation;

        ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
      } else {
        ctx.fillStyle = fillColor;
      }

      drawStyledFace(ctx, mesh, i, offX, offY, toScreen, state, 'fill');


      // Draw Edges for drawn faces
      const scaleFactor = state.camera.zoom / CONFIG.defaultZoom;
      if (rx == 0 && ry == 0) {
        ctx.strokeStyle = CONFIG.unitLineColor;
        ctx.lineWidth = Math.max(0.7, 3 * scaleFactor); // Scale width
      } else {
        ctx.strokeStyle = CONFIG.lineColor;
        ctx.lineWidth = Math.max(0.5, 2 * scaleFactor);
      }

      drawStyledFace(ctx, mesh, i, offX, offY, toScreen, state, 'stroke');
    }
  }

  // Loop candidates
  for (let rx = startRx; rx <= endRx; rx++) {
    for (let ry = startRy; ry <= endRy; ry++) {
      draw_rep(rx, ry);
    }
  }
  draw_rep(0, 0);
}

export function render(ctx, canvas, state) {
  // Clear
  ctx.fillStyle = CONFIG.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear full physical canvas

  drawGrid(ctx, state);

  // Draw the bounding box boundary for visualization
  const width = ctx.canvas.clientWidth;
  const height = ctx.canvas.clientHeight;
  const cx = width / 2;
  const cy = height / 2;
  const { x: camX, y: camY, zoom } = state.camera;

  const toScreen = (x, y) => ({
    x: cx + (x - camX) * zoom,
    y: cy - (y - camY) * zoom // Flip Y
  });

  if (state.renderMode === 'bbox') {
    const w = state.bboxWidth || 10;
    const h = state.bboxHeight || 10;
    // Bounding Box centered at origin
    const bbox = {
      minX: -w / 2,
      maxX: w / 2,
      minY: -h / 2,
      maxY: h / 2
    };

    // Draw Box
    const p1 = toScreen(bbox.minX, bbox.minY);
    const p2 = toScreen(bbox.maxX, bbox.minY);
    const p3 = toScreen(bbox.maxX, bbox.maxY);
    const p4 = toScreen(bbox.minX, bbox.maxY);

    ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]); // Reset

    drawMeshInBoxOrCircle(ctx, state, bbox);
  } else if (state.renderMode === 'circle') {
    const r = state.circleRadius || 10;
    const center = toScreen(state.circleShiftX, state.circleShiftY);
    const radius = r * zoom;
    // Draw circle.
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    const bbox = {
      minX: -r,
      maxX: r,
      minY: -r,
      maxY: r
    };

    drawMeshInBoxOrCircle(ctx, state, bbox);

  } else {
    drawMesh(ctx, state);
  }

  // Draw Unit Parallelogram
  if (state.showUnitParallelogram && state.mesh && state.mesh.vertices && state.mesh.vertices.length > 0 && state.mesh.periodicity) {
    if (state.mesh.singular_values && state.mesh.U) {

      // Find the distance of the vertex in baseMesh furthest away from the origin.
      let px = state.baseMesh.periodicity[0][0];
      let py = state.baseMesh.periodicity[0][1];
      let lenp = Math.sqrt(px * px + py * py);
      let qx = state.baseMesh.periodicity[1][0];
      let qy = state.baseMesh.periodicity[1][1];
      let lenq = Math.sqrt(qx * qx + qy * qy);
      let maxDist = Math.max(lenp, lenq), minDist = Math.min(lenp, lenq);
      // Draw an ellipse with axis aligned with the singular vectors.
      const radius1 = maxDist * zoom * state.mesh.singular_values[0][0];
      const radius2 = maxDist * zoom * state.mesh.singular_values[1][1];
      const center = toScreen(state.mesh.vertices[0].x, state.mesh.vertices[0].y);
      const rep_x = toScreen(state.mesh.vertices[0].x + state.mesh.periodicity[0][0],
        state.mesh.vertices[0].y + state.mesh.periodicity[0][1]);
      const rep_y = toScreen(state.mesh.vertices[0].x + state.mesh.periodicity[1][0],
        state.mesh.vertices[0].y + state.mesh.periodicity[1][1]);

      const u00 = state.mesh.U[0][0];
      const u10 = state.mesh.U[1][0];
      const angle = Math.atan2(u10, u00);
      const rotation = -angle;

      ctx.strokeStyle = '#70cd47A0';
      ctx.fillStyle = '#70cd4750';
      ctx.lineWidth = 5;
      // ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.ellipse(center.x, center.y, radius1, radius2, rotation, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.setLineDash([]);

      // Draw circles around center.
      ctx.fillStyle = '#379b0cff';
      ctx.strokeStyle = '#379b0cff';
      ctx.beginPath();
      ctx.arc(center.x, center.y, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw circle around center + state.mesh.periodicity[0]
      ctx.beginPath();
      ctx.arc(rep_x.x, rep_x.y, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw circle around center + state.mesh.periodicity[1]
      ctx.beginPath();
      ctx.arc(rep_y.x, rep_y.y, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw line from cetner to rep_x.
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(rep_x.x, rep_x.y);
      ctx.stroke();

      // Draw line from cetner to rep_y.
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(rep_y.x, rep_y.y);
      ctx.stroke();

    }

    const v0 = state.mesh.vertices[0];
    const px = state.mesh.periodicity[0]; // [x, y]
    const py = state.mesh.periodicity[1]; // [x, y]

    const p1 = toScreen(v0.x, v0.y);
    const p2 = toScreen(v0.x + px[0], v0.y + px[1]);
    const p3 = toScreen(v0.x + px[0] + py[0], v0.y + px[1] + py[1]);
    const p4 = toScreen(v0.x + py[0], v0.y + py[1]);

    ctx.strokeStyle = '#FF00FF'; // Magenta
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

  }
}
