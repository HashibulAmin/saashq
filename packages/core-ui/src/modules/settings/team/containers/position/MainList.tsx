import * as compose from 'lodash.flowright';

import { Alert, confirm } from '@saashq/ui/src/utils';
import { EmptyState, Spinner } from '@saashq/ui/src';
import { mutations, queries } from '@saashq/ui/src/team/graphql';

import MainListComponent from '../../components/position/MainList';
import { PositionsMainQueryResponse } from '@saashq/ui/src/team/types';
import React from 'react';
import client from '@saashq/ui/src/apolloClient';
import { generatePaginationParams } from '@saashq/ui/src/utils/router';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { withProps } from '@saashq/ui/src/utils/core';

type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {
  listQuery: PositionsMainQueryResponse;
} & Props;

const MainList = (props: FinalProps) => {
  const { listQuery } = props;
  if (listQuery.loading) {
    return <Spinner />;
  }

  if (listQuery.error) {
    return <EmptyState image="/images/actions/5.svg" text="Něco se pokazilo" />;
  }

  const deletePositions = (ids: string[], callback: () => void) => {
    confirm('Toto bude trvale smazáno, jste si naprosto jisti?', {
      hasDeleteConfirm: true,
    }).then(() => {
      client
        .mutate({
          mutation: gql(mutations.positionsRemove),
          variables: { ids },
          refetchQueries: ['positionsMain'],
        })
        .then(() => {
          callback();
          Alert.success('Úspěšně smazáno');
        })
        .catch((e) => {
          Alert.error(e.message);
        });
    });
  };

  return <MainListComponent {...props} deletePositions={deletePositions} />;
};

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.positionsMain), {
      name: 'listQuery',
      options: ({ queryParams }) => ({
        variables: {
          searchValue: queryParams.searchValue,
          ...generatePaginationParams(queryParams || {}),
        },
      }),
    }),
  )(MainList),
);
