import * as THREE from "three";

export default function getSunGlow(radius = 3.2) {
  const glowMat = new THREE.ShaderMaterial({
    uniforms: {
      c: { value: 0.4 },
      p: { value: 3.2 },
      glowColor: { value: new THREE.Color(0xffaa00) },
      viewVector: { value: new THREE.Vector3(0, 0, 0) },
    },
    vertexShader: `
      uniform vec3 viewVector;
      uniform float c;
      uniform float p;
      varying float intensity;
      void main() {
        vec3 vNormal = normalize(normalMatrix * normal);
        vec3 vNormView = normalize(normalMatrix * viewVector);
        intensity = pow(c - dot(vNormal, vNormView), p);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying float intensity;
      void main() {
        gl_FragColor = vec4(glowColor * intensity, intensity);
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });

  const glowGeo = new THREE.IcosahedronGeometry(5.25, 10);
  return new THREE.Mesh(glowGeo, glowMat);
}
