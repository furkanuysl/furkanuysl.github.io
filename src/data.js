// ─────────────────────────────────────────────────────────────
//  TÜM CV İÇERİĞİ BURADA. Sadece bu dosyayı düzenlemen yeterli.
//  Dile bağlı alanlar { tr: '…', en: '…' } şeklinde yazılır.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Furkan Uysal',
  initials: 'FU',
  title: { tr: 'Yazılım Geliştirici', en: 'Software Developer' },
  subtitle: {
    tr: 'Oyunlardan web panellerine ve masaüstü uygulamalarına kadar, fikirden yayına uçtan uca yazılım geliştiriyorum.',
    en: 'I build software end to end, from games to web dashboards and desktop apps, taking ideas all the way to release.',
  },
  location: 'Çubuk, Ankara',
  email: 'm.furkanysl@gmail.com',
  phone: '', // örn. '0545 275 11 73' — boş bırakırsan sitede gösterilmez
  available: false, // true yaparsan "Yeni projelere açığım" rozeti görünür
  summary: {
    tr:
      '2021’den beri yazılım geliştiren, oyun ve web tarafında ürünleri baştan sona kendisi kurup yayına alan bir geliştiriciyim. ' +
      'Unreal Engine ile Souls-like dövüş sistemleri, boss yapay zekâları ve etkileşimli mimari görselleştirmeler geliştirdim; ' +
      'C++ ile sunucu otoriteli çok oyunculu bir oyun, Unity ile mobil puzzle, parti ve idle/tycoon oyunları yaptım. ' +
      'Web tarafında Next.js, React ve Supabase ile inşaat ve site yönetimi için rol bazlı CRM panelleri, SEO odaklı kurumsal siteler geliştirdim; ' +
      'Tauri ve Rust ile açık kaynak bir masaüstü uygulaması yayınladım. Temiz mimariye, performansa ve kullanıcı deneyimine önem veriyorum. ' +
      'Şu an Sefa Grup’ta yazılım geliştirici olarak çalışıyor, Yönetim Bilişim Sistemleri okuyorum.',
    en:
      'Software developer building since 2021, taking game and web products from first commit to release on my own. ' +
      'With Unreal Engine I built Souls-like combat systems, boss AI and interactive architectural visualizations; ' +
      'I shipped a server-authoritative multiplayer game in C++, and mobile puzzle, party and idle/tycoon games in Unity. ' +
      'On the web I built role-based CRM dashboards for construction and property management with Next.js, React and Supabase, ' +
      'plus SEO-focused business websites, and I released an open-source desktop app with Tauri and Rust. I care about clean architecture, ' +
      'performance and user experience. I currently work as a software developer at Sefa Grup and study Management Information Systems.',
  },
  facts: [
    { label: { tr: 'Deneyim', en: 'Experience' }, value: { tr: '5+ yıl', en: '5+ years' } },
    { label: { tr: 'Odak', en: 'Focus' }, value: { tr: 'Oyun & Web', en: 'Games & Web' } },
    { label: { tr: 'Teknolojiler', en: 'Stack' }, value: 'Unreal · Unity · Next.js' },
  ],
  portfolio: 'https://youtube.com/playlist?list=PLsEWusgi79Wlz8dn-76ZRFsHpWv1Zuahl',
  links: [
    {
      label: { tr: 'Portfolyo (YouTube)', en: 'Portfolio (YouTube)' },
      url: 'https://youtube.com/playlist?list=PLsEWusgi79Wlz8dn-76ZRFsHpWv1Zuahl',
    },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/furkan-uysal-41490321a/' },
    { label: 'GitHub', url: 'https://github.com/furkanuysl' },
  ],
  // ATS uyumlu PDF'ler: `npm run cv:pdf` ile bu dosyadan üretilir (public/ altına). Boşsa buton gizlenir.
  cvPdf: { tr: 'Furkan_Uysal_CV_TR.pdf', en: 'Furkan_Uysal_CV_EN.pdf' },
};

// Proje görselleri public/projects/ altında
const shots = (name, nums) => nums.map((n) => `projects/${name}-${n}.webp`);

