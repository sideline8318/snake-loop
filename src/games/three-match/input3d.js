import * as THREE from 'three';

export function createInput({ canvas, camera, boardView, game, onAttempt, onRestart }) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  let dragging = false;
  let startCell = null;
  let pressedCell = null;
  let startPoint = { x: 0, y: 0 };
  let hoverCell = null;
  let suppressClick = false;

  function cellFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    pointer.set(x, y);
    raycaster.setFromCamera(pointer, camera);
    if (!raycaster.ray.intersectPlane(plane, hit)) return null;
    const offset = (game.size - 1) / 2;
    const col = Math.round(hit.x + offset);
    const row = Math.round(hit.z + offset);
    if (row < 0 || row >= game.size || col < 0 || col >= game.size) return null;
    return { row, col };
  }

  function onPointerDown(event) {
    if (!game.canInteract()) return;
    const cell = cellFromEvent(event);
    if (!cell) return;
    dragging = true;
    suppressClick = false;
    pressedCell = cell;
    startPoint = { x: event.clientX, y: event.clientY };
    boardView.highlightCell(cell.row, cell.col);
    canvas.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event) {
    if (!game.canInteract()) return;
    if (!dragging) {
      const cell = cellFromEvent(event);
      if (cell && (!hoverCell || hoverCell.row !== cell.row || hoverCell.col !== cell.col)) {
        hoverCell = cell;
        boardView.highlightCell(cell.row, cell.col, 0x4f7dff);
      } else if (!cell && hoverCell) {
        hoverCell = null;
        boardView.clearHighlight();
      }
      return;
    }
    const dx = event.clientX - startPoint.x;
    const dy = event.clientY - startPoint.y;
    if (Math.hypot(dx, dy) < 14) return;
    const from = pressedCell;
    const target = resolveSwipeTarget(from, dx, dy);
    dragging = false;
    pressedCell = null;
    startCell = null;
    suppressClick = true;
    boardView.clearHighlight();
    attempt(from, target);
  }

  function resolveSwipeTarget(cell, dx, dy) {
    if (Math.abs(dx) >= Math.abs(dy)) {
      return { row: cell.row, col: cell.col + (dx > 0 ? 1 : -1) };
    }
    return { row: cell.row + (dy > 0 ? 1 : -1), col: cell.col };
  }

  function onClick(event) {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    if (!game.canInteract()) return;
    const cell = cellFromEvent(event);
    if (!cell) return;
    if (!startCell) {
      startCell = cell;
      boardView.highlightCell(cell.row, cell.col);
      return;
    }
    if (sameCell(startCell, cell)) {
      startCell = null;
      boardView.clearHighlight();
      return;
    }
    const from = startCell;
    startCell = null;
    boardView.clearHighlight();
    attempt(from, cell);
  }

  function onPointerUp(event) {
    dragging = false;
    pressedCell = null;
    canvas.releasePointerCapture?.(event.pointerId);
  }

  function attempt(from, to) {
    if (onAttempt) {
      onAttempt(from, to);
      return;
    }
    game.trySwap(from, to);
  }

  function onKeyDown(event) {
    if (event.key === 'r' || event.key === 'R') {
      if (onRestart) onRestart();
      else game.start();
    }
  }

  function attach() {
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);
  }

  function detach() {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKeyDown);
  }

  return { attach, detach, cellFromEvent, resolveSwipeTarget };

  function sameCell(a, b) {
    return a && b && a.row === b.row && a.col === b.col;
  }
}
