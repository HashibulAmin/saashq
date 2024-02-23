import * as compose from 'lodash.flowright';

import { EditMutationResponse, ICompany } from '../../types';

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
import { mutations } from '../../graphql';
import { withProps } from '@saashq/ui/src/utils';

type Props = {
  company: ICompany;
  loading?: boolean;
};

type FinalProps = {
  fieldsGroupsQuery: FieldsGroupsQueryResponse;
} & Props &
  EditMutationResponse;

const CustomFieldsSection = (props: FinalProps) => {
  const { loading, company, companiesEdit, fieldsGroupsQuery } = props;

  if (fieldsGroupsQuery && fieldsGroupsQuery.loading) {
    return (
      <Sidebar full={true}>
        <Spinner />
      </Sidebar>
    );
  }

  const { _id } = company;

  const save = (data, callback) => {
    companiesEdit({
      variables: { _id, ...data },
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
    isDetail: false,
    object: company,
    customFieldsData: company.customFieldsData,
    fieldsGroups: fieldsGroupsQuery ? fieldsGroupsQuery.fieldsGroups : [],
    doc: company,
  };

  return <GenerateCustomFields {...updatedProps} />;
};

const options = () => ({
  refetchQueries: ['companDetail'],
});

export default withProps<Props>(
  compose(
    graphql<Props, FieldsGroupsQueryResponse, { contentType: string }>(
      gql(fieldQueries.fieldsGroups),
      {
        name: 'fieldsGroupsQuery',
        options: () => ({
          variables: {
            contentType: FIELDS_GROUPS_CONTENT_TYPES.COMPANY,
            isDefinedBySaasHQ: false,
          },
        }),
        skip: !isEnabled('forms') ? true : false,
      },
    ),
    graphql<Props, EditMutationResponse, ICompany>(
      gql(mutations.companiesEdit),
      {
        name: 'companiesEdit',
        options,
      },
    ),
  )(CustomFieldsSection),
);
