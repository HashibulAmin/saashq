import { Document, Schema } from 'mongoose';
import { customFieldSchema, ICustomField } from './common';
import {
  BOARD_STATUSES,
  BOARD_STATUSES_OPTIONS,
  BOARD_TYPES,
  HACK_SCORING_TYPES,
  VISIBLITIES,
  PROBABILITY,
  TIME_TRACK_TYPES,
} from './constants';
import { field, schemaWrapper } from './utils';

interface ICommonFields {
  userId?: string;
  createdAt?: Date;
  order?: number;
  type: string;
}

export interface IItemCommonFields {
  name?: string;
  // TODO migrate after remove 2row
  companyIds?: string[];
  customerIds?: string[];
  startDate?: Date;
  closeDate?: Date;
  stageChangedDate?: Date;
  description?: string;
  assignedUserIds?: string[];
  watchedUserIds?: string[];
  notifiedUserIds?: string[];
  labelIds?: string[];
  attachments?: any[];
  stageId: string;
  initialStageId?: string;
  modifiedAt?: Date;
  modifiedBy?: string;
  userId?: string;
  createdAt?: Date;
  order?: number;
  searchText?: string;
  priority?: string;
  sourceConversationIds?: string[];
  status?: string;
  timeTrack?: {
    status: string;
    timeSpent: number;
    startDate?: string;
  };
  customFieldsData?: ICustomField[];
  score?: number;
  number?: string;
  data?: any;
  tagIds?: string[];
  branchIds?: string[];
  departmentIds?: string[];
  parentId?: string;
}

export interface IItemCommonFieldsDocument extends IItemCommonFields, Document {
  _id: string;
}

export interface IItemDragCommonFields {
  proccessId: string;
  itemId: string;
  aboveItemId?: string;
  destinationStageId: string;
  sourceStageId: string;
}

export interface IBoard extends ICommonFields {
  name?: string;
  pipelines?: IPipeline[];
}

export interface IBoardDocument extends IBoard, Document {
  _id: string;
}

export interface IPipeline extends ICommonFields {
  name?: string;
  boardId: string;
  status?: string;
  visibility?: string;
  memberIds?: string[];
  bgColor?: string;
  watchedUserIds?: string[];
  startDate?: Date;
  endDate?: Date;
  metric?: string;
  hackScoringType?: string;
  templateId?: string;
  isCheckDate?: boolean;
  isCheckUser?: boolean;
  isCheckDepartment?: boolean;
  excludeCheckUserIds?: string[];
  numberConfig?: string;
  numberSize?: string;
  lastNum?: string;
  departmentIds?: string[];
  tagId?: string;
}

export interface IPipelineDocument extends IPipeline, Document {
  _id: string;
}

export interface IStage extends ICommonFields {
  _id?: string | undefined;
  name?: string;
  probability?: string;
  pipelineId: string;
  visibility?: string;
  memberIds?: string[];
  canMoveMemberIds?: string[];
  canEditMemberIds?: string[];
  departmentIds?: string[];
  formId?: string;
  status?: string;
  code?: string;
  age?: number;
  defaultTick?: boolean;
}

export interface IStageDocument extends IStage, Document {
  _id: string;
}

// Not mongoose document, just stage shaped plain object
export type IPipelineStage = IStage & { _id: string };

export const attachmentSchema = new Schema(
  {
    name: field({ type: String }),
    url: field({ type: String }),
    type: field({ type: String }),
    size: field({ type: Number, optional: true }),
    duration: field({ type: Number, optional: true }),
  },
  { _id: false },
);

// Mongoose schemas =======================
const commonFieldsSchema = {
  userId: field({ type: String, label: 'Vytvořil' }),
  createdAt: field({
    type: Date,
    default: new Date(),
    label: 'Vytvořeno v',
  }),
  order: field({ type: Number, label: 'Objednat' }),
  type: field({
    type: String,
    enum: BOARD_TYPES.ALL,
    required: true,
    label: 'Typ',
  }),
};

const timeTrackSchema = new Schema(
  {
    startDate: field({ type: String }),
    timeSpent: field({ type: Number }),
    status: field({
      type: String,
      enum: TIME_TRACK_TYPES.ALL,
      default: TIME_TRACK_TYPES.STOPPED,
    }),
  },
  { _id: false },
);

const relationSchema = new Schema(
  {
    id: field({ type: String }),
    start: field({ type: String }),
    end: field({ type: String }),
  },
  { _id: false },
);

