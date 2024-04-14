import { Document, Schema } from 'mongoose';
import { field } from './utils';

export interface IPipelineTemplateStage {
  _id: string;
  name: string;
  formId: string;
}

export interface IPipelineTemplate {
  name: string;
  description?: string;
  type: string;
  isDefinedBySaasHQ: boolean;
  stages: IPipelineTemplateStage[];
  createdBy?: string;
  createdDate: Date;
}

export interface IPipelineTemplateDocument extends IPipelineTemplate, Document {
  _id: string;
}

export const stageSchema = new Schema(
  {
    _id: field({ type: String }),
    name: field({ type: String, label: 'Pseudonym' }),
    formId: field({ type: String, optional: true, label: 'Formulář' }),
    order: field({ type: Number, label: 'Objednat' }),
  },
  { _id: false },
);

export const pipelineTemplateSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'Název' }),
  type: field({ type: String, label: 'Typ' }),
  description: field({ type: String, optional: true, label: 'Popis' }),
  stages: field({ type: [stageSchema], default: [], label: 'Etapy' }),
  isDefinedBySaasHQ: field({
    type: Boolean,
    default: false,
    label: 'Je definován SaasHQ',
  }),
  createdBy: field({ type: String, label: 'Vytvořil' }),
  createdAt: field({
    type: Date,
    default: new Date(),
    label: 'Vytvořeno v',
  }),
});
