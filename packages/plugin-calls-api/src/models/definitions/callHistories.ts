import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface ICallHistory {
  receiverNumber: string;
  callerNumber: string;
  callDuration: number;
  callStartTime: Date;
  callEndTime: Date;
  callType: string;
  callStatus: string;
  sessionId: string;
  updatedAt: Date;
  createdAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ICallHistoryDocument extends ICallHistory, Document {}

export const callHistorySchema = new Schema({
  receiverNumber: field({ type: String, label: 'číslo přijímače' }),
  callerNumber: field({ type: String, label: 'číslo volajícího' }),
  callDuration: field({ type: Number, label: 'doba trvání' }),
  callStartTime: field({ type: Date, label: 'čas zahájení hovoru' }),
  callEndTime: field({ type: Date, label: 'čas ukončení hovoru' }),
  callType: field({
    type: String,
    label: 'typ hovoru',
    enum: ['incoming', 'outgoing'],
  }),
  callStatus: field({
    type: String,
    label: 'postavení',
    enum: ['missed', 'connected', 'rejected', 'cancelled'],
  }),
  sessionId: field({ type: String, label: 'ID relace hovoru' }),
  updatedAt: field({ type: Date, label: 'upravené datum' }),
  createdAt: field({ type: Date, label: 'datum vytvoření' }),
  createdBy: field({ type: String, label: 'vytvořil' }),
  updatedBy: field({ type: String, label: 'aktualizováno Od' }),
});
