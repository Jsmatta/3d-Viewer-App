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

// GLTFLoader
const loader = new GLTFLoader().setPath('./public/apollo11/textures/');
// Load the GLTF model
loader.load('apollo_exterior-150k-4096.gltf',
  (gltf) => {
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    scene.add(model);
  
  }
)


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

// lights added
const light = new THREE.AmbientLight(0xffffff, 1); // Ambient light
scene.add(light);

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

document.getElementById('zoom-in').addEventListener('click', () => {
  controls.dollyOut(1.1);
  controls.update();
});

document.getElementById('zoom-out').addEventListener('click', () => {
  controls.dollyIn(1.1);
  controls.update();
});

document.getElementById('reset').addEventListener('click', () => {
  controls.reset();
  controls.update();
});

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 0.5;
controls.maxDistance = 5;
controls.target.set(0, 0, 0);
controls.update();
