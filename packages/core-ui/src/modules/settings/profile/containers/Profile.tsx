import { AppConsumer } from 'appContext';
import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import { Alert, withProps, confirm } from 'modules/common/utils';
import UserDetailForm from '@saashq/ui/src/team/containers/UserDetailForm';
import { mutations, queries } from '@saashq/ui/src/team/graphql';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import { IUser, IUserDoc } from '../../../auth/types';
import EditProfileForm from '../components/EditProfileForm';
import { EditProfileMutationResponse } from '../types';

type Props = {
  queryParams: any;
};

const Profile = (
  props: Props & EditProfileMutationResponse & { currentUser: IUser },
) => {
  const { currentUser, usersEditProfile, queryParams } = props;

  const save = (variables: IUserDoc, callback: () => void) => {
    confirm('Toto se trvale aktualizuje, jste si naprosto jisti?', {
      hasUpdateConfirm: true,
    }).then(() => {
      usersEditProfile({ variables })
        .then(() => {
          Alert.success(`Úspěšně jste aktualizovali tento profil`);
          callback();
        })
        .catch((error) => {
          Alert.error(error.message);
        });
    });
  };

  const editForm = ({ user, closeModal }) => (
    <EditProfileForm currentUser={user} save={save} closeModal={closeModal} />
  );

  return (
    <UserDetailForm
      _id={currentUser._id}
      queryParams={queryParams}
      renderEditForm={editForm}
    />
  );
};

const WithQuery = withProps<Props & { currentUser: IUser }>(
  compose(
    graphql(gql(mutations.usersEditProfile), {
      name: 'usersEditProfile',
      options: ({ currentUser }: { currentUser: IUser }) => ({
        refetchQueries: [
          {
            query: gql(queries.userDetail),
            variables: {
              _id: currentUser._id,
            },
          },
        ],
      }),
    }),
  )(Profile),
);

const WithConsumer = (props: Props) => {
  return (
    <AppConsumer>
      {({ currentUser }) => (
        <WithQuery {...props} currentUser={currentUser || ({} as IUser)} />
      )}
    </AppConsumer>
  );
};

export default WithConsumer;
