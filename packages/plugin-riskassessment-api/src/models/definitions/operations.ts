import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface IOperations extends Document {
  name: string;
  description: string;
  code: string;
  order: string;
  createdAt: string;
  modifiedAt: string;
}

export interface IOperationsDocument extends IOperations {
  _id: string;
}

export const operationSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'Název' }),
  description: field({ type: String, label: 'Popis' }),
  parentId: field({ type: String, label: 'Parent Id', optional: true }),
  code: field({ type: String, label: 'Kód' }),
  order: field({ type: String, label: 'Objednat' }),
  createdAt: field({ type: Date, label: 'Vytvořeno v', default: Date.now }),
  modifiedAt: field({ type: Date, label: 'Upraveno v', default: Date.now }),
  teamMemberIds: field({ type: [String], label: 'User Id' }),
});
