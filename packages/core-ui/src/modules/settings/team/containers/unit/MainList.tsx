import * as compose from 'lodash.flowright';

import { Alert, confirm } from '@saashq/ui/src/utils';
import { EmptyState, Spinner } from '@saashq/ui/src';
import { mutations, queries } from '@saashq/ui/src/team/graphql';

import MainListCompoenent from '../../components/unit/MainList';
import React from 'react';
import { UnitsMainQueryResponse } from '@saashq/ui/src/team/types';
import client from '@saashq/ui/src/apolloClient';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { withProps } from '@saashq/ui/src/utils/core';

type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {
  listQuery: UnitsMainQueryResponse;
} & Props;

class MainList extends React.Component<FinalProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { listQuery } = this.props;

    if (listQuery.loading) {
      return <Spinner />;
    }

    if (listQuery.error) {
      return (
        <EmptyState image="/images/actions/5.svg" text="Něco se pokazilo" />
      );
    }

    const deleteUnits = (ids: string[], callback: () => void) => {
      confirm('Toto bude trvale smazáno, jste si naprosto jisti?', {
        hasDeleteConfirm: true,
      }).then(() => {
        client
          .mutate({
            mutation: gql(mutations.unitsRemove),
            variables: { ids },
            refetchQueries: ['unitsMain'],
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
    return <MainListCompoenent {...this.props} deleteUnits={deleteUnits} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.unitsMain), {
      name: 'listQuery',
      options: ({ queryParams }) => ({
        variables: {
          searchValue: queryParams.searchValue,
        },
      }),
    }),
  )(MainList),
);