// Oyun projeleri (Atari makinesi bölgesi)
// icon: swords | brain | building | shirt | phone | person | rocket | globe | gamepad | code
export const games = [
  {
    title: { tr: 'Kubiko: Mobil 3D Puzzle', en: 'Kubiko: Mobile 3D Puzzle' },
    icon: 'gamepad',
    year: '2026',
    role: 'Freelance · Unity Developer',
    tech: ['Unity', 'C#', 'URP', 'Unity Gaming Services'],
    description: {
      tr:
        'Android/iOS için 6 yüzlü bir küp üzerinde oynanan, block-blast türünde sonsuz puzzle oyunu. Küp topolojisini ' +
        'motordan bağımsız saf C# ile yazıp EditMode testleriyle doğruladım; katmanlı, olay tabanlı mimari, arcball dokunmatik ' +
        'kontroller, online skor tablosu, kombo sistemi ve custom lava shader’ı geliştirdim.',
      en:
        'An endless block-blast puzzle for Android/iOS played on a six-faced cube. I wrote the cube topology as engine-independent ' +
        'C# covered by EditMode tests, with a layered event-driven architecture, arcball touch controls, online leaderboards, ' +
        'combos and a custom lava shader.',
    },
    images: shots('kubiko', [1, 2, 3, 4]),
    link: '',
  },
  {
    title: { tr: 'Cep Arenası: Mobil Parti Oyunu', en: 'Pocket Arena: Mobile Party Game' },
    icon: 'gamepad',
    year: '2026',
    role: 'Freelance · Unity Developer',
    tech: ['Unity 6', 'C#', 'Android', 'Bot AI'],
    description: {
      tr:
        'Tek telefonda 4 kişiye kadar oynanan, 30 mini oyunlu yerel çok oyunculu parti oyunu. Eksik oyuncuların yerine geçen ' +
        'bot yapay zekâsı, turnuva modu, açılabilir içerikler, TR/EN dil desteği ve ödüllü reklam altyapısı; 7.000+ satır C#.',
      en:
        'A local multiplayer party game for up to 4 players on one phone, with 30 mini-games. Bot AI fills in for missing players, ' +
        'plus a tournament mode, unlockable content, TR/EN localization and rewarded ads, in 7,000+ lines of C#.',
    },
    images: shots('pocket', [1, 2, 3, 4]),
    link: '',
  },
  {
    title: { tr: 'Valet City: Idle Tycoon', en: 'Valet City: Idle Tycoon' },
    icon: 'phone',
    year: '2026',
    role: 'Freelance · Unity Developer',
    tech: ['Unity 6', 'C#', 'Event Bus', 'Object Pooling'],
    description: {
      tr:
        'Oyuncunun vale otoparkları kurup büyüttüğü mobil idle/tycoon oyunu. Modüler kod tabanı, çevrimdışı ' +
        'kazanç ve prestij ekonomisi, trafik/yaya/vale yapay zekâsı, günlük görevler ve mobil optimizasyon.',
      en:
        'A mobile idle/tycoon game where players build and grow valet parking businesses. A modular codebase, offline ' +
        'earnings and prestige economy, traffic/pedestrian/valet AI, daily tasks and mobile optimization.',
    },
    images: shots('valet', [6, 7, 8, 9]),
    link: '',
  },
  {
    title: { tr: 'BalloonAscent: Co-op Tırmanma', en: 'BalloonAscent: Co-op Climbing' },
    icon: 'rocket',
    year: '2026',
    role: { tr: 'Kişisel proje · Gameplay Programmer', en: 'Personal project · Gameplay Programmer' },
    tech: ['Unreal Engine 5', 'C++', 'Replication/RPC', 'Steam'],
    description: {
      tr:
        'Tamamen C++ ile yazılmış, 10 oyuncuya kadar online co-op tırmanma oyunu. Sunucu otoriteli listen-server multiplayer ' +
        've client prediction, bölgeye göre değişen çarpışma, rebirth/prestij ekonomisi, Steam lobi ve davetleri, botlu soak ve otomasyon testleri.',
      en:
        'An online co-op climbing game for up to 10 players, written entirely in C++. Server-authoritative listen-server multiplayer ' +
        'with client prediction, zone-based collision, a rebirth/prestige economy, Steam lobbies and invites, and bot-driven soak and automation tests.',
    },
    link: '',
  },
  {
    title: { tr: 'Souls-like Dövüş Sistemi', en: 'Souls-like Combat System' },
    icon: 'swords',
    year: '2021 – 2023',
    role: 'Netco Prodüksiyon · Gameplay',
    tech: ['Unreal Engine', 'Blueprint', 'Animation'],
    description: {
      tr: 'Stamina yönetimi, vuruş tepkileri, kombo mantığı ve animasyon güdümlü oynanışa sahip Souls-like dövüş sistemi.',
      en: 'A Souls-like combat system with stamina management, hit reactions, combo logic and animation-driven gameplay.',
    },
    link: '',
  },
  {
    title: { tr: 'Çok Fazlı Boss AI', en: 'Multi-Phase Boss AI' },
    icon: 'brain',
    year: '2021 – 2023',
    role: 'Netco Prodüksiyon · AI',
    tech: ['Behavior Trees', 'State Machines', 'Unreal Engine'],
    description: {
      tr: 'Çok fazlı davranışlara ve oyuncuya uyum sağlayan saldırı desenlerine sahip gelişmiş boss yapay zekâları.',
      en: 'Advanced boss AI systems featuring multi-phase behaviors and adaptive combat patterns.',
    },
    link: '',
  },
  {
    title: { tr: 'Etkileşimli Mimari Görselleştirme', en: 'Interactive Architectural Visualization' },
    icon: 'building',
    year: '2025',
    role: 'Configgo · Unreal Engine Developer',
    tech: ['Unreal Engine', 'Real-Time Lighting', 'Blueprint'],
    description: {
      tr:
        'Kullanıcının daire seçip içine girdiği ve kontrol edilebilir bir karakterle serbestçe gezdiği uygulamalar. ' +
        'Farklı ışık koşulları için gerçek zamanlı ışık simülasyonu, dış cepheden iç mekâna kesintisiz geçişler.',
      en:
        'Applications where users select apartments, enter interiors and freely explore with a controllable character. ' +
        'Real-time lighting simulation for different lighting conditions and seamless exterior-to-interior transitions.',
    },
    link: '',
  },
  {
    title: { tr: 'Kumaş & Saç Fiziği', en: 'Cloth & Hair Physics' },
    icon: 'shirt',
    year: '2021 – 2023',
    role: { tr: 'Karakter Fiziği', en: 'Character Physics' },
    tech: ['Cloth Simulation', 'Hair Physics', { tr: 'Optimizasyon', en: 'Optimization' }],
    description: {
      tr: 'Görsel kalite ile performans arasında dengelenmiş fizik tabanlı kıyafetler ve gerçekçilik için saç fiziği.',
      en: 'Physics-based clothing balanced for visual quality and performance, plus hair physics for character realism.',
    },
    link: '',
  },
  {
    title: { tr: 'Mobil Oyun Projeleri', en: 'Mobile Game Projects' },
    icon: 'phone',
    year: '2021 – 2023',
    role: { tr: 'Gameplay Programlama', en: 'Gameplay Programming' },
    tech: ['Unreal Engine', { tr: 'Mobil', en: 'Mobile' }, { tr: 'Performans', en: 'Performance' }],
    description: {
      tr: 'Oynanış sistemlerini mobil cihazların performans sınırlarına uyarlayarak geliştirilen mobil oyunlar.',
      en: 'Mobile games with gameplay systems adapted to mobile performance constraints.',
    },
    link: '',
  },
  {
    title: { tr: '3D Karakter Animasyonları', en: '3D Character Animations' },
    icon: 'person',
    year: '2023 – 2025',
    role: 'Freelance · 3D Character Animator',
    tech: ['Blender', 'Locomotion', 'Real-Time'],
    description: {
      tr:
        "Blender'da yürüme/koşma, aksiyon ve etkileşim animasyonları; temel animasyon prensipleriyle cilalanmış, " +
        'gerçek zamanlı ortamlara entegre edilmiş karakter hareketleri.',
      en:
        'Locomotion, action and interaction animations in Blender, polished with core animation principles and ' +
        'integrated into real-time, interactive environments.',
    },
    link: '',
  },
];

