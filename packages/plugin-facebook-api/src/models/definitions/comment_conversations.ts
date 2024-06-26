import { Document, Schema } from 'mongoose';
import { attachmentSchema } from '@saashq/api-utils/src/definitions/common';
import { field } from './utils';

export interface ICommentConversation {
  postId: string;
  mid: string;
  comment_id: string;
  recipientId: string;
  senderId: string;
  content: string;
  saashqApiId?: string;
  customerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  attachments?: any;
}

export interface ICommentConversationDocument
  extends ICommentConversation,
    Document {
  isResolved: any;
}

export const commentConversationSchema = new Schema({
  _id: field({ pkey: true }),
  mid: { type: String, label: 'comment message id' },
  postId: { type: String },
  comment_id: { type: String },
  recipientId: { type: String },
  senderId: { type: String },
  content: String,
  saashqApiId: String,
  customerId: { type: String, optional: true },
  createdAt: { type: Date, default: Date.now, label: 'Vytvořeno v' },
  updatedAt: field({ type: Date, index: true, label: 'Updated At' }),
  attachments: [attachmentSchema],
});
