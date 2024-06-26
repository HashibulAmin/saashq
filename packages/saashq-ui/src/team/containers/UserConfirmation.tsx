import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import { IUser } from '@saashq/ui/src/auth/types';
import { Alert, withProps } from '@saashq/ui/src/utils';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@saashq/ui/src/types';
import UserConfirmation from '../components/UserConfirmation';
import { mutations } from '../graphql';
import { ConfirmMutationResponse, ConfirmMutationVariables } from '../types';

type Props = {
  queryParams: any;
  currentUser?: IUser;
};

type FinalProps = Props & IRouterProps & ConfirmMutationResponse;

class UserConfirmationContainer extends React.Component<FinalProps> {
  render() {
    const { usersConfirmInvitation, queryParams, history, currentUser } =
      this.props;

    const confirmUser = ({
      password,
      passwordConfirmation,
      username,
      fullName,
    }: {
      password: string;
      passwordConfirmation: string;
      username: string;
      fullName: string;
    }) => {
      usersConfirmInvitation({
        variables: {
          token: queryParams.token,
          password,
          passwordConfirmation,
          username,
          fullName,
        },
      })
        .then(() => {
          Alert.success('Úspěšně jste ověřili');
          history.push('/');
        })
        .catch((e) => {
          Alert.error(e.message);
        });
    };

    const updatedProps = {
      confirmUser,
      currentUser,
    };

    return <UserConfirmation {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, ConfirmMutationResponse, ConfirmMutationVariables>(
      gql(mutations.usersConfirmInvitation),
      {
        name: 'usersConfirmInvitation',
        options: {
          refetchQueries: ['users'],
        },
      },
    ),
  )(withRouter<FinalProps>(UserConfirmationContainer)),
);
