import { BasicInfo, TabContent } from './styles';
import { TabTitle, Tabs } from '@saashq/ui/src/components/tabs';
import { isEnabled, loadDynamicComponent } from '@saashq/ui/src/utils/core';

import Box from '@saashq/ui/src/components/Box';
import CompanySection from '@saashq/ui-contacts/src/companies/components/CompanySection';
import { IConversation } from '@saashq/ui-inbox/src/inbox/types';
import { ICustomer } from '@saashq/ui-contacts/src/customers/types';
import { IField } from '@saashq/ui/src/types';
import { IFieldsVisibility } from '@saashq/ui-contacts/src/customers/types';
import { IUser } from '@saashq/ui/src/auth/types';
import React from 'react';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';
import WebsiteActivity from '@saashq/ui-contacts/src/customers/components/common/WebsiteActivity';
import { __ } from 'coreui/utils';
import asyncComponent from '@saashq/ui/src/components/AsyncComponent';

const ActionSection = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-ActionSection" */ '@saashq/ui-contacts/src/customers/containers/ActionSection'
    ),
);

const CustomFieldsSection = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-CustomFieldsSection" */ '@saashq/ui-contacts/src/customers/containers/CustomFieldsSection'
    ),
  { height: '200px', width: '100%', color: '#fff' },
);

const ConversationCustomFieldsSection = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-ConversationCustomFieldsSection" */ '../../../containers/conversationDetail/ConversationCustomFieldsSection'
    ),
  { height: '200px', width: '100%', color: '#fff' },
);

const PortableDeals = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-PortableDeals" */ '@saashq/ui-cards/src/deals/components/PortableDeals'
    ),
);

const PortableTasks = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-PortableTasks" */ '@saashq/ui-cards/src/tasks/components/PortableTasks'
    ),
);

const PortableTickets = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-PortableTickets" */ '@saashq/ui-cards/src/tickets/components/PortableTickets'
    ),
);
const PortablePurchases = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-PortablePurchases" */ '@saashq/ui-cards/src/purchases/components/PortablePurchases'
    ),
);

const Contacts = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-Contacts" */ '@saashq/ui-contacts/src/companies/components/detail/Contacts'
    ),
);

const DetailInfo = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-InfoSection" */ '@saashq/ui-contacts/src/customers/components/common/DetailInfo'
    ),
  { isBox: true },
);

const InfoSection = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-InfoSection" */ '@saashq/ui-contacts/src/customers/components/common/InfoSection'
    ),
  { withImage: true },
);

const DevicePropertiesSection = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-DevicePropertiesSection" */ '@saashq/ui-contacts/src/customers/components/common/DevicePropertiesSection'
    ),
);

const TrackedDataSection = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-TrackedDataSection" */ '@saashq/ui-contacts/src/customers/components/common/TrackedDataSection'
    ),
);

const TaggerSection = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-TaggerSection" */ '@saashq/ui-contacts/src/customers/components/common/TaggerSection'
    ),
  { height: '200px', width: '100%', color: '#fff' },
);

const SidebarActivity = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-SidebarActivity" */ '../../../containers/conversationDetail/SidebarActivity'
    ),
);

const ConversationDetails = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar-ConversationDetails" */ './ConversationDetails'
    ),
  { isBox: true },
);

type IndexProps = {
  currentUser: IUser;
  conversation: IConversation;
  customer: ICustomer;
  customerVisibility: (key: string) => IFieldsVisibility;
  deviceVisibility: (key: string) => IFieldsVisibility;
  conversationFields: IField[];
  deviceFields: IField[];
  customerFields: IField[];
  loading: boolean;
  toggleSection: () => void;
  taggerRefetchQueries: any;
  merge?: (doc: { ids: string[]; data: ICustomer }) => void;
};

type IndexState = {
  currentTab: string;
  currentSubTab: string;
};

interface IRenderData {
  customer: ICustomer;
  fields?: IField[];
  kind: string;
  toggleSection: () => void;
}

