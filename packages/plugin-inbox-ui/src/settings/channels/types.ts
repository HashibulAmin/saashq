import { IChannel } from '@saashq/ui-inbox/src/settings/channels/types';
import { QueryResponse } from '@saashq/ui/src/types';

// query types

export type ChannelDetailQueryResponse = {
  channelDetail: IChannel;
} & QueryResponse;

export type ChannelsGetLastQueryResponse = {
  channelsGetLast: IChannel;
} & QueryResponse;

export type ChannelsCountQueryResponse = {
  channelsTotalCount: number;
} & QueryResponse;

// mutation types
export type EditChannelMutationVariables = {
  _id?: string;
  name: string;
  memberIds: string[];
  description?: string;
  integrationIds: string[];
};

export type EditChannelMutationResponse = {
  editMutation: (params: {
    variables: EditChannelMutationVariables;
  }) => Promise<void>;
};
