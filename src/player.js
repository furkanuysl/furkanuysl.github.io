import * as THREE from 'three';
import { ISLAND_RADIUS } from './world.js';

const SPEED = 7;
const GRAVITY = 28;
const JUMP_V = 10;
const RADIUS = 0.5;

const m = (color, e = 0) =>
  new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.6, emissive: e ? color : '#000', emissiveIntensity: e });

export function createPlayer(scene) {
  const root = new THREE.Group();
  const body = new THREE.Group(); // bobs and squashes
  root.add(body);

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.45, 0.5, 4, 10), m('#0b7a72'));
  torso.position.y = 0.95;
  const belly = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.1), m('#f2994a', 0.5));
  belly.position.set(0, 0.95, 0.42);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.7, 0.75), m('#f3ede1'));
  head.position.y = 1.85;
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.32, 0.05), m('#0f172a'));
  visor.position.set(0, 1.88, 0.38);
  const eyeMat = m('#7fe8d8', 2.5);
  const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.04), eyeMat);
  eyeL.position.set(-0.15, 1.9, 0.41);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.15;
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 5), m('#cbd5e1'));
  antenna.position.y = 2.37;
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), m('#fde047', 2.5));
  tip.position.y = 2.58;
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.6, 0.3), m('#003b37'));
  pack.position.set(0, 1.05, -0.45);

  const footGeo = new THREE.BoxGeometry(0.26, 0.2, 0.4);
  const footL = new THREE.Mesh(footGeo, m('#0e2a28'));
  const footR = footL.clone();
  footL.position.set(-0.2, 0.1, 0);
  footR.position.set(0.2, 0.1, 0);
  const armGeo = new THREE.CapsuleGeometry(0.1, 0.35, 3, 6);
  armGeo.translate(0, -0.25, 0);
  const armL = new THREE.Mesh(armGeo, m('#0b7a72'));
  const armR = armL.clone();
  armL.position.set(-0.55, 1.25, 0);
  armR.position.set(0.55, 1.25, 0);

  body.add(torso, belly, head, visor, eyeL, eyeR, antenna, tip, pack, armL, armR);
  root.add(footL, footR);
  root.traverse((o) => o.isMesh && (o.castShadow = true));

  // Blob shadow keeps the character readable even mid-jump
  const blob = new THREE.Mesh(
    new THREE.CircleGeometry(0.55, 20),
    new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.25, depthWrite: false })
  );
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = 0.05;
  scene.add(blob);
  scene.add(root);

  // Dust puffs
  const puffs = [];
  const puffGeo = new THREE.IcosahedronGeometry(0.12, 0);
  for (let i = 0; i < 14; i++) {
    const p = new THREE.Mesh(puffGeo, new THREE.MeshBasicMaterial({ color: '#e3f2ee', transparent: true, opacity: 0 }));
    p.visible = false;
    scene.add(p);
    puffs.push({ mesh: p, life: 0, vel: new THREE.Vector3() });
  }
  let puffIdx = 0;
  function puff(n, spread = 1) {
    for (let i = 0; i < n; i++) {
      const p = puffs[puffIdx++ % puffs.length];
      p.life = 0.5;
      p.mesh.visible = true;
      p.mesh.position.set(root.position.x + (Math.random() - 0.5) * 0.4, 0.1, root.position.z + (Math.random() - 0.5) * 0.4);
      p.vel.set((Math.random() - 0.5) * 2 * spread, 0.8 + Math.random(), (Math.random() - 0.5) * 2 * spread);
    }
  }

  const vel = new THREE.Vector3();
  let vy = 0;
  let grounded = true;
  let walkT = 0;
  let stepTimer = 0;
  let land = 0; // squash amount
  let blink = 0;
  let wasGrounded = true;

  const player = {
    object: root,
    target: null, // click-to-move destination (Vector3)
    get position() {
      return root.position;
    },
    get grounded() {
      return grounded;
    },
    jump() {
      if (!grounded) return false;
      vy = JUMP_V;
      grounded = false;
      puff(4, 0.6);
      return true;
    },
    /**
     * @param dir  {x, z} desired move direction in world space (length 0..1)
     */
    update(dt, t, dir, colliders, onStep) {
      // Click-to-move steering when no direct input
      let mx = dir.x;
      let mz = dir.z;
      if ((mx || mz) && player.target) player.target = null;
      if (!mx && !mz && player.target) {
        const dx = player.target.x - root.position.x;
        const dz = player.target.z - root.position.z;
        const d = Math.hypot(dx, dz);
        if (d < 0.25) player.target = null;
        else {
          const s = Math.min(1, d / 1.2);
          mx = (dx / d) * s;
          mz = (dz / d) * s;
        }
      }

      const want = new THREE.Vector3(mx, 0, mz).multiplyScalar(SPEED);
      const accel = grounded ? 14 : 5;
      vel.lerp(want, 1 - Math.exp(-accel * dt));
      root.position.x += vel.x * dt;
      root.position.z += vel.z * dt;

      // Collisions with circles
      for (const c of colliders) {
        const dx = root.position.x - c.x;
        const dz = root.position.z - c.z;
        const d = Math.hypot(dx, dz);
        const min = c.r + RADIUS;
        if (d < min && d > 0.0001) {
          const nx = dx / d;
          const nz = dz / d;
          root.position.x = c.x + nx * min;
          root.position.z = c.z + nz * min;
          // Slide along the obstacle instead of sticking to it
          const into = vel.x * nx + vel.z * nz;
          if (into < 0) {
            vel.x -= into * nx;
            vel.z -= into * nz;
            // Head-on hit leaves almost no sideways speed — steer around it
            const tx = -nz;
            const tz = nx;
            const side = vel.x * tx + vel.z * tz;
            if (Math.abs(side) < SPEED * 0.4) {
              const dir = side >= 0 ? 1 : -1;
              vel.x += tx * dir * -into;
              vel.z += tz * dir * -into;
            }
          }
        }
      }
      // Stay on the island
      const r = Math.hypot(root.position.x, root.position.z);
      if (r > ISLAND_RADIUS) {
        root.position.x *= ISLAND_RADIUS / r;
        root.position.z *= ISLAND_RADIUS / r;
      }

      // Vertical
      vy -= GRAVITY * dt;
      root.position.y += vy * dt;
      if (root.position.y <= 0) {
        root.position.y = 0;
        if (!wasGrounded) {
          land = 1;
          puff(5, 1);
          onStep?.('land');
        }
        vy = 0;
        grounded = true;
      } else grounded = false;
      wasGrounded = grounded;

      // Facing
      const speed = Math.hypot(vel.x, vel.z);
      if (speed > 0.3) {
        const targetYaw = Math.atan2(vel.x, vel.z);
        let diff = targetYaw - root.rotation.y;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        root.rotation.y += diff * (1 - Math.exp(-14 * dt));
      }

      // Walk cycle
      const moving = speed > 0.5 && grounded;
      if (moving) {
        walkT += dt * speed * 1.9;
        stepTimer += dt * speed;
        if (stepTimer > 2.2) {
          stepTimer = 0;
          puff(1, 0.3);
          onStep?.('step');
        }
      } else walkT += (Math.round(walkT / Math.PI) * Math.PI - walkT) * Math.min(1, dt * 10);
      const swing = Math.sin(walkT);
      footL.position.z = swing * 0.28;
      footR.position.z = -swing * 0.28;
      footL.position.y = 0.1 + Math.max(0, -swing) * 0.12;
      footR.position.y = 0.1 + Math.max(0, swing) * 0.12;
      armL.rotation.x = -swing * 0.7;
      armR.rotation.x = swing * 0.7;

      // Squash & stretch + idle bob
      land = Math.max(0, land - dt * 5);
      const idle = moving ? Math.abs(Math.sin(walkT)) * 0.08 : Math.sin(t * 2.5) * 0.03;
      const stretch = grounded ? 1 - land * 0.25 : 1 + Math.min(0.15, Math.abs(vy) * 0.015);
      body.scale.set(1 / Math.sqrt(stretch), stretch, 1 / Math.sqrt(stretch));
      body.position.y = idle;
      body.rotation.x = moving ? 0.08 : 0;
      tip.position.x = Math.sin(t * 4) * 0.03;

      // Blink
      blink -= dt;
      if (blink < -3.5) blink = 0.12;
      const eyeS = blink > 0 ? 0.15 : 1;
      eyeL.scale.y = eyeR.scale.y = eyeS;

      blob.position.x = root.position.x;
      blob.position.z = root.position.z;
      const bs = 1 - Math.min(0.6, root.position.y * 0.15);
      blob.scale.set(bs, bs, bs);

      for (const p of puffs) {
        if (p.life <= 0) continue;
        p.life -= dt;
        p.mesh.position.addScaledVector(p.vel, dt);
        p.vel.multiplyScalar(0.92);
        p.mesh.material.opacity = Math.max(0, p.life) * 1.2;
        p.mesh.scale.setScalar(1 + (0.5 - p.life) * 3);
        if (p.life <= 0) p.mesh.visible = false;
      }

      return speed;
    },
  };
  return player;
}
