import * as THREE from 'three';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { profile, zones as zonesData } from './data.js';
import { buildWorld, ISLAND_RADIUS } from './world.js';
import { createPlayer } from './player.js';
import { createInput } from './input.js';
import { initAudio, sfx, isMuted, setMuted } from './audio.js';
import { createPanel, toast } from './ui.js';
import { L, t, getLang, setLang, onLangChange } from './i18n.js';

const $ = (id) => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = matchMedia('(pointer: coarse)').matches;
document.body.classList.toggle('is-touch', isTouch);

// ── Static text from data ───────────────────────────────────
$('start-title').textContent = profile.name;
$('hud-name').textContent = profile.name;
$('hud-avatar').textContent = profile.initials;

// Static, language-dependent text. Re-run on every language switch.
function applyStaticText() {
  document.title = `${profile.name} — ${L(profile.title)}`;
  $('start-role').textContent = L(profile.title);
  $('start-sub').textContent = L(profile.subtitle);
  $('hud-role').textContent = L(profile.title);
  document.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll('[data-i18n-html]').forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml)));
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  document.querySelectorAll('[data-lang-toggle]').forEach((el) => {
    el.textContent = getLang() === 'tr' ? 'EN' : 'TR';
    el.setAttribute('aria-label', `${t('language')}: ${t('switchTo')}`);
    el.title = t('switchTo');
  });
}
applyStaticText();
document.querySelectorAll('[data-lang-toggle]').forEach((el) =>
  el.addEventListener('click', () => setLang(getLang() === 'tr' ? 'en' : 'tr'))
);

// ── Classic CV (React app, loaded on first open) ─────────────
const classic = $('classic');
let classicOpen = false;
let classicMounted = null;
let lastScroll = 0;
async function openClassic() {
  if (classicOpen) return;
  classicOpen = true;
  window.dispatchEvent(new Event('blur')); // releases held movement keys
  classic.hidden = false;
  document.documentElement.classList.add('classic-open');
  if (!classicMounted) {
    classic.innerHTML = `<div class="classic-loading">${t('loading')}</div>`;
    const { mountClassic } = await import('./classic/mount.tsx');
    classic.innerHTML = '';
    classicMounted = mountClassic(classic, backToGame);
  }
  window.scrollTo(0, lastScroll);
}
function closeClassic() {
  if (!classicOpen) return;
  lastScroll = window.scrollY;
  classicOpen = false;
  classic.hidden = true;
  document.documentElement.classList.remove('classic-open');
  window.scrollTo(0, 0);
  if (!started) $('start-btn').focus();
}
function backToGame() {
  closeClassic();
  if (!started && webgl) startGame();
}
$('start-classic').addEventListener('click', openClassic);
$('btn-classic').addEventListener('click', openClassic);

// ── WebGL check — fall back to the classic CV ───────────────
const webgl = (() => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
})();
if (!webgl) {
  $('start').hidden = true;
  openClassic();
  throw new Error('WebGL unavailable — showing the classic CV.');
}

