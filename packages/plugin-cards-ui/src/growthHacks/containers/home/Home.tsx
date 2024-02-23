import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import { queries } from '@saashq/ui-cards/src/boards/graphql';
import { BoardCountsQueryResponse } from '@saashq/ui-cards/src/boards/types';
import Spinner from '@saashq/ui/src/components/Spinner';
import { withProps } from '@saashq/ui/src/utils';
import { queries as ghQueries } from '../../graphql';
import { StateCountsQueryResponse } from '../../types';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import Home from '../../components/home/Home';

type Props = {
  queryParams: any;
};

type FinalProps = {
  boardCountsQuery: BoardCountsQueryResponse;
  pipelineStateCountQuery: StateCountsQueryResponse;
} & Props;

class HomeContainer extends React.Component<FinalProps> {
  render() {
    const {
      boardCountsQuery,
      queryParams,
      pipelineStateCountQuery
    } = this.props;

    if (pipelineStateCountQuery.loading) {
      return <Spinner />;
    }

    const props = {
      queryParams,
      boardsWithCount: boardCountsQuery.boardCounts || [],
      counts: pipelineStateCountQuery.pipelineStateCount || {}
    };

    return <Home {...props} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, BoardCountsQueryResponse>(gql(queries.boardCounts), {
      name: 'boardCountsQuery',
      options: () => ({
        variables: { type: 'growthHack' },
        fetchPolicy: 'network-only'
      })
    }),
    graphql<Props>(gql(ghQueries.pipelineStateCount), {
      name: 'pipelineStateCountQuery',
      options: ({ queryParams }) => ({
        variables: {
          boardId: queryParams && queryParams.id,
          type: 'growthHack'
        }
      })
    })
  )(HomeContainer)
);
