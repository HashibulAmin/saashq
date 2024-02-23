import * as compose from 'lodash.flowright';

import { CountQueryResponse } from '@saashq/ui/src/team/types';
import React from 'react';
import asyncComponent from '@saashq/ui/src/components/AsyncComponent';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { queries } from '@saashq/ui/src/team/graphql';
import { withProps } from '@saashq/ui/src/utils';

type Props = {
  userCountsQuery?: CountQueryResponse;
};

const Segments = asyncComponent(() =>
  import(
    /* webpackChunkName: "SegmentFilter" */ '@saashq/ui-segments/src/containers/Filter'
  )
);

const SegmentFilterContainer = (props: Props & WrapperProps) => {
  const { userCountsQuery } = props;

  const counts = (userCountsQuery ? userCountsQuery.usersTotalCount : null) || {
    bySegment: {}
  };

  return <Segments contentType="core:user" counts={counts.bySegment || {}} />;
};

type WrapperProps = {
  type: string;
  loadingMainQuery: boolean;
};

export default withProps<{ loadingMainQuery: boolean }>(
  compose(
    graphql<
      { loadingMainQuery: boolean },
      CountQueryResponse,
      { only: string }
    >(gql(queries.usersTotalCount), {
      name: 'userCountsQuery',
      skip: ({ loadingMainQuery }) => loadingMainQuery,
      options: {
        variables: { only: 'bySegment' }
      }
    })
  )(SegmentFilterContainer)
);
