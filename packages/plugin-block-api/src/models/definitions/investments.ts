import { Document, Schema } from 'mongoose';
import { field } from './utils';

export interface IInvestment {
  saashqCustomerId: string;
  packageId: string;
  amount: number;
}

export interface IInvestmentDocument extends IInvestment, Document {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export const investmentSchema = new Schema({
  _id: field({ pkey: true }),
  saashqCustomerId: field({
    type: String,
    label: 'Zákazník',
  }),
  amount: field({
    type: Number,
    label: 'Množství',
  }),
  packageId: field({
    type: String,
    label: 'Balík',
  }),
  createdAt: field({
    type: Date,
    default: Date.now,
    label: 'Vytvořeno v',
  }),
  modifiedAt: field({ type: Date, label: 'Upraveno v' }),
});
