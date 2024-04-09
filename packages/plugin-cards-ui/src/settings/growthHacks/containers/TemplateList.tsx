import {
  ICommonFormProps,
  ICommonListProps,
} from '@saashq/ui-settings/src/common/types';
import { mutations, queries } from '../graphql';

import { Alert } from '@saashq/ui/src/utils';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { IPipelineTemplate } from '../types';
import React from 'react';
import TemplateList from '../components/TemplateList';
import client from '@saashq/ui/src/apolloClient';
import commonListComposer from '@saashq/ui/src/utils/commonListComposer';
import { generatePaginationParams } from '@saashq/ui/src/utils/router';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';

export type PipelineTemplatesQueryResponse = {
  pipelineTemplates: IPipelineTemplate[];
  loading: boolean;
  refetch: () => void;
};

type Props = ICommonListProps &
  ICommonFormProps & {
    queryParams: any;
    renderButton: (props: IButtonMutateProps) => JSX.Element;
  };

class TemplateListContainer extends React.Component<Props> {
  duplicate = (id: string) => {
    client
      .mutate({
        mutation: gql(mutations.pipelineTemplatesDuplicate),
        variables: { _id: id },
      })
      .then(() => {
        Alert.success('Successfully duplicated a template');

        this.props.refetch();
      })
      .catch((e) => {
        Alert.error(e.message);
      });
  };

  render() {
    return <TemplateList {...this.props} duplicate={this.duplicate} />;
  }
}

export default commonListComposer<Props>({
  text: 'šablona pro hackování růstu',
  label: 'pipelineTemplates',
  stringEditMutation: mutations.pipelineTemplatesEdit,
  stringAddMutation: mutations.pipelineTemplatesAdd,

  gqlListQuery: graphql(gql(queries.pipelineTemplates), {
    name: 'listQuery',
    options: ({ queryParams }: { queryParams: any }) => {
      return {
        notifyOnNetworkStatusChange: true,
        variables: {
          ...generatePaginationParams(queryParams),
          type: 'growthHack',
        },
      };
    },
  }),

  gqlTotalCountQuery: graphql(gql(queries.totalCount), {
    name: 'totalCountQuery',
  }),

  gqlAddMutation: graphql(gql(mutations.pipelineTemplatesAdd), {
    name: 'addMutation',
  }),

  gqlEditMutation: graphql(gql(mutations.pipelineTemplatesEdit), {
    name: 'editMutation',
  }),

  gqlRemoveMutation: graphql(gql(mutations.pipelineTemplatesRemove), {
    name: 'removeMutation',
  }),

  ListComponent: TemplateListContainer,
});