// ── Renderer, scene, camera ─────────────────────────────────
const stage = $('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
stage.appendChild(renderer.domElement);

const labels = new CSS2DRenderer();
labels.setSize(innerWidth, innerHeight);
labels.domElement.className = 'labels';
stage.appendChild(labels.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog('#0b4a45', 45, 140);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 600);
camera.position.set(30, 20, 30);

const world = buildWorld(scene, zonesData);
const player = createPlayer(scene);
player.position.set(0, 0, 3.2);

// Click-to-move marker
const marker = new THREE.Mesh(
  new THREE.RingGeometry(0.3, 0.45, 24),
  new THREE.MeshBasicMaterial({ color: '#f2c94c', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })
);
marker.rotation.x = -Math.PI / 2;
marker.position.y = 0.06;
scene.add(marker);

// ── Game state ──────────────────────────────────────────────
const XP_ZONE = 100;
const XP_ORB = 25;
const XP_MAX = zonesData.length * XP_ZONE + world.orbs.length * XP_ORB;
const state = { xp: 0, level: 1, visited: new Set(), orbs: 0, completed: false };
let started = false;
let activeZone = null;
let autoOpen = null;

const panel = createPanel({
  onClose() {
    sfx.close();
    checkCompletion();
  },
});

const input = createInput({
  onJump: () => started && player.jump() && sfx.jump(),
  onInteract: () => {
    if (!started) return startGame();
    if (activeZone) openZone(activeZone.id);
  },
  onEscape: () => {
    if (classicOpen) closeClassic();
  },
  isBlocked: () => !started || panel.open || classicOpen,
});

function addXP(n) {
  state.xp = Math.min(XP_MAX, state.xp + n);
  const lvl = 1 + Math.floor(state.xp / 150);
  if (lvl > state.level) {
    state.level = lvl;
    sfx.levelUp();
    toast(t('levelUp', lvl), t('keepExploring'), 'level');
    const card = document.querySelector('.hud__player');
    card.classList.remove('pop');
    void card.offsetWidth;
    card.classList.add('pop');
  }
  updateHUD();
}

function openZone(id) {
  input.clear();
  player.target = null;
  autoOpen = null;
  sfx.open();
  panel.show(id);
  if (!state.visited.has(id)) {
    state.visited.add(id);
    const z = zonesData.find((zz) => zz.id === id);
    toast(t('zoneFound'), `${L(z.title)} · +${XP_ZONE} XP`);
    addXP(XP_ZONE);
  }
}

function checkCompletion() {
  if (state.completed) return;
  if (state.visited.size === zonesData.length && state.orbs === world.orbs.length) {
    state.completed = true;
    sfx.achievement();
    setTimeout(() => {
      panel.showCustom(
        t('achievement'),
        t('complete'),
        `${t('completeHtml')}
         <div class="contact"><a class="btn btn--primary" href="mailto:${profile.email}">${t('writeNow')}</a></div>`
      );
    }, 400);
  }
}

// ── HUD ─────────────────────────────────────────────────────
const questList = $('quest-list');
function updateHUD() {
  const pct = Math.round((state.xp / XP_MAX) * 100);
  $('xp-fill').style.width = `${pct}%`;
  $('xp').setAttribute('aria-valuenow', pct);
  $('hud-lvl').textContent = `LVL ${state.level}`;
  questList.innerHTML =
    zonesData
      .map((z) => {
        const done = state.visited.has(z.id);
        return `<li class="${done ? 'done' : ''}" style="--zone:${z.color}"><span class="quests__dot"></span>${L(z.title)}</li>`;
      })
      .join('') +
    `<li class="${state.orbs === world.orbs.length ? 'done' : ''}" style="--zone:#F2C94C">
       <span class="quests__dot"></span>${t('orbs')} ${state.orbs}/${world.orbs.length}</li>`;
}
updateHUD();

onLangChange(() => {
  applyStaticText();
  updateHUD();
  syncSound();
  world.relabel();
  if (activeZone) $('prompt-text').textContent = `${L(activeZone.title)} — ${t('inspect')}`;
});

const soundBtn = $('btn-sound');
function syncSound() {
  soundBtn.classList.toggle('is-muted', isMuted());
  soundBtn.setAttribute('aria-pressed', String(isMuted()));
  soundBtn.setAttribute('aria-label', isMuted() ? t('soundOn') : t('soundOff'));
}
syncSound();
soundBtn.addEventListener('click', () => {
  initAudio();
  setMuted(!isMuted());
  syncSound();
  sfx.blip();
});

$('btn-help').addEventListener('click', () => {
  input.clear();
  panel.showCustom(
    t('howToPlay'),
    t('controls'),
    t('helpHtml'),
    '#7FD1C3'
  );
});

$('btn-jump').addEventListener('pointerdown', (e) => {
  e.preventDefault();
  if (player.jump()) sfx.jump();
});

const promptBtn = $('prompt');
promptBtn.addEventListener('click', () => activeZone && openZone(activeZone.id));

// ── Start ───────────────────────────────────────────────────
const startBtn = $('start-btn');
function startGame() {
  if (started) return;
  initAudio();
  started = true;
  sfx.achievement();
  $('start').classList.add('start--out');
  setTimeout(() => ($('start').hidden = true), 700);
  $('hud').hidden = false;
  document.body.classList.add('is-playing');
  document.activeElement?.blur();
  setTimeout(() => {
    $('hint').classList.add('hint--fade');
  }, 9000);
}
startBtn.addEventListener('click', startGame);

// Wait for fonts so labels don't flash, then enable start
document.fonts.ready.then(() => {
  startBtn.disabled = false;
  startBtn.classList.add('is-ready');
  startBtn.focus({ preventScroll: true });
});

// ── Pointer: click-to-move ──────────────────────────────────
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const propTargets = world.zones.map((z) => {
  z.prop.traverse((o) => (o.userData.zoneId = z.id));
  return z.prop;
});
let downAt = null;
renderer.domElement.addEventListener('pointerdown', (e) => (downAt = { x: e.clientX, y: e.clientY }));
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!started || panel.open || !downAt) return;
  if (Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 8) return;
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.intersectObjects(propTargets, true)[0];
  if (hit) {
    const z = world.zones.find((zz) => zz.id === hit.object.userData.zoneId);
    player.target = z.ringPos.clone();
    autoOpen = z.id;
    showMarker(z.ringPos, z.color);
    return;
  }
  const p = new THREE.Vector3();
  if (raycaster.ray.intersectPlane(groundPlane, p) && Math.hypot(p.x, p.z) < ISLAND_RADIUS) {
    player.target = p;
    autoOpen = null;
    showMarker(p, '#F2C94C');
  }
});
let markerLife = 0;
function showMarker(p, color) {
  marker.position.x = p.x;
  marker.position.z = p.z;
  marker.material.color.set(color);
  markerLife = 1;
}

