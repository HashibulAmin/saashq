import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import EmptyContent from '@saashq/ui/src/components/empty/EmptyContent';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Spinner from '@saashq/ui/src/components/Spinner';
import { IDateColumn, IRouterProps } from '@saashq/ui/src/types';
import { withProps } from '@saashq/ui/src/utils';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import { withRouter } from 'react-router-dom';
import {
  EMPTY_CONTENT_DEAL,
  EMPTY_CONTENT_TASK,
  EMPTY_CONTENT_PURCHASE,
} from '../constants';
import { queries } from '../graphql';
import { RootBack, ScrolledContent, ChartBack } from '../styles/common';
import { IOptions, PipelineDetailQueryResponse } from '../types';
import Pipeline from './Pipeline';
import PipelineActivity from './PipelineActivity';
import ViewGroupBy from './ViewGroupBy';
import ChartStack from './chart/ChartRenderer';
import TimeItems from './time/TimeItems';

type Props = {
  pipelineDetailQuery: PipelineDetailQueryResponse;
  date: IDateColumn;
} & WrapperProps &
  IRouterProps;

class Board extends React.Component<Props> {
  render() {
    const { pipelineDetailQuery, queryParams, options, viewType } = this.props;

    if (pipelineDetailQuery && pipelineDetailQuery.loading) {
      return <Spinner />;
    }

    if (!pipelineDetailQuery || !pipelineDetailQuery.pipelineDetail) {
      const type = options.type;

      if (type === 'deal' || type === 'task' || type === 'purchase') {
        return (
          <EmptyContent
            content={
              type === 'deal'
                ? EMPTY_CONTENT_DEAL
                : type === 'task'
                  ? EMPTY_CONTENT_TASK
                  : EMPTY_CONTENT_PURCHASE
            }
            maxItemWidth="400px"
          />
        );
      }

      return (
        <EmptyState
          image="/images/actions/18.svg"
          text="Oh, chlapče, vypadá to, že potřebuješ získat náskok na své desce"
          size="small"
          light={true}
        />
      );
    }

    const pipeline = pipelineDetailQuery.pipelineDetail;

    if (viewType === 'activity') {
      return (
        <PipelineActivity
          key={pipeline._id}
          options={options}
          pipeline={pipeline}
          queryParams={queryParams}
        />
      );
    }

    if (viewType === 'list') {
      return (
        <ViewGroupBy
          key={pipeline._id}
          options={options}
          pipeline={pipeline}
          queryParams={queryParams}
          viewType={viewType}
        />
      );
    }

    if (viewType === 'gantt') {
      return (
        <ViewGroupBy
          key={pipeline._id}
          options={options}
          pipeline={pipeline}
          queryParams={queryParams}
          viewType={viewType}
        />
      );
    }

    if (viewType === 'chart') {
      return (
        <ChartBack>
          <ChartStack
            stackBy={queryParams.stackBy}
            type={options.type}
            pipelineId={pipeline._id}
            chartType={queryParams.chartType}
          />
        </ChartBack>
      );
    }

    if (viewType === 'time') {
      return (
        <RootBack style={{ backgroundColor: '#fff' }}>
          <ScrolledContent>
            <ViewGroupBy
              key={pipeline._id}
              options={options}
              pipeline={pipeline}
              queryParams={queryParams}
              viewType={viewType}
            />
          </ScrolledContent>
        </RootBack>
      );
    }

    return (
      <RootBack style={{ backgroundColor: pipeline.bgColor }}>
        <ScrolledContent>
          <Pipeline
            key={pipeline._id}
            options={options}
            pipeline={pipeline}
            queryParams={queryParams}
          />
        </ScrolledContent>
      </RootBack>
    );
  }
}

type WrapperProps = {
  queryParams: any;
  options: IOptions;
  viewType?: string;
};

export default withProps<WrapperProps>(
  compose(
    graphql<WrapperProps, PipelineDetailQueryResponse, { _id?: string }>(
      gql(queries.pipelineDetail),
      {
        name: 'pipelineDetailQuery',
        skip: ({ queryParams }) => !queryParams.pipelineId,
        options: ({ queryParams }) => ({
          variables: { _id: queryParams && queryParams.pipelineId },
        }),
      },
    ),
  )(withRouter(Board)),
);
