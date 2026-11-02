// Tiny i18n: UI strings live here, CV content in data.js uses { tr, en } objects.

const STORAGE_KEY = 'cv-lang';
const listeners = new Set();

let lang = (() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'tr' || saved === 'en') return saved;
  return (navigator.language || 'tr').toLowerCase().startsWith('tr') ? 'tr' : 'en';
})();

export const getLang = () => lang;

export function setLang(next) {
  if (next === lang || (next !== 'tr' && next !== 'en')) return;
  lang = next;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  for (const fn of listeners) fn(lang);
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Pick the current language from a { tr, en } value; plain strings pass through. */
export function L(value) {
  if (value && typeof value === 'object' && ('tr' in value || 'en' in value)) return value[lang] ?? value.tr ?? value.en;
  return value;
}

const STRINGS = {
  tr: {
    loading: 'Yükleniyor…',
    start: 'Oyuna Başla',
    startKeys: '<kbd>Enter</kbd> ile başla',
    skipGame: "Oyun istemiyorum — klasik CV'yi göster",
    classicCv: 'Klasik CV',
    soundOff: 'Sesi kapat',
    soundOn: 'Sesi aç',
    help: 'Kontroller ve yardım',
    quests: 'Görevler',
    orbs: 'XP küreleri',
    progress: 'Keşif ilerlemesi',
    inspect: 'incele',
    hint: '<kbd>WASD</kbd> yürü · <kbd>Space</kbd> zıpla · <kbd>E</kbd> incele · ya da yere <b>tıkla</b>',
    jump: 'Zıpla',
    close: 'Kapat',
    escClose: '<kbd>Esc</kbd> ile kapat',
    language: 'Dil',
    switchTo: 'English',
    zoneFound: 'Bölge keşfedildi',
    levelUp: (n) => `Seviye ${n}!`,
    keepExploring: 'Keşfetmeye devam et.',
    collector: 'Koleksiyoncu',
    collectorText: 'Tüm XP kürelerini topladın!',
    achievement: 'Başarım açıldı',
    complete: '%100 Tamamlandı!',
    completeHtml:
      '<p class="lead">Adanın her köşesini gezdin, tüm XP kürelerini topladın. Bu titizliği ekibimde görmek isterim.</p><p>Bir sonraki adım: <b>İletişim</b> bölgesine uğrayıp bana yazmak.</p>',
    writeNow: 'Hemen yaz',
    howToPlay: 'Nasıl oynanır',
    controls: 'Kontroller',
    helpHtml: `<ul class="controls">
       <li><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / ok tuşları</span><span>Yürü</span></li>
       <li><span><kbd>Space</kbd></span><span>Zıpla (yüksekteki küreler için)</span></li>
       <li><span><kbd>E</kbd> / <kbd>Enter</kbd></span><span>Bölgeyi incele</span></li>
       <li><span>Yere / objeye tıkla</span><span>Oraya yürü</span></li>
       <li><span>Fare tekerleği</span><span>Yakınlaş / uzaklaş</span></li>
       <li><span>Mobil</span><span>Sol altta joystick, sağda zıplama</span></li>
     </ul>
     <p class="muted">Oyun oynamak istemiyorsan sağ üstteki <b>Klasik CV</b> her şeyi tek sayfada gösterir.</p>`,
    // panels
    openToWork: 'Yeni projelere açığım',
    playView: 'Oyna / İncele',
    view: 'İncele',
    watchVideos: 'Videoları izle',
    reelText: 'Oynanış videoları ve demolar YouTube portfolyomda.',
    education: 'Eğitim',
    contactLead: 'Bir oyun, araç ya da uygulama fikrin mi var? Bir mesaj kadar uzağındayım.',
    copy: 'Kopyala',
    copied: 'Kopyalandı',
    cvPdf: 'CV (PDF)',
    // classic CV
    backToGame: 'Oyuna dön',
    print: 'Yazdır',
    email: 'E-posta',
    phone: 'Telefon',
    location: 'Konum',
    portfolio: 'Portfolyo',
    profile: 'Profil',
    about: 'Hakkımda',
    experience: 'Deneyim',
    games: 'Oyun Projeleri',
    apps: 'Web & Masaüstü',
    skills: 'Yetenekler',
    contact: 'İletişim',
    current: 'Güncel',
    watchGameplay: 'Oynanış videolarını izle',
    contactHeadline: ['Bir sonraki oyunu', 'birlikte', 'yapalım.'],
    playableVersion: "Bu CV'nin oynanabilir hâli → adayı gez",
  },
  en: {
    loading: 'Loading…',
    start: 'Start Game',
    startKeys: 'Press <kbd>Enter</kbd> to start',
    skipGame: 'Skip the game — show the classic CV',
    classicCv: 'Classic CV',
    soundOff: 'Mute sound',
    soundOn: 'Unmute sound',
    help: 'Controls and help',
    quests: 'Quests',
    orbs: 'XP orbs',
    progress: 'Exploration progress',
    inspect: 'inspect',
    hint: '<kbd>WASD</kbd> move · <kbd>Space</kbd> jump · <kbd>E</kbd> inspect · or <b>click</b> the ground',
    jump: 'Jump',
    close: 'Close',
    escClose: 'Press <kbd>Esc</kbd> to close',
    language: 'Language',
    switchTo: 'Türkçe',
    zoneFound: 'Zone discovered',
    levelUp: (n) => `Level ${n}!`,
    keepExploring: 'Keep exploring.',
    collector: 'Collector',
    collectorText: 'You collected every XP orb!',
    achievement: 'Achievement unlocked',
    complete: '100% Complete!',
    completeHtml:
      '<p class="lead">You explored every corner of the island and collected every XP orb. I\'d love that kind of thoroughness on my team.</p><p>Next step: visit the <b>Contact</b> zone and drop me a message.</p>',
    writeNow: 'Write to me',
    howToPlay: 'How to play',
    controls: 'Controls',
    helpHtml: `<ul class="controls">
       <li><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / arrow keys</span><span>Move</span></li>
       <li><span><kbd>Space</kbd></span><span>Jump (for the high orbs)</span></li>
       <li><span><kbd>E</kbd> / <kbd>Enter</kbd></span><span>Inspect a zone</span></li>
       <li><span>Click the ground / an object</span><span>Walk there</span></li>
       <li><span>Mouse wheel</span><span>Zoom in / out</span></li>
       <li><span>Mobile</span><span>Joystick bottom-left, jump on the right</span></li>
     </ul>
     <p class="muted">Not in the mood to play? <b>Classic CV</b> (top right) shows everything on one page.</p>`,
    openToWork: 'Open to new projects',
    playView: 'Play / View',
    view: 'View',
    watchVideos: 'Watch videos',
    reelText: 'Gameplay videos and demos are in my YouTube portfolio.',
    education: 'Education',
    contactLead: 'Got a game, tool or app idea? I\'m one message away.',
    copy: 'Copy',
    copied: 'Copied',
    cvPdf: 'CV (PDF)',
    backToGame: 'Back to game',
    print: 'Print',
    email: 'Email',
    phone: 'Phone',
    location: 'Location',
    portfolio: 'Portfolio',
    profile: 'Profile',
    about: 'About',
    experience: 'Experience',
    games: 'Game Projects',
    apps: 'Web & Desktop',
    skills: 'Skills',
    contact: 'Contact',
    current: 'Current',
    watchGameplay: 'Watch gameplay videos',
    contactHeadline: ["Let's build your next game", 'together', '.'],
    playableVersion: 'Playable version of this CV → explore the island',
  },
};

export function t(key, ...args) {
  const v = STRINGS[lang][key] ?? STRINGS.tr[key] ?? key;
  return typeof v === 'function' ? v(...args) : v;
}

document.documentElement.lang = lang;
