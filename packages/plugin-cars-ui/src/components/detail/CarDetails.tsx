import * as path from 'path';

import EmptyState from '@saashq/ui/src/components/EmptyState';
import { ICar } from '../../types';
import { IUser } from '@saashq/ui/src/auth/types';
import LeftSidebar from './LeftSidebar';
import React from 'react';
import RightSidebar from './RightSidebar';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { __ } from 'coreui/utils';
import asyncComponent from '@saashq/ui/src/components/AsyncComponent';
import { isEnabled } from '@saashq/ui/src/utils/core';

const ActivityInputs = asyncComponent(
  () =>
    isEnabled('logs') &&
    import(
      /* webpackChunkName: "ActivityInputs" */ '@saashq/ui-log/src/activityLogs/components/ActivityInputs'
    )
);

const ActivityLogs = asyncComponent(
  () =>
    isEnabled('logs') &&
    import(
      /* webpackChunkName: "ActivityLogs" */ '@saashq/ui-log/src/activityLogs/containers/ActivityLogs'
    )
);

type Props = {
  car: ICar;
  currentUser: IUser;
};

class CarDetails extends React.Component<Props> {
  renderContent(content) {
    if (isEnabled('logs')) {
      return content;
    }

    return (
      <EmptyState
        image="/images/actions/5.svg"
        text={__('No results found')}
        size="full"
      />
    );
  }

  render() {
    const { car } = this.props;

    const title = car.plateNumber || 'Unknown';

    const breadcrumb = [{ title: __('Cars'), link: '/cars' }, { title }];

    const content = (
      <>
        <ActivityInputs
          contentTypeId={car._id}
          contentType="car"
          showEmail={false}
        />
        <ActivityLogs
          target={car.plateNumber || ''}
          contentId={car._id}
          contentType="car"
          extraTabs={[]}
        />
      </>
    );

    return (
      <Wrapper
        header={<Wrapper.Header title={title} breadcrumb={breadcrumb} />}
        leftSidebar={<LeftSidebar {...this.props} />}
        rightSidebar={<RightSidebar car={car} />}
        content={this.renderContent(content)}
        transparent={true}
      />
    );
  }
}

export default CarDetails;
