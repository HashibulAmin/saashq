import Box from '@saashq/ui/src/components/Box';
import { IContract, IContractGql } from '../../types';
import { List } from '../../styles';
import React from 'react';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';
import { __ } from 'coreui/utils';
import asyncComponent from '@saashq/ui/src/components/AsyncComponent';
import dayjs from 'dayjs';
import { isEnabled } from '@saashq/ui/src/utils/core';
import DealSection from './DealSection';
import ContractsCustomFields from '../list/ContractsCustomFields';

const CompanySection = asyncComponent(
  () =>
    isEnabled('contacts') &&
    import(
      /* webpackChunkName: "CompanySection" */ '@saashq/ui-contacts/src/companies/components/CompanySection'
    ),
);

const CustomerSection = asyncComponent(
  () =>
    isEnabled('contacts') &&
    import(
      /* webpackChunkName: "CustomerSection" */ '@saashq/ui-contacts/src/customers/components/CustomerSection'
    ),
);

type Props = {
  contract: IContract | any;
};

export default class RightSidebar extends React.Component<Props> {
  renderPlan(contract) {
    if (!contract.plan) {
      return null;
    }

    return (
      <li>
        <div>{__('Plan')}: </div>
        <span>{contract.plan}</span>
      </li>
    );
  }

  render() {
    const { contract } = this.props;

    return (
      <Sidebar>
        {isEnabled('contacts') && (
          <>
            {contract.customerType === 'customer' && contract.customers && (
              <CustomerSection
                customers={[contract.customers]}
                title={__('Loan Primary Customers')}
                name={'Contract'}
              />
            )}
            {contract.customerType === 'company' && contract.companies && (
              <CompanySection
                companies={[contract.companies]}
                title={__('Loan Primary Companies')}
                name={'Contract'}
              />
            )}
            <CustomerSection
              mainType="contractSub"
              mainTypeId={contract._id}
              title={__('Loan Collectively Customers')}
              name={'Contract'}
            />

            <DealSection contract={contract} />
          </>
        )}
        {isEnabled('forms') && (
          <ContractsCustomFields
            contract={contract}
            collapseCallback={console.log}
            isDetail
          />
        )}

        <Box title={__('Other')} name="showOthers">
          <List>
            <li>
              <div>{__('Vytvořeno v')}: </div>{' '}
              <span>{dayjs(contract.createdAt).format('lll')}</span>
            </li>
            {this.renderPlan(contract)}
          </List>
        </Box>
      </Sidebar>
    );
  }
}
