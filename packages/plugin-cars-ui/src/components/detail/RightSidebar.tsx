import * as path from 'path';

import Box from '@saashq/ui/src/components/Box';
import { ICar } from '../../types';
import { List } from '../../styles';
import React from 'react';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';
import { __ } from 'coreui/utils';
import asyncComponent from '@saashq/ui/src/components/AsyncComponent';
import dayjs from 'dayjs';
import { isEnabled } from '@saashq/ui/src/utils/core';

const CompanySection = asyncComponent(
  () =>
    isEnabled('contacts') &&
    import(
      /* webpackChunkName: "CompanySection" */ '@saashq/ui-contacts/src/companies/components/CompanySection'
    )
);

const CustomerSection = asyncComponent(
  () =>
    isEnabled('contacts') &&
    import(
      /* webpackChunkName: "CustomerSection" */ '@saashq/ui-contacts/src/customers/components/CustomerSection'
    )
);

type Props = {
  car: ICar;
};

export default class RightSidebar extends React.Component<Props> {
  renderPlan(car) {
    if (!car.plan) {
      return null;
    }

    return (
      <li>
        <div>{__('Plan')}: </div>
        <span>{car.plan}</span>
      </li>
    );
  }

  render() {
    const { car } = this.props;

    return (
      <Sidebar>
        {isEnabled('contacts') && (
          <>
            <CustomerSection mainType="car" mainTypeId={car._id} />
            <CompanySection mainType="car" mainTypeId={car._id} />
          </>
        )}

        <Box title={__('Other')} name="showOthers">
          <List>
            <li>
              <div>{__('Created at')}: </div>{' '}
              <span>{dayjs(car.createdAt).format('lll')}</span>
            </li>
            <li>
              <div>{__('Modified at')}: </div>{' '}
              <span>{dayjs(car.modifiedAt).format('lll')}</span>
            </li>
            {this.renderPlan(car)}
          </List>
        </Box>
      </Sidebar>
    );
  }
}
