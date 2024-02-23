import { FIELDS_GROUPS_CONTENT_TYPES } from '@saashq/ui-forms/src/settings/properties/constants';
import { FieldsGroupsQueryResponse } from '@saashq/ui-forms/src/settings/properties/types';
import { queries as fieldQueries } from '@saashq/ui-forms/src/settings/properties/graphql';
import { isEnabled } from '@saashq/ui/src/utils/core';

import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import { withProps } from '@saashq/ui/src/utils';
import CategoryMask from '../components/CategoryMask';
import { IProductCategory } from '../types';

type Props = {
  parentCategory?: IProductCategory;
  categoryId?: string;
  code: string;
  maskType: string;
  mask: any;
  changeCode: (code: string) => void;
  changeMask: (mask: any) => void;
};

type FinalProps = {
  fieldsGroupsQuery: FieldsGroupsQueryResponse;
} & Props;

class CategoryMaskContainer extends React.Component<FinalProps> {
  render() {
    const { fieldsGroupsQuery } = this.props;

    if (fieldsGroupsQuery.loading) {
      return null;
    }

    const fieldGroups = fieldsGroupsQuery.fieldsGroups || [];

    const updatedProps = {
      ...this.props,
      fieldGroups
    };

    return <CategoryMask {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, FieldsGroupsQueryResponse, { contentType: string }>(
      gql(fieldQueries.fieldsGroups),
      {
        name: 'fieldsGroupsQuery',
        options: ({ parentCategory, categoryId }) => ({
          variables: {
            contentType: FIELDS_GROUPS_CONTENT_TYPES.PRODUCT,
            isDefinedBySaasHQ: false,
            config: {
              categoryId: parentCategory?._id || categoryId,
              isChosen: true
            }
          }
        }),
        skip: !isEnabled('forms')
      }
    )
  )(CategoryMaskContainer)
);
