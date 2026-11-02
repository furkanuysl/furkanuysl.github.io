// Keyboard + virtual joystick. Camera never rotates, so "up" is always -Z.
export function createInput({ onJump, onInteract, onEscape, isBlocked }) {
  const keys = new Set();
  const joy = { x: 0, y: 0 };

  const MOVE = {
    KeyW: [0, -1], ArrowUp: [0, -1],
    KeyS: [0, 1], ArrowDown: [0, 1],
    KeyA: [-1, 0], ArrowLeft: [-1, 0],
    KeyD: [1, 0], ArrowRight: [1, 0],
  };

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') return onEscape();
    if (isBlocked()) return;
    if (e.target.closest?.('input, textarea, button, a, [contenteditable]') && !MOVE[e.code]) return;
    if (MOVE[e.code]) {
      keys.add(e.code);
      e.preventDefault();
    }
    if (e.code === 'Space') {
      e.preventDefault();
      if (!e.repeat) onJump();
    }
    if ((e.code === 'KeyE' || e.code === 'Enter') && !e.repeat) onInteract();
  });
  window.addEventListener('keyup', (e) => keys.delete(e.code));
  window.addEventListener('blur', () => keys.clear());

  // Virtual joystick
  const base = document.getElementById('joystick');
  const knob = base?.querySelector('.joystick__knob');
  let pid = null;
  const R = 46;
  function setFrom(e) {
    const rect = base.getBoundingClientRect();
    let dx = e.clientX - (rect.left + rect.width / 2);
    let dy = e.clientY - (rect.top + rect.height / 2);
    const d = Math.hypot(dx, dy);
    if (d > R) {
      dx = (dx / d) * R;
      dy = (dy / d) * R;
    }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    joy.x = dx / R;
    joy.y = dy / R;
  }
  function reset() {
    pid = null;
    joy.x = joy.y = 0;
    knob.style.transform = '';
  }
  if (base) {
    base.addEventListener('pointerdown', (e) => {
      pid = e.pointerId;
      base.setPointerCapture(pid);
      setFrom(e);
    });
    base.addEventListener('pointermove', (e) => e.pointerId === pid && setFrom(e));
    base.addEventListener('pointerup', reset);
    base.addEventListener('pointercancel', reset);
  }

  return {
    direction() {
      if (isBlocked()) return { x: 0, z: 0 };
      let x = joy.x;
      let z = joy.y;
      for (const k of keys) {
        x += MOVE[k][0];
        z += MOVE[k][1];
      }
      const l = Math.hypot(x, z);
      if (l > 1) {
        x /= l;
        z /= l;
      }
      if (l < 0.12) return { x: 0, z: 0 };
      return { x, z };
    },
    clear() {
      keys.clear();
      if (base) reset();
    },
  };
}
