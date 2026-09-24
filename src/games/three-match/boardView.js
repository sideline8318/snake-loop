import * as THREE from 'three';
import { GAME, GEM_COLORS, GEM_IDS } from './config.js';
import { tileToWorld, createGemMesh } from './scene3d.js';

const TILE = 1;

export class BoardView {
  constructor({ scene, boardGroup, size = GAME.BOARD_SIZE }) {
    this.scene = scene;
    this.boardGroup = boardGroup;
    this.size = size;
    this.gems = new Map();
    this.effects = [];
    this.particles = [];
    this.time = 0;
    this.buildFrame();
  }

  key(row, col) {
    return `${row}:${col}`;
  }

  buildFrame() {
    const half = (this.size - 1) / 2;
    const pad = 0.62;
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(this.size + pad, 0.35, this.size + pad),
      new THREE.MeshStandardMaterial({ color: 0x121a33, roughness: 0.7, metalness: 0.35 })
    );
    frame.position.y = -0.26;
    frame.receiveShadow = true;
    this.boardGroup.add(frame);

    const grid = new THREE.GridHelper(this.size, this.size, 0x3d4a7a, 0x232c4d);
    grid.position.y = -0.07;
    this.boardGroup.add(grid);

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const light = (row + col) % 2 === 0 ? 0x1a2244 : 0x151c38;
        const cell = new THREE.Mesh(
          new THREE.BoxGeometry(TILE * 0.96, 0.08, TILE * 0.96),
          new THREE.MeshStandardMaterial({ color: light, roughness: 0.6, metalness: 0.2 })
        );
        cell.position.copy(tileToWorld(row, col, this.size));
        cell.position.y = -0.06;
        cell.receiveShadow = true;
        this.boardGroup.add(cell);
      }
    }
    this.half = half;
  }

  entityAt(row, col) {
    return this.gems.get(this.key(row, col)) || null;
  }

  addGem(row, col, kind, spawnOffset = 0) {
    const mesh = createGemMesh(kind);
    const target = tileToWorld(row, col, this.size);
    mesh.position.copy(target);
    if (spawnOffset > 0) {
      mesh.position.y = spawnOffset * 1.4 + 1;
      mesh.scale.setScalar(0.85);
    }
    this.boardGroup.add(mesh);
    const entity = {
      mesh,
      kind,
      row,
      col,
      target: target.clone(),
      from: tileToWorld(row, col, this.size).clone(),
      progress: spawnOffset > 0 ? 0 : 1,
      speed: 4.4,
      spawn: spawnOffset > 0,
    };
    this.gems.set(this.key(row, col), entity);
    return entity;
  }

  syncFromBoard(board) {
    for (const [, entity] of this.gems) {
      this.boardGroup.remove(entity.mesh);
      disposeMesh(entity.mesh);
    }
    this.gems.clear();
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] !== null) this.addGem(row, col, board[row][col]);
      }
    }
    this.settle();
  }

  settle() {
    for (const [, entity] of this.gems) {
      entity.mesh.position.copy(entity.target);
      entity.mesh.rotation.set(0, 0, 0);
      entity.progress = 1;
      entity.spawn = false;
    }
    this.clearEffects();
  }

  applyEvents(events) {
    for (const event of events) {
      if (event.type === 'clear') {
        for (const cell of event.cells) this.popGem(cell.row, cell.col, cell.kind);
      } else if (event.type === 'fall') {
        for (const fall of event.falls) this.moveGem(fall.from, fall.to);
        for (const spawn of event.spawns) this.addGem(spawn.row, spawn.col, null, spawn.offset);
      }
    }
  }

  popGem(row, col, kind) {
    const entity = this.gems.get(this.key(row, col));
    if (!entity) return;
    this.spawnBurst(entity.mesh.position, kind);
    this.effects.push({ entity, life: 0, duration: 0.32, kind: 'pop' });
    this.gems.delete(this.key(row, col));
  }

  moveGem(from, to) {
    const entity = this.gems.get(this.key(from.row, from.col));
    if (!entity) return;
    this.gems.delete(this.key(from.row, from.col));
    entity.from.copy(entity.mesh.position);
    entity.target = tileToWorld(to.row, to.col, this.size);
    entity.row = to.row;
    entity.col = to.col;
    entity.progress = 0;
    entity.speed = 4.4;
    this.gems.set(this.key(to.row, to.col), entity);
  }

  spawnBurst(position, kind) {
    const color = GEM_COLORS[GEM_IDS[kind]] ?? 0xffffff;
    const count = 8;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocity = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;
      velocity.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          Math.random() * 3 + 1.2,
          (Math.random() - 0.5) * 4
        )
      );
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color,
      size: 0.2,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    this.boardGroup.add(points);
    this.particles.push({ points, velocity, life: 0, duration: 0.7 });
  }

  update(dt) {
    this.time += dt;
    for (const [, entity] of [...this.gems]) {
      if (entity.progress < 1) {
        entity.progress = Math.min(1, entity.progress + dt * entity.speed);
        const t = easeOutCubic(entity.progress);
        entity.mesh.position.lerpVectors(entity.from, entity.target, t);
        if (entity.spawn) {
          entity.mesh.position.y = Math.max(entity.target.y, entity.mesh.position.y);
          entity.mesh.scale.setScalar(0.85 + 0.15 * t);
        }
        if (entity.progress >= 1) {
          entity.mesh.position.copy(entity.target);
          entity.mesh.scale.setScalar(1);
          entity.spawn = false;
        }
      }
    }

    const idleBob = Math.sin(this.time * 2.4) * 0.02;
    for (const [, entity] of this.gems) {
      if (entity.progress >= 1) {
        entity.mesh.position.y = entity.target.y + idleBob;
        entity.mesh.rotation.y += dt * 0.4;
      }
    }

    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i];
      effect.life += dt;
      const t = effect.life / effect.duration;
      if (t >= 1) {
        this.boardGroup.remove(effect.entity.mesh);
        disposeMesh(effect.entity.mesh);
        this.effects.splice(i, 1);
      } else {
        effect.entity.mesh.scale.setScalar(1 + t * 0.6);
        effect.entity.mesh.rotation.y += dt * 6;
        if (effect.entity.mesh.material) {
          effect.entity.mesh.material.opacity = 1 - t;
          effect.entity.mesh.material.transparent = true;
        }
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const burst = this.particles[i];
      burst.life += dt;
      const attr = burst.points.geometry.getAttribute('position');
      for (let p = 0; p < burst.velocity.length; p++) {
        const v = burst.velocity[p];
        attr.array[p * 3] += v.x * dt;
        attr.array[p * 3 + 1] += v.y * dt;
        attr.array[p * 3 + 2] += v.z * dt;
        v.y -= 9.8 * dt;
      }
      attr.needsUpdate = true;
      burst.points.material.opacity = Math.max(0, 1 - burst.life / burst.duration);
      if (burst.life >= burst.duration) {
        this.boardGroup.remove(burst.points);
        burst.points.geometry.dispose();
        burst.points.material.dispose();
        this.particles.splice(i, 1);
      }
    }
  }

  highlightCell(row, col, color = 0x66e0ff) {
    this.clearHighlight();
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.28, 0.46, 24),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(tileToWorld(row, col, this.size));
    ring.position.y = 0.06;
    this.boardGroup.add(ring);
    this.highlight = ring;
  }

  clearHighlight() {
    if (this.highlight) {
      this.boardGroup.remove(this.highlight);
      this.highlight.geometry.dispose();
      this.highlight.material.dispose();
      this.highlight = null;
    }
  }

  clearEffects() {
    for (const effect of this.effects) {
      this.boardGroup.remove(effect.entity.mesh);
      disposeMesh(effect.entity.mesh);
    }
    this.effects = [];
    for (const burst of this.particles) {
      this.boardGroup.remove(burst.points);
      burst.points.geometry.dispose();
      burst.points.material.dispose();
    }
    this.particles = [];
    this.clearHighlight();
  }
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function disposeMesh(mesh) {
  if (mesh.geometry) mesh.geometry.dispose();
  if (mesh.material) {
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) material.dispose();
  }
}
