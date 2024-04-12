export const STEPS = [
  {
    title: 'Začínáme',
    key: 'setup',
    image: '/images/usingGuide.png',
  },
  {
    title: 'Zjistěte více',
    key: 'documentation',
    image: '/images/documentation.svg',
  },
  {
    title: 'Uživatelská příručka',
    key: 'usingGuide',
    image: '/images/guidebook.png',
  },
  {
    title: 'Připojte se k naší komunitě',
    key: 'community',
    image: '/images/community.png',
  },
];

export const SETUP = [
  {
    title: 'Konfigurace systému',
    icon: 'cog',
    content:
      '<ol><li><b>Přejděte do nastavení a vyhledejte Konfigurace systému</b></li><li><b>Přístup k Obecným nastavením. Odtud konfigurujte:</b><ul style="list-style-type: disc;"><li>Jazyk (výběr z 34 dostupných jazyků)</li><li>Currency</li><li>Členové týmu, kteří mají přístup ke každé pobočce a oddělení</li></ul></li><li><b>Přejděte na téma a nastavte:</b><ul style="list-style-type: disc;"><li>Emblém</li><li>Favicon</li><li>Pozadí</li><li>Barva textu</li><li>Motto</li><li>Popis přihlašovací stránky</li></ul></li><li><b>Nakonfigurujte další nastavení</b> které jsou nezbytné, abyste mohli začít používat SaasHQ, jako je Cloudflare, AWS SES a další.</li></ol>',
    btnText: 'Přejděte do obecného nastavení',
    url: '/settings/general',
    action: 'generalSettingsCreate',
  },
  {
    title: 'Vytvořte značku',
    icon: 'bolt-alt',
    content:
      '<ol><li><b>Přejděte do nastavení a najděte Značky</b></li><li><b>Klikněte na "Přidat novou značku" a vyplňte:</b><ul style="list-style-type: disc;"><li>Název značky</li><li>Popis</li><li>E-mailová adresa, ze které chcete zasílat transakční e-maily</li><li>Vytvořte si vlastní šablonu e-mailu nebo použijte výchozí šablonu</li></ul></li></ol>',
    btnText: 'Přejděte do obecného nastavení',
    url: '/settings/brands#showBrandAddModal=true',
    action: 'brandCreate',
  },
  {
    title: 'Nastavte oprávnění',
    icon: 'lock',
    content:
      '<ol><li>Přejděte do nastavení a vyhledejte oprávnění</li><li>Klikněte na "Vytvořit uživatelskou skupinu" a vyplňte:<ul style="list-style-type: disc;"><li>Název</li><li>Popis</li><li>Přidejte členy týmu do skupiny uživatelů</li></ul></li><li>Klikněte na "Nové oprávnění" a můžete :<ul style="list-style-type: disc;"><li>Vyberte konkrétní funkce a vyberte, jaké akce lze provést</li><li>Vyberte skupinu a přidejte členy týmu, kteří k ní mají přístup</li><li>Zkontrolujte, zda je povoleno povolení</li></ul></li></ol>',
    btnText: 'Přejděte do obecného nastavení',
    url: '/settings/permissions',
    action: 'userGroupCreate',
  },
  {
    title: 'Nastavit organizační strukturu',
    icon: 'layer-group',
    content:
      '<ol><li>Přejděte do nastavení a najděte Strukturu</li><li>Vytvořte větev</li><li>Vytvořte oddělení <ul style="list-style-type: disc;"><li>Vyberte vedoucího katedry </li><li>Přidejte členy týmu</li></ul></li><li>Vytvořte jednotku<ul style="list-style-type: disc;"><li>Vyberte vedoucího katedry </li><li>Vyberte příslušné oddělení </li><li>Přidejte členy týmu</li></ul></li></ol><p>Povinné pole "KÓD" může být cokoli, co vám pomůže rozlišit jednotlivé pobočky, oddělení a jednotky. </p>',
    btnText: 'Přejděte do obecného nastavení',
    url: '/settings/structure',
    action: '',
  },
  {
    title: 'Pozvěte členy týmu',
    icon: 'user-plus',
    content:
      '<ol><li>Přejděte do nastavení a najděte Člen týmu</li><li>Klikněte na "Pozvat členy týmu"</li><li>Zadejte e-mail a vytvořte heslo</li><li>Nastavte oprávnění pro každého člena týmu</li><li>Zařadit do příslušné pobočky, oddělení a jednotky</li></ol>',
    btnText: 'Přejděte do obecného nastavení',
    url: '/settings/team',
    action: 'userCreate',
  },
];

export const COMMUNITY = [
  {
    name: 'Github',
    link: 'https://github.com/saashq/saashq',
    icon: 'github-circled',
  },
  {
    name: 'Discord',
    link: 'https://discord.com/invite/aaGzy3gQK5',
    image: '/images/discord.png',
  },
  {
    name: 'Youtube',
    link: 'https://www.youtube.com/channel/UCunYU3kJiiDsXGfB068BbDA',
    icon: 'youtube-play',
  },
  { name: 'Figma', link: '', image: '/images/figma.png' },
  { name: 'Twitter', link: 'https://twitter.com/saashq', icon: 'twitter' },
  {
    name: 'Facebook',
    link: 'https://www.facebook.com/saashq/',
    icon: 'facebook',
  },
  {
    name: 'Blog',
    link: 'https://shq.saashq.org/blog',
    image: '/images/glyph_dark.png',
  },
];

