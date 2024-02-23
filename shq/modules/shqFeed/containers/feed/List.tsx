import { mutations, queries } from '../../graphql';
import { useMutation, useQuery } from '@apollo/client';

import Alert from '../../../utils/Alert';
import List from '../../components/feed/List';
import WelcomeList from '../../components/feed/WelcomeList';
import React from 'react';
import { confirm } from '../../../utils';
import gql from 'graphql-tag';

type Props = {
  queryParams: any;
  contentType: string;
};

export default function ListContainer(props: Props) {
  const { contentType } = props;

  const feedResponse = useQuery(gql(queries.feed), {
    variables: {
      contentTypes: [contentType || 'post']
    }
  });

  const [deleteMutation] = useMutation(gql(mutations.deleteFeed));
  const [pinMutation] = useMutation(gql(mutations.pinFeed));

  if (feedResponse.loading) {
    return null;
  }

  const loadMore = () => {
    const feedLength = feedResponse.data.shqFeed.list.length || 0;

    feedResponse.fetchMore({
      variables: {
        skip: feedLength
      },
      updateQuery(prev, { fetchMoreResult }) {
        if (!fetchMoreResult) {
          return prev;
        }

        const fetchedShqFeed = fetchMoreResult.shqFeed.list || [];

        const prevShqFeed = prev.shqFeed.list || [];

        if (fetchedShqFeed) {
          return {
            ...prev,
            shqFeed: {
              ...prev.shqFeed,
              list: [...prevShqFeed, ...fetchedShqFeed]
            }
          };
        }
      }
    });
  };

  const pinItem = (_id: string) => {
    pinMutation({ variables: { _id } })
      .then(() => {
        Alert.success('Success!');

        feedResponse.refetch();
      })
      .catch((error) => {
        Alert.error(error.message);
      });
  };

  const deleteItem = (_id: string) => {
    confirm().then(() => {
      deleteMutation({ variables: { _id } })
        .then(() => {
          Alert.success('You successfully deleted.');

          feedResponse.refetch();
        })
        .catch((error) => {
          Alert.error(error.message);
        });
    });
  };

  const shqFeed = feedResponse.data?.shqFeed.list || [];
  const totalCount = feedResponse.data?.shqFeed.totalCount || 0;

  if (contentType === 'welcome') {
    return (
      <WelcomeList list={shqFeed} totalCount={totalCount} loadMore={loadMore} />
    );
  }

  return (
    <List
      deleteItem={deleteItem}
      pinItem={pinItem}
      list={shqFeed}
      totalCount={totalCount}
      contentType={contentType}
      loadMore={loadMore}
    />
  );
}
