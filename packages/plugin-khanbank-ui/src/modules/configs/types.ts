import { IUser } from '@saashq/ui/src/auth/types';
import { IDepartment } from '@saashq/ui/src/team/types';
import { QueryResponse } from '@saashq/ui/src/types';

export interface IKhanbankConfigsItem {
  _id: string;
  name: string;
  description: string;

  consumerKey: string;
  secretKey: string;
}

export type ConfigsListQueryResponse = {
  khanbankConfigsList: {
    list: IKhanbankConfigsItem[];
    totalCount: number;
  };

  loading: boolean;
  refetch: () => void;
} & QueryResponse;
