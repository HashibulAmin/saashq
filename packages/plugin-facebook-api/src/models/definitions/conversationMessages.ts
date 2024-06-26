import { Document, Schema } from 'mongoose';

import { attachmentSchema } from '@saashq/api-utils/src/definitions/common';
import { field } from './utils';

export interface IConversationMessage {
  mid: string;
  conversationId: string;
  content: string;
  // from inbox
  createdAt?: Date;
  updatedAt?: Date;
  attachments?: any;
  customerId?: string;
  visitorId?: string;
  userId?: string;
  fromBot?: boolean;
  isCustomerRead?: boolean;
  internal?: boolean;
  botId?: string;
  botData?: any;
}

export interface IConversationMessageDocument
  extends IConversationMessage,
    Document {
  _id: string;
}

export const conversationMessageSchema = new Schema({
  _id: field({ pkey: true }),
  mid: { type: String, label: 'Facebook message id' },
  content: { type: String },
  // the following derives from inbox
  attachments: [attachmentSchema],
  conversationId: field({ type: String, index: true }),
  customerId: field({ type: String, index: true }),
  visitorId: field({
    type: String,
    index: true,
    label: 'unique visitor id on logger database',
  }),
  fromBot: field({ type: Boolean }),
  userId: field({ type: String, index: true }),
  createdAt: field({ type: Date, index: true, label: 'Vytvořeno v' }),
  updatedAt: field({ type: Date, index: true, label: 'Updated At' }),
  isCustomerRead: field({ type: Boolean, label: 'Is Customer Read' }),
  internal: field({ type: Boolean, label: 'Internal' }),
  botId: field({ type: String, label: 'Bot', optional: true }),
  botData: field({ type: Object, optional: true }),
});
