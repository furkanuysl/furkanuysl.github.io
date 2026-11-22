import { useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { ArrowUpRight, Check, Copy, FileDown, Gamepad2, Languages, Mail, MapPin, Play } from 'lucide-react';

import { profile, games, apps, skills, experience, education } from '../data.js';
import { L as pick, t as tr, getLang, setLang, onLangChange } from '../i18n.js';
import { cn } from '@/lib/utils';

// Swiss-style CV in the petrol (#00534E) palette.
const VARS = {
  '--c-bg': '#FBFAF7',
  '--c-soft': '#EEF4F2',
  '--c-line': '#D5E1DE',
  '--c-ink': '#0E2A28',
  '--c-muted': '#4F6662',
  '--c-primary': '#00534E',
  '--c-on-primary': '#FFFFFF',
  '--c-on-primary-muted': '#A9D3CC',
  '--c-accent': '#C2410C',
  '--c-accent-bright': '#F2994A',
  '--c-on-accent': '#FFFFFF',
} as CSSProperties;

type Text = string | { tr: string; en: string };
type Project = {
  title: Text;
  year?: Text;
  role?: Text;
  kind?: Text;
  tech: Text[];
  description: Text;
  link?: string;
  images?: string[];
};

// Re-render the page whenever the language changes
function useLang() {
  return useSyncExternalStore((cb) => onLangChange(cb), getLang, getLang);
}
const L = (v: unknown) => pick(v) as string;
const t = (k: string) => tr(k) as string;

const pad = (n: number) => String(n).padStart(2, '0');
const condensed = 'font-extrabold tracking-tight [font-stretch:78%]';

// ── Building blocks ──────────────────────────────────────────

/** Swiss layout row: section label on the left, content on the right */
function Row({ id, no, title, children }: { id: string; no: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="grid gap-6 border-t border-(--c-line) py-12 md:grid-cols-12 md:gap-10 md:py-16">
      <div className="md:col-span-3">
        <div className="md:sticky md:top-24">
          <p className="text-sm font-bold text-(--c-accent)">{no}</p>
          <h2 id={`${id}-t`} className={cn('mt-1 text-3xl leading-none text-(--c-ink) uppercase md:text-4xl', condensed)}>
            {title}
          </h2>
        </div>
      </div>
      <div className="min-w-0 md:col-span-9">{children}</div>
    </section>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(profile.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard blocked — mailto still works */
        }
      }}
      className="inline-flex h-12 cursor-pointer items-center gap-2 border-2 border-(--c-on-primary)/40 px-5 text-sm font-bold text-(--c-on-primary) transition-colors hover:border-(--c-on-primary) print:hidden"
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? t('copied') : t('copy')}
    </button>
  );
}

function ProjectCard({ p, index }: { p: Project; index: number }) {
  return (
    <article className="group relative flex h-full flex-col bg-(--c-bg) p-6 transition-[transform,box-shadow] duration-200 hover:z-10 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(0,83,78,0.55)] print:break-inside-avoid print:hover:translate-y-0">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-(--c-accent) transition-transform duration-300 group-hover:scale-x-100" />
      <div className="flex items-start justify-between gap-4">
        <span className={cn('text-5xl leading-none text-(--c-line) transition-colors group-hover:text-(--c-accent)', condensed)}>{pad(index + 1)}</span>
        <span className="pt-1 text-right text-xs font-semibold whitespace-nowrap text-(--c-muted)">{L(p.year ?? p.kind)}</span>
      </div>
      <h3 className={cn('mt-5 text-2xl leading-tight text-(--c-ink)', condensed)}>{L(p.title)}</h3>
      {p.role && <p className="mt-1 text-sm font-semibold text-(--c-accent)">{L(p.role)}</p>}
      {p.images?.length ? (
        <div data-gallery className="-mx-6 mt-5 flex snap-x gap-2 overflow-x-auto px-6 pb-2 print:hidden">
          {p.images.map((src, i) => (
            <a key={src} href={src} target="_blank" rel="noopener" className="shrink-0 snap-start">
              <img
                src={src}
                alt={`${L(p.title)} ${i + 1}`}
                loading="lazy"
                className="h-44 w-auto border border-(--c-line) object-cover transition-opacity hover:opacity-85"
              />
            </a>
          ))}
        </div>
      ) : null}
      <p className="mt-3 text-[15px] leading-relaxed text-(--c-muted)">{L(p.description)}</p>
      <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-5 text-xs font-bold tracking-wide text-(--c-ink) uppercase">
        {p.tech.map((x) => (
          <li key={L(x)} className="before:mr-3 before:text-(--c-line) before:content-['/'] first:before:hidden">
            {L(x)}
          </li>
        ))}
      </ul>
      {p.link && (
        <a href={p.link} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-1 self-start text-sm font-bold text-(--c-ink) underline underline-offset-4">
          {t('view')} <ArrowUpRight className="size-4" />
        </a>
      )}
    </article>
  );
}

