import {
  attachmentSchema,
  boardSchema,
  stageSchema as boardStageSchema,
  pipelineSchema,
} from './models/definitions/boards';
import {
  checklistItemSchema,
  checklistSchema,
} from './models/definitions/checklists';
import { dealSchema, productDataSchema } from './models/definitions/deals';
import {
  purchaseSchema,
  purchaseproductDataSchema,
} from './models/definitions/purchases';
import {
  pipelineTemplateSchema,
  stageSchema,
} from './models/definitions/pipelineTemplates';

import { growthHackSchema } from './models/definitions/growthHacks';
import { pipelineLabelSchema } from './models/definitions/pipelineLabels';
import { taskSchema } from './models/definitions/tasks';
import { ticketSchema } from './models/definitions/tickets';

export const IMPORT_EXPORT_TYPES = [
  {
    text: 'Obchod',
    contentType: 'deal',
    icon: 'signal-alt-3',
  },
  {
    text: 'Nákup',
    contentTypeL: 'purchase',
    icon: 'signal-alt-3',
  },
  {
    text: 'Úkol',
    contentType: 'task',
    icon: 'laptop',
  },
  {
    text: 'Lístek',
    contentType: 'ticket',
    icon: 'ticket',
  },
];
export const PRIORITIES = {
  CRITICAL: 'Kritické',
  HIGH: 'Vysoký',
  NORMAL: 'Normální',
  LOW: 'Nízký',
  ALL: [
    {
      name: 'Kritické',
      color: '#EA475D',
    },
    { name: 'Vysoký', color: '#F7CE53' },
    { name: 'Normální', color: '#3B85F4' },
    { name: 'Nízký', color: '#AAAEB3' },
  ],
};

export const CLOSE_DATE_TYPES = {
  NEXT_DAY: 'dalšíDen',
  NEXT_WEEK: 'příštíTýden',
  NEXT_MONTH: 'příštíMěsíc',
  NO_CLOSE_DATE: 'žádné datum uzavření',
  OVERDUE: 'zpožděný',
  ALL: [
    {
      name: 'Další den',
      value: 'nextDay',
    },
    {
      name: 'Příští týden',
      value: 'nextWeek',
    },
    {
      name: 'Příští měsíc',
      value: 'nextMonth',
    },
    {
      name: 'Žádné datum uzavření',
      value: 'noCloseDate',
    },
    {
      name: 'Zpožděný',
      value: 'overdue',
    },
  ],
};

export const BOARD_ITEM_EXTENDED_FIELDS = [
  {
    _id: Math.random(),
    name: 'boardName',
    label: 'Název desky',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'pipelineName',
    label: 'Název potrubí',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'stageName',
    label: 'Stage name',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'assignedUserEmail',
    label: 'Přidělený e-mail uživatele',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'labelIds',
    label: 'Označení',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'totalAmount',
    label: 'Celková částka',
    type: 'number',
  },
];

export const BOARD_ITEM_EXPORT_EXTENDED_FIELDS = [
  {
    _id: Math.random(),
    name: 'totalAmount',
    label: 'Celková částka',
    type: 'number',
  },
  {
    _id: Math.random(),
    name: 'totalLabelCount',
    label: 'Celkový počet štítků',
    type: 'number',
  },
  {
    _id: Math.random(),
    name: 'stageMovedUser',
    label: 'Uživatel přesunutý do fáze',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'internalNotes',
    label: 'Interní poznámky',
    type: 'string',
  },
];

export const BOARD_BASIC_INFOS = [
  'userId',
  'createdAt',
  'order',
  'name',
  'closeDate',
  'reminderMinute',
  'isComplete',
  'description',
  'assignedUsers',
  'watchedUserIds',
  'labelIds',
  'stageId',
  'initialStageId',
  'modifiedAt',
  'modifiedBy',
  'priority',
];

