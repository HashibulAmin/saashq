import * as compose from 'lodash.flowright';

import { EditMutationResponse, ICustomer } from '../types';

import { FIELDS_GROUPS_CONTENT_TYPES } from '@saashq/ui-forms/src/settings/properties/constants';
import { FieldsGroupsQueryResponse } from '@saashq/ui-forms/src/settings/properties/types';
import GenerateCustomFields from '@saashq/ui-forms/src/settings/properties/components/GenerateCustomFields';
import React from 'react';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';
import Spinner from '@saashq/ui/src/components/Spinner';
import { queries as fieldQueries } from '@saashq/ui-forms/src/settings/properties/graphql';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { isEnabled } from '@saashq/ui/src/utils/core';
import { mutations } from '../graphql';
import { withProps } from '@saashq/ui/src/utils';

type Props = {
  customer: ICustomer;
  loading?: boolean;
  isDetail: boolean;
  collapseCallback?: () => void;
};

type FinalProps = {
  fieldsGroupsQuery: FieldsGroupsQueryResponse;
} & Props &
  EditMutationResponse;

const CustomFieldsSection = (props: FinalProps) => {
  const {
    customer,
    customersEdit,
    fieldsGroupsQuery,
    loading,
    isDetail,
    collapseCallback,
  } = props;

  if (fieldsGroupsQuery && fieldsGroupsQuery.loading) {
    return (
      <Sidebar full={true}>
        <Spinner />
      </Sidebar>
    );
  }

  const { _id } = customer;

  const save = (variables, callback) => {
    customersEdit({
      variables: { _id, ...variables },
    })
      .then(() => {
        callback();
      })
      .catch((e) => {
        callback(e);
      });
  };

  const updatedProps = {
    save,
    loading,
    customFieldsData: customer.customFieldsData,
    fieldsGroups: fieldsGroupsQuery ? fieldsGroupsQuery.fieldsGroups : [],
    isDetail,
    object: customer,
    collapseCallback,
  };

  return <GenerateCustomFields {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, FieldsGroupsQueryResponse, { contentType: string }>(
      gql(fieldQueries.fieldsGroups),
      {
        name: 'fieldsGroupsQuery',
        options: () => ({
          variables: {
            contentType: FIELDS_GROUPS_CONTENT_TYPES.CUSTOMER,
            isDefinedBySaasHQ: false,
          },
        }),
        skip: !isEnabled('forms') ? true : false,
      },
    ),

    // mutations
    graphql<Props, EditMutationResponse, ICustomer>(
      gql(mutations.customersEdit),
      {
        name: 'customersEdit',
        options: () => ({
          refetchQueries: ['customerDetail'],
        }),
      },
    ),
  )(CustomFieldsSection),
);
