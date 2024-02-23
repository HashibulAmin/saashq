import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import Segments from '@saashq/ui-segments/src/containers/Filter';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import { withProps } from '@saashq/ui/src/utils';
import { queries as customerQueries } from '@saashq/ui-contacts/src/customers/graphql';
import { CountQueryResponse } from '@saashq/ui-contacts/src/customers/types';

type Props = {
  customersCountQuery?: CountQueryResponse;
};

const SegmentFilterContainer = (props: Props & WrapperProps) => {
  const { customersCountQuery, type } = props;

  const counts = (customersCountQuery
    ? customersCountQuery.customerCounts
    : null) || { bySegment: {} };

  return (
    <Segments
      contentType={`contacts:${type}`}
      counts={counts.bySegment || {}}
    />
  );
};

type WrapperProps = {
  abortController?: any;
  type: string;
  loadingMainQuery: boolean;
};

export default withProps<WrapperProps>(
  compose(
    graphql<WrapperProps, CountQueryResponse, { only: string }>(
      gql(customerQueries.customerCounts),
      {
        name: 'customersCountQuery',
        skip: ({ loadingMainQuery }) => loadingMainQuery,
        options: ({ type, abortController }) => ({
          variables: { type, only: 'bySegment' },
          context: {
            fetchOptions: { signal: abortController && abortController.signal }
          }
        })
      }
    )
  )(SegmentFilterContainer)
);
