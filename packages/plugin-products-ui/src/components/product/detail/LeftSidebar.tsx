import { gql } from '@apollo/client';
import TaggerSection from '@saashq/ui-contacts/src/customers/components/common/TaggerSection';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';
import BasicInfo from '../../../containers/product/detail/BasicInfo';
import CustomFieldsSection from '../../../containers/product/detail/CustomFieldsSection';
import { IProduct } from '../../../types';
import React from 'react';
import { queries } from '../../../graphql';
import { isEnabled } from '@saashq/ui/src/utils/core';

type Props = {
  product: IProduct;
};

class LeftSidebar extends React.Component<Props> {
  render() {
    const { product } = this.props;

    const refetchQueries = [
      {
        query: gql(queries.productDetail),
        variables: { _id: product._id }
      }
    ];

    return (
      <Sidebar wide={true}>
        <BasicInfo product={product} refetchQueries={refetchQueries} />
        <CustomFieldsSection product={product} />
        {isEnabled('tags') && (
          <TaggerSection
            data={product}
            type="products:product"
            refetchQueries={refetchQueries}
          />
        )}
      </Sidebar>
    );
  }
}

export default LeftSidebar;
