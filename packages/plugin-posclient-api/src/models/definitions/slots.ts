import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils';

export interface IPosSlot {
  _id?: string;
  posId: string;
  posToken: string;
  name: string;
  code: string;
  option: object;
}

export interface IPosSlotDocument extends IPosSlot, Document {
  _id: string;
}

export const posSlotSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Název' }),
    code: field({ type: String, label: 'Kód' }),
    posId: field({ type: String, label: 'Pos' }),
    posToken: field({ type: String, label: 'Pos Token' }),
    option: field({ type: Object, lable: 'Option' }),
  }),
  'saashq_pos_slot',
);
