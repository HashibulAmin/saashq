import * as compose from 'lodash.flowright';

import { ITag, TagsQueryResponse } from '@saashq/ui-tags/src/types';

import { CountQueryResponse } from '@saashq/ui-contacts/src/customers/types';
import CountsByTag from '@saashq/ui/src/components/CountsByTag';
import React from 'react';
import { TAG_TYPES } from '@saashq/ui-tags/src/constants';
import { queries as customerQueries } from '@saashq/ui-contacts/src/customers/graphql';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { queries as tagQueries } from '@saashq/ui-tags/src/graphql';
import { withProps } from '@saashq/ui/src/utils';

const TagFilterContainer = (props: {
  customersCountQuery?: CountQueryResponse;
  tagsQuery?: TagsQueryResponse;
}) => {
  const { customersCountQuery, tagsQuery } = props;

  const counts = (customersCountQuery
    ? customersCountQuery.customerCounts
    : null) || { byTag: {} };

  let tagsLoading = false;
  let tags: ITag[] = [];

  if (tagsQuery) {
    tagsLoading = tagsQuery.loading || false;
    tags = tagsQuery.tags || [];
  }

  return (
    <CountsByTag
      tags={tags}
      counts={counts.byTag || {}}
      manageUrl="/settings/tags?type=contacts:customer"
      loading={tagsLoading}
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
          variables: { type, only: 'byTag' },
          context: {
            fetchOptions: { signal: abortController && abortController.signal }
          }
        })
      }
    ),
    graphql<WrapperProps, TagsQueryResponse, { type: string }>(
      gql(tagQueries.tags),
      {
        name: 'tagsQuery',
        skip: ({ loadingMainQuery }) => loadingMainQuery,
        options: ({ abortController }) => ({
          variables: {
            type: TAG_TYPES.CUSTOMER
          },
          context: {
            fetchOptions: { signal: abortController && abortController.signal }
          }
        })
      }
    )
  )(TagFilterContainer)
);
