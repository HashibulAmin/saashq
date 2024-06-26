import { Document, Schema } from 'mongoose';
import { TRANSACTION_SELECT_OPTIONS } from './constants';
import { field } from './utils';

const getEnum = (fieldName: string): string[] => {
  return TRANSACTION_SELECT_OPTIONS[fieldName].map((option) => option.value);
};

export interface ITransaction {
  saashqCustomerId: string;
  type: string;
  body: any;
  status: string;
  bankStatus: string;
}

export interface ITransactionDocument extends ITransaction, Document {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export const transactionSchema = new Schema({
  _id: field({ pkey: true }),
  saashqCustomerId: field({
    type: String,
    label: 'Zákazník',
    optional: true,
  }),
  type: field({
    type: String,
    enum: getEnum('TYPE'),
    default: '',
    optional: true,
    label: 'Typ',
    esType: 'keyword',
    selectOptions: TRANSACTION_SELECT_OPTIONS.TYPE,
  }),
  status: field({
    type: String,
    label: 'Postavení',
    default: 'processing',
    optional: true,
  }),
  bankStatus: field({
    type: String,
    label: 'Stav Banky',
    optional: true,
  }),
  body: field({
    type: String,
    label: 'Postavení',
    optional: true,
  }),
  createdAt: field({
    type: Date,
    default: Date.now,
    label: 'Vytvořeno v',
  }),

  modifiedAt: field({ type: Date, label: 'Upraveno v' }),
});
