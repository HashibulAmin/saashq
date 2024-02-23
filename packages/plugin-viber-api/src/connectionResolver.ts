import { IContext as IMainContext } from '@saashq/api-utils/src';
import { IConversation, IConversationMessages } from './models';

export interface IModels {
  Conversations: IConversation;
  ConversationMessage: IConversationMessages;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}
