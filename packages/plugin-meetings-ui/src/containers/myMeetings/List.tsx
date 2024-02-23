import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { mutations, queries } from '../../graphql';
import { Alert, confirm, withProps } from '@saashq/ui/src/utils';
import { ListComponent } from '../../components/myMeetings/List';
import { graphql } from '@apollo/client/react/hoc';
import * as compose from 'lodash.flowright';
import withCurrentUser from '@saashq/ui/src/auth/containers/withCurrentUser';
import { IUser } from '@saashq/ui/src/auth/types';
import { RemoveMutationResponse } from '../../types';
import { Spinner } from '@saashq/ui/src/components';
import queryString from 'query-string';

type Props = {
  history: any;
  queryParams: any;
};

type FinalProps = {
  currentUser: IUser;
} & Props &
  RemoveMutationResponse;

const MyMeetingListContainer = (props: FinalProps) => {
  const { removeMutation } = props;

  const queryParams = queryString.parse(location.search);
  const {
    page,
    perPage,
    createdAtFrom,
    createdAtTo,
    ownerId,
    companyId,
    searchValue
  } = queryParams;

  const { data, loading } = useQuery(gql(queries.meetings), {
    variables: {
      perPage: parseInt(perPage?.toString()) || 10,
      page: parseInt(page?.toString()) || 1,
      isPreviousSession: true,
      createdAtFrom,
      createdAtTo,
      userId: ownerId,
      companyId,
      searchValue
    }
  });

  const { data: countData, loading: countLoading } = useQuery(
    gql(queries.meetingsCount),
    {
      variables: {
        perPage: parseInt(perPage?.toString()) || 10,
        page,
        isPreviousSession: true
      }
    }
  );

  const remove = (id: string) => {
    confirm('You are about to delete the item. Are you sure? ')
      .then(() => {
        removeMutation({ variables: { _id: id } })
          .then(() => {
            Alert.success('Successfully deleted an item');
          })
          .catch(e => Alert.error(e.message));
      })
      .catch(e => Alert.error(e.message));
  };
  if (loading || countLoading) {
    return <Spinner />;
  }
  const updatedProps = {
    ...props,
    remove,
    meetings: data.meetings,
    count: countData?.meetingsTotalCount
  };
  return <ListComponent {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql(gql(mutations.remove), {
      name: 'removeMutation',
      options: () => ({
        refetchQueries: ['meetings']
      })
    })
  )(withCurrentUser(MyMeetingListContainer))
);
