import * as compose from 'lodash.flowright';

import { Alert, withProps } from '@saashq/ui/src/utils';
import {
  ClientPortalUserAssignCompanyMutationResponse,
  IClientPortalUser
} from '../../types';
import { mutations, queries } from '../../graphql';

import CompanyAssignForm from '../../components/detail/CompanyAssignForm';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import React from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';

type Props = {
  queryParams: any;
  clientPortalUser: IClientPortalUser;
  closeModal: () => void;
};

type FinalProps = {} & Props & ClientPortalUserAssignCompanyMutationResponse;

const FormContainer = (props: FinalProps) => {
  const { clientPortalUserAssignCompany, closeModal } = props;

  const assignCompany = (
    userId: string,
    saashqCompanyId: string,
    saashqCustomerId: string
  ) => {
    clientPortalUserAssignCompany({
      variables: { saashqCustomerId, saashqCompanyId, userId }
    })
      .then(() => {
        Alert.success('Successfully assigned company');
        closeModal();
      })
      .catch(err => Alert.error(err));
  };

  const updatedProps = {
    ...props
  };

  return <CompanyAssignForm {...updatedProps} assignCompany={assignCompany} />;
};

export default withProps<Props>(
  compose(
    graphql<Props>(gql(mutations.clientPortalUserAssignCompany), {
      name: 'clientPortalUserAssignCompany',
      options: ({ clientPortalUser }) => ({
        refetchQueries: [
          {
            query: gql(queries.clientPortalUserDetail),
            variables: { _id: clientPortalUser._id }
          }
        ]
      })
    })
  )(FormContainer)
);
