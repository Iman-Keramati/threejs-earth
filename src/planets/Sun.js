import * as THREE from "three";
import getSunGlow from "../getSunGlow.js";

export default function getSun() {
  const loader = new THREE.TextureLoader();
  const texture = loader.load("./textures/sun/sunmap.jpg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const sunMat = new THREE.MeshBasicMaterial({ map: texture });
  const isMobile = window.innerWidth < 768;
  const detail = isMobile ? 4 : 10;

  const sunGeo = new THREE.IcosahedronGeometry(3, detail);

  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.position.set(0, 0, 0);

  const sunGroup = new THREE.Group();
  sunGroup.add(sunMesh);

  const glow = getSunGlow();
  glow.position.copy(sunMesh.position);
  sunGroup.add(glow);

  return { sunGroup, texture, glow };
}
