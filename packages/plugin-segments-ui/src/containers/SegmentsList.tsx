import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import { Alert, withProps } from '@saashq/ui/src/utils';
import { confirm } from '@saashq/ui/src/utils';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import SegmentsList from '../components/SegmentsList';
import { mutations, queries } from '@saashq/ui-segments/src/graphql';
import { router } from '@saashq/ui/src/utils';
import {
  RemoveMutationResponse,
  SegmentsQueryResponse
} from '@saashq/ui-segments/src/types';
import Spinner from '@saashq/ui/src/components/Spinner';

type Props = {
  contentType: string;
  history: any;
};

type FinalProps = {
  segmentsQuery: SegmentsQueryResponse;
  getTypesQuery;
} & Props &
  RemoveMutationResponse;

const SegmentListContainer = (props: FinalProps) => {
  const { segmentsQuery, getTypesQuery, removeMutation, history } = props;

  if (getTypesQuery.loading) {
    return <Spinner />;
  }

  const types = getTypesQuery.segmentsGetTypes || [];

  if (!router.getParam(history, 'contentType') || !segmentsQuery) {
    router.setParams(
      history,
      { contentType: types[0] ? types[0].contentType.toString() : '' },
      true
    );
  }

  const removeSegment = segmentId => {
    confirm().then(() => {
      removeMutation({
        variables: { _id: segmentId }
      })
        .then(() => {
          segmentsQuery.refetch();

          Alert.success('You successfully deleted a segment');
        })
        .catch(error => {
          Alert.error(error.message);
        });
    });
  };

  const updatedProps = {
    ...props,
    types,
    loading: segmentsQuery.loading,
    segments: segmentsQuery.segments || [],
    removeSegment
  };

  return <SegmentsList {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.getTypes), {
      name: 'getTypesQuery',
      options: () => ({
        fetchPolicy: 'network-only'
      })
    }),
    graphql<Props, SegmentsQueryResponse, { contentTypes: string[] }>(
      gql(queries.segments),
      {
        name: 'segmentsQuery',
        options: ({ contentType }) => ({
          fetchPolicy: 'network-only',
          variables: { contentTypes: [contentType] }
        })
      }
    ),

    graphql<Props, RemoveMutationResponse, { _id: string }>(
      gql(mutations.segmentsRemove),
      {
        name: 'removeMutation'
      }
    )
  )(SegmentListContainer)
);
