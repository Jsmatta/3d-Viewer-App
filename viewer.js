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
  console.log('Model loaded:', gltf);
  const model = gltf.scene;

  // Scale and position the model
  model.scale.set(0.01, 0.01, 0.01);
  model.position.set(0, 0, 0);

  model.traverse((child) => {
    if (child.isMesh) {
      console.log('Mesh:', child.name);
      const material = child.material;

      if (material.map) { //find texture map
        material.map.colorSpace = THREE.SRGBColorSpace;
        material.map.flipY = false;
        material.map.needsUpdate = true;
      }
      if (material.normalMap) { //find normal map
        material.normalMap.flipY = false;
        material.normalMap.needsUpdate = true;
      }
      if (material.aoMap) { //find ambient occlusion map
        material.aoMap.flipY = false;
        material.aoMap.needsUpdate = true;
      }
      if (material.roughnessMap) { //find roughness map
        material.roughnessMap.flipY = false;
        material.roughnessMap.needsUpdate = true;
      }
      if (material.metalnessMap) { //find metalness map
        material.metalnessMap.flipY = false;
        material.metalnessMap.needsUpdate = true;
      }
    }
  });

  scene.add(model); //load model the the scene
  animatedObject = model; // animate the model
});

// lighting added to the scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);


// // Add a basic cube
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
      animatedObject.rotation.y = time / 1000; // Rotate the loaded model across y-axis
    }
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
