import { __ } from '@saashq/ui/src/utils';
export const STORAGE_BOARD_KEY = 'saashqCurrentBoardId';
export const STORAGE_PIPELINE_KEY = 'saashqCurrentPipelineId';

export const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];

export const DATERANGES = [
  { name: 'Datum vytvoření', value: 'createdAt' },
  { name: 'Změna data etapy', value: 'stageChangedDate' },
  { name: 'Datum zahájení', value: 'startDate' },
  { name: 'Datum uzavření', value: 'closeDate' },
];

export const TEXT_COLORS = [
  '#fff',
  '#fefefe',
  '#fafafa',
  '#ccc',
  '#ddd',
  '#888',
  '#444',
  '#333',
  '#222',
  '#000',
];

export const REMINDER_MINUTES = [
  { _id: '0', name: 'V den splatnosti' },
  { _id: '5', name: 'Před 5 minutami' },
  { _id: '10', name: 'Před 10 minutami' },
  { _id: '15', name: 'Před 15 minutami' },
  { _id: '60', name: 'Před 1 hodinou' },
  { _id: '120', name: 'Před 2 hodinami' },
  { _id: '1440', name: '1 den předem' },
  { _id: '2880', name: '2 den předem' },
];

export const PIPELINE_UPDATE_STATUSES = {
  START: __('start'),
  END: __('konec'),
  NEW_REQUEST: __('nová žádost'),
};

export const EMPTY_CONTENT_DEAL = {
  title: __('Začínáme s prodejním kanálem'),
  description: __(
    `Drive vede k úspěšnému uzavření s našimi deskami ve stylu Kanban`,
  ),
  steps: [
    {
      title: __('Vytvářejte desky a potrubí'),
      description: `${__(
        'Sledujte celý svůj prodejní kanál z jednoho řídicího panelu',
      )}${__('Můžete také omezit přístup ke svým prodejním kanálům')}`,
      url: '/settings/boards/deal',
      urlText: __('Přejděte na Palubu a Potrubí'),
    },
    {
      title: __('Tip: Vyberte různá zobrazení'),
      description: __(
        'Kliknutím na "Nástěnky, Kalendář, Konverze" Vyfiltrujete Nabídky',
      ),
      icon: 'lightbulb-alt',
    },
  ],
};

export const EMPTY_CONTENT_PURCHASE = {
  title: __('Začínáme s Nákupem'),
  description: __(
    `Drive vede k úspěšnému uzavření s našimi deskami ve stylu Kanban`,
  ),
  steps: [
    {
      title: __('Vytvořte Nástěnky a Kanál Nákupů'),
      description: `${__(
        'Sledujte celý svůj kanál nákupů z jednoho řídicího panelu',
      )}${__('Můžete také omezit přístup ke svým nákupním kanálům')}`,
      url: '/settings/boards/purchase',
      urlText: __('Přejít na Palubu a Nákup Potrubí'),
    },
    {
      title: __('Tip: Vyberte různá zobrazení'),
      description: __(
        'Kliknutím na "Tabule, Kalendář, Konverze" Můžete Filtrovat Kanál Nákupů',
      ),
      icon: 'lightbulb-alt',
    },
  ],
};

export const EMPTY_CONTENT_TASK = {
  title: __('Začínáme s Úkoly'),
  description: __(
    'Vytvořte více spolupracující, soběstačný a propojený tým s našimi deskami ve stylu Kanban',
  ),
  steps: [
    {
      title: __('Vytvořte svůj první úkolovník'),
      description: __(
        'Tip: Může to být ekvivalentní vašim značkám nebo můžete organizovat podle roku/projektu/atd.',
      ),
      url: '/settings/boards/task',
      urlText: __('Přejděte na Palubu a Potrubí'),
    },
    {
      title: __('Tip: Filtr'),
      description: __(
        'Kliknutím na "Zobrazit nabídku" můžete úkoly filtrovat podle přiřazených členů týmu, zákazníků, data atd.',
      ),
      icon: 'lightbulb-alt',
    },
  ],
};

export const groupByList = [
  {
    name: 'stage',
    title: 'Etapa',
  },
  {
    name: 'label',
    title: 'Označení',
  },
  {
    name: 'přednost',
    title: 'Priority',
  },
  {
    name: 'zmocněnec',
    title: 'Assignee',
  },
  {
    name: 'datum splatnosti',
    title: 'Due Date',
  },
];

export const groupByGantt = [
  {
    name: 'etapa',
    title: 'Stage',
  },
  {
    name: 'označení',
    title: 'Label',
  },
  {
    name: 'přednost',
    title: 'Priority',
  },
  {
    name: 'zmocněnec',
    title: 'Assignee',
  },
];

export const showByTime = [
  {
    name: 'etapa',
    title: 'Stage',
  },
  {
    name: 'značky',
    title: 'Tags',
  },
  {
    name: 'členů',
    title: 'Members',
  },
];

export const stackByChart = [
  {
    name: 'etapa',
    title: 'Stage',
  },
  {
    name: 'označení',
    title: 'Label',
  },
  {
    name: 'přednost',
    title: 'Priority',
  },
  {
    name: 'datum splatnosti',
    title: 'Due Date',
  },
];

export const chartTypes = [
  {
    name: 'line',
    title: 'Spojnicový Graf',
    icon: 'chart-line',
  },
  {
    name: 'area',
    title: 'Plošný Graf',
    icon: 'arrow-growth',
  },
  {
    name: 'simpleBar',
    title: 'Jednoduchý Sloupcový Graf',
    icon: 'chart-bar',
  },
  {
    name: 'stackedBar',
    title: 'Skládaný Pruhový Graf',
    icon: 'chart',
  },
];

export const SEARCH_ACTIVITY_CHECKBOX = [
  { action: 'create', value: 'added new card', title: 'Přidána nová karta' },
  { action: 'moved', value: 'moved card', title: 'Přesunutá karta' },
  { action: 'archive', value: 'archived card', title: 'Archivovaná karta' },
  {
    action: 'delete',
    value: 'deleted archived card',
    title: 'Archivovaná karta byla smazána',
  },
  { action: 'addNote', value: 'added notes on', title: 'Přidány poznámky' },
];

export const TYPES = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  all: ['day', 'week', 'month', 'year'],
};

// type from growthHack
export const HACKSTAGES = [
  'Awareness',
  'Acquisition',
  'Activation',
  'Retention',
  'Revenue',
  'Referrals',
];
