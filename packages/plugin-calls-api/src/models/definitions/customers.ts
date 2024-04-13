import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface ICustomer {
  inboxIntegrationId: string;
  primaryPhone: string | number;
  saashqApiId?: string;
}

export interface ICustomerDocument extends ICustomer, Document {}

export const customerSchema: Schema<ICustomerDocument> =
  new Schema<ICustomerDocument>({
    _id: field({ pkey: true }),
    saashqApiId: { type: String, label: 'ID zákazníka na contact-api' },
    primaryPhone: {
      type: String,
      unique: true,
      label: 'Zavolejte na primární telefon',
    },
    inboxIntegrationId: { type: String, label: 'ID integrace doručené pošty' },
  });