class Index extends React.Component<IndexProps, IndexState> {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'customer',
      currentSubTab: 'details',
    };
  }

  onTabClick = (currentTab) => {
    this.setState({ currentTab });
  };

  onSubtabClick = (currentSubTab) => {
    this.setState({ currentSubTab });
  };

  renderTrackedData = ({ customer, kind, toggleSection }: IRenderData) => {
    return (
      <TrackedDataSection
        customer={customer}
        collapseCallback={toggleSection}
      />
    );
  };

  renderDeviceProperties = ({
    customer,
    kind,
    fields,
    toggleSection,
  }: IRenderData) => {
    if (!(kind === 'messenger' || kind === 'form')) {
      return null;
    }

    return (
      <DevicePropertiesSection
        customer={customer}
        fields={fields}
        collapseCallback={toggleSection}
        isDetail={false}
        deviceFieldsVisibility={this.props.deviceVisibility}
      />
    );
  };

  renderTabSubContent() {
    const { currentSubTab } = this.state;

    const {
      currentUser,
      taggerRefetchQueries,
      conversation,
      customer,
      toggleSection,
      loading,
      customerVisibility,
      deviceFields,
      conversationFields,
      customerFields,
    } = this.props;

    const { kind = '' } = customer.integration || {};

    if (currentSubTab === 'details') {
      return (
        <TabContent>
          <DetailInfo
            customer={customer}
            fieldsVisibility={customerVisibility}
            fields={customerFields}
            isDetail={false}
          />
          <CustomFieldsSection
            loading={loading}
            customer={customer}
            isDetail={false}
            collapseCallback={toggleSection}
          />
          <Box
            title={__('Conversation details')}
            name="showConversationDetails"
            callback={toggleSection}
          >
            <ConversationDetails
              conversation={conversation}
              fields={conversationFields}
            />
            <ConversationCustomFieldsSection conversation={conversation} />
          </Box>
          {isEnabled('tags') && (
            <TaggerSection
              data={customer}
              type="contacts:customer"
              refetchQueries={taggerRefetchQueries}
              collapseCallback={toggleSection}
            />
          )}

          {this.renderTrackedData({ customer, kind, toggleSection })}
          {this.renderDeviceProperties({
            customer,
            kind,
            fields: deviceFields,
            toggleSection,
          })}
          <WebsiteActivity urlVisits={customer.urlVisits || []} />

          {loadDynamicComponent('conversationDetailSidebar', {
            conversation,
            customer,
            customerId: customer._id,
            contentType: 'inbox:conversations',
            contentTypeId: conversation._id,
          })}
        </TabContent>
      );
    }

    if (currentSubTab === 'activity') {
      return (
        <SidebarActivity
          currentUser={currentUser}
          customer={customer}
          currentSubTab={currentSubTab}
        />
      );
    }

    return (
      <>
        <PortableDeals mainType="customer" mainTypeId={customer._id} />
        <PortableTickets mainType="customer" mainTypeId={customer._id} />
        <PortableTasks mainType="customer" mainTypeId={customer._id} />
        <PortablePurchases mainType="customer" mainTypeId={customer._id} />
      </>
    );
  }

  renderTabContent() {
    const { currentTab, currentSubTab } = this.state;
    const { customer, toggleSection } = this.props;

    if (currentTab === 'customer') {
      const detailsOnClick = () => this.onSubtabClick('details');
      const activityOnClick = () => this.onSubtabClick('activity');
      const relatedOnClick = () => this.onSubtabClick('related');

      return (
        <>
          <BasicInfo>
            <InfoSection customer={customer} hideForm={true} />
          </BasicInfo>
          <ActionSection customer={customer} />
          <Tabs full={true}>
            <TabTitle
              className={currentSubTab === 'details' ? 'active' : ''}
              onClick={detailsOnClick}
            >
              {__('Details')}
            </TabTitle>
            {isEnabled('logs') && (
              <TabTitle
                className={currentSubTab === 'activity' ? 'active' : ''}
                onClick={activityOnClick}
              >
                {__('Activity')}
              </TabTitle>
            )}
            {isEnabled('cards') && (
              <TabTitle
                className={currentSubTab === 'related' ? 'active' : ''}
                onClick={relatedOnClick}
              >
                {__('Related')}
              </TabTitle>
            )}
          </Tabs>
          {this.renderTabSubContent()}
        </>
      );
    }

    return (
      <>
        <CompanySection
          mainType="customer"
          mainTypeId={customer._id}
          collapseCallback={toggleSection}
        />
        <Contacts companies={customer.companies} customerId={customer._id} />
      </>
    );
  }

  render() {
    const { currentTab } = this.state;
    const customerOnClick = () => this.onTabClick('customer');
    const companyOnClick = () => this.onTabClick('company');

    return (
      <Sidebar full={true}>
        <Tabs full={true}>
          <TabTitle
            className={currentTab === 'customer' ? 'active' : ''}
            onClick={customerOnClick}
          >
            {__('Zákazník')}
          </TabTitle>
          <TabTitle
            className={currentTab === 'company' ? 'active' : ''}
            onClick={companyOnClick}
          >
            {__('Společnost')}
          </TabTitle>
        </Tabs>
        {this.renderTabContent()}
      </Sidebar>
    );
  }
}

export default Index;
