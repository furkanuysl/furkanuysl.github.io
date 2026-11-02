// ─────────────────────────────────────────────────────────────
//  TÜM CV İÇERİĞİ BURADA. Sadece bu dosyayı düzenlemen yeterli.
//  Dile bağlı alanlar { tr: '…', en: '…' } şeklinde yazılır.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Furkan Uysal',
  initials: 'FU',
  title: { tr: 'Oyun Geliştirici', en: 'Game Developer' },
  subtitle: {
    tr: 'Unreal Engine ile oynanış sistemleri, boss AI ve etkileşimli 3D deneyimler.',
    en: 'Gameplay systems, boss AI and interactive 3D experiences built with Unreal Engine.',
  },
  location: 'Çubuk, Ankara',
  email: 'm.furkanysl@gmail.com',
  phone: '', // örn. '0545 275 11 73' — boş bırakırsan sitede gösterilmez
  available: false, // true yaparsan "Yeni projelere açığım" rozeti görünür
  summary: {
    tr:
      'Unreal Engine ile 3+ yıllık uygulamalı deneyime sahip bir oyun geliştiricisiyim. Oynanış sistemleri, ' +
      'yapay zekâ davranışları, gerçek zamanlı simülasyonlar ve etkileşimli 3D uygulamalar üzerine uzmanlaştım. ' +
      'Souls-like dövüş mekanikleri, boss AI tasarımı, karakter fiziği ve mimari görselleştirme konularında güçlü ' +
      'bir geçmişim var; buna web geliştirme ve Electron tabanlı masaüstü araç deneyimi de ekleniyor. ' +
      'Bilgisayar Programcılığı altyapısının ardından şu an Yönetim Bilişim Sistemleri okuyorum.',
    en:
      'Game Developer with 3+ years of hands-on experience using Unreal Engine, specializing in gameplay systems, ' +
      'AI behaviors, real-time simulations, and interactive 3D applications. Strong background in Souls-like combat ' +
      'mechanics, boss AI design, character physics, and architectural visualization, combined with experience in ' +
      'web development and Electron-based desktop tools. Currently studying Management Information Systems with a ' +
      'Computer Programming background.',
  },
  facts: [
    { label: { tr: 'Deneyim', en: 'Experience' }, value: { tr: '3+ yıl', en: '3+ years' } },
    { label: { tr: 'Ana motor', en: 'Main engine' }, value: 'Unreal Engine' },
    { label: { tr: 'Uzmanlık', en: 'Specialty' }, value: 'Combat & Boss AI' },
  ],
  portfolio: 'https://youtube.com/playlist?list=PLsEWusgi79Wlz8dn-76ZRFsHpWv1Zuahl',
  links: [
    {
      label: { tr: 'Portfolyo (YouTube)', en: 'Portfolio (YouTube)' },
      url: 'https://youtube.com/playlist?list=PLsEWusgi79Wlz8dn-76ZRFsHpWv1Zuahl',
    },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/furkan-uysal-41490321a/' },
  ],
  cvPdf: '', // örn. './Furkan_Uysal_CV.pdf' (dosyayı public/ klasörüne koy) — boşsa buton gizlenir
};

const PRESENT = { tr: 'Şimdi', en: 'Present' };

// Oyun & Unreal projeleri (Atari makinesi bölgesi)
// icon: swords | brain | building | shirt | phone | person | rocket | globe | gamepad | code
export const games = [
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
    year: { tr: '2025 – Şimdi', en: '2025 – Present' },
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
    title: { tr: 'Masaüstü Oyun Launcher', en: 'Desktop Game Launcher' },
    icon: 'rocket',
    kind: { tr: 'Masaüstü', en: 'Desktop' },
    tech: ['Electron.js', 'JavaScript'],
    description: {
      tr: "Uygulama başlatma ve sürüm yönetimini üstlenen, sıfırdan geliştirilmiş özel oyun launcher'ı (Configgo).",
      en: 'A custom desktop game launcher built from scratch, handling application launch and version management (Configgo).',
    },
    link: '',
  },
  {
    title: { tr: 'Front-End Web Uygulamaları', en: 'Front-End Web Applications' },
    icon: 'globe',
    kind: 'Web',
    tech: ['Nuxt.js', 'JavaScript'],
    description: {
      tr: 'Modüler ve sürdürülebilir mimariye odaklanan front-end web uygulamaları (Freelance, 2023 – 2025).',
      en: 'Front-end web applications focused on modular and maintainable architecture (Freelance, 2023 – 2025).',
    },
    link: '',
  },
];

// Yetenekler (Kristaller bölgesi).
// İstersen bir öğeye level: 0-100 ekleyebilirsin; oyundaki panelde ilerleme çubuğu olarak gösterilir.
export const skills = [
  {
    group: { tr: 'Oyun Motorları', en: 'Game Engines' },
    items: [{ name: 'Unreal Engine' }, { name: 'Blueprints' }, { name: 'Gameplay Systems' }, { name: 'AI' }, { name: 'Physics' }, { name: 'Lighting' }],
  },
  {
    group: { tr: 'Oynanış & Sistemler', en: 'Gameplay & Systems' },
    items: [
      { name: 'Souls-like Combat Systems' },
      { name: 'Boss AI (Behavior Trees, State Machines)' },
      { name: 'Character Movement & Physics' },
      { name: 'Cloth & Hair Simulation' },
      { name: 'Real-Time Lighting & Environment Simulation' },
    ],
  },
  {
    group: { tr: 'Web, Araçlar & 3D', en: 'Web, Tools & 3D' },
    items: [{ name: 'JavaScript' }, { name: 'Nuxt.js' }, { name: 'Electron.js' }, { name: { tr: 'Blender (Animasyon)', en: 'Blender (Animation)' } }],
  },
];

// Deneyim (Deniz feneri bölgesi)
export const experience = [
  {
    role: 'Unreal Engine Developer',
    company: 'Configgo',
    period: { tr: '2025 — Şimdi', en: '2025 — Present' },
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
    role: 'Front-End Developer & 3D Character Animator',
    company: 'Freelance',
    period: '2023 — 2025',
    points: [
      {
        tr: 'JavaScript ve Nuxt.js ile modüler, sürdürülebilir mimariye sahip front-end web uygulamaları geliştirdim.',
        en: 'Developed frontend web applications using JavaScript and Nuxt.js, focusing on modular and maintainable architecture.',
      },
      {
        tr: "Blender'da yürüme/koşma, aksiyon ve etkileşim karakter animasyonları oluşturdum.",
        en: 'Created character animations in Blender, including locomotion, action, and interaction animations.',
      },
      {
        tr: 'Animasyonlu 3D varlıkları gerçek zamanlı ve etkileşimli ortamlara entegre ettim.',
        en: 'Integrated animated 3D assets into real-time and interactive environments.',
      },
      {
        tr: 'Temel animasyon prensiplerini uygulayarak cilalı ve inandırıcı karakter hareketleri elde ettim.',
        en: 'Applied core animation principles to achieve polished and believable character motion.',
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
