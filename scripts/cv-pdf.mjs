// Builds ATS-friendly CV PDFs (single column, plain text, no images) from src/data.js.
// Run: npm run cv:pdf  → public/Furkan_Uysal_CV_TR.pdf + public/Furkan_Uysal_CV_EN.pdf
// Re-run whenever src/data.js changes, then commit the PDFs.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { profile, games, apps, skills, experience, education } from '../src/data.js';

const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && existsSync(p));
if (!CHROME) throw new Error('Chrome/Edge not found — set CHROME_PATH');

const H = {
  tr: { summary: 'Özet', exp: 'İş Deneyimi', projects: 'Projeler', skills: 'Yetenekler', edu: 'Eğitim', tech: 'Teknolojiler' },
  en: { summary: 'Summary', exp: 'Work Experience', projects: 'Projects', skills: 'Skills', edu: 'Education', tech: 'Tech' },
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const bare = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

function html(lang) {
  const L = (v) => (v && typeof v === 'object' && 'tr' in v ? v[lang] : v ?? '');
  const h = H[lang];
  // Projects with screenshots, a live link or from this year; older studio work is already covered under experience
  const projects = [...games, ...apps].filter((p) => p.images || p.link || p.year === '2026');
  const contact = [
    profile.email,
    profile.phone,
    profile.location,
    ...profile.links.map((l) => `<a href="${esc(l.url)}">${esc(/youtube/i.test(l.url) ? L(l.label) : bare(l.url))}</a>`),
  ].filter(Boolean);

  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(profile.name)} CV</title><style>
    @page { size: A4; margin: 15mm 16mm; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; line-height: 1.4; color: #111; margin: 0; }
    h1 { font-size: 20pt; margin: 0; }
    .title { font-size: 12pt; font-weight: bold; margin: 2px 0 4px; }
    .contact { margin: 0 0 6px; }
    a { color: #111; text-decoration: none; }
    h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: .5px; border-bottom: 1px solid #111; margin: 12px 0 6px; padding-bottom: 2px; }
    h3 { font-size: 10.5pt; margin: 0; }
    .item { margin: 0 0 8px; break-inside: avoid; }
    .meta { font-style: italic; margin: 0 0 2px; }
    ul { margin: 2px 0 0; padding-left: 16px; }
    li { margin: 0 0 2px; }
    p { margin: 0; }
  </style></head><body>
  <h1>${esc(profile.name)}</h1>
  <p class="title">${esc(L(profile.title))}</p>
  <p class="contact">${contact.map((c) => (c.startsWith('<a') ? c : esc(c))).join(' | ')}</p>

  <h2>${h.summary}</h2>
  <p>${esc(L(profile.summary))}</p>

  <h2>${h.exp}</h2>
  ${experience
    .map(
      (e) => `<div class="item"><h3>${esc(L(e.role))}${e.company === 'Freelance' ? '' : `, ${esc(e.company)}`}</h3><p class="meta">${esc(L(e.period).replace('—', '–'))}</p>
      <ul>${e.points.map((p) => `<li>${esc(L(p))}</li>`).join('')}</ul></div>`
    )
    .join('')}

  <h2>${h.projects}</h2>
  ${projects
    .map(
      (p) => `<div class="item"><h3>${esc(L(p.title))}${p.link ? ` (<a href="${esc(p.link)}">${esc(bare(p.link))}</a>)` : ''}</h3>
      <p class="meta">${esc([L(p.role ?? p.kind), L(p.year)].filter(Boolean).join(' · '))}</p>
      <p>${esc(L(p.description))}</p><p>${h.tech}: ${esc(p.tech.map(L).join(', '))}</p></div>`
    )
    .join('')}

  <h2>${h.skills}</h2>
  ${skills.map((g) => `<p><b>${esc(L(g.group))}:</b> ${esc(g.items.map((s) => L(s.name)).join(', '))}</p>`).join('')}

  <h2>${h.edu}</h2>
  ${education
    .map((e) => `<div class="item"><h3>${esc(L(e.degree))}, ${esc(L(e.school))}</h3><p class="meta">${esc(L(e.period).replace('—', '–'))}</p></div>`)
    .join('')}
  </body></html>`;
}

const dir = mkdtempSync(join(tmpdir(), 'cv-pdf-'));
for (const lang of ['tr', 'en']) {
  const src = join(dir, `cv-${lang}.html`);
  const out = resolve(`public/Furkan_Uysal_CV_${lang.toUpperCase()}.pdf`);
  writeFileSync(src, html(lang));
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${out}`, pathToFileURL(src).href], {
    stdio: 'ignore',
  });
  if (!existsSync(out)) throw new Error(`PDF not created: ${out}`);
  console.log('✓', out);
}
