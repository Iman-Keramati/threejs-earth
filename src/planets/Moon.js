import * as THREE from "three";

export default function getMoon() {
  const loader = new THREE.TextureLoader();
  const texture = loader.load("../../textures/moon/moon.jpg");
  const geo = new THREE.IcosahedronGeometry(0.75, 10);
  const moonSerface = new THREE.MeshBasicMaterial({ map: texture });

  const moonMesh = new THREE.Mesh(geo, moonSerface);
  moonMesh.position.set(5, 0, 0);
  return moonMesh;
}
