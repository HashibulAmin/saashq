import {
  FieldStyle,
  SidebarCounter,
  SidebarList
} from '@saashq/ui/src/layout/styles';
import { __, isValidDate } from '@saashq/ui/src/utils';

import Box from '@saashq/ui/src/components/Box';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import { ICompany } from '@saashq/ui-contacts/src/companies/types';
import { ICustomer } from '@saashq/ui-contacts/src/customers/types';
import Label from '@saashq/ui/src/components/Label';
import React from 'react';
import dayjs from 'dayjs';

type Props = {
  customer?: ICustomer;
  company?: ICompany;
  queryParams?: any;
  collapseCallback?: () => void;
};

class TrackedDataSection extends React.Component<Props> {
  renderCustomValue = (value: string) => {
    if (isValidDate(value)) {
      return dayjs(value).format('lll');
    }

    return value;
  };

  renderTrackedData(trackedData: any[]) {
    return (
      <>
        {trackedData.map((data, index) => (
          <li key={index}>
            <FieldStyle>{data.field}</FieldStyle>
            <SidebarCounter>
              {this.renderCustomValue(data.value)}
            </SidebarCounter>
          </li>
        ))}
      </>
    );
  }

  renderContent() {
    const { customer, company } = this.props;

    if (company) {
      return (
        <SidebarList className="no-link">
          {this.renderTrackedData(company.trackedData || [])}
        </SidebarList>
      );
    }

    if (!customer) {
      return null;
    }

    const { isOnline, sessionCount, lastSeenAt } = customer;

    const trackedData = customer.trackedData || [];

    if (!trackedData) {
      return <EmptyState icon="chat" text="Empty" size="small" />;
    }

    return (
      <SidebarList className="no-link">
        <li>
          <FieldStyle>{__('Status')}</FieldStyle>
          <SidebarCounter>
            {isOnline ? (
              <Label lblStyle="success">Online</Label>
            ) : (
              <Label lblStyle="simple">Offline</Label>
            )}
          </SidebarCounter>
        </li>
        <li>
          <FieldStyle>{__('Last online')}</FieldStyle>
          <SidebarCounter>{dayjs(lastSeenAt).format('lll')}</SidebarCounter>
        </li>
        <li>
          <FieldStyle>{__('Session count')}</FieldStyle>
          <SidebarCounter>{sessionCount}</SidebarCounter>
        </li>
        {this.renderTrackedData(trackedData)}
      </SidebarList>
    );
  }

  render() {
    const { collapseCallback } = this.props;

    return (
      <Box
        title={__('Tracked data')}
        name="showTrackedData"
        callback={collapseCallback}
      >
        {this.renderContent()}
      </Box>
    );
  }
}

export default TrackedDataSection;
