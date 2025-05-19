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
camera.position.z = 5; //adjust based on the model size

// GLTFLoader loading the model
const loader = new GLTFLoader().setPath('./public/apollo11/');
let animatedObject = null; // Reference to the object to animate

loader.load('apollo_exterior-150k-4096.gltf', (gltf) => {
  const model = gltf.scene;

  // Extract geometries from the model
  const geometries = [];
  model.traverse((child) => {
    if (child.isMesh) {
      geometries.push(child.geometry);
    }
  });

  // Merge geometries using BufferGeometryUtils
  const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, map: null }); // Placeholder for textures
  const mergedMesh = new THREE.Mesh(mergedGeometry, material);

  // Apply rotation and position adjustments
  mergedMesh.rotation.x = THREE.MathUtils.degToRad(90); // Rotate 90 degrees around the X-axis
  mergedMesh.position.set(0, -2, 0); // Adjust position if needed
  mergedMesh.scale.set(0.01, 0.01, 0.01); // Adjust scale for visibility

  // Add the merged mesh to the scene
  scene.add(mergedMesh);

  // Set the animated object to the loaded model
  animatedObject = mergedMesh;
});


// Add a basic cube
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
// const material = new THREE.MeshNormalMaterial();
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// animation initial variables
let isAnimating = true;
let animationId = null;

//animation loop updated for the new model
function animate(time) {
  if (isAnimating) {
    if (animatedObject) {
      animatedObject.rotation.z = time / 1000; // Rotate the loaded model
    }
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
  controls.dollyOut(1.1); // Zoom in by a factor
  controls.update();
});

document.getElementById('zoom-out').addEventListener('click', () => {
  controls.dollyIn(1.1); // Zoom out by a factor
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
controls.maxPolarAngle = Math.PI;
controls.minDistance = 0.1;
controls.maxDistance = 10;
controls.target.set(0, 0, 0);
controls.update();
