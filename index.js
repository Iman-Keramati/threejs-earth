import * as THREE from "three";
import getEarth from "./src/planets/Earth.js";
import getSun from "./src/planets/Sun.js";
import getStarfield from "./src/getStarfield.js";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import ToolbarManager from "./src/helper/toolbarManager.js";
import getMoon from "./src/planets/Moon.js";

const h = window.innerHeight;
const w = window.innerWidth;
let orbitAngle = 0;
const orbitRadius = 10;

//Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
// Camera
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 20;

// Scene
const scene = new THREE.Scene();

// Earth
const { group: earthGroup, earthMesh } = getEarth();
scene.add(earthGroup);

// Sun
const { sunGroup, glow } = getSun();
scene.add(sunGroup);

// Moon
const moonMesh = getMoon();

// Stars
const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

// Light (still same)
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-100, 10, 2);
scene.add(sunLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Toolbar
const toolbar = new ToolbarManager(camera, renderer.domElement);

toolbar._showToolbar("Solar System");
toolbar.registerObject(
  sunGroup.children[0],
  "☀️ The Sun: Center of the solar system."
);
toolbar.registerObject(earthMesh, "🌍 Earth: Our home planet.");
toolbar.registerObject(moonMesh, "🌑 The Moon: Earth's satellite.");

function animate() {
  requestAnimationFrame(animate);
  stars.rotation.y -= 0.0002;

  // Rotate Earth on its axis
  earthGroup.rotation.y += 0.01;

  // Animate Earth orbiting around the Sun
  orbitAngle += 0.005;
  earthGroup.position.x = Math.cos(orbitAngle) * orbitRadius;
  earthGroup.position.z = Math.sin(orbitAngle) * orbitRadius;

  // Sun light animation
  sunGroup.position.set(0, 0, 0);
  sunLight.position.copy(sunGroup.position);
  sunLight.target.position.copy(earthGroup.position);
  scene.add(sunLight.target);

  glow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(
    camera.position,
    glow.position
  );

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});
