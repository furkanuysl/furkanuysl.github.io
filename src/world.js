import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { L } from './i18n.js';

export const ISLAND_RADIUS = 23;

const mat = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, ...opts });
const glow = (color, intensity = 1.6) =>
  new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, flatShading: true });

// Seeded random so the island always looks the same
function rng(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

function shadowed(obj) {
  obj.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = !o.material.transparent;
      o.receiveShadow = true;
    }
  });
  return obj;
}

export function buildWorld(scene, zonesData) {
  const colliders = []; // { x, z, r }
  const animated = []; // fn(t, dt)
  const rand = rng(7);

  // ── Sky dome ─────────────────────────────────────────────
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(300, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        top: { value: new THREE.Color('#031614') },
        mid: { value: new THREE.Color('#0b4a45') },
        horizon: { value: new THREE.Color('#f2994a') },
      },
      vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; varying vec3 vP;
        void main(){ float h = vP.y;
          vec3 c = mix(horizon, mid, smoothstep(-0.05, 0.18, h));
          c = mix(c, top, smoothstep(0.18, 0.6, h));
          gl_FragColor = vec4(c, 1.0); }`,
    })
  );
  scene.add(sky);

  // Stars
  {
    const n = 900;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = rand() * Math.PI * 2;
      const v = 0.12 + rand() * 0.88;
      const r = 260;
      pos[i * 3] = Math.cos(u) * Math.sqrt(1 - v * v) * r;
      pos[i * 3 + 1] = v * r;
      pos[i * 3 + 2] = Math.sin(u) * Math.sqrt(1 - v * v) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(
      g,
      new THREE.PointsMaterial({ color: '#ffffff', size: 1.4, sizeAttenuation: true, fog: false, transparent: true, opacity: 0.85 })
    );
    scene.add(stars);
    animated.push((t) => (stars.rotation.y = t * 0.004));
  }

  // ── Lights ───────────────────────────────────────────────
  scene.add(new THREE.HemisphereLight('#bfe8df', '#1d3a36', 1.15));
  const sun = new THREE.DirectionalLight('#ffd2b0', 2.4);
  sun.position.set(-18, 28, 14);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera;
  sc.left = sc.bottom = -30;
  sc.right = sc.top = 30;
  sc.near = 1;
  sc.far = 80;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.03;
  scene.add(sun);

  // ── Water ────────────────────────────────────────────────
  const waterGeo = new THREE.PlaneGeometry(240, 240, 70, 70);
  waterGeo.rotateX(-Math.PI / 2);
  const water = new THREE.Mesh(
    waterGeo,
    new THREE.MeshStandardMaterial({ color: '#0d4f4a', roughness: 0.25, metalness: 0.1, flatShading: true })
  );
  water.position.y = -0.9;
  water.receiveShadow = true;
  scene.add(water);
  const wp = waterGeo.attributes.position;
  const base = Float32Array.from(wp.array);
  let waterTick = 0;
  animated.push((t, dt) => {
    waterTick += dt;
    if (waterTick < 1 / 30) return; // 30 Hz is plenty for waves
    waterTick = 0;
    for (let i = 0; i < wp.count; i++) {
      const x = base[i * 3];
      const z = base[i * 3 + 2];
      wp.array[i * 3 + 1] = Math.sin(x * 0.18 + t * 1.1) * 0.22 + Math.cos(z * 0.21 + t * 0.9) * 0.22;
    }
    wp.needsUpdate = true;
    waterGeo.computeVertexNormals();
  });

  // ── Island ───────────────────────────────────────────────
  const island = new THREE.Group();
  const sand = new THREE.Mesh(new THREE.CylinderGeometry(ISLAND_RADIUS + 3, ISLAND_RADIUS + 5, 1.6, 40), mat('#e9c48f'));
  sand.position.y = -0.95;
  const grassGeo = new THREE.CylinderGeometry(ISLAND_RADIUS + 0.5, ISLAND_RADIUS + 2, 1.2, 40, 1);
  const grass = new THREE.Mesh(grassGeo, mat('#4c9f7e'));
  grass.position.y = -0.6;
  grass.name = 'ground';
  const cliff = new THREE.Mesh(new THREE.ConeGeometry(ISLAND_RADIUS + 4, 14, 14), mat('#3f5653'));
  cliff.rotation.x = Math.PI;
  cliff.position.y = -8.5;
  island.add(sand, grass, cliff);
  shadowed(island);
  scene.add(island);

  // Grass tufts (instanced)
  {
    const tuftGeo = new THREE.ConeGeometry(0.12, 0.45, 4);
    tuftGeo.translate(0, 0.22, 0);
    const tufts = new THREE.InstancedMesh(tuftGeo, mat('#7cc79a'), 420);
    const m = new THREE.Matrix4();
    for (let i = 0; i < 420; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * (ISLAND_RADIUS - 1);
      const s = 0.6 + rand() * 0.9;
      m.compose(
        new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rand() * 3, 0)),
        new THREE.Vector3(s, s, s)
      );
      tufts.setMatrixAt(i, m);
    }
    tufts.receiveShadow = true;
    scene.add(tufts);
  }

  // ── Paths from the campfire to each zone ────────────────
  {
    const stoneGeo = new THREE.CylinderGeometry(0.45, 0.5, 0.12, 7);
    const stones = [];
    for (const z of zonesData) {
      const [x, zz] = z.pos;
      const len = Math.hypot(x, zz);
      for (let d = 2.6; d < len - 2.4; d += 1.15) {
        stones.push([(x / len) * d + (rand() - 0.5) * 0.3, (zz / len) * d + (rand() - 0.5) * 0.3]);
      }
    }
    const inst = new THREE.InstancedMesh(stoneGeo, mat('#e3dccb'), stones.length);
    const m = new THREE.Matrix4();
    stones.forEach(([x, z], i) => {
      m.compose(new THREE.Vector3(x, 0.02, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rand() * 3, 0)), new THREE.Vector3(1, 1, 1));
      inst.setMatrixAt(i, m);
    });
    inst.receiveShadow = true;
    scene.add(inst);
  }

  // ── Campfire (spawn) ─────────────────────────────────────
  {
    const g = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const s = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32), mat('#8a9b96'));
      const a = (i / 8) * Math.PI * 2;
      s.position.set(Math.cos(a) * 1, 0.15, Math.sin(a) * 1);
      g.add(s);
    }
    for (let i = 0; i < 3; i++) {
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.3, 6), mat('#7a4a2a'));
      log.rotation.z = Math.PI / 2.4;
      log.rotation.y = (i / 3) * Math.PI * 2;
      log.position.y = 0.3;
      g.add(log);
    }
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 6), glow('#ff9a3c', 2.5));
    flame.position.y = 0.7;
    const flame2 = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 6), glow('#ffe066', 3));
    flame2.position.y = 0.65;
    g.add(flame, flame2);
    const light = new THREE.PointLight('#ff8a3c', 18, 12, 1.6);
    light.position.y = 1.4;
    g.add(light);
    shadowed(g);
    flame.castShadow = flame2.castShadow = false;
    scene.add(g);
    colliders.push({ x: 0, z: 0, r: 1.3 });
    animated.push((t) => {
      const f = 1 + Math.sin(t * 13) * 0.08 + Math.sin(t * 7.3) * 0.06;
      flame.scale.set(1, f, 1);
      flame2.scale.set(1, 2 - f, 1);
      flame.rotation.y = t * 2;
      light.intensity = 16 + Math.sin(t * 11) * 3;
    });
  }

  // ── Zones ────────────────────────────────────────────────
  const zones = zonesData.map((z) => {
    const [x, zz] = z.pos;
    const group = new THREE.Group();
    group.position.set(x, 0, zz);
    // Props face the island centre
    const facing = Math.atan2(-x, -zz);
    const prop = buildProp(z.id, z.color, animated);
    prop.rotation.y = facing;
    group.add(shadowed(prop));

    // Glowing trigger ring
    const ringPos = new THREE.Vector3(x + Math.sin(facing) * 2.6, 0.04, zz + Math.cos(facing) * 2.6);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.15, 1.45, 40),
      new THREE.MeshBasicMaterial({ color: z.color, transparent: true, opacity: 0.85, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(ringPos);
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(1.15, 40),
      new THREE.MeshBasicMaterial({ color: z.color, transparent: true, opacity: 0.18 })
    );
    disc.rotation.x = -Math.PI / 2;
    disc.position.copy(ringPos);
    disc.position.y = 0.03;
    scene.add(ring, disc);
    animated.push((t) => {
      const s = 1 + Math.sin(t * 2.5 + x) * 0.06;
      ring.scale.set(s, s, s);
    });

    // HTML label floating above the prop
    const el = document.createElement('div');
    el.className = 'zone-label';
    el.style.setProperty('--zone', z.color);
    setLabel(el, z);
    const label = new CSS2DObject(el);
    label.position.set(0, prop.userData.labelY ?? 4.6, 0);
    group.add(label);

    scene.add(group);
    colliders.push({ x, z: zz, r: 1.9 });
    return { ...z, group, ring, ringPos, label: el, prop };
  });

  // ── Trees & rocks ────────────────────────────────────────
  const blocked = (x, z, r) =>
    Math.hypot(x, z) < 4 ||
    zones.some((zn) => Math.hypot(x - zn.pos[0], z - zn.pos[1]) < 4.2 || Math.hypot(x - zn.ringPos.x, z - zn.ringPos.z) < 2.6) ||
    colliders.some((c) => Math.hypot(x - c.x, z - c.z) < c.r + r + 0.6) ||
    onPath(x, z);
  function onPath(x, z) {
    return zones.some((zn) => {
      const [px, pz] = zn.pos;
      const len = Math.hypot(px, pz);
      const t = (x * px + z * pz) / (len * len);
      if (t < 0 || t > 1) return false;
      return Math.hypot(x - px * t, z - pz * t) < 1.6;
    });
  }

  const trees = [];
  for (let tries = 0; tries < 400 && trees.length < 26; tries++) {
    const a = rand() * Math.PI * 2;
    const r = 5 + rand() * (ISLAND_RADIUS - 6);
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    if (blocked(x, z, 0.8)) continue;
    const tree = rand() > 0.35 ? makePine(rand) : makeRoundTree(rand);
    tree.position.set(x, 0, z);
    tree.rotation.y = rand() * 6;
    scene.add(shadowed(tree));
    colliders.push({ x, z, r: 0.75 });
    trees.push(tree);
    const phase = rand() * 6;
    animated.push((t) => (tree.rotation.z = Math.sin(t * 1.2 + phase) * 0.02));
  }
  for (let tries = 0; tries < 200; tries++) {
    if (colliders.length > 50) break;
    const a = rand() * Math.PI * 2;
    const r = 6 + rand() * (ISLAND_RADIUS - 6);
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const s = 0.4 + rand() * 0.7;
    if (blocked(x, z, s)) continue;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(s), mat('#8a9b96'));
    rock.position.set(x, s * 0.4, z);
    rock.rotation.set(rand(), rand(), rand());
    scene.add(shadowed(rock));
    colliders.push({ x, z, r: s * 0.9 });
  }

  // ── Collectible XP orbs ─────────────────────────────────
  const orbs = [];
  const orbGeo = new THREE.IcosahedronGeometry(0.32, 0);
  for (let tries = 0; tries < 500 && orbs.length < 12; tries++) {
    const a = rand() * Math.PI * 2;
    const r = 4 + rand() * (ISLAND_RADIUS - 5);
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    if (colliders.some((c) => Math.hypot(x - c.x, z - c.z) < c.r + 1.2)) continue;
    if (orbs.some((o) => Math.hypot(x - o.x, z - o.z) < 4)) continue;
    const mesh = new THREE.Mesh(orbGeo, glow('#facc15', 0.9));
    mesh.castShadow = true;
    // Some orbs float higher so you need to jump for them
    const high = orbs.length % 4 === 3;
    const y = high ? 2.3 : 0.9;
    mesh.position.set(x, y, z);
    scene.add(mesh);
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(0.45, 0.55, 24),
      new THREE.MeshBasicMaterial({ color: '#fde047', transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    );
    mesh.add(halo);
    orbs.push({ x, z, y, mesh, taken: false, high });
  }
  animated.push((t) => {
    for (const o of orbs) {
      if (o.taken) continue;
      o.mesh.rotation.y = t * 2;
      o.mesh.position.y = o.y + Math.sin(t * 3 + o.x) * 0.15;
    }
  });

  return {
    relabel() {
      for (const z of zones) setLabel(z.label, z);
    },
    colliders,
    zones,
    orbs,
    ground: grass,
    update(t, dt) {
      for (const fn of animated) fn(t, dt);
    },
  };
}

function setLabel(el, z) {
  el.innerHTML = `<span class="zone-label__title">${L(z.title)}</span><span class="zone-label__hint">${L(z.hint)}</span>`;
}

function makePine(rand) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1, 6), mat('#6b4a32'));
  trunk.position.y = 0.5;
  g.add(trunk);
  const greens = ['#3f9a6a', '#4aa874', '#358a60'];
  const h = 0.8 + rand() * 0.6;
  for (let i = 0; i < 3; i++) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(1.2 - i * 0.3, 1.3 * h, 7), mat(greens[i]));
    c.position.y = 1.3 + i * 0.75 * h;
    g.add(c);
  }
  return g;
}

function makeRoundTree(rand) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 1.4, 6), mat('#7a5236'));
  trunk.position.y = 0.7;
  g.add(trunk);
  const colors = ['#f2994a', '#e8c07a', '#eb6f5b'];
  const col = colors[Math.floor(rand() * colors.length)];
  const top = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 0), mat(col));
  top.position.y = 2;
  const top2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 0), mat(col));
  top2.position.set(0.6, 1.7, 0.3);
  g.add(top, top2);
  return g;
}

// ── Zone props, built from primitives ──────────────────────
function buildProp(id, color, animated) {
  const g = new THREE.Group();
  const accent = glow(color, 1.4);

  if (id === 'about') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(3, 2.2, 2.6), mat('#f3ede1'));
    body.position.y = 1.1;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.5, 4), mat('#0b6b64'));
    roof.position.y = 2.95;
    roof.rotation.y = Math.PI / 4;
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.3, 0.1), mat('#6b4a32'));
    door.position.set(0, 0.65, 1.31);
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.1), glow('#fde68a', 1.2));
    win.position.set(-0.95, 1.3, 1.31);
    const win2 = win.clone();
    win2.position.x = 0.95;
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 0.4), mat('#7fd1c3'));
    chimney.position.set(0.8, 3.2, -0.4);
    g.add(body, roof, door, win, win2, chimney);
  }

  if (id === 'games') {
    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 1.3), mat('#0e2a28'));
    cab.position.y = 1.4;
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.45, 1.4), accent);
    top.position.y = 3;
    const screenMat = new THREE.MeshStandardMaterial({ color: '#000', emissive: '#22d3ee', emissiveIntensity: 1.5 });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.95), screenMat);
    screen.position.set(0, 2.1, 0.66);
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 0.7), mat('#123c38'));
    panel.position.set(0, 1.35, 0.75);
    panel.rotation.x = 0.35;
    const stick = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), glow('#f43f5e', 2));
    stick.position.set(-0.35, 1.6, 0.85);
    const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 10), glow('#fde047', 2));
    b1.position.set(0.25, 1.52, 0.82);
    const b2 = b1.clone();
    b2.material = glow('#22d3ee', 2);
    b2.position.x = 0.5;
    // A second cabinet for a little "arcade corner"
    const cab2 = new THREE.Group();
    const c2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 1.2), mat('#0b6b64'));
    c2.position.y = 1.2;
    const s2 = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.8), glow('#a3e635', 1.2));
    s2.position.set(0, 1.8, 0.61);
    cab2.add(c2, s2);
    cab2.position.set(1.9, 0, -0.4);
    cab2.rotation.y = -0.35;
    g.add(cab, top, screen, panel, stick, b1, b2, cab2);
    const hues = ['#7fd1c3', '#f2994a', '#6cb4ee', '#f2c94c'];
    animated.push((t) => {
      screenMat.emissive.set(hues[Math.floor(t * 1.5) % hues.length]);
      screenMat.emissiveIntensity = 1.2 + Math.sin(t * 20) * 0.15;
    });
  }

  if (id === 'apps') {
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3, 0.15, 1.4), mat('#a16207'));
    desk.position.y = 1;
    for (const [lx, lz] of [[-1.3, -0.55], [1.3, -0.55], [-1.3, 0.55], [1.3, 0.55]]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1, 0.12), mat('#713f12'));
      leg.position.set(lx, 0.5, lz);
      g.add(leg);
    }
    const monitor = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.05, 0.1), mat('#0f172a'));
    monitor.position.set(-0.3, 1.85, -0.3);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 0.9), glow('#38bdf8', 1));
    screen.position.set(-0.3, 1.85, -0.24);
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.4, 0.15), mat('#334155'));
    stand.position.set(-0.3, 1.25, -0.3);
    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.55), mat('#cbd5e1'));
    laptopBase.position.set(0.95, 1.1, 0.2);
    const laptopLid = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.04), mat('#cbd5e1'));
    laptopLid.position.set(0.95, 1.35, -0.05);
    laptopLid.rotation.x = -0.25;
    const lscreen = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.4), glow('#34d399', 1));
    lscreen.position.set(0.95, 1.35, -0.025);
    lscreen.rotation.x = -0.25;
    // Floating code brackets
    const brk = new THREE.Group();
    for (const s of [-1, 1]) {
      const a = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), accent);
      a.position.set(s * 0.35, 0, 0);
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), accent);
      b.position.set(s * 0.25, 0.2, 0);
      b.rotation.z = s * 0.9;
      const c = b.clone();
      c.position.y = -0.2;
      c.rotation.z = -s * 0.9;
      brk.add(a, b, c);
    }
    brk.position.set(-0.3, 3, -0.3);
    g.add(desk, monitor, screen, stand, laptopBase, laptopLid, lscreen, brk);
    animated.push((t) => {
      brk.rotation.y = t;
      brk.position.y = 3 + Math.sin(t * 2) * 0.12;
    });
  }

  if (id === 'skills') {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.9, 0.5, 8), mat('#3f5653'));
    base.position.y = 0.25;
    g.add(base);
    const cols = ['#7fd1c3', '#6cb4ee', '#b5de6e', '#f2994a'];
    const crystals = [];
    for (let i = 0; i < 4; i++) {
      const c = new THREE.Mesh(new THREE.OctahedronGeometry(0.55 - i * 0.05), glow(cols[i], 1.3));
      const a = (i / 4) * Math.PI * 2;
      c.userData.a = a;
      c.scale.y = 1.6;
      g.add(c);
      crystals.push(c);
    }
    const big = new THREE.Mesh(new THREE.OctahedronGeometry(0.8), glow('#b5de6e', 1.5));
    big.scale.y = 1.7;
    big.position.y = 2.2;
    g.add(big);
    animated.push((t) => {
      big.rotation.y = t * 0.8;
      big.position.y = 2.2 + Math.sin(t * 1.6) * 0.15;
      crystals.forEach((c, i) => {
        const a = c.userData.a + t * 0.6;
        c.position.set(Math.cos(a) * 1.3, 1.3 + Math.sin(t * 2 + i) * 0.2, Math.sin(a) * 1.3);
        c.rotation.y = -t * 1.5;
      });
    });
  }

  if (id === 'experience') {
    const stripes = ['#f8fafc', '#ef4444', '#f8fafc', '#ef4444'];
    for (let i = 0; i < 4; i++) {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.95 - i * 0.12, 1.05 - i * 0.12, 1, 10), mat(stripes[i]));
      s.position.y = 0.5 + i;
      g.add(s);
    }
    const deck = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.15, 10), mat('#334155'));
    deck.position.y = 4.05;
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.6, 8), glow('#facc15', 0.9));
    lamp.position.y = 4.45;
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.6, 8), mat('#ef4444'));
    cap.position.y = 5.05;
    const beamPivot = new THREE.Group();
    beamPivot.position.y = 4.45;
    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(1.2, 9, 16, 1, true),
      new THREE.MeshBasicMaterial({ color: '#fde68a', transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false })
    );
    beam.rotation.z = Math.PI / 2;
    beam.position.x = 4.5;
    beamPivot.add(beam);
    g.add(deck, lamp, cap, beamPivot);
    animated.push((t) => (beamPivot.rotation.y = t * 0.7));
    // Labels sit a bit higher on the tall lighthouse
    g.userData.labelY = 6.2;
  }

  if (id === 'contact') {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.3, 0.2), mat('#6b4a32'));
    post.position.y = 0.65;
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 1.1), mat('#fb923c'));
    box.position.y = 1.55;
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.1, 12, 1, false, 0, Math.PI), mat('#fb923c'));
    lid.rotation.z = Math.PI / 2;
    lid.rotation.y = Math.PI / 2;
    lid.position.y = 1.85;
    const flagPivot = new THREE.Group();
    flagPivot.position.set(0.45, 1.6, -0.2);
    const flagPole = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.7, 0.05), mat('#f8fafc'));
    flagPole.position.y = 0.35;
    const flag = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.25, 0.35), glow('#ef4444', 0.8));
    flag.position.set(0, 0.6, 0.17);
    flagPivot.add(flagPole, flag);
    // Floating envelope
    const env = new THREE.Group();
    const paper = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.05), mat('#f8fafc'));
    const v1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.05, 0.06), accent);
    v1.position.set(-0.2, 0.12, 0.01);
    v1.rotation.z = -0.55;
    const v2 = v1.clone();
    v2.position.x = 0.2;
    v2.rotation.z = 0.55;
    env.add(paper, v1, v2);
    env.position.y = 3;
    g.add(post, box, lid, flagPivot, env);
    animated.push((t) => {
      env.position.y = 3 + Math.sin(t * 2) * 0.15;
      env.rotation.y = Math.sin(t) * 0.6;
      flagPivot.rotation.x = Math.sin(t * 3) > 0.6 ? -1.2 : 0;
    });
  }

  return g;
}
