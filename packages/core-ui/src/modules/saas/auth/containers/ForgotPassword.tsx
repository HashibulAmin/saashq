import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import { Alert, withProps } from 'modules/common/utils';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import ForgotPassword from '../components/ForgotPassword';
import { mutations } from '../graphql';
import {
  ForgotPasswordMutationResponse,
  ForgotPasswordMutationVariables,
} from '../types';
import withCurrentOrganization from '@saashq/ui-settings/src/general/saas/containers/withCurrentOrganization';

type Props = {
  currentOrganization: any;
};

type FinalProps = Props & ForgotPasswordMutationResponse;

const ForgotPasswordContainer = (props: FinalProps) => {
  const { forgotPasswordMutation } = props;

  const forgotPassword = (variables) => {
    forgotPasswordMutation({ variables })
      .then(() => {
        Alert.success('Další pokyny byly zaslány na vaši e-mailovou adresu.');
      })
      .catch((error) => {
        Alert.error(error.message);
      });
  };

  const updatedProps = {
    ...props,
    forgotPassword,
  };

  return <ForgotPassword {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<
      Props,
      ForgotPasswordMutationResponse,
      ForgotPasswordMutationVariables
    >(gql(mutations.forgotPassword), {
      name: 'forgotPasswordMutation',
    }),
  )(withCurrentOrganization(ForgotPasswordContainer)),
);
