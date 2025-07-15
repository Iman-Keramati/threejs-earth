import * as THREE from "three";
import { getFresnelMat } from "../getFresnelMat.js";
import getMoon from "./Moon.js";

const loader = new THREE.TextureLoader();
let orbitAngle = 0;
const orbitRadius = 4;

export default function getEarth() {
  const moonMesh = getMoon();

  const isMobile = window.innerWidth < 768;
  const detail = isMobile ? 5 : 12;
  const geometry = new THREE.IcosahedronGeometry(2, detail);

  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = (-23.4 * Math.PI) / 180;

  const material = new THREE.MeshPhongMaterial({
    map: loader.load("./textures/earth/00_earthmap1k.jpg"),
    specularMap: loader.load("./textures/earth/02_earthspec1k.jpg"),
    bumpMap: loader.load("./textures/earth/01_earthbump1k.jpg"),
    bumpScale: 0.04,
  });
  const earthMesh = new THREE.Mesh(geometry, material);
  earthMesh.receiveShadow = true;
  earthGroup.add(earthMesh);
  earthGroup.position.set(15, 0, 0);

  const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load("./textures/earth/03_earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
  });
  const lightsMesh = new THREE.Mesh(geometry, lightsMat);
  earthGroup.add(lightsMesh);

  const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load("./textures/earth/04_earthcloudmap.jpg"),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    alphaMap: loader.load("./textures/earth/05_earthcloudmaptrans.jpg"),
  });
  const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
  cloudsMesh.scale.setScalar(1.003);
  earthGroup.add(cloudsMesh);

  const fresnelMat = getFresnelMat();
  const glowMesh = new THREE.Mesh(geometry, fresnelMat);
  glowMesh.scale.setScalar(1.01);
  earthGroup.add(glowMesh);
  earthGroup.add(moonMesh);

  function animate() {
    requestAnimationFrame(animate);
    orbitAngle += 0.02;
    moonMesh.position.x = Math.cos(orbitAngle) * orbitRadius;
    moonMesh.position.z = Math.sin(orbitAngle) * orbitRadius;
  }

  animate();

  return {
    group: earthGroup,
    earthMesh,
    lightsMesh,
    cloudsMesh,
    glowMesh,
    moonMesh,
  };
}
