export const TOOLTIP = 'Vaše odpověď určí vaše průvodce pro přihlášení';

export const PLACEHOLDER = 'Vyber jeden';

export const ROLE_VALUE = [
  {
    _id: 'answerOne',
    name: 'Nikdy předtím jsem nepoužíval CRM ani obchodní nástroje',
  },
  { _id: 'answerTwo', name: 'Jsem nový v SaasHQ, ale dříve jsem používal CRM' },
  { _id: 'answerThree', name: 'V SaasHQ se dobře vyznám' },
];

export const ROLE_OPTIONS = [
  { _id: 'odbyt', name: 'Odbyt' },
  { _id: 'marketingový', name: 'marketingovýový' },
  { _id: 'zákaznická podpora', name: 'Zákaznická podpora' },
  { _id: 'řízení a provoz', name: 'Řízení a provoz' },
  { _id: 'výše', name: 'Vše výše uvedené' },
];

export const ROLE_SETUP = [
  {
    title: 'Založit',
    key: 'setup',
    content: [
      {
        name: 'Nastavte obecná nastavení',
        title: 'generalSettings',
        steps: 3,
        types: [
          'odbyt',
          'marketingovýový',
          'zákaznická podpora',
          'řízení a provoz',
          'výše',
        ],
      },
      {
        name: 'Vytvořte své značky a kanály',
        title: 'channelBrands',
        steps: 2,
        types: [
          'odbyt',
          'marketingovýový',
          'zákaznická podpora',
          'řízení a provoz',
          'výše',
        ],
      },
      {
        name: 'Integrujte další aplikace do SaasHQ',
        title: 'integrationOtherApps',
        steps: 2,
        types: [
          'odbyt',
          'marketingovýový',
          'zákaznická podpora',
          'řízení a provoz',
          'výše',
        ],
      },
      {
        name: 'Přizpůsobte si databázi SaasHQ',
        title: 'customizeDatabase',
        steps: 2,
        types: [
          'odbyt',
          'marketingovýový',
          'zákaznická podpora',
          'řízení a provoz',
          'výše',
        ],
      },
    ],
  },
  {
    title: 'Provozní',
    key: 'operational',
    content: [
      {
        name: 'Importujte své stávající kontakty',
        title: 'importExistingContacts',
        steps: 4,
        types: ['odbyt', 'marketingovýový'],
      },
      {
        name: 'Přizpůsobte si svůj prodejní kanál',
        title: 'salesPipeline',
        steps: 3,
        types: ['odbyt', 'výše'],
      },
      {
        name: 'Pozvěte členy svého týmu',
        title: 'inviteTeamMembers',
        steps: 3,
        types: [
          'odbyt',
          'marketingový',
          'zákaznická podpora',
          'řízení a provoz',
          'výše',
        ],
      },
      {
        name: 'Přidejte svůj produkt a služby',
        title: 'createProductServices',
        steps: 2,
        types: ['odbyt', 'výše'],
      },
      {
        name: 'Nainstalujte widgety SaasHQ',
        title: 'installSaasHQWidgets',
        steps: 1,
        types: ['odbyt', 'marketingový', 'zákaznická podpora', 'výše'],
      },
      {
        name: 'Vytvořte si formuláře pro generování potenciálních zákazníků',
        title: 'createLeadGenerationForm',
        steps: 2,
        types: ['marketingový'],
      },
      {
        name: 'Vytvořte si znalostní bázi',
        title: 'customizeKnowledgeBase',
        steps: 4,
        types: ['zákaznická podpora', 'řízení a provoz'],
      },
      {
        name: 'Naplánujte si obsah pomocí Úkolů',
        title: 'customizeTickets',
        steps: 3,
        types: ['marketingový'],
      },
      {
        name: 'Přizpůsobte si vstupenky',
        title: 'customizeTickets',
        steps: 3,
        types: ['zákaznická podpora', 'řízení a provoz', 'výše'],
      },
      {
        name: 'Přizpůsobte si úkoly',
        title: 'customizeTasks',
        steps: 3,
        types: ['zákaznická podpora', 'řízení a provoz', 'výše'],
      },
      {
        name: 'Importujte svá stávající zákaznická data do SaasHQ',
        title: 'importExistingContacts',
        steps: 4,
        types: ['výše'],
      },
      {
        name: 'Vytvořte si formuláře',
        title: 'createLeadGenerationForm',
        steps: 2,
        types: ['výše'],
      },
      {
        name: 'Přizpůsobte si znalostní bázi',
        title: 'customizeKnowledgeBase',
        steps: 4,
        types: ['výše'],
      },
    ],
  },
  {
    title: 'Pokračující',
    key: 'on-going',
    content: [
      {
        name: 'Segmentujte své kontakty',
        title: 'customizeSegmentation',
        steps: 2,
        types: ['odbyt', 'marketingový', 'výše'],
      },

      {
        name: 'Připravte si šablony obsahu',
        title: 'prepareContentTemplates',
        steps: 3,
        types: ['odbyt', 'zákaznická podpora', 'řízení a provoz', 'výše'],
      },

      {
        name: 'Automatizujte svůj prodej pomocí kampaně',
        title: 'automateCampaigns',
        steps: 3,
        types: ['odbyt'],
      },
      {
        name: 'Přizpůsobte si přehledy',
        title: 'customizeReports',
        steps: 2,
        types: [
          'odbyt',
          'marketingový',
          'zákaznická podpora',
          'řízení a provoz',
          'výše',
        ],
      },
      {
        name: 'Přizpůsobte si hackování růstu',
        title: 'customizeGrowthHacking',
        steps: 4,
        types: ['marketingový', 'výše'],
      },
      {
        name: 'Přizpůsobte si segmentaci zákazníků',
        title: 'customizeSegmentation',
        steps: 2,
        types: ['marketingový'],
      },
      {
        name: 'Připravte si šablony e-mailu/odpovědi',
        title: 'prepareMailResponseTemplates',
        steps: 2,
        types: ['marketingový'],
      },
      {
        name: 'Automatizujte generování potenciálních zákazníků pomocí kampaní',
        title: 'automateCampaigns',
        steps: 3,
        types: ['marketingový'],
      },
      {
        name: 'Automatizujte pomocí kampaní',
        title: 'automateCampaigns',
        steps: 3,
        types: ['výše'],
      },
    ],
  },
];