// Web & masaüstü projeleri (Terminal bölgesi)
export const apps = [
  {
    title: { tr: 'İnşaat Yönetim Paneli', en: 'Construction Management Panel' },
    icon: 'building',
    kind: 'Sefa Grup · Web',
    tech: ['Next.js 16', 'TypeScript', 'Supabase', 'Tailwind', 'shadcn/ui'],
    description: {
      tr:
        'İnşaat firmaları için yönetim ve CRM paneli: daire ve blok yönetimi, müşteri takibi, satış ve tahsilat, ödeme planı ' +
        'hesaplama, malzeme ve stok, satın alma ve şantiye arıza bildirimi. Rol bazlı erişim (Supabase RLS), mobilde PWA ve ' +
        'koyu temalı “kontrol odası” arayüzü.',
      en:
        'A management and CRM dashboard for construction companies covering unit and block management, customer tracking, sales ' +
        'and payment plans, inventory, purchasing and on-site issue reporting, with role-based access (Supabase RLS) and a mobile PWA.',
    },
    images: shots('insaat', [1, 2]),
    link: '',
  },
  {
    title: { tr: 'Site Yönetim Paneli', en: 'Apartment Complex Management' },
    icon: 'building',
    kind: 'Sefa Grup · Web',
    tech: ['React 19', 'TypeScript', 'Cloudflare Workers', 'D1', 'Supabase', 'Recharts'],
    description: {
      tr:
        'Çok bloklu bir sitenin kira, aidat, depozito, gelir-gider, şikâyet ve iş takibini tek panelde toplayan, canlıda çalışan ' +
        'yönetim sistemi. Etkileşimli kat planları, TR/EN kiracı portalı ve WhatsApp ile yanıt, 4 rollü yetkilendirme, geri ' +
        'alınabilir denetim kaydı ve 30+ uç noktalı REST API.',
      en:
        'A production management system for a multi-block residential complex: rent, dues, deposits, income/expenses, complaints ' +
        'and tasks in one panel. Interactive floor plans, a TR/EN tenant portal with WhatsApp replies, 4-role access control, ' +
        'a restorable audit log and a 30+ endpoint REST API.',
    },
    images: shots('apartman', [1, 2]),
    link: 'https://kampusesenboga.com/',
  },
  {
    title: { tr: '06 May Oto Elektrik', en: '06 May Auto Electric' },
    icon: 'globe',
    kind: 'Freelance · Web',
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4'],
    description: {
      tr:
        'Kocaeli’deki bir oto elektrik servisi için yerel müşteri kazanımına odaklı site: Schema.org yapısal veri ve 13 ilçelik ' +
        'yerel SEO, TR/EN/AR dil desteği, WhatsApp’a bağlı teklif formu ve çerez onayından sonra yüklenen Analytics.',
      en:
        'A lead-generation website for an auto electrical shop in Kocaeli: Schema.org data and local SEO across 13 districts, ' +
        'TR/EN/AR support, a WhatsApp quote form and consent-gated analytics.',
    },
    images: shots('otoelektrik', [1]),
    link: 'https://sifiraltimayoto.com.tr',
  },
  {
    title: { tr: 'Tayra Interactive', en: 'Tayra Interactive' },
    icon: 'globe',
    kind: 'Freelance · Web',
    tech: ['React 19', 'Vite', 'SSR/Prerender', 'Canvas API', 'Vercel'],
    description: {
      tr:
        'Ankara’daki 360° yaratıcı iletişim ajansının sitesi. Build sırasında SSR ile önceden oluşturulan hızlı ve SEO uyumlu ' +
        'sayfalar, proje detay sayfaları, Canvas API ile kodlanmış logo ışık animasyonu, JSON-LD ve KVKK uyumlu çerez onayı.',
      en:
        'Website for a 360° creative agency in Ankara. Prerendered at build time for speed and SEO, with project detail pages, ' +
        'a hand-coded Canvas API light animation around the logo, JSON-LD and cookie consent.',
    },
    images: shots('tayra', [1]),
    link: 'https://tayrainteractive.com',
  },
  {
    title: { tr: 'Tetik Yol Yardım', en: 'Tetik Roadside Assistance' },
    icon: 'globe',
    kind: 'Freelance · Web',
    tech: ['Preact', 'Vite', 'Pre-render', 'GA4', 'Vercel'],
    description: {
      tr:
        '2003’ten beri çalışan bir yol yardım firmasının sitesini sıfırdan tasarlayıp yayına aldım. Statik pre-render, teknik SEO ' +
        '(JSON-LD, sitemap, canonical, llms.txt), izinle yüklenen GA4 dönüşüm takibi ve Vercel güvenlik başlıkları.',
      en:
        'Designed, built and launched a site for a roadside assistance company operating since 2003. Static pre-rendering, technical ' +
        'SEO (JSON-LD, sitemap, canonical, llms.txt), consent-first GA4 conversion tracking and Vercel security headers.',
    },
    images: shots('tetik', [1]),
    link: 'https://tetikyolyardim.com',
  },
  {
    title: { tr: 'Mola: Masa Başı Sağlık Asistanı', en: 'Mola: Desk Health Companion' },
    icon: 'code',
    kind: { tr: 'Açık kaynak · Masaüstü', en: 'Open source · Desktop' },
    tech: ['Tauri 2', 'Rust', 'React', 'TypeScript', 'GitHub Actions'],
    description: {
      tr:
        'Windows için su ve hareket hatırlatıcısı olan sistem tepsisi uygulaması. Rust tarafında Windows API’leriyle boşta kalma ' +
        've görüşme/tam ekran algılama (tuş/ses kaydı ve ağ isteği yok), odak zamanlayıcı, haftalık özet; installer ve winget ile dağıtım.',
      en:
        'A Windows tray app with water and movement reminders. A Rust backend uses Windows APIs to detect idle time, calls and ' +
        'fullscreen apps (no keystrokes, audio or network), plus a focus timer and weekly summary; shipped via installer and winget.',
    },
    images: shots('mola', [1, 2, 3, 4]),
    link: 'https://github.com/furkanuysl/Mola',
  },
  {
    title: { tr: 'Masaüstü Oyun Launcher', en: 'Desktop Game Launcher' },
    icon: 'rocket',
    kind: { tr: 'Configgo · Masaüstü', en: 'Configgo · Desktop' },
    tech: ['Electron.js', 'JavaScript'],
    description: {
      tr: "Uygulama başlatma ve sürüm yönetimini üstlenen, sıfırdan geliştirilmiş özel oyun launcher'ı.",
      en: 'A custom desktop game launcher built from scratch, handling application launch and version management.',
    },
    link: '',
  },
  {
    title: { tr: 'Front-End Web Uygulamaları', en: 'Front-End Web Applications' },
    icon: 'globe',
    kind: 'Freelance · Web',
    tech: ['Nuxt.js', 'JavaScript'],
    description: {
      tr: 'Modüler ve sürdürülebilir mimariye odaklanan front-end web uygulamaları (2023 – 2025).',
      en: 'Front-end web applications focused on modular and maintainable architecture (2023 – 2025).',
    },
    link: '',
  },
];

