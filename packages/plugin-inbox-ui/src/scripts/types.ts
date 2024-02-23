import { IIntegration } from '@saashq/ui-inbox/src/settings/integrations/types';

export interface IScript {
  _id: string;
  name: string;
  messengerId?: string;
  leadIds?: string[];
  leads?: IIntegration[];
  kbTopicId?: string;
}
