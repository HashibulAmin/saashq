import {
  SkillTypesAddMutation,
  SkillTypesEditMutation,
  SkillTypesRemoveMutation,
  SkillTypesTotalCountQueryResponse,
} from '../types';

import SkillTypes from '../components/SkillTypes';
import { SkillTypesQueryResponse } from '@saashq/ui-inbox/src/settings/skills/types';
import { commonListComposer } from '@saashq/ui/src/utils';
import { generatePaginationParams } from '@saashq/ui/src/utils/router';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import mutations from '../graphql/mutations';
import queries from '../graphql/queries';

type Props = {
  queryParams: any;
};

const commonOptions = ({ queryParams }: { queryParams?: any }) => ({
  refetchQueries: [
    { query: gql(queries.skillTypes) },
    { query: gql(queries.skills) },
    {
      query: gql(queries.skills),
      variables: {
        typeId: queryParams.typeId,
        ...generatePaginationParams(queryParams),
      },
    },
  ],
});

export default commonListComposer<Props>({
  label: 'dovednostiTypy',
  text: 'Typy dovedností',
  stringEditMutation: mutations.skillTypeEdit,
  stringAddMutation: mutations.skillTypeAdd,

  confirmProps: {
    message:
      'Toto trvale odstraní tento typ dovednosti a dovednosti v něm. jsi si naprosto jistý?',
    options: { hasDeleteConfirm: true },
  },

  gqlListQuery: graphql<Props, SkillTypesQueryResponse>(
    gql(queries.skillTypes),
    {
      name: 'listQuery',
      options: () => ({
        notifyOnNetworkStatusChange: true,
      }),
    },
  ),

  gqlTotalCountQuery: graphql<{}, SkillTypesTotalCountQueryResponse>(
    gql(queries.skillTypesTotalCount),
    {
      name: 'totalCountQuery',
    },
  ),

  gqlAddMutation: graphql<{}, SkillTypesAddMutation>(
    gql(mutations.skillTypeAdd),
    {
      name: 'addMutation',
      options: commonOptions,
    },
  ),

  gqlEditMutation: graphql<{}, SkillTypesEditMutation>(
    gql(mutations.skillTypeEdit),
    {
      name: 'editMutation',
      options: commonOptions,
    },
  ),

  gqlRemoveMutation: graphql<Props, SkillTypesRemoveMutation>(
    gql(mutations.skillTypeRemove),
    {
      name: 'removeMutation',
      options: commonOptions,
    },
  ),

  ListComponent: SkillTypes,
});