// Yetenekler (Kristaller bölgesi).
// İstersen bir öğeye level: 0-100 ekleyebilirsin; oyundaki panelde ilerleme çubuğu olarak gösterilir.
export const skills = [
  {
    group: { tr: 'Oyun Geliştirme', en: 'Game Development' },
    items: [
      { name: 'Unreal Engine (C++, Blueprint)' },
      { name: 'Unity (C#)' },
      { name: 'Multiplayer (Replication, RPC, Steam)' },
      { name: 'Gameplay AI (Behavior Trees, State Machines)' },
      { name: { tr: 'Combat, Fizik & Oyun Hissi', en: 'Combat, Physics & Game Feel' } },
      { name: { tr: 'Mobil Optimizasyon', en: 'Mobile Optimization' } },
    ],
  },
  {
    group: { tr: 'Web & Full-Stack', en: 'Web & Full-Stack' },
    items: [
      { name: 'TypeScript / JavaScript' },
      { name: 'React, Next.js, Nuxt.js' },
      { name: 'Supabase, PostgreSQL, Cloudflare D1' },
      { name: 'Tailwind CSS, shadcn/ui' },
      { name: { tr: 'SEO, SSR & Pre-render', en: 'SEO, SSR & Pre-rendering' } },
      { name: 'Vercel, Cloudflare Workers' },
    ],
  },
  {
    group: { tr: 'Masaüstü, Araçlar & 3D', en: 'Desktop, Tools & 3D' },
    items: [
      { name: 'Tauri 2 & Rust' },
      { name: 'Electron.js' },
      { name: 'Git, GitHub Actions (CI)' },
      { name: { tr: 'Otomasyon & Birim Testleri', en: 'Automation & Unit Testing' } },
      { name: { tr: 'Blender (Animasyon)', en: 'Blender (Animation)' } },
    ],
  },
];

