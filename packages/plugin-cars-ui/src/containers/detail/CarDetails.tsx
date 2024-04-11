import { FieldsGroupsQueryResponse } from '@saashq/ui-forms/src/settings/properties/types';
import { EmptyState, Spinner, withProps } from '@saashq/ui/src';
import { IUser } from '@saashq/ui/src/auth/types';
import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import CarDetails from '../../components/detail/CarDetails';
import { queries } from '../../graphql';
import { queries as fieldQueries } from '@saashq/ui-forms/src/settings/properties/graphql';
import { DetailQueryResponse } from '../../types';

type Props = {
  id: string;
};

type FinalProps = {
  carDetailQuery: DetailQueryResponse;
  currentUser: IUser;
  fieldsGroupsQuery: FieldsGroupsQueryResponse;
} & Props;

const CarDetailsContainer = (props: FinalProps) => {
  const { id, carDetailQuery, currentUser, fieldsGroupsQuery } = props;
  if (carDetailQuery.loading) {
    return <Spinner objective={true} />;
  }

  if (!carDetailQuery.carDetail) {
    return <EmptyState text="Auto nenalezeno" image="/images/actions/24.svg" />;
  }

  const carDetail = carDetailQuery.carDetail;

  const updatedProps = {
    ...props,
    loading: carDetailQuery.loading,
    car: carDetail,
    currentUser,
    fieldsGroups: fieldsGroupsQuery ? fieldsGroupsQuery.fieldsGroups : [],
  };

  return <CarDetails {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, DetailQueryResponse, { _id: string }>(
      gql(queries.carDetail),
      {
        name: 'carDetailQuery',
        options: ({ id }) => ({
          variables: {
            _id: id,
          },
        }),
      },
    ),
    graphql<Props, FieldsGroupsQueryResponse, { contentType: string }>(
      gql(fieldQueries.fieldsGroups),
      {
        name: 'fieldsGroupsQuery',
        options: () => ({
          variables: {
            contentType: 'cars:car',
            isDefinedBySaasHQ: false,
          },
        }),
      },
    ),
  )(CarDetailsContainer),
);
