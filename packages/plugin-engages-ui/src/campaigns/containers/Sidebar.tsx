import * as compose from 'lodash.flowright';

import { Counts, IRouterProps } from '@saashq/ui/src/types';

import { CountQueryResponse } from '@saashq/ui-engage/src/types';
import React from 'react';
import Sidebar from '../components/Sidebar';
import { TagsQueryResponse } from '@saashq/ui-tags/src/types';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { isEnabled } from '@saashq/ui/src/utils/core';
import { queries } from '@saashq/ui-engage/src/graphql';
import { queries as tagQueries } from '@saashq/ui-tags/src/graphql';
import { withProps } from '@saashq/ui/src/utils';
import { withRouter } from 'react-router-dom';

type Props = {
  queryParams: any;
};

type FinalProps = {
  kindCountsQuery: CountQueryResponse;
  statusCountsQuery: CountQueryResponse;
  tagsQuery: TagsQueryResponse;
  tagCountsQuery: Counts;
} & IRouterProps;

const SidebarContainer = (props: FinalProps) => {
  const {
    kindCountsQuery,
    statusCountsQuery,
    tagsQuery,
    tagCountsQuery
  } = props;

  const updatedProps = {
    ...props,
    kindCounts: kindCountsQuery.engageMessageCounts || {},
    statusCounts: statusCountsQuery.engageMessageCounts || {},
    tags: (tagsQuery && tagsQuery.tags) || [],
    tagCounts: (tagCountsQuery && tagCountsQuery.engageMessageCounts) || {}
  };

  return <Sidebar {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, CountQueryResponse>(gql(queries.kindCounts), {
      name: 'kindCountsQuery'
    }),
    graphql<Props, CountQueryResponse, { kind: string }>(
      gql(queries.statusCounts),
      {
        name: 'statusCountsQuery',
        options: ({ queryParams }) => ({
          variables: {
            kind: queryParams.kind || ''
          }
        })
      }
    ),
    graphql<Props, Counts, { type: string }>(gql(tagQueries.tags), {
      name: 'tagsQuery',
      options: () => ({
        variables: { type: 'engages:engageMessage' }
      }),
      skip: !isEnabled('tags')
    }),
    graphql<Props, CountQueryResponse, { kind: string; status: string }>(
      gql(queries.tagCounts),
      {
        name: 'tagCountsQuery',
        options: ({ queryParams }) => ({
          variables: {
            kind: queryParams.kind || '',
            status: queryParams.status || ''
          }
        }),
        skip: !isEnabled('tags')
      }
    )
  )(withRouter<FinalProps>(SidebarContainer))
);
