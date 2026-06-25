import { get_fabrication_edges } from "./kirigami_cpp_bridge";
import { state } from "./state";


export async function export_fabrication_svg() {
  let result = await get_fabrication_edges();
  let folding_edges = result.folding;
  let cutting_edges = result.cutting;

  let min_x = Infinity, min_y = Infinity, max_x = -Infinity, max_y = -Infinity;

  const update_bounds = (edges) => {
    for (let edge of edges) {
      min_x = Math.min(min_x, edge[0], edge[2]);
      max_x = Math.max(max_x, edge[0], edge[2]);
      min_y = Math.min(min_y, -edge[1], -edge[3]);
      max_y = Math.max(max_y, -edge[1], -edge[3]);
    }
  };

  update_bounds(folding_edges);
  update_bounds(cutting_edges);

  if (min_x === Infinity) {
    min_x = 0; min_y = 0; max_x = 100; max_y = 100;
  }

  const width = max_x - min_x;
  const height = max_y - min_y;
  const padding = Math.max(width, height) * 0.05; // 5% padding

  const viewBox = `${min_x - padding} ${min_y - padding} ${width + 2 * padding} ${height + 2 * padding}`;

  let svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">`;

  // Folding edges: Blue, thickness 0.01
  for (let edge of folding_edges) {
    svgContent += `<line x1="${edge[0]}" y1="${-edge[1]}" x2="${edge[2]}" y2="${-edge[3]}" stroke="blue" stroke-width="0.01" />`;
  }

  // Cutting edges: Red, thickness 0.01
  for (let edge of cutting_edges) {
    svgContent += `<line x1="${edge[0]}" y1="${-edge[1]}" x2="${edge[2]}" y2="${-edge[3]}" stroke="red" stroke-width="0.01" />`;
  }

  svgContent += `</svg>`;

  // Create duplicate for download
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'fabrication.svg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function export_optimized_obj(mesh, filename) {
  let objContent = "";
  // Vertices
  for (let i = 0; i < mesh.vertices.length; i += 3) {
    objContent += `v ${mesh.vertices[i]} ${mesh.vertices[i + 1]} ${mesh.vertices[i + 2]}\n`;
  }

  // Faces
  for (let i = 0; i < mesh.faces.length; i += 3) {
    objContent += `f ${mesh.faces[i] + 1} ${mesh.faces[i + 1] + 1} ${mesh.faces[i + 2] + 1}\n`;
  }

  // Create blob and download
  const blob = new Blob([objContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function invert2x2(m) {
  const [px_x, px_y] = m[0];
  const [py_x, py_y] = m[1];
  const det = px_x * py_y - px_y * py_x;
  if (Math.abs(det) < 1e-9) return null;
  return [
    [py_y / det, -px_y / det],
    [-py_x / det, px_x / det]
  ];
}

function getEdgeCuttingType(face_index, edge_index) {
  let face_color = state.baseMesh.face_colors[face_index];
  if (state.periodicInfo[face_index][edge_index].length == 0) {
    return 'full';
  }
  const [twin_face_index, twin_edge_index] = state.periodicInfo[face_index][edge_index];
  let twin_face_color = state.baseMesh.face_colors[twin_face_index];
  if (face_color == twin_face_color) {
    return 'full';
  }
  if (face_color == 0) {
    return 'hinge_start';
  }
  return 'hinge_end';
}

function get_avg_edge_length() {
  let sum = 0, count = 0;
  for (let i = 0; i < state.baseMesh.faces.length; i++) {
    let face = state.baseMesh.faces[i];
    for (let j = 0; j < face.length; j++) {
      let v0 = state.baseMesh.vertices[face[j]];
      let v1 = state.baseMesh.vertices[face[(j + 1) % face.length]];
      sum += Math.sqrt((v0.x - v1.x) * (v0.x - v1.x) + (v0.y - v1.y) * (v0.y - v1.y));
      count++;
    }
  }
  return sum / count;
}

// Helper for cubic Bezier
function getBezierPt(t, p0, cp1, cp2, p3) {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;

  // B(t) = (1-t)^3*P0 + 3(1-t)^2*t*CP1 + 3(1-t)*t^2*CP2 + t^3*P3
  const x = mt3 * p0.x + 3 * mt2 * t * cp1.x + 3 * mt * t2 * cp2.x + t3 * p3.x;
  const y = mt3 * p0.y + 3 * mt2 * t * cp1.y + 3 * mt * t2 * cp2.y + t3 * p3.y;
  const z = mt3 * (p0.z || 0) + 3 * mt2 * t * (cp1.z || 0) + 3 * mt * t2 * (cp2.z || 0) + t3 * (p3.z || 0);
  return { x, y, z };
}

export function exportToSVG(mesh, options = {}) {
  const {
    repX = 1,
    repY = 1,
    bbox = null,
    edgeStyles = [],
    edgeStyleMap = {},
    periodicInfo = null,
    averageEdgeSizeMm = 40,
    hingeSizeMm = 2,
    filename = "kirigami.svg"
  } = options;

  let svgContent = '';
  let globalVertexCount = 0; // 0-based for tracking, output is 1-based
  let globalVerts = [];
  let coveredEdges = [], coveredEdgesInds = [], boundaryEdges = [], edgesCuttingType = [], edgeOffsets = [];
  // Track the base mesh edges to determine the real boundary edges (when the
  // opening angle is greater than 0).
  let coveredBaseMeshEdges = [];
  let is_boundary_edge = (orig_v0, orig_v1) => {
    for (let i = 0; i < coveredBaseMeshEdges.length; i++) {
      let edge = coveredBaseMeshEdges[i];
      if (Math.hypot(edge[0].x - orig_v0.x, edge[0].y - orig_v0.y) < 1e-2 && Math.hypot(edge[1].x - orig_v1.x, edge[1].y - orig_v1.y) < 1e-2) {
        boundaryEdges[i] = false;
        return false;
      }
    }
    return true;
  };
  let alreadyCovered = (v0, v1) => {
    for (let i = 0; i < coveredEdges.length; i++) {
      let edge = coveredEdges[i];
      if (Math.hypot(edge[0].x - v0.x, edge[0].y - v0.y) < 1e-4 && Math.hypot(edge[1].x - v1.x, edge[1].y - v1.y) < 1e-4) {
        boundaryEdges[i] = false;
        return true;
      }
    }
    return false;
  };

  let avg_edge_length = get_avg_edge_length();
  // Scale to make the average edge length match the requested size in millimeters.
  let scale = averageEdgeSizeMm / avg_edge_length;
  // Leave the requested amount for the hinge.
  let hinge_len = hingeSizeMm;

  // Determine Repetition Range
  let minRx, maxRx, minRy, maxRy;
  let min_x = Infinity, min_y = Infinity, max_x = -Infinity, max_y = -Infinity;
  let updateBounds = (index) => {
    min_x = Math.min(min_x, globalVerts[index].x);
    min_y = Math.min(min_y, globalVerts[index].y);
    max_x = Math.max(max_x, globalVerts[index].x);
    max_y = Math.max(max_y, globalVerts[index].y);
  };
  let increase_global_vertex_count = () => {
    updateBounds(globalVertexCount);
    globalVertexCount++;
  };
  let checkBBox = false;

  if (bbox) {
    checkBBox = true;
    const { minX, maxX, minY, maxY } = bbox;
    const inv = invert2x2(state.baseMesh.periodicity);
    if (!inv) {
      // Fallback or error?
      minRx = 0; maxRx = 0; minRy = 0; maxRy = 0;
    } else {
      // Project bbox corners to repetition space
      const corners = [
        { x: minX, y: minY },
        { x: maxX, y: minY },
        { x: maxX, y: maxY },
        { x: minX, y: maxY }
      ];

      let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
      corners.forEach(p => {
        const u = p.x * inv[0][0] + p.y * inv[0][1];
        const v = p.x * inv[1][0] + p.y * inv[0][1];
        minU = Math.min(minU, u);
        maxU = Math.max(maxU, u);
        minV = Math.min(minV, v);
        maxV = Math.max(maxV, v);
      });

      // Add padding
      const pad = 1.5;
      minRx = Math.floor(minU - pad);
      maxRx = Math.ceil(maxU + pad);
      minRy = Math.floor(minV - pad);
      maxRy = Math.ceil(maxV + pad);
    }
  } else {
    minRx = 0; maxRx = repX - 1;
    minRy = 0; maxRy = repY - 1;
  }

  let add_edge = (index) => {
    let [v0, v1] = coveredEdges[index];
    let [idx1, idx2] = coveredEdgesInds[index];
    let cutting_type = edgesCuttingType[index];
    let [offsetX, offsetY] = edgeOffsets[index];
    if (boundaryEdges[index]) {
      cutting_type = "full";
    }

    const polyIndices = [];
    let elen = Math.sqrt((v1.x - v0.x) ** 2 + (v1.y - v0.y) ** 2);


    // Check for edge style
    const key = `${idx1}_${idx2}`;
    const { styleIdx, flip } = edgeStyleMap[key] || { styleIdx: undefined, flip: 0 };

    if (styleIdx !== undefined && edgeStyles[styleIdx]) {
      // Styled Edge
      let internalIndices = [];

      // Generate
      const style = edgeStyles[styleIdx];
      const points = style.points;

      const vv1 = mesh.vertices[idx1];
      const vv2 = mesh.vertices[idx2];

      let flip_x = (flip % 2 == 1);
      let flip_y = (Math.floor(flip / 2) == 1) ^ flip_x;

      let pMin = flip_x ? vv1 : vv2;
      let pMax = flip_x ? vv2 : vv1;

      const pStart = { x: pMin.x + offsetX, y: pMin.y + offsetY, z: pMin.z || 0 };
      const pEnd = { x: pMax.x + offsetX, y: pMax.y + offsetY, z: pMax.z || 0 };

      const dx = pEnd.x - pStart.x;
      const dy = pEnd.y - pStart.y;
      const dz = pEnd.z - pStart.z;
      const nx = -dy;
      const ny = dx;

      const mapPt = (pt) => ({
        x: pStart.x + pt.x * dx - (flip_y ? -1 : 1) * pt.y * nx,
        y: pStart.y + pt.x * dy - (flip_y ? -1 : 1) * pt.y * ny,
        z: pStart.z + pt.x * dz
      });

      const mapStruct = (pt) => {
        const res = mapPt(pt);
        if (pt.hIn) res.hIn = mapPt(pt.hIn);
        else res.hIn = { ...res };
        if (pt.hOut) res.hOut = mapPt(pt.hOut);
        else res.hOut = { ...res };
        return res;
      };

      const mappedPoints = points.map(mapStruct);
      const drawPts = flip_x ? mappedPoints : mappedPoints.slice().reverse();

      const generatedIndices = [];

      for (let k = 0; k < drawPts.length - 1; k++) {
        const pCurr = drawPts[k];
        const pNext = drawPts[k + 1];

        const cp1 = flip_x ? pCurr.hOut : pCurr.hIn;
        const cp2 = flip_x ? pNext.hIn : pNext.hOut;

        const steps = 10;
        const endStep = (k == drawPts.length - 2 ? steps + 1 : steps);
        for (let s = 0; s < endStep; s++) {
          const t = s / steps;
          const pt = getBezierPt(t, pCurr, cp1, cp2, pNext);
          if (cutting_type === "hinge_start" && Math.hypot(pt.x * scale - v0.x, pt.y * scale - v0.y) < hinge_len) {
            continue;
          }
          if (cutting_type === "hinge_end" && Math.hypot(pt.x * scale - v1.x, pt.y * scale - v1.y) < hinge_len) {
            continue;
          }
          globalVerts.push({ x: pt.x * scale, y: pt.y * scale });
          generatedIndices.push(globalVertexCount);
          increase_global_vertex_count();
        }
      }
      internalIndices = generatedIndices;


      // Add intermediate indices to polygon
      internalIndices.forEach(idx => polyIndices.push(idx));
    } else {

      if (cutting_type === "full") {
        // Push v0.
        globalVerts.push(v0);
        polyIndices.push(globalVertexCount);
        increase_global_vertex_count();

        // Push v1.
        globalVerts.push(v1);
        polyIndices.push(globalVertexCount);
        increase_global_vertex_count();
      } else if (cutting_type === "hinge_start") {
        // Shift origin.
        globalVerts.push({ x: v0.x + (v1.x - v0.x) * hinge_len / elen, y: v0.y + (v1.y - v0.y) * hinge_len / elen })
        polyIndices.push(globalVertexCount);
        increase_global_vertex_count();

        // Push v1.
        globalVerts.push(v1);
        polyIndices.push(globalVertexCount);
        increase_global_vertex_count();
      } else if (cutting_type === "hinge_end") {
        // Push v0.
        globalVerts.push(v0);
        polyIndices.push(globalVertexCount);
        increase_global_vertex_count();

        // Shift end.
        globalVerts.push({ x: v1.x - (v1.x - v0.x) * hinge_len / elen, y: v1.y - (v1.y - v0.y) * hinge_len / elen })
        polyIndices.push(globalVertexCount);
        increase_global_vertex_count();
      } else {
        console.log("Unknown cutting type");
      }
    }
    // Add to SVG
    svgContent += `<polyline points="${polyIndices.map(idx => `${globalVerts[idx].x},${globalVerts[idx].y}`).join(' ')}" stroke="red" stroke-width="0.01" fill="none" />`;
  };

  const baseMeshSplitVerts =
    state.baseMesh.faces.flatMap(f => f)
      .map(idx => state.baseMesh.vertices[idx]);
  // Generate Geometry
  for (let rx = minRx; rx <= maxRx; rx++) {
    for (let ry = minRy; ry <= maxRy; ry++) {
      const offX_vec = mesh.periodicity[0];
      const offY_vec = mesh.periodicity[1];
      const offsetX = offX_vec[0] * rx + offY_vec[0] * ry;
      const offsetY = offX_vec[1] * rx + offY_vec[1] * ry;
      const baseMeshOffX = state.baseMesh.periodicity[0].map(v => v * rx);
      const baseMeshOffY = state.baseMesh.periodicity[1].map(v => v * ry);

      const repStartVertex = globalVertexCount;

      const transformedVerts = checkBBox ? state.baseMesh.vertices.map(v => ({
        x: v.x + baseMeshOffX[0] + baseMeshOffY[0],
        y: v.y + baseMeshOffX[1] + baseMeshOffY[1]
      })) : null;

      let checkInside = (v) => {
        if (state.renderMode === 'bbox') {
          return v.x >= bbox.minX && v.x <= bbox.maxX && v.y >= bbox.minY && v.y <= bbox.maxY;
        } else {
          return Math.hypot(v.x - state.circleShiftX, v.y - state.circleShiftY) <= state.circleRadius;
        }
      };

      for (let i = 0; i < mesh.faces.length; i++) {
        const face = mesh.faces[i];

        if (checkBBox) {
          let allInside = true;
          for (const idx of state.baseMesh.faces[i]) {
            const v = transformedVerts[idx];
            if (!checkInside(v)) {
              allInside = false;
              break;
            }
          }
          if (!allInside) continue;
        }

        for (let j = 0; j < face.length; j++) {
          let cutting_type = getEdgeCuttingType(i, j);
          const idx1 = face[j];
          const idx2 = face[(j + 1) % face.length];

          let map_vertex = (v) => ({ x: (v.x + offsetX) * scale, y: (v.y + offsetY) * scale });
          let v0 = map_vertex(mesh.vertices[idx1]);
          let v1 = map_vertex(mesh.vertices[idx2]);
          let map_base_vertex = (v) => ({ x: (v.x + baseMeshOffX[0] + baseMeshOffY[0]), y: (v.y + baseMeshOffX[1] + baseMeshOffY[1]) });
          let orig_v0 = map_base_vertex(baseMeshSplitVerts[idx1]);
          let orig_v1 = map_base_vertex(baseMeshSplitVerts[idx2]);
          if (alreadyCovered(v1, v0)) {
            continue;
          }
          boundaryEdges.push(is_boundary_edge(orig_v1, orig_v0));
          coveredEdges.push([v0, v1]);
          coveredBaseMeshEdges.push([orig_v0, orig_v1]);
          coveredEdgesInds.push([idx1, idx2]);
          edgesCuttingType.push(cutting_type);
          edgeOffsets.push([offsetX, offsetY]);
        }
      }
    }
  }
  for (let i = 0; i < coveredEdges.length; i++) {
    add_edge(i);
  }

  let svgHeader = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${(max_x - min_x)}mm" height="${(max_y - min_y)}mm" viewBox="${min_x} ${min_y} ${max_x - min_x} ${max_y - min_y}">`;

  svgContent += `</svg>`;

  // Create blob and download
  const blob = new Blob([svgHeader + svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}