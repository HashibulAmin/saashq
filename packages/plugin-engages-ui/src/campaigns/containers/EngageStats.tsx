import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Spinner from '@saashq/ui/src/components/Spinner';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import { withProps } from '@saashq/ui/src/utils';
import EngageStats from '../components/EngageStats';
import { queries } from '@saashq/ui-engage/src/graphql';
import { EngageMessageDetailQueryResponse } from '@saashq/ui-engage/src/types';

type Props = {
  messageId: string;
};

type FinalProps = {
  engageMessageDetailQuery: EngageMessageDetailQueryResponse;
};

const EngageStatsContainer = (props: FinalProps) => {
  const { engageMessageDetailQuery } = props;

  if (engageMessageDetailQuery.error) {
    return <EmptyState size="full" text="Chyba" icon="ban" />;
  }

  if (engageMessageDetailQuery.loading) {
    return <Spinner />;
  }

  if (!engageMessageDetailQuery.engageMessageDetail) {
    return (
      <EmptyState size="full" text="Zpráva nenalezena" icon="web-section-alt" />
    );
  }

  const message = engageMessageDetailQuery.engageMessageDetail;

  return <EngageStats message={message} {...props} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, EngageMessageDetailQueryResponse, { _id: string }>(
      gql(queries.engageMessageStats),
      {
        name: 'engageMessageDetailQuery',
        options: ({ messageId }) => ({
          variables: {
            _id: messageId,
          },
        }),
      },
    ),
  )(EngageStatsContainer),
);
