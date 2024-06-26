import { Document, Schema } from 'mongoose';
import { IGeneral } from './general';
import { schemaHooksWrapper, field } from './utils';

export interface IClassification {
  description: string;
  invDate: Date;
  total: number;
  classification: string;
  newClassification: string;
  contractId: string;
}

export interface IClassificationDocument extends IClassification, Document {
  _id: string;
  createdAt?: Date;
  createdBy?: string;
  dtl?: IGeneral[];
}

export const classificationSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    number: field({
      type: String,
      label: 'Number',
      index: true,
    }),
    description: field({ type: String, optional: true, label: 'Popis' }),
    invDate: field({
      type: Date,
      default: new Date(),
      label: 'Vytvořeno v',
    }),
    total: field({ type: Number, min: 0, label: 'total' }),
    classification: field({ type: String, label: 'classification' }),
    newClassification: field({ type: String, label: 'newClassification' }),
    createdAt: field({
      type: Date,
      default: () => new Date(),
      label: 'Vytvořeno v',
    }),
    createdBy: field({ type: String, optional: true, label: 'created member' }),
    contractId: field({
      type: String,
      label: 'contractId',
    }),
  }),
  'saashq_classificationSchema',
);
