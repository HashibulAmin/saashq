import * as compose from 'lodash.flowright';

import { Alert, withProps } from '@saashq/ui/src/utils';
import {
  EditSchedulePageMutationResponse,
  SchedulePageMutationVariables,
} from '../../types';

import PageForm from '../../components/scheduler/PageForm';
import React from 'react';
import Spinner from '@saashq/ui/src/components/Spinner';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { queries as integrationQueries } from '@saashq/ui-inbox/src/settings/integrations/graphql';
import { mutations } from '../../graphql';
import { queries } from '@saashq/ui-inbox/src/settings/integrations/graphql';

type Props = {
  pageId: string;
  accountId: string;
  history: any;
};

type FinalProps = {
  fetchCalendarQuery: any;
  fetchPageQuery: any;
} & Props &
  EditSchedulePageMutationResponse;

class EditPageContainer extends React.Component<FinalProps, {}> {
  render() {
    const {
      fetchCalendarQuery,
      fetchPageQuery,
      accountId,
      editMutation,
      history,
      pageId,
    } = this.props;

    if (fetchCalendarQuery.loading || fetchPageQuery.loading) {
      return <Spinner objective={true} />;
    }

    if (fetchCalendarQuery.error || fetchPageQuery.error) {
      return <span style={{ color: 'red' }}>Integrations api neběží</span>;
    }

    const save = (doc: SchedulePageMutationVariables) => {
      editMutation({
        variables: { _id: pageId, ...doc },
      })
        .then(() => {
          Alert.success('Úspěšně jste aktualizovali stránku');

          history.push('/settings/schedule');
        })
        .catch((error) => {
          Alert.error(error.message);
        });
    };

    const updatedProps = {
      save,
      accountId,
      calendars: fetchCalendarQuery.integrationsNylasGetCalendars || [],
      page: fetchPageQuery.integrationsNylasGetSchedulePage,
    };

    return <PageForm {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, any>(
      gql(integrationQueries.integrationsNylasGetSchedulePage),
      {
        name: 'fetchPageQuery',
        options: ({ pageId }) => {
          return {
            variables: {
              pageId,
            },
          };
        },
      },
    ),
    graphql<Props, any>(gql(queries.integrationsNylasGetCalendars), {
      name: 'fetchCalendarQuery',
      options: ({ accountId }) => {
        return {
          variables: {
            accountId,
          },
        };
      },
    }),
    graphql<
      Props,
      SchedulePageMutationVariables,
      EditSchedulePageMutationResponse
    >(gql(mutations.editSchedulePage), {
      name: 'editMutation',
    }),
  )(EditPageContainer),
);
