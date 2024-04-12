import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import { Alert, withProps } from 'modules/common/utils';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import ChangePassword from '../components/ChangePassword';
import { ChangePasswordMutationResponse } from '../types';

type Props = {
  closeModal: () => void;
};

const ChangePasswordContainer = (
  props: Props & ChangePasswordMutationResponse,
) => {
  const { changePasswordMutation } = props;

  const save = ({ currentPassword, newPassword, confirmation }) => {
    if (newPassword !== confirmation) {
      return Alert.error('Heslo se neshodovalo');
    }

    if (!currentPassword || currentPassword === 0) {
      return Alert.error('Zadejte prosím aktuální heslo');
    }

    if (!newPassword || newPassword === 0) {
      return Alert.error('Zadejte prosím nové heslo');
    }

    changePasswordMutation({ variables: { currentPassword, newPassword } })
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

  return <ChangePassword {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql(
      gql`
        mutation usersChangePassword(
          $currentPassword: String!
          $newPassword: String!
        ) {
          usersChangePassword(
            currentPassword: $currentPassword
            newPassword: $newPassword
          ) {
            _id
          }
        }
      `,
      {
        name: 'changePasswordMutation',
      },
    ),
  )(ChangePasswordContainer),
);