// Deneyim (Deniz feneri bölgesi)
export const experience = [
  {
    role: { tr: 'Yazılım Geliştirici', en: 'Software Developer' },
    company: 'Sefa Grup',
    period: { tr: '2026 — Şimdi', en: '2026 — Present' },
    points: [
      {
        tr: 'İnşaat firmaları için daire/blok, müşteri, satış-tahsilat, ödeme planı, stok, satın alma ve şantiye arıza modüllerini kapsayan rol bazlı bir yönetim ve CRM paneli geliştirdim (Next.js 16, TypeScript, Supabase).',
        en: 'Built a role-based management and CRM dashboard for construction companies covering units/blocks, customers, sales and collections, payment plans, inventory, purchasing and on-site issue reporting (Next.js 16, TypeScript, Supabase).',
      },
      {
        tr: 'Kampüs Esenboğa Evleri için kira, aidat, depozito, gelir-gider ve şikâyet takibini tek panelde toplayan site yönetim sistemini geliştirip canlıya aldım (kampusesenboga.com).',
        en: 'Built and launched the property management system for Kampüs Esenboğa Evleri, bringing rent, dues, deposits, finances and complaints into one panel (kampusesenboga.com).',
      },
      {
        tr: 'Kiracıların giriş yapmadan talep bırakıp telefon doğrulamasıyla takip edebildiği TR/EN kiracı portalı ve WhatsApp üzerinden yanıt akışı kurdum.',
        en: 'Built a TR/EN tenant portal where tenants submit and track requests with phone verification, plus a WhatsApp reply flow for staff.',
      },
      {
        tr: 'Rol bazlı yetkilendirme, geri alınabilir denetim kaydı, snapshot yedekleme ve mobilde PWA desteği ekledim.',
        en: 'Added role-based permissions, a restorable audit log, snapshot backups and mobile PWA support.',
      },
    ],
  },
  {
    role: 'Unreal Engine Developer',
    company: 'Configgo',
    period: '2025',
    points: [
      {
        tr: 'Kullanıcıların daire seçip iç mekâna girebildiği ve kontrol edilebilir bir karakterle serbestçe gezebildiği etkileşimli mimari görselleştirme uygulamaları geliştirdim.',
        en: 'Developed interactive architectural visualization applications, allowing users to select apartments, enter interiors, and freely explore environments with a controllable character.',
      },
      {
        tr: 'Farklı ışık koşullarını göstermek ve gerçekçiliği artırmak için gerçek zamanlı ışık simülasyonları uyguladım.',
        en: 'Implemented real-time lighting simulations to demonstrate different lighting conditions and enhance realism.',
      },
      {
        tr: 'Dış cephe görünümleri ile iç mekân turları arasında kesintisiz geçişler tasarladım.',
        en: 'Designed seamless transitions between exterior building views and interior walkthroughs.',
      },
      {
        tr: "Uygulama başlatma ve sürüm yönetimini yapan, Electron.js ile özel bir masaüstü oyun launcher'ı geliştirdim.",
        en: 'Built a custom desktop game launcher using Electron.js, handling application launch and version management.',
      },
      {
        tr: 'Büyük sahnelerde Blueprint tabanlı sistemleri performans ve ölçeklenebilirlik için optimize ettim.',
        en: 'Optimized Blueprint-based systems for performance and scalability in large scenes.',
      },
    ],
  },
  {
    role: { tr: 'Freelance Yazılım Geliştirici', en: 'Freelance Software Developer' },
    company: 'Freelance',
    period: { tr: '2023 — Şimdi', en: '2023 — Present' },
    points: [
      {
        tr: 'Unity ve C# ile mobil oyunlar geliştirdim: 3D küp puzzle Kubiko, 30 mini oyunlu parti oyunu Cep Arenası ve idle/tycoon oyunu Valet City.',
        en: 'Built mobile games in Unity and C#: the 3D cube puzzle Kubiko, the 30-mini-game party game Pocket Arena and the idle/tycoon game Valet City.',
      },
      {
        tr: 'İşletmeler için SEO odaklı kurumsal siteler geliştirip yayına aldım: 06 May Oto Elektrik (Next.js), Tayra Interactive (React, SSR) ve Tetik Yol Yardım (Preact, pre-render).',
        en: 'Built and launched SEO-focused business websites: 06 May Auto Electric (Next.js), Tayra Interactive (React, SSR) and Tetik Roadside Assistance (Preact, pre-rendering).',
      },
      {
        tr: 'Tauri 2 ve Rust ile açık kaynak masaüstü uygulaması Mola’yı geliştirdim; GitHub Actions ile CI kurup installer ve winget üzerinden dağıttım.',
        en: 'Built the open-source desktop app Mola with Tauri 2 and Rust, with GitHub Actions CI and releases via installer and winget.',
      },
      {
        tr: 'JavaScript ve Nuxt.js ile modüler, sürdürülebilir mimariye sahip front-end web uygulamaları geliştirdim.',
        en: 'Developed frontend web applications using JavaScript and Nuxt.js, focusing on modular and maintainable architecture.',
      },
      {
        tr: "Blender'da yürüme/koşma, aksiyon ve etkileşim karakter animasyonları oluşturup gerçek zamanlı ortamlara entegre ettim.",
        en: 'Created locomotion, action and interaction character animations in Blender and integrated them into real-time environments.',
      },
    ],
  },
  {
    role: 'Unreal Engine Game Developer',
    company: 'Netco Prodüksiyon Animasyon',
    period: '2021 — 2023',
    points: [
      {
        tr: 'Stamina yönetimi, vuruş tepkileri, kombo mantığı ve animasyon güdümlü oynanış içeren Souls-like bir dövüş sistemi tasarlayıp geliştirdim.',
        en: 'Designed and implemented a Souls-like combat system, including stamina management, hit reactions, combo logic, and animation-driven gameplay.',
      },
      {
        tr: 'Çok fazlı davranışlara ve uyarlanabilir saldırı desenlerine sahip gelişmiş boss AI sistemleri geliştirdim.',
        en: 'Developed advanced boss AI systems featuring multi-phase behaviors and adaptive combat patterns.',
      },
      {
        tr: 'Kumaş simülasyonuyla yoğun çalıştım; fizik tabanlı kıyafetleri görsel kalite ve performans için optimize ettim.',
        en: 'Worked extensively with cloth simulation, optimizing physics-based clothing for visual quality and performance.',
      },
      {
        tr: 'Karakter gerçekçiliğini artırmak için saç fiziği sistemleri uyguladım.',
        en: 'Implemented hair physics systems to improve character realism.',
      },
      {
        tr: 'Oynanış sistemlerini mobil performans kısıtlarına uyarlayarak mobil oyun projeleri geliştirdim.',
        en: 'Developed mobile game projects, adapting gameplay systems for mobile performance constraints.',
      },
      {
        tr: 'Blueprint tabanlı gameplay programlama ve hata ayıklamada derin deneyim kazandım.',
        en: 'Gained deep experience in Blueprint-based gameplay programming and debugging.',
      },
    ],
  },
];