export const MODULE_NAMES = {
  BOARD: 'board',
  BOARD_DEAL: 'dealBoards',
  BOARD_PURCHASE: 'purchaseBoards',
  BOARD_TASK: 'taskBoards',
  BOARD_TICKET: 'ticketBoards',
  BOARD_GH: 'growthHackBoards',
  PIPELINE_DEAL: 'dealPipelines',
  PIPELINE_PURCHASE: 'purchasePipelines',
  PIPELINE_TASK: 'taskPipelines',
  PIPELINE_TICKET: 'ticketPipelines',
  PIPELINE_GH: 'growthHackPipelines',
  STAGE_DEAL: 'dealStages',
  STAGE_PURCHASE: 'purchaseStages',
  STAGE_TASK: 'taskStages',
  STAGE_TICKET: 'ticketStages',
  STAGE_GH: 'growthHackStages',
  CHECKLIST: 'checklist',
  CHECKLIST_ITEM: 'checkListItem',
  DEAL: 'deal',
  PURCHASE: 'purchase',
  TICKET: 'ticket',
  TASK: 'task',
  PIPELINE_LABEL: 'pipelineLabel',
  PIPELINE_TEMPLATE: 'pipelineTemplate',
  GROWTH_HACK: 'growthHack',
};

interface ISchemaMap {
  name: string;
  schemas: any[];
}

export const LOG_MAPPINGS: ISchemaMap[] = [
  {
    name: MODULE_NAMES.BOARD_DEAL,
    schemas: [attachmentSchema, boardSchema],
  },
  {
    name: MODULE_NAMES.BOARD_PURCHASE,
    schemas: [attachmentSchema, boardSchema],
  },
  {
    name: MODULE_NAMES.BOARD_TASK,
    schemas: [attachmentSchema, boardSchema],
  },
  {
    name: MODULE_NAMES.BOARD_TICKET,
    schemas: [attachmentSchema, boardSchema],
  },
  {
    name: MODULE_NAMES.PIPELINE_DEAL,
    schemas: [pipelineSchema],
  },
  {
    name: MODULE_NAMES.PIPELINE_PURCHASE,
    schemas: [pipelineSchema],
  },
  {
    name: MODULE_NAMES.PIPELINE_TASK,
    schemas: [pipelineSchema],
  },
  {
    name: MODULE_NAMES.PIPELINE_TICKET,
    schemas: [pipelineSchema],
  },
  {
    name: MODULE_NAMES.CHECKLIST,
    schemas: [checklistSchema],
  },
  {
    name: MODULE_NAMES.CHECKLIST_ITEM,
    schemas: [checklistItemSchema],
  },
  {
    name: MODULE_NAMES.DEAL,
    schemas: [dealSchema, productDataSchema],
  },
  {
    name: MODULE_NAMES.PURCHASE,
    schemas: [purchaseSchema, purchaseproductDataSchema],
  },
  {
    name: MODULE_NAMES.PIPELINE_LABEL,
    schemas: [pipelineLabelSchema],
  },
  {
    name: MODULE_NAMES.PIPELINE_TEMPLATE,
    schemas: [pipelineTemplateSchema, stageSchema],
  },
  {
    name: MODULE_NAMES.TASK,
    schemas: [taskSchema, attachmentSchema],
  },
  {
    name: MODULE_NAMES.GROWTH_HACK,
    schemas: [growthHackSchema, attachmentSchema],
  },
  {
    name: MODULE_NAMES.TICKET,
    schemas: [ticketSchema, attachmentSchema],
  },
  {
    name: MODULE_NAMES.STAGE_DEAL,
    schemas: [boardStageSchema],
  },
  {
    name: MODULE_NAMES.STAGE_PURCHASE,
    schemas: [boardStageSchema],
  },
  {
    name: MODULE_NAMES.STAGE_TASK,
    schemas: [boardStageSchema],
  },
  {
    name: MODULE_NAMES.STAGE_TICKET,
    schemas: [boardStageSchema],
  },
  {
    name: MODULE_NAMES.STAGE_GH,
    schemas: [boardStageSchema],
  },
];

