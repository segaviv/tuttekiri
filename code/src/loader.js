export function mergeCloseVertices(mesh) {
  const tolerance = 1e-3;
  const newVertices = [];
  const vertexMap = new Map(); // key -> newIndex
  const oldToNewIndex = new Array(mesh.vertices.length);

  for (let i = 0; i < mesh.vertices.length; i++) {
    const v = mesh.vertices[i];
    // Quantize keys for spatial hashing
    const x = Math.round(v.x / tolerance);
    const y = Math.round(v.y / tolerance);
    const z = v.z ? Math.round(v.z / tolerance) : 0;
    const key = `${x},${y},${z}`;

    if (vertexMap.has(key)) {
      oldToNewIndex[i] = vertexMap.get(key);
    } else {
      const newIndex = newVertices.length;
      vertexMap.set(key, newIndex);
      oldToNewIndex[i] = newIndex;
      newVertices.push(v);
    }
  }

  // Update faces
  for (const face of mesh.faces) {
    for (let i = 0; i < face.length; i++) {
      face[i] = oldToNewIndex[face[i]];
    }
  }

  mesh.vertices = newVertices;
  return mesh;
}

export function parseMTL(text) {
  const lines = text.split('\n');
  const materials = {};
  let current_material = null;

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('#') || line === '') continue;

    const parts = line.split(/\s+/);
    const type = parts[0];

    if (type === 'newmtl') {
      current_material = parts[1];
      materials[current_material] = {};
    } else if (type === 'Kd') {
      materials[current_material] = parts.slice(1).map(part => parseFloat(part) * 255);
    }
  }

  return materials;
}

export function parseOBJ(text) {
  const lines = text.split('\n');
  const vertices = [];
  const uvs = [];
  const uv_faces = [];
  const faces = [];
  const face_colors = [];
  const mtl_face_color_names = [];
  let current_mtl_name = "";

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('#') || line === '') continue;

    const parts = line.split(/\s+/);
    const type = parts[0];

    if (type === 'v') {
      // v x y z (we ignore z or flatten it)
      vertices.push({
        x: parseFloat(parts[1]),
        y: parseFloat(parts[2]),
        z: parts.length > 3 ? parseFloat(parts[3]) : 0
      });
    } else if (type === 'vt') {
      // vt u v
      uvs.push({
        x: parseFloat(parts[1]),
        y: parseFloat(parts[2])
      });
    } else if (type === 'f') {
      // f v1/vt1/vn1 v2/vt2/vn2 v3/vt3/vn3 ... (1-indexed indices)
      // handling 'v/vt/vn' format by taking the first part
      const faceIndices = parts.slice(1).map(part => {
        const indexStr = part.split('/')[0];
        return parseInt(indexStr, 10) - 1; // Convert to 0-indexed
      });
      faces.push(faceIndices);
      uv_faces.push(parts.slice(1).map(part => {
        const indexStr = part.split('/')[1];
        return parseInt(indexStr, 10) - 1; // Convert to 0-indexed
      }));
      mtl_face_color_names.push(current_mtl_name);
    } else if (type === 'fc') {
      // fc r g b
      const color = parts.slice(1).map(part => parseInt(part));
      face_colors.push(color);
    } else if (type === 'usemtl') {
      current_mtl_name = parts[1];
    }
  }

  return { vertices, faces, face_colors, mtl_face_color_names, uvs, uv_faces };
}

