import { Document, Schema } from 'mongoose';
import { commonItemFieldsSchema, IItemCommonFields } from './boards';
import { field } from './utils';

export interface IGrowthHack extends IItemCommonFields {
  voteCount?: number;
  votedUserIds?: string[];

  hackStages?: string;
  reach?: number;
  impact?: number;
  confidence?: number;
  ease?: number;
}

export interface IGrowthHackDocument extends IGrowthHack, Document {
  _id: string;
}

export const growthHackSchema = new Schema({
  ...commonItemFieldsSchema,
  voteCount: field({
    type: Number,
    default: 0,
    optional: true,
    label: 'Vote count',
  }),
  votedUserIds: field({ type: [String], label: 'Hlasovaní uživatelé' }),

  hackStages: field({ type: [String], optional: true, label: 'Etapy' }),
  reach: field({ type: Number, default: 0, optional: true, label: 'Reagovat' }),
  impact: field({
    type: Number,
    default: 0,
    optional: true,
    label: 'Dopad',
  }),
  confidence: field({
    type: Number,
    default: 0,
    optional: true,
    label: 'Důvěra',
  }),
  ease: field({ type: Number, default: 0, optional: true, label: 'Ulehčit' }),
});