// ── Page ─────────────────────────────────────────────────────

export default function ClassicApp({ onBack }: { onBack: () => void }) {
  const lang = useLang();
  const [firstName, ...lastNames] = profile.name.split(' ');
  const year = new Date().getFullYear();
  const [h1, h2, h3] = tr('contactHeadline') as unknown as string[];

  return (
    <div
      style={VARS}
      className="min-h-screen overflow-x-clip bg-(--c-bg) font-body text-(--c-ink) antialiased selection:bg-(--c-primary) selection:text-(--c-on-primary) print:[print-color-adjust:exact] print:[-webkit-print-color-adjust:exact]"
    >
      {/* top bar */}
      <div className="sticky top-0 z-20 border-b border-(--c-line) bg-(--c-bg)/90 backdrop-blur print:hidden">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
          <a href="#top" className="flex items-center gap-3">
            <span className={cn('grid size-9 place-items-center bg-(--c-primary) text-sm text-(--c-on-primary)', condensed)}>{profile.initials}</span>
            <span className="hidden h-5 w-1 bg-(--c-accent-bright) sm:block" aria-hidden="true" />
            <span className="hidden text-sm font-bold sm:block">{profile.name}</span>
          </a>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
              aria-label={`${t('language')}: ${t('switchTo')}`}
              title={t('switchTo')}
              className="inline-flex h-10 cursor-pointer items-center gap-1.5 border border-(--c-line) px-3 text-sm font-bold text-(--c-ink) transition-colors hover:border-(--c-primary)"
            >
              <Languages className="size-4 text-(--c-primary)" aria-hidden="true" />
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>
            {profile.cvPdf && (
              <a
                href={L(profile.cvPdf)}
                download
                aria-label={t('downloadPdf')}
                className="inline-flex h-10 cursor-pointer items-center gap-2 px-3 text-sm font-bold text-(--c-ink) transition-colors hover:bg-(--c-soft)"
              >
                <FileDown className="size-4" /> <span className="hidden md:inline">{t('downloadPdf')}</span>
              </a>
            )}
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-10 cursor-pointer items-center gap-2 bg-(--c-primary) px-4 text-sm font-bold whitespace-nowrap text-(--c-on-primary) transition-opacity hover:opacity-90"
            >
              <Gamepad2 className="size-4" /> {t('backToGame')}
            </button>
          </div>
        </div>
      </div>

      <div id="top" className="mx-auto max-w-6xl px-5">
        {/* header */}
        <header className="grid gap-10 pt-14 pb-12 md:grid-cols-12 md:pt-20 md:pb-16">
          <div className="md:col-span-8">
            <p className="flex items-center gap-3 text-sm font-bold tracking-[0.18em] text-(--c-accent) uppercase">
              <span className="h-0.5 w-10 bg-(--c-accent)" aria-hidden="true" />
              {L(profile.title)}
            </p>
            <h1 className={cn('mt-6 text-[17vw] leading-[0.82] text-(--c-ink) uppercase sm:text-8xl md:text-[8.5rem]', condensed)}>
              {firstName}
              <br />
              <span className="text-(--c-primary) [-webkit-text-stroke:2px_var(--c-primary)] [-webkit-text-fill-color:transparent] print:[-webkit-text-fill-color:var(--c-primary)]">
                {lastNames.join(' ')}
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-snug text-(--c-muted) md:text-2xl">{L(profile.subtitle)}</p>
          </div>

          <aside className="self-end md:col-span-4">
            <dl className="divide-y divide-(--c-line) border-y-2 border-(--c-ink) text-sm">
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="font-bold tracking-wider text-(--c-muted) uppercase">{t('email')}</dt>
                <dd>
                  <a href={`mailto:${profile.email}`} className="font-semibold break-all hover:text-(--c-accent)">
                    {profile.email}
                  </a>
                </dd>
              </div>
              {profile.phone && (
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="font-bold tracking-wider text-(--c-muted) uppercase">{t('phone')}</dt>
                  <dd className="font-semibold">{profile.phone}</dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="font-bold tracking-wider text-(--c-muted) uppercase">{t('location')}</dt>
                <dd className="inline-flex items-center gap-1.5 font-semibold">
                  <MapPin className="size-4 text-(--c-accent)" aria-hidden="true" />
                  {profile.location}
                </dd>
              </div>
              {profile.links.map((l) => {
                const isYt = /youtube/i.test(L(l.label));
                return (
                  <div key={l.url} className="flex items-center justify-between gap-4 py-3">
                    <dt className="font-bold tracking-wider text-(--c-muted) uppercase">{isYt ? t('portfolio') : L(l.label)}</dt>
                    <dd>
                      <a href={l.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold hover:text-(--c-accent)">
                        {isYt ? 'YouTube' : t('profile')} <ArrowUpRight className="size-4" />
                      </a>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </aside>
        </header>
      </div>

      {/* stat band */}
      <div className="bg-(--c-primary) text-(--c-on-primary)">
        <dl className="mx-auto grid max-w-6xl grid-cols-1 divide-(--c-on-primary)/15 px-5 sm:grid-cols-3 sm:divide-x">
          {profile.facts.map((f, i) => (
            <div
              key={L(f.label)}
              className={cn('border-(--c-on-primary)/15 py-5 not-first:border-t sm:border-t-0 sm:px-8 sm:py-8', i === 0 && 'sm:pl-0')}
            >
              <dt className="text-xs font-bold tracking-[0.2em] text-(--c-on-primary-muted) uppercase">{L(f.label)}</dt>
              <dd className={cn('mt-2 text-4xl leading-none md:text-5xl', condensed)}>{L(f.value)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <main className="mx-auto max-w-6xl px-5">
        <Row id="about" no="01" title={t('about')}>
          <p className="max-w-3xl text-xl leading-relaxed text-(--c-ink) md:text-2xl md:leading-relaxed">{L(profile.summary)}</p>
        </Row>

        <Row id="experience" no="02" title={t('experience')}>
          <ol className="divide-y divide-(--c-line)">
            {experience.map((e, i) => (
              <li key={e.company + L(e.period)} className="grid gap-4 py-8 first:pt-0 last:pb-0 md:grid-cols-[170px_1fr] print:break-inside-avoid">
                <div>
                  <p className="text-sm font-bold text-(--c-accent)">{L(e.period)}</p>
                  {i === 0 && (
                    <span className="mt-2 inline-flex items-center gap-1.5 bg-(--c-soft) px-2 py-1 text-[11px] font-bold tracking-wider text-(--c-ink) uppercase">
                      <span className="size-1.5 rounded-full bg-(--c-accent-bright)" aria-hidden="true" />
                      {t('current')}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className={cn('text-2xl leading-tight md:text-3xl', condensed)}>{L(e.role)}</h3>
                  <p className="mt-1 font-semibold text-(--c-muted)">{e.company}</p>
                  <ul className="mt-4 grid gap-2.5 text-[15px] leading-relaxed text-(--c-ink)/85">
                    {e.points.map((pt) => (
                      <li key={L(pt)} className="flex gap-3">
                        <span className="mt-[11px] h-0.5 w-3 shrink-0 bg-(--c-accent-bright)" aria-hidden="true" />
                        <span>{L(pt)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Row>

        <Row id="games" no="03" title={t('games')}>
          {profile.portfolio && (
            <a href={profile.portfolio} target="_blank" rel="noopener" className="group mb-8 inline-flex items-center gap-4 print:hidden">
              <span className="grid size-14 place-items-center rounded-full bg-(--c-primary) text-(--c-on-primary) transition-transform group-hover:scale-110">
                <Play className="size-5 translate-x-0.5 fill-current" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-bold tracking-[0.2em] text-(--c-muted) uppercase">{t('portfolio')}</span>
                <span className="text-lg font-bold underline-offset-4 group-hover:underline">{t('watchGameplay')}</span>
              </span>
            </a>
          )}
          <div className="grid gap-px border border-(--c-line) bg-(--c-line) sm:grid-cols-2">
            {(games as Project[]).map((p, i) => (
              <ProjectCard key={L(p.title)} p={p} index={i} />
            ))}
          </div>
        </Row>

        <Row id="apps" no="04" title={t('apps')}>
          <div className="grid gap-px border border-(--c-line) bg-(--c-line) sm:grid-cols-2">
            {(apps as Project[]).map((p, i) => (
              <ProjectCard key={L(p.title)} p={p} index={i} />
            ))}
          </div>
        </Row>

        <Row id="skills" no="05" title={t('skills')}>
          <div className="grid gap-10 sm:grid-cols-3">
            {skills.map((g) => (
              <div key={L(g.group)}>
                <h3 className="border-b-2 border-(--c-ink) pb-2 text-sm font-bold tracking-[0.15em] uppercase">{L(g.group)}</h3>
                <ul className="divide-y divide-(--c-line)">
                  {g.items.map((s) => (
                    <li key={L(s.name)} className="py-2.5 text-[15px] font-medium">
                      {L(s.name)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Row>

        <Row id="education" no="06" title={t('education')}>
          <ul className="grid gap-px border border-(--c-line) bg-(--c-line) sm:grid-cols-2">
            {education.map((e) => (
              <li key={L(e.school)} className="bg-(--c-bg) p-6">
                <p className="text-sm font-bold text-(--c-accent)">{L(e.period)}</p>
                <p className={cn('mt-2 text-2xl leading-tight', condensed)}>{L(e.degree)}</p>
                <p className="mt-1 text-(--c-muted)">{L(e.school)}</p>
              </li>
            ))}
          </ul>
        </Row>
      </main>

      {/* contact band */}
      <section id="contact" aria-labelledby="contact-t" className="mt-8 bg-(--c-primary) text-(--c-on-primary) print:mt-0">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-3">
            <p className="text-sm font-bold text-(--c-on-primary-muted)">07</p>
            <h2 id="contact-t" className={cn('mt-1 text-3xl leading-none uppercase md:text-4xl', condensed)}>
              {t('contact')}
            </h2>
          </div>
          <div className="md:col-span-9">
            <p className={cn('max-w-3xl text-5xl leading-[0.95] uppercase md:text-7xl', condensed)}>
              {h1} <span className="text-(--c-accent-bright)">{h2}</span>
              {h3 === '.' ? '.' : ` ${h3}`}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex h-12 items-center gap-2 bg-(--c-accent-bright) px-6 text-sm font-bold text-(--c-ink) transition-opacity hover:opacity-90"
              >
                <Mail className="size-4" /> {profile.email}
              </a>
              <CopyEmail />
              {profile.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex h-12 items-center gap-2 border-2 border-(--c-on-primary)/40 px-5 text-sm font-bold transition-colors hover:border-(--c-on-primary) print:hidden"
                >
                  {L(l.label)} <ArrowUpRight className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-(--c-on-primary)/15">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-(--c-on-primary-muted)">
            <span>
              © {year} {profile.name}
            </span>
            <button type="button" onClick={onBack} className="cursor-pointer font-bold text-(--c-on-primary) underline-offset-4 hover:underline print:hidden">
              {t('playableVersion')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
