// Tiny synthesized SFX — no audio files needed.
let ctx = null;
let master = null;
let muted = localStorage.getItem('cv-muted') === '1';

export function initAudio() {
  if (ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 0.35;
  master.connect(ctx.destination);
}

export function isMuted() {
  return muted;
}

export function setMuted(v) {
  muted = v;
  localStorage.setItem('cv-muted', v ? '1' : '0');
  if (master) master.gain.setTargetAtTime(v ? 0 : 0.35, ctx.currentTime, 0.02);
}

function tone(freq, { at = 0, dur = 0.12, type = 'square', vol = 0.3, slide = 0 } = {}) {
  if (!ctx || muted) return;
  const t = ctx.currentTime + at;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfx = {
  coin() {
    tone(988, { dur: 0.08, vol: 0.2 });
    tone(1319, { at: 0.07, dur: 0.22, vol: 0.2 });
  },
  jump() {
    tone(330, { dur: 0.16, type: 'triangle', vol: 0.25, slide: 2 });
  },
  land() {
    tone(120, { dur: 0.08, type: 'triangle', vol: 0.15, slide: 0.6 });
  },
  step() {
    tone(180 + Math.random() * 40, { dur: 0.04, type: 'triangle', vol: 0.05 });
  },
  open() {
    tone(523, { dur: 0.07, vol: 0.15 });
    tone(784, { at: 0.06, dur: 0.12, vol: 0.15 });
  },
  close() {
    tone(659, { dur: 0.06, vol: 0.12 });
    tone(440, { at: 0.05, dur: 0.1, vol: 0.12 });
  },
  achievement() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, { at: i * 0.09, dur: 0.18, vol: 0.18 }));
  },
  levelUp() {
    [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, { at: i * 0.07, dur: 0.2, type: 'triangle', vol: 0.22 }));
  },
  blip() {
    tone(880, { dur: 0.05, vol: 0.1 });
  },
};
