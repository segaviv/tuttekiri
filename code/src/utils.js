import { mesh_area } from "./kirigami_cpp_bridge";


export async function standardizeMesh(mesh) {
  let min_y = Number.MAX_VALUE, max_y = Number.MIN_VALUE;
  let min_x = Number.MAX_VALUE, max_x = Number.MIN_VALUE;
  let min_z = Number.MAX_VALUE, max_z = Number.MIN_VALUE;
  let centroid_x = 0, centroid_z = 0;
  for (let i = 0; i < mesh.vertices.length; i++) {
    const v = mesh.vertices[i];
    min_y = Math.min(min_y, v.y);
    min_x = Math.min(min_x, v.x);
    min_z = Math.min(min_z, v.z);
    max_y = Math.max(max_y, v.y);
    max_x = Math.max(max_x, v.x);
    max_z = Math.max(max_z, v.z);
    centroid_x += v.x;
    centroid_z += v.z;
  }
  centroid_x /= mesh.vertices.length;
  centroid_z /= mesh.vertices.length;

  for (let i = 0; i < mesh.vertices.length; i++) {
    const v = mesh.vertices[i];
    v.y -= min_y;
    v.x -= centroid_x;
    v.z -= centroid_z;
  }
  const scale = Math.max(max_x - min_x, max_y - min_y, max_z - min_z) / 10;
  // const area = await mesh_area(mesh);
  // const scale = Math.sqrt(area) / 10;
  for (let i = 0; i < mesh.vertices.length; i++) {
    const v = mesh.vertices[i];
    v.x /= scale;
    v.y /= scale;
    v.z /= scale;
  }
  for (let i = 0; i < mesh.uvs.length; i++) {
    const uv = mesh.uvs[i];
    uv.x /= scale;
    uv.y /= scale;
  }

  return mesh;
}

export function centerMesh(mesh) {
  let centroid_x = 0, centroid_y = 0, centroid_z = 0;
  for (let i = 0; i < mesh.vertices.length; i++) {
    const v = mesh.vertices[i];
    centroid_x += v.x;
    centroid_y += v.y;
    if (v.z !== undefined)
      centroid_z += v.z;
  }
  centroid_x /= mesh.vertices.length;
  centroid_y /= mesh.vertices.length;
  centroid_z /= mesh.vertices.length;
  for (let i = 0; i < mesh.vertices.length; i++) {
    const v = mesh.vertices[i];
    v.x -= centroid_x;
    v.y -= centroid_y;
    if (v.z !== undefined)
      v.z -= centroid_z;
  }
  return mesh;
}