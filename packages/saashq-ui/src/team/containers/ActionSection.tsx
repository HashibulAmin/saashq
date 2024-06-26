import client from '@saashq/ui/src/apolloClient';
import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import { Alert, withProps } from '@saashq/ui/src/utils';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@saashq/ui/src/types';
import ActionSection from '../components/detail/ActionSection';
import { IUser } from '@saashq/ui/src/auth/types';
import { mutations, queries } from '../graphql';

type Props = {
  user: IUser;
  isSmall?: boolean;
  renderEditForm: ({
    closeModal,
    user,
  }: {
    closeModal: () => void;
    user: IUser;
  }) => React.ReactNode;
};

type FinalProps = Props & { statusChangedMutation: any } & IRouterProps;

const ActionSectionContainer = (props: FinalProps) => {
  const { user, renderEditForm, isSmall } = props;

  const changeStatus = (id: string): void => {
    const { statusChangedMutation } = props;

    statusChangedMutation({
      variables: { _id: id },
    })
      .then(() => {
        Alert.success('Gratulujeme, úspěšně aktualizováno.');
      })
      .catch((error: Error) => {
        Alert.error(error.message);
      });
  };

  const resendInvitation = (email: string) => {
    client
      .mutate({
        mutation: gql(mutations.usersResendInvitation),
        variables: { email },
      })
      .then(() => {
        Alert.success('Úspěšně znovu odeslat pozvánku');
      })
      .catch((e) => {
        Alert.error(e.message);
      });
  };

  const updatedProps = {
    user,
    isSmall,
    renderEditForm,
    changeStatus,
    resendInvitation,
  };

  return <ActionSection {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<{ queryParams: any }>(gql(mutations.usersSetActiveStatus), {
      name: 'statusChangedMutation',
      options: ({ queryParams }) => ({
        refetchQueries: [
          {
            query: gql(queries.users),
          },
        ],
      }),
    }),
  )(withRouter<FinalProps>(ActionSectionContainer)),
);