// Zoom
let zoom = 1;
renderer.domElement.addEventListener(
  'wheel',
  (e) => {
    zoom = THREE.MathUtils.clamp(zoom + Math.sign(e.deltaY) * 0.08, 0.6, 1.5);
  },
  { passive: true }
);

// ── Minimap ─────────────────────────────────────────────────
const mm = $('minimap');
const mctx = mm.getContext('2d');
function drawMinimap() {
  const S = mm.width;
  const k = (S / 2 - 8) / ISLAND_RADIUS;
  const c = S / 2;
  mctx.clearRect(0, 0, S, S);
  mctx.fillStyle = 'rgba(3,32,30,0.8)';
  mctx.beginPath();
  mctx.arc(c, c, S / 2 - 1, 0, Math.PI * 2);
  mctx.fill();
  mctx.fillStyle = '#2f7a62';
  mctx.beginPath();
  mctx.arc(c, c, ISLAND_RADIUS * k, 0, Math.PI * 2);
  mctx.fill();
  for (const o of world.orbs) {
    if (o.taken) continue;
    mctx.fillStyle = '#F2C94C';
    mctx.fillRect(c + o.x * k - 1.5, c + o.z * k - 1.5, 3, 3);
  }
  for (const z of world.zones) {
    mctx.fillStyle = z.color;
    mctx.globalAlpha = state.visited.has(z.id) ? 0.55 : 1;
    mctx.beginPath();
    mctx.arc(c + z.pos[0] * k, c + z.pos[1] * k, 5, 0, Math.PI * 2);
    mctx.fill();
    mctx.globalAlpha = 1;
  }
  const px = c + player.position.x * k;
  const pz = c + player.position.z * k;
  const yaw = player.object.rotation.y;
  mctx.save();
  mctx.translate(px, pz);
  mctx.rotate(-yaw + Math.PI);
  mctx.fillStyle = '#fff';
  mctx.beginPath();
  mctx.moveTo(0, -6);
  mctx.lineTo(4.5, 4.5);
  mctx.lineTo(-4.5, 4.5);
  mctx.closePath();
  mctx.fill();
  mctx.restore();
}

