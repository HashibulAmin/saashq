import * as compose from 'lodash.flowright';

import { Alert, __ } from '@saashq/ui/src/utils';
import {
  ChangeStateMutationResponse,
  ChangeStateMutationVariables,
  CustomersQueryResponse,
  EditMutationResponse,
  ICustomer,
  ICustomerDoc,
} from '../types';

import LeadState from '../components/LeadState';
import React from 'react';
import { confirm } from '@saashq/ui/src/utils';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { mutations } from '@saashq/ui-contacts/src/customers/graphql';

type Props = {
  customer: ICustomer;
};

type FinalProps = {
  customersQuery: CustomersQueryResponse;
} & Props &
  EditMutationResponse &
  ChangeStateMutationResponse;

class CustomerChooser extends React.Component<FinalProps> {
  render() {
    const { customersEdit, customer, customersChangeState } = this.props;

    const changeState = (value: string) => {
      confirm(
        __(
          'Jste si jisti, že chcete převést potenciálního zákazníka na zákazníka?',
        ),
      ).then(() =>
        customersChangeState({
          variables: {
            _id: customer._id,
            value,
          },
        })
          .then(() => {
            Alert.success('Úspěšně jste převedli na zákazníka');
          })
          .catch((e) => {
            Alert.error(e.message);
          }),
      );
    };

    const saveState = (state: string) => {
      customersEdit({
        variables: { _id: customer._id, leadStatus: state },
      })
        .then(() => {
          Alert.success('Úspěšně jste aktualizovali stav');
        })
        .catch((e) => {
          Alert.error(e.message);
        });
    };

    return (
      <LeadState
        customer={customer}
        saveState={saveState}
        changeCustomerState={changeState}
      />
    );
  }
}

export default compose(
  // mutations
  graphql<Props, EditMutationResponse, ICustomerDoc>(
    gql(mutations.customersEdit),
    {
      name: 'customersEdit',
      options: () => {
        return {
          refetchQueries: ['customersMain', 'customers'],
        };
      },
    },
  ),
  graphql<Props, ChangeStateMutationResponse, ChangeStateMutationVariables>(
    gql(mutations.customersChangeState),
    {
      name: 'customersChangeState',
      options: {
        refetchQueries: ['customersMain', 'customerCounts', 'customerDetail'],
      },
    },
  ),
)(CustomerChooser);
