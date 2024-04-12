import {
  IDetail,
  IDetailDocument,
  IEmailSignature,
  IEmailSignatureDocument,
  IUser,
  IUserDocument,
  userSchema,
} from '@saashq/api-utils/src/definitions/users';
import { Document, Schema } from 'mongoose';
import { USER_MOVEMENT_STATUSES } from '../../../constants';
import { field } from './utils';

interface IUserMovementDocument extends Document {
  _id: string;
  contentType: string;
  contentTypeId: string;
  userId: string;
  createdAt: string;
  createdBy: string;
  status: string;
  isActive: boolean;
}

const userMovemmentSchema = new Schema({
  _id: field({ pkey: true }),
  contentType: field({ type: String, label: 'Typ obsahu' }),
  contentTypeId: field({ type: String, label: 'ID typu obsahu' }),
  userId: field({ type: String, label: 'Uživatelské ID' }),
  createdBy: field({ type: String, label: 'Vytvořil' }),
  isActive: field({ type: Boolean, label: 'Je aktivní' }),
  status: field({
    type: String,
    label: 'Stav pohybu uživatele',
    default: USER_MOVEMENT_STATUSES.CREATED,
  }),
  createdAt: field({ type: Date, label: 'Vytvořeno v', default: Date.now }),
});

export {
  IDetail,
  IDetailDocument,
  IEmailSignature,
  IEmailSignatureDocument,
  IUser,
  IUserDocument,
  userSchema,
  IUserMovementDocument,
  userMovemmentSchema,
};
