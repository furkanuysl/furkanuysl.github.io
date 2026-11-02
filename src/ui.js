import { profile, games, apps, skills, experience, education, zones } from './data.js';
import { L, t, onLangChange } from './i18n.js';

// esc() also localizes { tr, en } values, so every field below is language-aware
const esc = (s = '') =>
  String(L(s) ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Lucide-style inline icons (no emoji as icons)
export const icon = {
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
};

const tags = (arr) => `<ul class="tags">${arr.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;
const linkBtn = (url, label) =>
  url ? `<a class="btn btn--ghost btn--sm" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)} ${icon.ext}</a>` : '';

function aboutHTML() {
  return `
    <div class="about">
      <div class="about__head">
        <div class="avatar avatar--lg" aria-hidden="true">${esc(profile.initials)}</div>
        <div>
          <h3 class="about__name">${esc(profile.name)}</h3>
          <p class="about__title">${esc(profile.title)}</p>
          <p class="muted inline-icon">${icon.pin} ${esc(profile.location)}</p>
          ${profile.available ? `<span class="badge badge--live">${t('openToWork')}</span>` : ''}
        </div>
      </div>
      <p class="lead">${esc(profile.summary)}</p>
      <dl class="facts">
        ${profile.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}
      </dl>
    </div>`;
}

function gamesHTML() {
  const reel = profile.portfolio
    ? `<div class="reel"><p class="muted">${t('reelText')}</p>${linkBtn(profile.portfolio, t('watchVideos'))}</div>`
    : '';
  return `${reel}<div class="cards">${games
    .map(
      (g) => `
      <article class="card">
        <header class="card__head"><h3>${esc(g.title)}</h3><span class="muted">${esc(g.year)}</span></header>
        <p class="card__role">${esc(g.role)}</p>
        <p>${esc(g.description)}</p>
        ${tags(g.tech)}
        ${linkBtn(g.link, t('playView'))}
      </article>`
    )
    .join('')}</div>`;
}

function appsHTML() {
  return `<div class="cards">${apps
    .map(
      (a) => `
      <article class="card">
        <header class="card__head"><h3>${esc(a.title)}</h3><span class="badge">${esc(a.kind)}</span></header>
        <p>${esc(a.description)}</p>
        ${tags(a.tech)}
        ${linkBtn(a.link, t('view'))}
      </article>`
    )
    .join('')}</div>`;
}

function skillsHTML() {
  return skills
    .map(
      (grp) => `
      <section class="skill-group">
        <h3>${esc(grp.group)}</h3>
        ${grp.items.every((s) => s.level == null)
          ? tags(grp.items.map((s) => s.name))
          : `<ul class="skills">
          ${grp.items
            .map(
              (s) => `
            <li>
              <div class="skill__row"><span>${esc(s.name)}</span><span class="muted">${s.level}</span></div>
              <div class="bar" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.level}" aria-label="${esc(s.name)}">
                <span style="--v:${s.level}%"></span>
              </div>
            </li>`
            )
            .join('')}
        </ul>`}
      </section>`
    )
    .join('');
}

function experienceHTML() {
  return `<ol class="timeline">${experience
    .map(
      (e) => `
      <li>
        <div class="timeline__period">${esc(e.period)}</div>
        <h3>${esc(e.role)} <span class="muted">· ${esc(e.company)}</span></h3>
        <ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      </li>`
    )
    .join('')}</ol>
    ${
      education.length
        ? `<h3 class="sub-title">${t('education')}</h3>
      <ol class="timeline">${education
        .map(
          (e) => `
        <li>
          <div class="timeline__period">${esc(e.period)}</div>
          <h3>${esc(e.degree)} <span class="muted">· ${esc(e.school)}</span></h3>
        </li>`
        )
        .join('')}</ol>`
        : ''
    }`;
}

function contactHTML() {
  return `
    <p class="lead">${t('contactLead')}</p>
    <div class="contact">
      <a class="btn btn--primary" href="mailto:${esc(profile.email)}">${icon.mail} ${esc(profile.email)}</a>
      <button class="btn btn--ghost" type="button" data-copy="${esc(profile.email)}">${icon.copy} ${t('copy')}</button>
      ${profile.phone ? `<a class="btn btn--ghost" href="tel:${esc(profile.phone.replace(/\s/g, ''))}">${esc(profile.phone)}</a>` : ''}
    </div>
    <ul class="links">
      ${profile.links.map((l) => `<li>${linkBtn(l.url, l.label)}</li>`).join('')}
      ${profile.cvPdf ? `<li><a class="btn btn--ghost btn--sm" href="${esc(profile.cvPdf)}" download>${icon.file} ${t('cvPdf')}</a></li>` : ''}
    </ul>`;
}

export const sections = {
  about: aboutHTML,
  games: gamesHTML,
  apps: appsHTML,
  skills: skillsHTML,
  experience: experienceHTML,
  contact: contactHTML,
};

// ── Panel (modal dialog) ────────────────────────────────────
export function createPanel({ onClose }) {
  const dlg = document.getElementById('panel');
  const title = dlg.querySelector('.panel__title');
  const kicker = dlg.querySelector('.panel__kicker');
  const body = dlg.querySelector('.panel__body');

  dlg.addEventListener('close', () => onClose());
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close(); // backdrop click
    const copy = e.target.closest('[data-copy]');
    if (copy) copyText(copy);
  });
  dlg.querySelector('.panel__close').addEventListener('click', () => dlg.close());

  let currentZone = null;
  function render(zoneId) {
    const z = zones.find((zz) => zz.id === zoneId);
    dlg.style.setProperty('--zone', z.color);
    kicker.textContent = L(z.hint);
    title.textContent = L(z.title);
    body.innerHTML = sections[zoneId]();
  }
  // Re-render an open zone panel when the language changes; custom panels just close
  onLangChange(() => {
    if (!dlg.open) return;
    if (currentZone) render(currentZone);
    else dlg.close();
  });

  return {
    get open() {
      return dlg.open;
    },
    show(zoneId) {
      currentZone = zoneId;
      render(zoneId);
      body.scrollTop = 0;
      dlg.showModal();
    },
    showCustom(k, heading, html, color = '#F2C94C') {
      currentZone = null;
      dlg.style.setProperty('--zone', color);
      kicker.textContent = k;
      title.textContent = heading;
      body.innerHTML = html;
      dlg.showModal();
    },
    close() {
      if (dlg.open) dlg.close();
    },
  };
}

export async function copyText(btn) {
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    const old = btn.innerHTML;
    btn.innerHTML = `${icon.check} ${t('copied')}`;
    setTimeout(() => (btn.innerHTML = old), 1600);
  } catch {
    /* clipboard blocked — the mailto link still works */
  }
}

// ── Toasts ──────────────────────────────────────────────────
export function toast(title, text, kind = 'achievement') {
  const wrap = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = `toast toast--${kind}`;
  el.innerHTML = `<span class="toast__icon">${icon.trophy}</span><div><strong>${esc(title)}</strong><span>${esc(text)}</span></div>`;
  wrap.appendChild(el);
  setTimeout(() => el.classList.add('toast--out'), 3200);
  setTimeout(() => el.remove(), 3700);
}
