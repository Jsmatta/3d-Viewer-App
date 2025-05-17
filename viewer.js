import * as THREE from 'three';
import { GLTFLoader } from './libs/addons/loaders/GLTFLoader.js';
import * as BufferGeometryUtils from './libs/addons/utils/BufferGeometryUtils.js';

// viewer container
const container = document.getElementById('viewer');

//renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(
  70,
  container.clientWidth / container.clientHeight,
  0.01,
  10
);
camera.position.z = 2;

// Add a basic cube
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Animation loop
function animate(time) {
  mesh.rotation.x = time / 1000;
  mesh.rotation.y = time / 1000;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();