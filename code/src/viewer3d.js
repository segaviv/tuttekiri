import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { WireframeGeometry2 } from 'three/examples/jsm/lines/WireframeGeometry2.js';
import { Wireframe } from 'three/examples/jsm/lines/Wireframe.js';
import { CONFIG } from './constants.js';

export class Viewer3D {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x333333);

    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, 10);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(10, 20, 10);
    this.scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.set(-10, -10, -5);
    this.scene.add(dirLight2);

    // Helpers
    // const axesHelper = new THREE.AxesHelper(5);
    // this.scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(20, 20);
    this.scene.add(gridHelper);

    this.currentMesh = null;
    this.currentWireframe = null;

    this.animate = this.animate.bind(this);
    this.onResize = this.onResize.bind(this);

    window.addEventListener('resize', this.onResize);
    this.animate();
  }

  updateMesh(meshData) {
    if (this.currentMesh) {
      this.scene.remove(this.currentMesh);
      this.currentMesh.geometry.dispose();
      this.currentMesh.material.dispose();
      this.currentMesh = null;
    }
    if (this.currentWireframe) {
      this.scene.remove(this.currentWireframe);
      this.currentWireframe.geometry.dispose();
      this.currentWireframe.material.dispose();
      this.currentWireframe = null;
    }

    if (!meshData || !meshData.vertices || !meshData.faces) return;

    const vertices = [];
    // Convert array of objects {x,y,z} to float array [x,y,z, x,y,z, ...]
    for (const v of meshData.vertices) {
      vertices.push(v.x, v.y || 0, v.z || 0); // Handle 2D gracefully
    }

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    // Helper to hex string to rgb
    const hexToRgb = (hex) => {
      const c = new THREE.Color(hex);
      return [c.r, c.g, c.b];
    }

    const color0 = hexToRgb(CONFIG.faceColor0);
    const color1 = hexToRgb(CONFIG.faceColor1);
    const color2 = hexToRgb(CONFIG.faceColor2); // Optional third color if we had it mapped
    const defaultColor = hexToRgb('#44aa88');

    const hasFaceColors = meshData.face_colors && meshData.face_colors.length === meshData.faces.length;

    for (let fIdx = 0; fIdx < meshData.faces.length; fIdx++) {
      const face = meshData.faces[fIdx];
      if (face.length < 3) continue;

      // Determine face color
      let faceRGB = defaultColor;
      if (hasFaceColors) {
        const cType = meshData.face_colors[fIdx];
        if (cType === 0) faceRGB = color0;
        else if (cType === 1) faceRGB = color1;
        else if (cType === 2) faceRGB = color2;
      }

      // Triangulate face (fan)
      const v0 = meshData.vertices[face[0]];
      for (let i = 1; i < face.length - 1; i++) {
        const v1 = meshData.vertices[face[i]];
        const v2 = meshData.vertices[face[i + 1]];

        // Push vertices
        positions.push(v0.x, v0.y || 0, v0.z || 0);
        positions.push(v1.x, v1.y || 0, v1.z || 0);
        positions.push(v2.x, v2.y || 0, v2.z || 0);

        // Push colors
        colors.push(...faceRGB);
        colors.push(...faceRGB);
        colors.push(...faceRGB);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Use white so vertex colors show through
      vertexColors: true,
      roughness: 0.7,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    this.currentMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.currentMesh);

    // Wireframe - Custom implementation for Polygonal Edges
    // Instead of using THREE.WireframeGeometry which uses the triangulated structure,
    // we build line segments manually from the original faces.
    const lineVertices = [];
    for (const face of meshData.faces) {
      if (face.length < 2) continue;
      for (let i = 0; i < face.length; i++) {
        const idx1 = face[i];
        const idx2 = face[(i + 1) % face.length];

        const v1 = meshData.vertices[idx1];
        const v2 = meshData.vertices[idx2];

        lineVertices.push(v1.x, v1.y || 0, v1.z || 0);
        lineVertices.push(v2.x, v2.y || 0, v2.z || 0);
      }
    }

    // this.currentWireframe = new THREE.LineSegments(lineGeo, lineMat);
    const lineGeo = new WireframeGeometry2(geometry);
    lineGeo.setPositions(lineVertices);
    const lineMat = new LineMaterial({
      color: 0x100000,
      linewidth: 0.003,
      transparent: true,
      opacity: 0.5,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });
    this.currentWireframe = new Wireframe(lineGeo, lineMat);
    this.currentMesh.add(this.currentWireframe);

    geometry.computeBoundingSphere();
    const center = geometry.boundingSphere.center;
    const radius = geometry.boundingSphere.radius;
  }

  onResize() {
    if (!this.container) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    if (this.currentMesh) {
      this.currentMesh.geometry.dispose();
      this.currentMesh.material.dispose();
    }
  }
}
