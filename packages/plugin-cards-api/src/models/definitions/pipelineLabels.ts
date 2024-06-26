import { Document, Schema } from 'mongoose';
import { field } from './utils';

export interface IPipelineLabel {
  name: string;
  colorCode: string;
  pipelineId: string;
  createdBy?: string;
  createdAt?: Date;
}

export interface IPipelineLabelDocument extends IPipelineLabel, Document {
  _id: string;
}

export const pipelineLabelSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'Název' }),
  colorCode: field({ type: String, label: 'Kód barvy' }),
  pipelineId: field({ type: String, label: 'Potrubí' }),
  createdBy: field({ type: String, label: 'Vytvořil' }),
  createdAt: field({
    type: Date,
    default: new Date(),
    label: 'Vytvořeno v',
  }),
});

pipelineLabelSchema.index(
  { pipelineId: 1, name: 1, colorCode: 1 },
  { unique: true },
);
