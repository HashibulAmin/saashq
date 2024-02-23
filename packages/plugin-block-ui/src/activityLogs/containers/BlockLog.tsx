import * as compose from 'lodash.flowright';

import { IActivityLogItemProps } from '@saashq/ui-log/src/activityLogs/types';
import React from 'react';
import Spinner from '@saashq/ui/src/components/Spinner';
import BlockLog from '../component/BlockLog';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { queries } from '../../graphql';
import { withProps } from '@saashq/ui/src/utils';
import { InvestmentsQueryResponse } from '../../types';

type Props = {
  contentId: string;
  packageId: string;
  amount: number;
  activity: IActivityLogItemProps;
};

type FinalProps = {
  investmentsQuery: InvestmentsQueryResponse;
} & Props;

const BlockLogContainer = (props: FinalProps) => {
  const { investmentsQuery } = props;

  if (investmentsQuery.loading) {
    return <Spinner />;
  }

  const investments = investmentsQuery.investments;

  return <BlockLog investments={investments} {...props} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, InvestmentsQueryResponse, { saashqCustomerId: string }>(
      gql(queries.investments),
      {
        name: 'investmentsQuery',
        options: ({ contentId }) => ({
          fetchPolicy: 'network-only',
          variables: { saashqCustomerId: contentId }
        })
      }
    )
  )(BlockLogContainer)
);