// Eğitim
export const education = [
  {
    school: { tr: 'Eskişehir Anadolu Üniversitesi', en: 'Anadolu University, Eskişehir' },
    degree: { tr: 'Yönetim Bilişim Sistemleri', en: 'Management Information Systems' },
    period: { tr: '2022 — Devam ediyor', en: '2022 — Present' },
  },
  {
    school: { tr: 'Selçuk Üniversitesi', en: 'Selçuk University' },
    degree: { tr: 'Bilgisayar Programcılığı', en: 'Computer Programming' },
    period: '2019 — 2021',
  },
];

// Adadaki bölgeler. Konumlar adanın merkezine göre (x, z). Renkler adadaki ışıklar ve paneller içindir.
export const zones = [
  { id: 'about', title: { tr: 'Hakkımda', en: 'About' }, hint: { tr: 'Ev', en: 'House' }, color: '#7FD1C3', pos: [-9, -6] },
  { id: 'games', title: { tr: 'Oyun Projeleri', en: 'Game Projects' }, hint: { tr: 'Atari makinesi', en: 'Arcade cabinet' }, color: '#F2994A', pos: [0, -12] },
  { id: 'apps', title: { tr: 'Web & Masaüstü', en: 'Web & Desktop' }, hint: 'Terminal', color: '#6CB4EE', pos: [10, -6] },
  { id: 'skills', title: { tr: 'Yetenekler', en: 'Skills' }, hint: { tr: 'Kristaller', en: 'Crystals' }, color: '#B5DE6E', pos: [11, 6] },
  { id: 'experience', title: { tr: 'Deneyim & Eğitim', en: 'Experience & Education' }, hint: { tr: 'Deniz feneri', en: 'Lighthouse' }, color: '#F2C94C', pos: [0, 12.5] },
  { id: 'contact', title: { tr: 'İletişim', en: 'Contact' }, hint: { tr: 'Posta kutusu', en: 'Mailbox' }, color: '#EB6F5B', pos: [-10.5, 6] },
];
