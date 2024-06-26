import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Spinner from '@saashq/ui/src/components/Spinner';
import { router, withProps, Alert } from '@saashq/ui/src/utils';
import React, { useState } from 'react';
import { graphql } from '@apollo/client/react/hoc';
import { IUser } from '@saashq/ui/src/auth/types';
import AutomationForm from '../../components/editor/Main';
import { queries, mutations } from '../../graphql';
import {
  DetailQueryResponse,
  EditMutationResponse,
  IAutomation,
  AutomationsNoteQueryResponse,
  AutomationConstantsQueryResponse,
} from '../../types';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@saashq/ui/src/types';

type Props = {
  id: string;
  queryParams: any;
};

type FinalProps = {
  automationDetailQuery: DetailQueryResponse;
  automationNotesQuery: AutomationsNoteQueryResponse;
  automationConstantsQuery: AutomationConstantsQueryResponse;
  currentUser: IUser;
  saveAsTemplateMutation: any;
} & Props &
  EditMutationResponse &
  IRouterProps;

const AutomationDetailsContainer = (props: FinalProps) => {
  const {
    automationDetailQuery,
    automationNotesQuery,
    currentUser,
    history,
    editAutomationMutation,
    automationConstantsQuery,
  } = props;

  const [saveLoading, setLoading] = useState(false);

  const save = (doc: IAutomation) => {
    setLoading(true);

    editAutomationMutation({
      variables: {
        ...doc,
      },
    })
      .then(() => {
        router.removeParams(history, 'isCreate');

        setTimeout(() => {
          setLoading(false);
        }, 300);

        Alert.success(`Úspěšně jste aktualizovali a ${doc.name || 'status'}`);
      })

      .catch((error) => {
        Alert.error(error.message);
      });
  };

  if (
    automationDetailQuery.loading ||
    automationNotesQuery.loading ||
    automationConstantsQuery.loading
  ) {
    return <Spinner objective={true} />;
  }

  if (!automationDetailQuery.automationDetail) {
    return (
      <EmptyState
        text="Automatizace nenalezena"
        image="/images/actions/24.svg"
      />
    );
  }

  const automationDetail = automationDetailQuery.automationDetail;
  const automationNotes = automationNotesQuery.automationNotes || [];
  const constants = automationConstantsQuery.automationConstants || {};

  const updatedProps = {
    ...props,
    loading: automationDetailQuery.loading,
    automation: automationDetail,
    automationNotes,
    currentUser,
    save,
    saveLoading,
    constants,
  };

  return <AutomationForm {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, DetailQueryResponse, { _id: string }>(
      gql(queries.automationDetail),
      {
        name: 'automationDetailQuery',
        options: ({ id }) => ({
          variables: {
            _id: id,
          },
        }),
      },
    ),
    graphql<Props, AutomationsNoteQueryResponse, { automationId: string }>(
      gql(queries.automationNotes),
      {
        name: 'automationNotesQuery',
        options: ({ id }) => ({
          variables: {
            automationId: id,
          },
        }),
      },
    ),
    graphql<{}, EditMutationResponse, IAutomation>(
      gql(mutations.automationsEdit),
      {
        name: 'editAutomationMutation',
        options: () => ({
          refetchQueries: [
            'automations',
            'automationsMain',
            'automationDetail',
          ],
        }),
      },
    ),
    graphql<AutomationConstantsQueryResponse>(
      gql(queries.automationConstants),
      {
        name: 'automationConstantsQuery',
      },
    ),
  )(withRouter<FinalProps, any>(AutomationDetailsContainer)),
);
