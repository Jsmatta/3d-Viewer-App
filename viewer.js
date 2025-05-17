import * as THREE from 'three';
import { GLTFLoader } from './libs/addons/loaders/GLTFLoader.js';
import * as BufferGeometryUtils from './libs/addons/utils/BufferGeometryUtils.js';
import { OrbitControls } from './libs/addons/controls/OrbitControls.js';


// viewer container
const container = document.getElementById('viewer');

//renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222); // dark gray

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

// animation initial variables
let isAnimating = true;
let animationId = null;

//animation loop
function animate(time) {
  if (isAnimating == true) {
    mesh.rotation.x = time / 1000;
    mesh.rotation.y = time / 1000;
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  }
}

// Start animation initially
animate();

// Animation toggle button
const animateBtn = document.getElementById('animate');
animateBtn.addEventListener('click', () => {
  isAnimating = !isAnimating;
  if (isAnimating == true) {
    animateBtn.textContent = 'Pause Animation';
    animate();
  } else {
    animateBtn.textContent = 'Play Animation';
    cancelAnimationFrame(animationId);
  }
});

// Set initial button text
animateBtn.textContent = 'Pause Animation';

// zoom in and out
document.getElementById('zoom-in').addEventListener('click', () => {
  camera.position.z -= 0.1;
}
);
document.getElementById('zoom-out').addEventListener('click', () => {
  camera.position.z += 0.1;
}
);
// reset zoom
document.getElementById('reset').addEventListener('click', () => {
  camera.position.z = 2;
}
);

// Orbit controls