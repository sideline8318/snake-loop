import * as THREE from 'three';
import { GEM_COLORS, GEM_IDS, GAME } from './config.js';

export function buildScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x05070f, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x05070f, 15, 30);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 8.4, 7.6);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xbcd0ff, 0.85));

  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(5, 10, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -6;
  key.shadow.camera.right = 6;
  key.shadow.camera.top = 6;
  key.shadow.camera.bottom = -6;
  scene.add(key);

  const rim = new THREE.PointLight(0x7c8cff, 80, 30);
  rim.position.set(-6, 6, -4);
  scene.add(rim);

  const glow = new THREE.PointLight(0xff7ac0, 60, 26);
  glow.position.set(6, 4, -6);
  scene.add(glow);

  const boardGroup = new THREE.Group();
  scene.add(boardGroup);

  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshBasicMaterial({ color: 0x05070f })
  );
  backdrop.position.y = -0.6;
  backdrop.rotation.x = -Math.PI / 2;
  scene.add(backdrop);

  return { renderer, scene, camera, boardGroup };
}

export function tileToWorld(row, col, size = GAME.BOARD_SIZE) {
  const offset = (size - 1) / 2;
  return new THREE.Vector3(col - offset, 0, row - offset);
}

export function createGemMesh(kind, size = 1) {
  const color = GEM_COLORS[GEM_IDS[kind]] ?? 0xffffff;
  const geometry = new THREE.BoxGeometry(size * 0.86, size * 0.86, size * 0.86);
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.28,
    metalness: 0.15,
    emissive: new THREE.Color(color).multiplyScalar(0.18),
    emissiveIntensity: 1,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.kind = kind;
  return mesh;
}

export function createParticles() {
  const count = 60;
  const positions = new Float32Array(count * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.16,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  points.visible = false;
  return { points, count, positions };
}
