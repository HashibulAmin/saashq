import * as compose from 'lodash.flowright';

import { Alert, __, confirm, withProps } from 'coreui/utils';
import { mutations, subscriptions } from '../graphql';

import Event from '../components/Event';
import Info from '@saashq/ui/src/components/Info';
import React from 'react';
import Spinner from '@saashq/ui/src/components/Spinner';
import { getWarningMessage } from '@saashq/ui-cards/src/boards/utils';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { queries as integrationsQueries } from '@saashq/ui-inbox/src/settings/integrations/graphql';

type Props = {
  type: string;
  currentDate: Date;
  queryParams: any;
  startTime: Date;
  endTime: Date;
  calendarIds: string[];
  onDayClick: (date) => void;
};

type FinalProps = {
  integrationsGetNylasEventsQuery: any;
  removeEventMutation: any;
} & Props;

class EventContainer extends React.Component<FinalProps, {}> {
  private unsubscribe;

  componentDidMount() {
    const { integrationsGetNylasEventsQuery } = this.props;

    this.unsubscribe = integrationsGetNylasEventsQuery.subscribeToMore({
      document: gql(subscriptions.calendarEventUpdated),
      updateQuery: () => {
        this.props.integrationsGetNylasEventsQuery.refetch();
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    this.props.integrationsGetNylasEventsQuery.refetch();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const {
      integrationsGetNylasEventsQuery,
      removeEventMutation,
      startTime,
      endTime,
      queryParams,
    } = this.props;

    if (integrationsGetNylasEventsQuery.loading) {
      return <Spinner objective={true} />;
    }

    if (integrationsGetNylasEventsQuery.error) {
      return <Info>{integrationsGetNylasEventsQuery.error.message}</Info>;
    }

    // remove action
    const remove = (_id: string, accountId: string) => {
      confirm(getWarningMessage('Událost'), { hasDeleteConfirm: true }).then(
        () => {
          removeEventMutation({
            variables: {
              _id,
              accountId,
            },
          })
            .then(() => {
              integrationsGetNylasEventsQuery.refetch({
                startTime,
                endTime,
                queryParams,
              });

              const msg = `${__(`Úspěšně jste smazali an`)} ${__('událost')}.`;

              Alert.success(msg);
            })
            .catch((error) => {
              Alert.error(error.message);
            });
        },
      );
    };

    const updatedProps = {
      ...this.props,
      remove,
      events: integrationsGetNylasEventsQuery.integrationsGetNylasEvents || [],
    };

    return <Event {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, any>(gql(integrationsQueries.integrationsGetNylasEvents), {
      name: 'integrationsGetNylasEventsQuery',
      options: ({ startTime, endTime, calendarIds }) => {
        return {
          variables: {
            calendarIds,
            startTime,
            endTime,
          },
        };
      },
    }),
    graphql<Props, any, { _id: string; accountId: string }>(
      gql(mutations.deleteEvent),
      {
        name: 'removeEventMutation',
      },
    ),
  )(EventContainer),
);
