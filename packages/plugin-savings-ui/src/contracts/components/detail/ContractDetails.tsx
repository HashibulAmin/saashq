import ActivityItem from './ActivityItem';
import { IContractDoc } from '../../types';
import { IProduct } from '@saashq/ui-products/src/types';
import { IUser } from '@saashq/ui/src/auth/types';
import LeftSidebar from './LeftSidebar';
import React from 'react';
import RightSidebar from './RightSidebar';
import ScheduleSection from '../schedules/ScheduleSection';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { __ } from 'coreui/utils';
import asyncComponent from '@saashq/ui/src/components/AsyncComponent';
import { isEnabled } from '@saashq/ui/src/utils/core';
import PolarisData from '../polaris';

const ActivityInputs = asyncComponent(
  () =>
    isEnabled('logs') &&
    import(
      /* webpackChunkName: "ActivityInputs" */ '@saashq/ui-log/src/activityLogs/components/ActivityInputs'
    ),
);

const ActivityLogs = asyncComponent(
  () =>
    isEnabled('logs') &&
    import(
      /* webpackChunkName: "ActivityLogs" */ '@saashq/ui-log/src/activityLogs/containers/ActivityLogs'
    ),
);

type Props = {
  contract: IContractDoc;
  currentUser: IUser;
  saveItem: (doc: IContractDoc, callback?: (item) => void) => void;
  regenSchedules: (contractId: string) => void;
  fixSchedules: (contractId: string) => void;
  loading: boolean;
};

type State = {
  amount: any;
  collaterals: IProduct[];
  collateralsData: any;
};

class ContractDetails extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const contract = props.contract;

    this.state = {
      amount: contract.amount || {},
      collateralsData: contract.collaterals
        ? contract.collaterals.map((p) => ({ ...p }))
        : [],
      // collecting data for ItemCounter component
      collaterals: contract.collaterals
        ? contract.collaterals.map((p) => p.collateral)
        : [],
    };
  }

  onChangeField = <T extends keyof State>(name: T, value: State[T]) => {
    this.setState({ [name]: value } as Pick<State, keyof State>);
  };

  render() {
    const { contract } = this.props;

    const title = contract.number || 'Unknown';

    const breadcrumb = [
      { title: __('Contracts'), link: '/saashq-plugin-saving/contract-list' },
      { title },
    ];

    const content = (
      <>
        <ScheduleSection
          contractId={contract._id}
          isFirst={false}
        ></ScheduleSection>

        <ActivityInputs
          contentTypeId={contract._id}
          contentType="savingContract"
          showEmail={false}
        />

        <ActivityLogs
          target={contract.number || ''}
          contentId={contract._id}
          contentType="savingContract"
          extraTabs={[
            { name: 'savings:interestStore', label: 'Interest store' },
          ]}
          activityRenderItem={ActivityItem}
        />
        {isEnabled('syncpolaris') && <PolarisData contract={contract} />}
      </>
    );

    return (
      <Wrapper
        header={<Wrapper.Header title={title} breadcrumb={breadcrumb} />}
        leftSidebar={<LeftSidebar {...this.props} />}
        rightSidebar={<RightSidebar contract={contract} />}
        content={content}
        transparent={true}
      />
    );
  }
}

export default ContractDetails;
