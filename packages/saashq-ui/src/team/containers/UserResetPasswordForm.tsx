import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import { IUser } from '@saashq/ui/src/auth/types';
import { Alert, withProps } from '@saashq/ui/src/utils';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import UserResetPasswordForm from '../components/UserResetPasswordForm';
import { mutations } from '../graphql';
import { ResetMemberPasswordResponse } from '../types';

type Props = {
  object: IUser;
  closeModal: () => void;
};

const UserResetPasswordContainer = (
  props: Props & ResetMemberPasswordResponse,
) => {
  const { usersResetMemberPassword } = props;

  const save = ({ _id, newPassword, repeatPassword }) => {
    if ((newPassword && !repeatPassword) || repeatPassword === 0) {
      return Alert.error('Please enter a repeat password');
    }

    if (!newPassword || newPassword === 0) {
      return Alert.error('Zadejte prosím nové heslo');
    }

    if (newPassword !== repeatPassword) {
      return Alert.error('Heslo se neshodovalo');
    }

    usersResetMemberPassword({ variables: { _id, newPassword } })
      .then(() => {
        Alert.success('Vaše heslo bylo změněno a aktualizováno');
        props.closeModal();
      })
      .catch((error) => {
        Alert.error(error.message);
      });
  };

  const updatedProps = {
    ...props,
    save,
  };

  return <UserResetPasswordForm {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql(gql(mutations.usersResetMemberPassword), {
      name: 'usersResetMemberPassword',
      options: {
        refetchQueries: ['users'],
      },
    }),
  )(UserResetPasswordContainer),
);