export function parseUKP(text) {
  const lines = text.split('\n');
  const vertices = [];
  const faces = [];
  const face_colors = [];
  let px = [];
  let py = [];
  let repX = 1;
  let repY = 1;

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('#') || line === '') continue;

    const parts = line.split(/\s+/);
    const type = parts[0];

    if (type === 'v') {
      // v x y z (we ignore z or flatten it)
      vertices.push({
        x: parseFloat(parts[1]),
        y: parseFloat(parts[2]),
      });
    } else if (type === 'f') {
      // f v1 v2 v3 ... (1-indexed indices)
      // handling 'v/vt/vn' format by taking the first part
      const faceIndices = parts.slice(1).map(part => {
        const indexStr = part.split('/')[0];
        return parseInt(indexStr, 10) - 1; // Convert to 0-indexed
      });
      faces.push(faceIndices);
    } else if (type === 'fc') {
      // fc r g b
      const color = parseInt(parts[1]);
      face_colors.push(color);
    } else if (type === 'px') {
      // px x y
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      px = [x, y];
    } else if (type === 'py') {
      // py x y
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      py = [x, y];
    } else if (type === 'rep2x2') {
      // rep2x2
      repX = 2;
      repY = 2;
    }
  }

  console.info("face colors", face_colors);
  let mesh = { vertices, faces, face_colors, periodicity: [px, py], repX, repY };
  mesh = mergeCloseVertices(mesh);
  return mesh;
}

export function normalizeMesh(mesh) {
  // Center mesh at origin
  if (mesh.vertices.length === 0) return;

  // Calculate Bounds
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  let meanX = 0, meanY = 0;

  mesh.vertices.forEach(v => {
    if (v.x < minX) minX = v.x;
    if (v.y < minY) minY = v.y;
    if (v.x > maxX) maxX = v.x;
    if (v.y > maxY) maxY = v.y;
    meanX += v.x;
    meanY += v.y;
  });

  const uniqueWidth = maxX - minX;
  const uniqueHeight = maxY - minY;

  meanX /= mesh.vertices.length;
  meanY /= mesh.vertices.length;

  // Reposition vertices to center
  mesh.vertices.forEach(v => {
    v.x -= meanX;
    v.y -= meanY;
  });

  // Scale to reasonable size (e.g., max dimension 5.0)
  const maxDim = Math.max(uniqueWidth, uniqueHeight);
  if (maxDim > 0) {
    const targetSize = 5.0;
    const scale = targetSize / maxDim;

    mesh.vertices.forEach(v => {
      v.x *= scale;
      v.y *= scale;
      if (v.z !== undefined) v.z *= scale;
    });

    if (mesh.periodicity) {
      if (Array.isArray(mesh.periodicity[0])) {
        mesh.periodicity[0][0] *= scale;
        mesh.periodicity[0][1] *= scale;
      }
      if (Array.isArray(mesh.periodicity[1])) {
        mesh.periodicity[1][0] *= scale;
        mesh.periodicity[1][1] *= scale;
      }
    }

    mesh.width = uniqueWidth * scale;
    mesh.height = uniqueHeight * scale;
    return { width: mesh.width, height: mesh.height };
  }

  // Return bounds for auto-zoom (unscaled fallback)
  mesh.width = uniqueWidth;
  mesh.height = uniqueHeight;
  return { width: uniqueWidth, height: uniqueHeight };
}

import { CONFIG } from './constants.js';
import { state } from './state.js';

// Helper to parse rgba(r, g, b, a) or #hex to [r,g,b] 0-1
function parseColor(colorStr) {
  if (colorStr.startsWith('#')) {
    // Hex
    let c = colorStr.substring(1).split('');
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    const bigint = parseInt(c.join(''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r / 255, g / 255, b / 255];
  } else if (colorStr.startsWith('rgba')) {
    const match = colorStr.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return [parseInt(match[1]) / 255, parseInt(match[2]) / 255, parseInt(match[3]) / 255];
    }
  }
  return [0.8, 0.8, 0.8]; // Default grey
}

// Helper for 2x2 matrix inverse
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

