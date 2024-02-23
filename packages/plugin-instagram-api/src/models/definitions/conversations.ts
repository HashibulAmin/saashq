import { Document, Schema } from 'mongoose';

import { field } from './utils';

export interface IConversation {
  // id on saashq-api
  saashqApiId?: string;
  timestamp: Date;
  senderId: string;
  recipientId: string;
  content: string;
  integrationId: string;
}

export interface IConversationDocument extends IConversation, Document {}

export const conversationSchema = new Schema({
  _id: field({ pkey: true }),
  saashqApiId: String,
  timestamp: Date,
  senderId: { type: String, index: true },
  recipientId: { type: String, index: true },
  integrationId: String,
  content: String
});

conversationSchema.index({ senderId: 1, recipientId: 1 }, { unique: true });
