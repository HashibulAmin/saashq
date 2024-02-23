import ActivityInputs from '@saashq/ui-log/src/activityLogs/components/ActivityInputs';
import ActivityLogs from '@saashq/ui-log/src/activityLogs/containers/ActivityLogs';
import { IProduct } from '../../../types';
import { IUser } from '@saashq/ui/src/auth/types';
import LeftSidebar from './LeftSidebar';
import React from 'react';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { __ } from '@saashq/ui/src/utils';
import { isEnabled } from '@saashq/ui/src/utils/core';
import { ContentBox } from '@saashq/ui-settings/src/styles';

type Props = {
  product: IProduct;
  currentUser: IUser;
};

class CompanyDetails extends React.Component<Props> {
  render() {
    const { product } = this.props;

    const title = product.name || 'Unknown';

    const breadcrumb = [
      { title: __('Settings'), link: '/settings' },
      { title: __('Product & Service'), link: '/settings/product-service' },
      { title }
    ];

    const content = (
      <ContentBox>
        <ActivityInputs
          contentTypeId={product._id}
          contentType="products:product"
          showEmail={false}
        />
        {isEnabled('logs') && (
          <ActivityLogs
            target={product.name || ''}
            contentId={product._id}
            contentType="products:product"
            extraTabs={[]}
          />
        )}
      </ContentBox>
    );

    return (
      <Wrapper
        header={<Wrapper.Header title={title} breadcrumb={breadcrumb} />}
        leftSidebar={<LeftSidebar {...this.props} />}
        content={content}
        transparent={true}
        hasBorder={true}
      />
    );
  }
}

export default CompanyDetails;