export const commonItemFieldsSchema = {
  _id: field({ pkey: true }),
  parentId: field({ type: String, optional: true, label: 'Id Rodiče' }),
  userId: field({ type: String, optional: true, esType: 'keyword' }),
  createdAt: field({ type: Date, label: 'Vytvořeno v', esType: 'date' }),
  order: field({ type: Number, index: true }),
  name: field({ type: String, label: 'Název' }),
  startDate: field({ type: Date, label: 'Datum zahájení', esType: 'date' }),
  closeDate: field({ type: Date, label: 'Datum uzavření', esType: 'date' }),
  stageChangedDate: field({
    type: Date,
    label: 'Změna data etapy',
    esType: 'date',
  }),
  reminderMinute: field({ type: Number, label: 'Minuta připomenutí' }),
  isComplete: field({
    type: Boolean,
    default: false,
    label: 'Je kompletní',
    esType: 'boolean',
  }),
  description: field({ type: String, optional: true, label: 'Popis' }),
  assignedUserIds: field({ type: [String], esType: 'keyword' }),
  watchedUserIds: field({ type: [String], esType: 'keyword' }),
  labelIds: field({ type: [String], esType: 'keyword' }),
  attachments: field({ type: [attachmentSchema], label: 'Přílohy' }),
  stageId: field({ type: String, index: true }),
  initialStageId: field({
    type: String,
    optional: true,
  }),
  modifiedAt: field({
    type: Date,
    default: new Date(),
    label: 'Upraveno v',
    esType: 'date',
  }),
  modifiedBy: field({ type: String, esType: 'keyword' }),
  searchText: field({ type: String, optional: true, index: true }),
  priority: field({ type: String, optional: true, label: 'Přednost' }),
  // TODO remove after migration
  sourceConversationId: field({ type: String, optional: true }),
  sourceConversationIds: field({ type: [String], optional: true }),
  timeTrack: field({
    type: timeTrackSchema,
  }),
  status: field({
    type: String,
    enum: BOARD_STATUSES.ALL,
    default: BOARD_STATUSES.ACTIVE,
    label: 'Postavení',
    selectOptions: BOARD_STATUSES_OPTIONS,
    index: true,
  }),
  customFieldsData: field({
    type: [customFieldSchema],
    optional: true,
    label: 'Data vlastních polí',
  }),
  score: field({
    type: Number,
    optional: true,
    label: 'Skóre',
    esType: 'number',
  }),
  number: field({
    type: String,
    unique: true,
    sparse: true,
    label: 'Číslo položky',
  }),
  relations: field({
    type: [relationSchema],
    optional: true,
    label: 'Související položky použité pro Ganttův diagram',
  }),
  tagIds: field({
    type: [String],
    optional: true,
    index: true,
    label: 'Tagy',
  }),
  branchIds: field({
    type: [String],
    optional: true,
    index: true,
    label: 'Tagy',
  }),
  departmentIds: field({
    type: [String],
    optional: true,
    index: true,
    label: 'Tagy',
  }),
};

export const boardSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Název' }),
    ...commonFieldsSchema,
  }),
);

export const pipelineSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'Název' }),
  boardId: field({ type: String, label: 'Deska' }),
  tagId: field({
    type: String,
    optional: true,
    label: 'Tagy',
  }),
  status: field({
    type: String,
    enum: BOARD_STATUSES.ALL,
    default: BOARD_STATUSES.ACTIVE,
    label: 'Postavení',
  }),
  visibility: field({
    type: String,
    enum: VISIBLITIES.ALL,
    default: VISIBLITIES.PUBLIC,
    label: 'Viditelnost',
  }),
  watchedUserIds: field({ type: [String], label: 'Sledovaní uživatelé' }),
  memberIds: field({ type: [String], label: 'členové' }),
  bgColor: field({ type: String, label: 'Barva pozadí' }),
  // Growth hack
  startDate: field({ type: Date, optional: true, label: 'Datum zahájení' }),
  endDate: field({ type: Date, optional: true, label: 'Datum ukončení' }),
  metric: field({ type: String, optional: true, label: 'Metrický' }),
  hackScoringType: field({
    type: String,
    enum: HACK_SCORING_TYPES.ALL,
    label: 'Typ hodnocení hackování',
  }),
  templateId: field({ type: String, optional: true, label: 'Šablona' }),
  isCheckDate: field({
    type: Boolean,
    optional: true,
    label: 'Vyberte den po datu vytvoření karty',
  }),
  isCheckUser: field({
    type: Boolean,
    optional: true,
    label: 'Zobrazit pouze karty vytvořené nebo přiřazené uživateli',
  }),
  isCheckDepartment: field({
    type: Boolean,
    optional: true,
    label: 'Zobrazit pouze vytvořené nebo přiřazené karty oddělení',
  }),
  excludeCheckUserIds: field({
    type: [String],
    optional: true,
    label: 'Uživatelé mají nárok na zobrazení všech karet',
  }),
  numberConfig: field({
    type: String,
    optional: true,
    label: 'Konfigurace čísla',
  }),
  numberSize: field({ type: String, optional: true, label: 'Počet čísel' }),
  lastNum: field({
    type: String,
    optional: true,
    label: 'Poslední vygenerované číslo',
  }),
  departmentIds: field({
    type: [String],
    optional: true,
    label: 'Příbuzná oddělení',
  }),
  ...commonFieldsSchema,
});

export const stageSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'Název' }),
  probability: field({
    type: String,
    enum: PROBABILITY.ALL,
    label: 'Pravděpodobnost',
  }), // Win probability
  pipelineId: field({ type: String, label: 'Potrubí' }),
  formId: field({ type: String, label: 'Formulář' }),
  status: field({
    type: String,
    enum: BOARD_STATUSES.ALL,
    default: BOARD_STATUSES.ACTIVE,
  }),
  visibility: field({
    type: String,
    enum: VISIBLITIES.ALL,
    default: VISIBLITIES.PUBLIC,
    label: 'Viditelnost',
  }),
  code: field({
    type: String,
    label: 'Kód',
    optional: true,
  }),
  age: field({ type: Number, optional: true, label: 'Stáří' }),
  memberIds: field({ type: [String], label: 'členové' }),
  canMoveMemberIds: field({ type: [String], label: 'Může přesouvat členy' }),
  canEditMemberIds: field({ type: [String], label: 'Může upravovat členy' }),
  departmentIds: field({ type: [String], label: 'Oddělení' }),
  defaultTick: field({
    type: Boolean,
    label: 'Použito výchozí zaškrtnutí',
    optional: true,
  }),
  ...commonFieldsSchema,
});