export const DOCS = [
  {
    title: 'Dokumentace',
    desc: 'Zdroje pro vývojáře',
    url: 'https://docs.saashq.org',
    icon: 'copy-1',
  },
  {
    title: 'Centrum nápovědy',
    desc: 'Najděte odpovědi na své problémy a vytvořte vstupenky',
    url: 'https://help.saashq.org/',
    icon: 'info-circle',
  },
  {
    title: 'Investovat',
    desc: 'Zúčastněte se a investujte do SaasHQ',
    url: 'https://shq.saashq.org/invest',
    icon: 'dollar-alt',
  },
  {
    title: 'Středisko zdrojů',
    desc: 'Získejte přístup ke všem zdrojům, které hledáte',
    url: 'https://shq.saashq.org/resource-center',
    icon: 'folder-2',
  },
];

export const VIDEO = [
  {
    title: 'Oznámení',
    desc: 'Jak nakonfigurovat nastavení oznámení',
    icon: 'bell',
    url: 'https://www.youtube.com/embed/rK-lAt9bXtY?si=9h3sGgMaEbvlh4bx',
  },
  {
    title: 'Protokoly',
    desc: 'Jak zobrazit protokoly aktivit',
    icon: 'file-blank',
    url: 'https://www.youtube.com/embed/AHOtbefxwaw?si=bqh-TV5OtLVWBezP',
  },
  {
    title: 'E-mailové podpisy',
    desc: 'Jak vytvořit svůj e-mailový podpis',
    icon: 'envelope',
    url: 'https://www.youtube.com/embed/Eg9D4r38aso?si=zKqRtmuZlWSgDVsJ',
  },
  {
    title: 'Import & Export',
    desc: 'Jak importovat a exportovat svá data',
    icon: 'import',
    url: 'https://www.youtube.com/embed/llQfH8yGwh8?si=kmNJD0Q2AQ1oHr0D',
  },
  {
    title: 'Segmenty',
    desc: 'Jak vytvořit segmentaci',
    icon: 'chart-pie-alt',
    url: 'https://www.youtube.com/embed/uUe98rmz89c?si=k0I6Tc2JFX3jcxNc',
  },
  {
    title: 'Tagy',
    desc: 'Jak vytvářet značky a filtrovat zákazníky',
    icon: 'pricetag-alt',
    url: 'https://www.youtube.com/embed/5tGbsUsUiJ4?si=Nqqo71dZEDAqtVGr',
  },
  {
    title: 'Vyskakovací okna a Formuláře',
    desc: 'Jak vytvářet vyskakovací okna a formuláře a jak je používat',
    icon: 'file-alt',
    url: 'https://www.youtube.com/embed/7lz3mIbfIS4?si=IQa2C6cgIPgda-Ey',
  },
  {
    title: 'Instalace skriptu',
    desc: 'Jak nainstalovat kód skriptu SaasHQ messenger pro integraci do vaší platformy',
    icon: 'download-3',
    url: 'https://www.youtube.com/embed/Ky0IQ5UJ5xo?si=MxjHLtFmukLPTY5P',
  },
  {
    title: 'Integrace',
    desc: 'Jak integrovat externí platformy do SaasHQ',
    icon: 'puzzle-piece',
    url: 'https://www.youtube.com/embed/ZHdwkZSnkxU?si=wPUlu33bEBCep9xS',
  },
  {
    title: 'Prodejní potrubí',
    desc: 'Jak vytvořit novou prodejní desku a potrubí',
    icon: 'subject',
    url: 'https://www.youtube.com/embed/yqc9l_1-qFA?si=HyHEnNRvpJ47rfX_',
  },
  {
    title: 'Týmová schránka',
    desc: 'Jak centralizovat komunikační platformy do jediné týmové schránky',
    icon: 'comments',
    url: 'https://www.youtube.com/embed/eVcqpG0zsiY?si=hIXflgXpE22kHbEb',
  },
  {
    title: 'Znalostní základna',
    desc: 'Jak vytvořit znalostní bázi a přidávat články',
    icon: 'book-open',
    url: 'https://www.youtube.com/embed/r0s1aOUa0_c?si=rxmnkEMt771iRtVU',
  },
  {
    title: 'Šablony e-mailů',
    desc: 'Jak připravit e-mailové šablony',
    icon: 'envelope-open',
    url: 'https://www.youtube.com/embed/dsmQl2mhT1Y?si=BTDDD-60aRo3CdBk',
  },
  {
    title: 'Šablony odpovědí',
    desc: 'Jak vytvořit šablony odpovědí',
    icon: 'comment-alt-lines',
    url: 'https://www.youtube.com/embed/olfky0vuHmU?si=2BYdB2JT9_f681nd',
  },
];