export const ROLE_SETUP_DETAILS = {
  generalSettings: {
    text: 'Nastavte obecná nastavení',
    description:
      'Nastavení vaší obecné konfigurace upraví základní základní funkce na naší platformě',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      generalSettingsCreate: {
        name: 'Nastavte své obecné nastavení',
        url: '/settings/general',
      },
      generalSettingsUploadCreate: {
        name: 'Nastavte typy souborů, které chcete nahrát',
        url: '/settings/general/',
      },
      generelSettingsConstantsCreate: {
        name: 'Nastavte si konstanty',
        url: '/settings/general/',
      },
    },
  },
  channelBrands: {
    text: 'Nastavení značky a kanálu',
    description:
      'Vytváření značek a kanálů vám umožňuje organizovat a zobrazovat všechny zprávy a e-maily odeslané od zákazníků na jedné platformě',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      brandCreate: {
        name: 'Vytvářejte značky',
        url: '/settings/brands#showBrandAddModal=true',
      },
      channelCreate: {
        name: 'Vytvořte kanály',
        url: '/settings/channels#showChannelAddModal=true',
      },
    },
  },
  integrationOtherApps: {
    text: 'Integrace / App Store',
    description:
      'Všechny doručené pošty můžete přenést do jednoho okna a spravovat své interakce se zákazníky',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      integrationsCreate: {
        name: 'Vyberte, které integrace chcete přidat',
        url: '/settings/integrations/',
      },
      connectIntegrationsToChannel: {
        name: 'Pro úspěšnou integraci komunikačních kanálů postupujte podle zobrazených pokynů',
        url: '/settings/channels/',
      },
    },
  },
  customizeDatabase: {
    text: 'Vlastnosti',
    description:
      'Upravte nastavení údajů o zákaznících, přidejte vlastnosti pro informace o zákaznících atd. pro vaši databázi zákazníků',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      fieldGroupCreate: {
        name: 'Přidejte nové skupiny a pole, pokud tam požadovaná pole nejsou',
        url: '/settings/properties/',
      },
      fieldCreate: {
        name: 'Upravte stávající pole',
        url: '/settings/properties/',
      },
    },
  },
  importExistingContacts: {
    text: 'Importovat',
    description:
      'Budete moci importovat velké soubory a exportovat data z našeho systému',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      fieldGroupCreate: {
        name: 'Přidat skupiny',
        url: '/settings/properties/',
      },
      fieldCreate: {
        name: 'Přidat vlastnosti',
        url: '/settings/properties/',
      },
      importDownloadTemplate: {
        name: 'Stáhněte si šablonu',
        url: '/settings/importHistories/',
      },
      importCreate: {
        name: 'Importujte soubor',
        url: '/settings/importHistories/',
      },
    },
  },
  inviteTeamMembers: {
    text: 'Členové týmu / Povolení',
    description:
      'Pozvěte členy svého týmu do vaší organizace, aby spravovali všechny interní a externí aktivity na jednom místě',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      userGroupCreate: {
        name: 'Vytvořte skupinu uživatelů pro oprávnění',
        url: '/settings/permissions',
      },
      usersInvite: {
        name: 'Přidejte členy svého týmu',
        url: '/settings/team/',
      },
      userEdit: {
        name: 'Zadejte informace o členu týmu',
        url: '/settings/team/',
      },
    },
  },
  odbytPipeline: {
    text: 'Fáze prodeje',
    description:
      'Vytvořte prodejní fáze pro sledování celého prodejního kanálu z jednoho řídicího panelu',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      dealBoardsCreate: {
        name: 'Vytvořte desku',
        url: '/settings/boards/deal#showBoardModal=true',
      },
      dealPipelinesCreate: {
        name: 'Vytvořte potrubí, které bude použito na vaší desce',
        url: '/settings/boards/deal#showPipelineModal=true',
      },
      dealCreate: {
        name: 'Vytvořit dohodu',
        url: '/deal/board',
      },
    },
  },
  purchasePipeline: {
    text: 'Fáze nákupu',
    description:
      'Vytvořte nákupní fáze pro sledování celého nákupního kanálu z jednoho řídicího panelu',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      purchaseBoardsCreate: {
        name: 'Vytvořte desku',
        url: '/settings/boards/purchase#showBoardModal=true',
      },
      purchasePipelinesCreate: {
        name: 'Vytvořte nákup, který použijete na své desce',
        url: '/settings/boards/purchase#showPipelineModal=true',
      },
      purchaseCreate: {
        name: 'Vytvořit nákup',
        url: '/purchase/board',
      },
    },
  },
  createProductServices: {
    text: 'Produkt a služba',
    description:
      'Přidejte a kategorizujte své produkty a služby do našeho systému',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      productCategoryCreate: {
        name: 'Přidejte kategorii',
        url: '/settings/boards/',
      },
      productCreate: {
        name: 'Přidejte produkt a službu do kategorie',
        url: '/settings/boards/',
      },
    },
  },
  customizeTickets: {
    text: 'Vstupenka fáze',
    description:
      'Přizpůsobení fází vstupenek pomůže členům vašeho týmu s procesem přijímání, udržování a řešení stížností od zákazníků organizace.',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      ticketBoardsCreate: {
        name: 'Vytvořte desku',
        url: '/settings/boards/ticket#showBoardModal=true',
      },
      ticketPipelinesCreate: {
        name: 'Vytvořte potrubí, které bude použito na vaší desce',
        url: '/settings/boards/ticket#showPipelineModal=true',
      },
      ticketCreate: {
        name: 'Vytvořit lístek',
        url: '/ticket/board',
      },
    },
  },
  customizeTasks: {
    text: 'Fáze úkolu',
    description:
      'Přizpůsobení fází tiketu vám pomůže spravovat a sledovat interní operace a aktivity organizace',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      taskBoardsCreate: {
        name: 'Vytvořte desku',
        url: '/settings/boards/task#showBoardModal=true',
      },
      taskPipelinesCreate: {
        name: 'Vytvořte potrubí, které bude použito na vaší desce',
        url: '/settings/boards/task#showBoardModal=true',
      },
      taskCreate: {
        name: 'Vytvořit úkol',
        url: '/task/board',
      },
    },
  },
  customizeGrowthHacking: {
    text: 'Fáze hackování růstu',
    description:
      'Vyhodnoťte procento úspěšnosti každého nápadu rozdělením do kategorií',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      growthHackBoardCreate: {
        name: 'Vytvořte marketingovou kampaň',
        url: '/settings/boards/growthHack#showBoardModal=true',
      },

      pipelineTemplate: {
        name: 'Vytvořte šablonu pro hackování růstu',
        url: '/settings/boards/growthHackTemplate',
      },

      growthHackPipelines: {
        name: 'Vytvářejte marketingové projekty',
        url: '/settings/boards/growthHack#showPipelineModal=true',
      },

      growthHackCreate: {
        name: 'Vytvářejte experimenty',
        url: '/growthHack/board',
      },
    },
  },
  customizeSegmentation: {
    text: 'Kontakt',
    description:
      'Segment je menší skupina vašich kontaktů definovaná pravidly nebo filtry, které nastavíte',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      segmentCreate: {
        name: 'Vytvořte segment',
        url: '/segments/new?contentType=customer',
      },
      subSegmentCreate: {
        name: 'Vytvořte podsegment v rámci předchozího segmentu',
        url: '/segments/new?contentType=customer',
      },
    },
  },
  prepareMailResponseTemplates: {
    text: 'Šablona e-mailu/odpovědi',
    description:
      'Můžete ušetřit spoustu času přípravou šablon e-mailů/odpovědí, vše, co musíte udělat, je automatizovat celý váš provoz pomocí připravených skriptů. ',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      createResponseTemplate: {
        name: 'Vytvořte šablonu odpovědi',
        url: '/settings/response-templates#showListFormModal=true',
      },
      createEmailTemplate: {
        name: 'Vytvořte šablonu e-mailu',
        url: '/settings/email-templates#showListFormModal=true',
      },
    },
  },
  automateCampaigns: {
    text: 'Kampaně',
    description:
      'Vytvářejte kampaně, které automaticky doručují informace zákazníkům na základě segmentů a štítků',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      engageVerifyEmail: {
        name: 'Ověřte svůj odesílací e-mail',
        url: '/settings/campaign-configs',
      },
      engageSendTestEmail: {
        name: 'Odeslat zkušební e-mail',
        url: '/settings/campaign-configs',
      },
      engageCreate: {
        name: 'Vytvořte kampaň',
        url: '/campaigns/create?kind=auto',
      },
    },
  },
  customizeKnowledgeBase: {
    text: 'Znalostní báze',
    description:
      'Vzdělávejte své zákazníky i zaměstnance vytvořením centra nápovědy souvisejícího s vašimi značkami, produkty a službami, abyste dosáhli vyšší úrovně spokojenosti',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      knowledgeBaseTopicCreate: {
        name: 'Vytvořte téma',
        url: '/knowledgebase#showKBAddModal=true',
      },
      knowledgeBaseCategoryCreate: {
        name: 'Vytvořit kategorii',
        url: '/knowledgebase#showKBAddCategoryModal=true',
      },
      knowledgeBaseArticleCreate: {
        name: 'Nyní pište články',
        url: '/knowledgebase#showKBAddArticleModal=true',
      },
      knowledgeBaseInstalled: {
        name: 'Vložit znalostní bázi',
        url: '#',
      },
    },
  },
  installSaasHQWidgets: {
    text: 'Widgety SaasHQ',
    description:
      'Se SaasHQ Messenger můžete mít živé přímé chaty se svými zákazníky bez ohledu na jejich umístění',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      messengerIntegrationCreate: {
        name: 'Přidejte SaasHQ messenger',
        url: '/settings/integrations/createMessenger',
      },
    },
  },
  createLeadGenerationForm: {
    text: 'Formulář',
    description:
      'To vám umožní přidat formulář na webové stránky vaší organizace/business messenger pro shromažďování informací od vašich potenciálních potenciálních zákazníků',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      leadIntegrationCreate: {
        name: 'Vytvořit formulář',
        url: '/forms/create',
      },
      leadIntegrationInstalled: {
        name: 'Nainstalujte na web',
        url: '/forms',
      },
    },
  },
  prepareContentTemplates: {
    text: 'Šablona obsahu',
    description:
      'Můžete ušetřit spoustu času přípravou šablon e-mailů/odpovědí, vše, co musíte udělat, je automatizovat celý váš provoz pomocí připravených skriptů',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      createResponseTemplate: {
        name: 'Vytvořte šablonu odpovědi',
        url: '/settings/response-templates#showListFormModal=true',
      },

      createEmailTemplate: {
        name: 'Vytvořte šablonu e-mailu',
        url: '/settings/email-templates#showListFormModal=true',
      },

      pipelineTemplate: {
        name: 'Vytvořte šablonu pro hackování růstu',
        url: '/settings/boards/growthHackTemplate',
      },
    },
  },
  customizeReports: {
    text: 'Zprávy',
    description:
      'Zprávy vám pomohou dohlížet na pokrok a efektivitu činností vaší organizace a činit manažerská rozhodnutí',
    videoUrl: '',
    videoThumb: '',
    settingsDetails: {
      dashboardCreate: {
        name: 'Vytvořte řídicí panel',
        url: '/dashboard#showDashboardAddModal=true',
      },
      dashboardItemCreate: {
        name: 'Vytvořte graf',
        url: '/settings/boards/',
      },
    },
  },
};