export const CARD_PROPERTIES_INFO = {
  priority: 'Přednost',

  ALL: [
    {
      label: 'Přednost',
      field: 'priority',
      canHide: false,
      validation: null,
      type: 'select',
      options: ['Kritické', 'Vysoký', 'Normální', 'Nízký'],
    },
    {
      label: 'Označení',
      field: 'labelIds',
      canHide: false,
      validation: null,
      type: 'select',
      options: [],
    },
    {
      label: 'Datum zahájení',
      field: 'startDate',
      canHide: false,
      validation: 'date',
      type: 'input',
    },
    {
      label: 'Datum uzavření',
      field: 'closeDate',
      canHide: false,
      validation: 'date',
      type: 'input',
    },
    {
      label: 'Přiřazen',
      field: 'assignedUserIds',
      canHide: false,
      validation: null,
      type: 'select',
      options: [],
    },
    {
      label: 'Přílohy',
      field: 'attachments',
      canHide: false,
      type: 'file',
    },
    {
      label: 'Popis',
      field: 'description',
      canHide: false,
      validation: null,
      type: 'textarea',
    },
    {
      label: 'Větve',
      field: 'branchIds',
      canHide: false,
      validation: null,
      type: 'select',
      options: [],
    },
    {
      label: 'oddělení',
      field: 'departmentIds',
      canHide: false,
      validation: null,
      type: 'select',
      options: [],
    },
  ],
};

export const NOTIFICATION_MODULES = [
  {
    name: 'deals',
    description: 'Nabídky',
    icon: 'piggy-bank',
    types: [
      {
        name: 'dealAdd',
        text: 'Přiřazena nová karta',
      },
      {
        name: 'dealRemoveAssign',
        text: 'Odebráno z karty rozdání',
      },
      {
        name: 'dealEdit',
        text: 'Deal karta upravena',
      },
      {
        name: 'dealChange',
        text: 'Přesouval se mezi fázemi',
      },
      {
        name: 'dealDueDate',
        text: 'Termín splatnosti se blíží',
      },
      {
        name: 'dealDelete',
        text: 'Deal karta smazána',
      },
    ],
  },

  {
    name: 'purchases',
    description: 'Nákupy',
    icon: 'bag-alt',
    types: [
      {
        name: 'purchaseAdd',
        text: 'Přiřazena nová nákupní karta',
      },
      {
        name: 'purchaseRemoveAssign',
        text: 'Odebráno z nákupní karty',
      },
      {
        name: 'purchaseEdit',
        text: 'Nákupní karta upravena',
      },
      {
        name: 'purchaseChange',
        text: 'Přesouval se mezi fázemi',
      },
      {
        name: 'purchaseDueDate',
        text: 'Termín splatnosti se blíží',
      },
      {
        name: 'purchaseDelete',
        text: 'Nákupní karta byla smazána',
      },
    ],
  },

  {
    name: 'tickets',
    description: 'Vstupenky',
    icon: 'ticket',
    types: [
      {
        name: 'ticketAdd',
        text: 'Přiřazena nová karta jízdenek',
      },
      {
        name: 'ticketRemoveAssign',
        text: 'Odebráno z lístku',
      },
      {
        name: 'ticketEdit',
        text: 'Vstupenka upravena',
      },
      {
        name: 'ticketChange',
        text: 'Přesouval se mezi fázemi',
      },
      {
        name: 'ticketDueDate',
        text: 'Termín splatnosti se blíží',
      },
      {
        name: 'ticketDelete',
        text: 'Karta vstupenky byla smazána',
      },
    ],
  },

  {
    name: 'tasks',
    description: 'Úkoly',
    icon: 'file-check-alt',
    types: [
      {
        name: 'taskAdd',
        text: 'Přiřazena nová karta úkolu',
      },
      {
        name: 'taskRemoveAssign',
        text: 'Odebráno z karty úkolu',
      },
      {
        name: 'taskEdit',
        text: 'Karta úkolu upravena',
      },
      {
        name: 'taskChange',
        text: 'Přesouval se mezi fázemi',
      },
      {
        name: 'taskDueDate',
        text: 'Termín splatnosti se blíží',
      },
      {
        name: 'taskDelete',
        text: 'Karta úkolu byla smazána',
      },
    ],
  },
];
