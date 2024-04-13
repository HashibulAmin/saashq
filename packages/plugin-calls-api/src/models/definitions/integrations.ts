import { Schema, Document } from 'mongoose';
import { field } from './utils';

interface Operator {
  userId: string;
  gsUsername: string;
  gsPassword: string;
}

export interface IIntegration {
  inboxId: String;
  wsServer: String;
  phone: String;
  operators: [Operator];
  token: String;
}

export interface IIntegrationDocument extends IIntegration, Document {}

export const integrationSchema = new Schema({
  _id: field({ pkey: true }),
  inboxId: field({ type: String, label: 'ID doručené pošty' }),
  wsServer: field({ type: String, label: 'webový soketový server' }),
  phone: field({ type: String, label: 'telefonní číslo', unique: true }),
  operators: field({ type: Object, label: 'Mapy operátorů' }),
  token: field({ type: String, label: 'žeton' }),
});