// ── Loop ────────────────────────────────────────────────────
const timer = new THREE.Timer();
timer.connect(document);
const camLook = new THREE.Vector3(0, 0, 0);
const camWant = new THREE.Vector3();
const lookWant = new THREE.Vector3();
let minimapTick = 0;

renderer.setAnimationLoop(() => {
  timer.update();
  if (classicOpen) return; // the 3D scene is hidden — save the GPU
  const dt = Math.min(Math.max(timer.getDelta(), 0), 0.1);
  const time = timer.getElapsed();

  world.update(time, dt);

  if (started) {
    player.update(dt, time, input.direction(), world.colliders, (kind) => (kind === 'land' ? sfx.land() : sfx.step()));

    // Orb pickups
    for (const o of world.orbs) {
      if (o.taken) continue;
      const dx = player.position.x - o.x;
      const dz = player.position.z - o.z;
      const dy = player.position.y + 1 - o.mesh.position.y;
      if (dx * dx + dz * dz < 1.1 && Math.abs(dy) < 1.4) {
        o.taken = true;
        o.mesh.visible = false;
        state.orbs++;
        sfx.coin();
        addXP(XP_ORB);
        if (state.orbs === world.orbs.length) toast(t('collector'), t('collectorText'));
        checkCompletion();
      }
    }

    // Zone proximity
    let near = null;
    for (const z of world.zones) {
      if (Math.hypot(player.position.x - z.ringPos.x, player.position.z - z.ringPos.z) < 1.9) near = z;
    }
    if (near !== activeZone) {
      activeZone = near;
      promptBtn.hidden = !near;
      if (near) {
        $('prompt-text').textContent = `${L(near.title)} — ${t('inspect')}`;
        promptBtn.style.setProperty('--zone', near.color);
        sfx.blip();
      }
    }
    if (near && autoOpen === near.id && !player.target && !panel.open) openZone(near.id);

    // Portrait screens: pull back and look down more steeply so more of the island fits
    const portrait = Math.min(1.9, Math.max(1, 1.15 / camera.aspect));
    const z2 = zoom * portrait;
    camWant.set(player.position.x, player.position.y * 0.4 + 12 * z2 * (portrait > 1 ? 1.15 : 1), player.position.z + 14 * z2 * (portrait > 1 ? 0.8 : 1));
    lookWant.set(player.position.x, player.position.y * 0.4 + 1, player.position.z);
  } else {
    // Attract mode: slow orbit around the island
    const a = time * (reducedMotion ? 0.03 : 0.08);
    camWant.set(Math.sin(a) * 36, 20, Math.cos(a) * 36);
    lookWant.set(0, 0, 0);
  }
  const k = 1 - Math.exp(-(started ? 5 : 2) * dt);
  camera.position.lerp(camWant, k);
  camLook.lerp(lookWant, k);
  camera.lookAt(camLook);

  // Fade labels by distance from the player
  for (const z of world.zones) {
    const d = started ? Math.hypot(player.position.x - z.pos[0], player.position.z - z.pos[1]) : 20;
    z.label.style.opacity = String(THREE.MathUtils.clamp(1.4 - d / 22, 0.35, 1));
    z.label.classList.toggle('is-near', activeZone?.id === z.id);
  }

  if (markerLife > 0) {
    markerLife -= dt * 1.5;
    marker.material.opacity = Math.max(0, markerLife);
    const s = 1 + (1 - markerLife) * 0.8;
    marker.scale.set(s, s, s);
  }

  renderer.render(scene, camera);
  labels.render(scene, camera);

  minimapTick += dt;
  if (started && minimapTick > 1 / 20) {
    minimapTick = 0;
    drawMinimap();
  }
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  labels.setSize(innerWidth, innerHeight);
});
