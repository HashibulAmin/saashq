import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';

import EmptyState from '@saashq/ui/src/components/EmptyState';
import Spinner from '@saashq/ui/src/components/Spinner';
import { withProps } from '@saashq/ui/src/utils';
import EngageLogs from '../components/EngageLogs';
import { queries } from '@saashq/ui-engage/src/graphql';
import {
  EngageLogsQueryResponse,
  IEngageLog,
} from '@saashq/ui-engage/src/types';

type Props = {
  messageId: string;
};

type FinalProps = {
  engageMessageLogsQuery: EngageLogsQueryResponse;
} & Props;

const EngageStatsContainer = (props: FinalProps) => {
  const { engageMessageLogsQuery, messageId } = props;

  if (engageMessageLogsQuery.error) {
    return <EmptyState size="full" text="Chyba" icon="ban" />;
  }

  if (engageMessageLogsQuery.loading) {
    return <Spinner />;
  }

  if (!engageMessageLogsQuery.engageLogs) {
    return (
      <EmptyState
        size="full"
        text="Protokoly nebyly nalezeny"
        icon="web-section-alt"
      />
    );
  }

  const fetchMore = (perPage: number) => {
    engageMessageLogsQuery.fetchMore({
      variables: {
        engageMessageId: messageId,
        perPage,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        const prevLogs = prev.engageLogs || [];
        const prevIds = prevLogs.map((log: IEngageLog) => log._id);
        const fetchedLogs: any[] = [];

        for (const log of fetchMoreResult.engageLogs) {
          if (!prevIds.includes(log._id)) {
            fetchedLogs.push(log);
          }
        }

        return {
          ...prev,
          engageLogs: [...prevLogs, ...fetchedLogs],
        };
      },
    });
  };

  return (
    <EngageLogs
      {...props}
      logs={engageMessageLogsQuery.engageLogs || []}
      fetchMore={fetchMore}
    />
  );
};

export default withProps<Props>(
  compose(
    graphql<Props, EngageLogsQueryResponse, { engageMessageId: string }>(
      gql(queries.engageLogs),
      {
        name: 'engageMessageLogsQuery',
        options: ({ messageId }) => ({
          variables: { engageMessageId: messageId },
        }),
      },
    ),
  )(EngageStatsContainer),
);
