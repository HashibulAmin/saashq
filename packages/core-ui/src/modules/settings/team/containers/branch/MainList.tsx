import React from 'react';
import * as compose from 'lodash.flowright';
import { withProps } from '@saashq/ui/src/utils/core';
import { graphql } from '@apollo/client/react/hoc';
import { gql } from '@apollo/client';
import { queries, mutations } from '@saashq/ui/src/team/graphql';
import { BranchesMainQueryResponse } from '@saashq/ui/src/team/types';
import { EmptyState, Spinner } from '@saashq/ui/src';
import MainListCompoenent from '../../components/branch/MainList';
import { Alert, confirm } from '@saashq/ui/src/utils';
import client from '@saashq/ui/src/apolloClient';
import { generatePaginationParams } from '@saashq/ui/src/utils/router';

type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {
  listQuery: BranchesMainQueryResponse;
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
        <EmptyState image="/images/actions/5.svg" text="Something went wrong" />
      );
    }

    const deleteBranches = (ids: string[], callback: () => void) => {
      confirm().then(() => {
        client
          .mutate({
            mutation: gql(mutations.branchesRemove),
            variables: { ids },
            refetchQueries: ['branchesMain']
          })
          .then(() => {
            callback();
            Alert.success('Successfully deleted');
          })
          .catch(e => {
            Alert.error(e.message);
          });
      });
    };
    return (
      <MainListCompoenent {...this.props} deleteBranches={deleteBranches} />
    );
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.branchesMain), {
      name: 'listQuery',
      options: ({ queryParams }) => ({
        variables: {
          searchValue: queryParams.searchValue,
          withoutUserFilter: true,
          ...generatePaginationParams(queryParams || {})
        }
      })
    })
  )(MainList)
);
