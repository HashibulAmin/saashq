import { Document, Schema } from 'mongoose';

import { field } from './utils';

export interface IConversation {
  // id on saashq-api
  saashqApiId?: string;
  senderPhoneNumber: string;
  recipientPhoneNumber: string;
  integrationId: string;
  callId: string;
}

export interface IConversationDocument extends IConversation, Document {}

export const conversationSchema = new Schema({
  _id: field({ pkey: true }),
  saashqApiId: String,
  integrationId: String,
  senderPhoneNumber: { type: String },
  recipientPhoneNumber: { type: String },
  callId: String
});
