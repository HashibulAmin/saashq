import React from 'react';
import { gql } from '@apollo/client';
import { queries } from '../../graphql';
import { PageDetailQueryResponse, IPage } from '../../types';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Spinner from '@saashq/ui/src/components/Spinner';
import Detail from '../../components/pages/PageDetail';
import { withProps } from '@saashq/ui/src/utils';
import * as compose from 'lodash.flowright';
import { graphql } from '@apollo/client/react/hoc';

type Props = {
  id: string;
};

type FinalProps = {
  pageDetailQuery: PageDetailQueryResponse;
} & Props;

function PageDetail(props: FinalProps) {
  const { pageDetailQuery } = props;

  if (pageDetailQuery.loading) {
    return <Spinner objective={true} />;
  }

  if (!pageDetailQuery.forumPage) {
    return (
      <EmptyState text="Stránka nenalezena" image="/images/actions/17.svg" />
    );
  }

  const updatedProps = {
    ...props,
    page: pageDetailQuery.forumPage || ({} as IPage),
  };

  return <Detail {...updatedProps} />;
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.pageDetail), {
      name: 'pageDetailQuery',
      options: ({ id }) => ({
        variables: {
          id,
        },
        fetchPolicy: 'network-only',
      }),
    }),
  )(PageDetail),
);
