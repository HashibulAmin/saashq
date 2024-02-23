import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Spinner from '@saashq/ui/src/components/Spinner';
import { withProps } from '@saashq/ui/src/utils';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import CustomerDetails from '../components/detail/CustomerDetails';
import { queries } from '@saashq/ui-contacts/src/customers/graphql';
import { CustomerDetailQueryResponse } from '@saashq/ui-contacts/src/customers/types';
import {
  PropertyConsumer,
  PropertyProvider
} from '@saashq/ui-contacts/src/customers/propertyContext';

type Props = {
  id: string;
};

type FinalProps = {
  customerDetailQuery: CustomerDetailQueryResponse;
} & Props;

function CustomerDetailsContainer(props: FinalProps) {
  const { id, customerDetailQuery } = props;

  if (customerDetailQuery.loading) {
    return <Spinner objective={true} />;
  }

  if (!customerDetailQuery.customerDetail) {
    return (
      <EmptyState text="Customer not found" image="/images/actions/17.svg" />
    );
  }

  const taggerRefetchQueries = [
    {
      query: gql(queries.customerDetail),
      variables: { _id: id }
    }
  ];

  const updatedProps = {
    ...props,
    customer: customerDetailQuery.customerDetail || ({} as any),
    taggerRefetchQueries
  };

  return (
    <PropertyProvider>
      <PropertyConsumer>
        {({
          deviceFields,
          customerVisibility,
          deviceVisibility,
          customerFields
        }) => {
          return (
            <CustomerDetails
              {...updatedProps}
              deviceFields={deviceFields}
              fields={customerFields}
              fieldsVisibility={customerVisibility}
              deviceFieldsVisibility={deviceVisibility}
            />
          );
        }}
      </PropertyConsumer>
    </PropertyProvider>
  );
}

export default withProps<Props>(
  compose(
    graphql<Props, CustomerDetailQueryResponse, { _id: string }>(
      gql(queries.customerDetail),
      {
        name: 'customerDetailQuery',
        options: ({ id }) => ({
          variables: {
            _id: id
          }
        })
      }
    )
  )(CustomerDetailsContainer)
);