export function exportToOBJAndDownload(mesh, name) {
  const { obj, mtl } = exportToOBJ(mesh, { mtlFileName: `${name}.mtl` });

  // Download OBJ
  const blobObj = new Blob([obj], { type: 'text/plain' });
  const urlObj = URL.createObjectURL(blobObj);
  const aObj = document.createElement('a');
  aObj.href = urlObj;
  aObj.download = `${name}.obj`;
  document.body.appendChild(aObj);
  aObj.click();
  document.body.removeChild(aObj);
  URL.revokeObjectURL(urlObj);

  // Download MTL
  const blobMtl = new Blob([mtl], { type: 'text/plain' });
  const urlMtl = URL.createObjectURL(blobMtl);
  const aMtl = document.createElement('a');
  aMtl.href = urlMtl;
  aMtl.download = `${name}.mtl`;
  document.body.appendChild(aMtl);
  aMtl.click();
  document.body.removeChild(aMtl);
  URL.revokeObjectURL(urlMtl);
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

export function exportToOBJ(mesh, options = {}) {
  const {
    repX = 1,
    repY = 1,
    bbox = null,
    mtlFileName = 'tessellation_export.mtl',
    edgeStyles = [],
    edgeStyleMap = {},
    periodicInfo = null
  } = options;

  let objOutput = `# Exported from Plane Tessellations\n`;
  objOutput += `mtllib ${mtlFileName}\n`;

  let mtlOutput = '# Materials for Plane Tessellations\n';

  if (state.mtlInterpolation < 1.0 || !state.baseMesh.mtl_face_color_names) {
    // Helper to flow color line
    const writeMtl = (name, colorHex) => {
      const c = parseColor(colorHex);
      return `newmtl ${name}\nKd ${c[0].toFixed(3)} ${c[1].toFixed(3)} ${c[2].toFixed(3)}\n\n`;
    };

    // Normal Colors
    mtlOutput += writeMtl('Mat0', '#BDE0FE');
    mtlOutput += writeMtl('Mat1', '#FFC2D1');
    mtlOutput += writeMtl('Mat2', CONFIG.faceColor2);
    mtlOutput += writeMtl('MatDefault', CONFIG.fillColor);

    // Unit Colors
    mtlOutput += writeMtl('MatUnit0', '#7BB6FF');
    mtlOutput += writeMtl('MatUnit1', '#FF84B4');
    mtlOutput += writeMtl('MatUnit2', CONFIG.unitFaceColor2);
  } else {
    // Write the materials from state.color_map.
    Object.entries(state.color_map).forEach(([key, value]) => {
      mtlOutput += `newmtl ${key}\nKd ${value[0] / 255} ${value[1] / 255} ${value[2] / 255}\n\n`;
    });
  }

  let globalVertexCount = 0; // 0-based for tracking, output is 1-based
  let lastMat = null;

  const getMatName = (idx, isUnit) => {
    if (state.mtlInterpolation < 1.0 || !state.baseMesh.mtl_face_color_names) {
      if (!mesh.face_colors) return 'MatDefault';
      const c = mesh.face_colors[idx];
      const prefix = isUnit ? 'MatUnit' : 'Mat';
      if (c === 0) return `${prefix}0`;
      if (c === 1) return `${prefix}1`;
      if (c === 2) return `${prefix}2`;
      return 'MatDefault';
    } else {
      return state.baseMesh.mtl_face_color_names[idx];
    }
  };

  // Determine Repetition Range
  let minRx, maxRx, minRy, maxRy;
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

      // Add vertices for this repetition (base mesh vertices)
      for (const v of mesh.vertices) {
        const z = v.z || 0;
        objOutput += `v ${(v.x + offsetX).toFixed(6)} ${(v.y + offsetY).toFixed(6)} ${(z).toFixed(6)}\n`;
      }
      globalVertexCount += mesh.vertices.length;

      const isUnit = (rx === 0 && ry === 0);
      const transformedVerts = checkBBox ? state.baseMesh.vertices.map(v => ({
        x: v.x + baseMeshOffX[0] + baseMeshOffY[0],
        y: v.y + baseMeshOffX[1] + baseMeshOffY[1]
      })) : null;

      // Cache for shared curved edges to ensure watertight mesh
      // Key: "minIdx_maxIdx", Value: { indices: [], src: int, dst: int }
      const edgeCache = {};

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

        const mat = getMatName(i, isUnit);
        if (mat !== lastMat) {
          objOutput += `usemtl ${mat}\n`;
          lastMat = mat;
        }

        const polyIndices = [];

        for (let j = 0; j < face.length; j++) {
          const idx1 = face[j];
          const idx2 = face[(j + 1) % face.length];

          // Add current vertex
          polyIndices.push(idx1 + 1 + repStartVertex);

          // Check for edge style
          if (periodicInfo && edgeStyleMap) {
            const key = `${idx1}_${idx2}`;
            const { styleIdx, flip } = edgeStyleMap[key] || { styleIdx: undefined, flip: 0 };

            if (styleIdx !== undefined && edgeStyles[styleIdx]) {
              // Styled Edge
              let internalIndices = [];

              if (edgeCache[key]) {
                // Already generated
                const cached = edgeCache[key];
                if (idx1 === cached.src) {
                  internalIndices = cached.indices;
                } else {
                  // Reverse
                  internalIndices = [...cached.indices].reverse();
                }
              } else {
                // Generate
                const style = edgeStyles[styleIdx];
                const points = style.points;

                const v1 = mesh.vertices[idx1];
                const v2 = mesh.vertices[idx2];

                let flip_x = (flip % 2 == 1);
                let flip_y = (Math.floor(flip / 2) == 1) ^ flip_x;

                let pMin = flip_x ? v1 : v2;
                let pMax = flip_x ? v2 : v1;

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
                  for (let s = 1; s < steps; s++) {
                    const t = s / steps;
                    const pt = getBezierPt(t, pCurr, cp1, cp2, pNext);
                    objOutput += `v ${pt.x.toFixed(6)} ${pt.y.toFixed(6)} ${pt.z.toFixed(6)}\n`;
                    globalVertexCount++;
                    generatedIndices.push(globalVertexCount);
                  }

                  if (k < drawPts.length - 2) {
                    // Intermediate control point (node)
                    objOutput += `v ${pNext.x.toFixed(6)} ${pNext.y.toFixed(6)} ${pNext.z.toFixed(6)}\n`;
                    globalVertexCount++;
                    generatedIndices.push(globalVertexCount);
                  }
                }

                // Save to cache. src=idx1 (start of this specific traversal that generated it)
                edgeCache[key] = { indices: generatedIndices, src: idx1, dst: idx2 };
                internalIndices = generatedIndices;
              }

              // Add intermediate indices to polygon
              internalIndices.forEach(idx => polyIndices.push(idx));
            }
          }
        }

        // Write Face
        objOutput += `f ${polyIndices.join(' ')}\n`;
      }
    }
  }

  return { obj: objOutput, mtl: mtlOutput };
}

export function exportToUKP(mesh) {
  let output = '';

  // Vertices
  for (const v of mesh.vertices) {
    // Flatten Z if present, usually 2D here
    output += `v ${v.x} ${v.y}\n`;
  }

  // Faces
  for (const face of mesh.faces) {
    // 1-indexed for OBJ/UKP
    const faceIndices = face.map(idx => idx + 1).join(' ');
    output += `f ${faceIndices}\n`;
  }

  // Periodicity
  if (mesh.periodicity && mesh.periodicity.length === 2) {
    output += `px ${mesh.periodicity[0][0]} ${mesh.periodicity[0][1]}\n`;
    output += `py ${mesh.periodicity[1][0]} ${mesh.periodicity[1][1]}\n`;
  }

  if (mesh.face_colors && mesh.face_colors.length === mesh.faces.length) {
    for (let i = 0; i < mesh.face_colors.length; i++) {
      const color = mesh.face_colors[i];
      output += `fc ${color}\n`;
    }
  }

  return output;
}
