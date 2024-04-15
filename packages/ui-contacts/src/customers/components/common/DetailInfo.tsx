import {
  FieldStyle,
  SidebarCounter,
  SidebarFlexRow,
  SidebarList,
} from '@saashq/ui/src/layout/styles';

import { GENDER_TYPES } from '@saashq/ui-contacts/src/customers/constants';
import { ICustomer } from '@saashq/ui-contacts/src/customers/types';
import { IField } from '@saashq/ui/src/types';
import { IFieldsVisibility } from '../../types';
import PrimaryEmail from './PrimaryEmail';
import PrimaryPhone from './PrimaryPhone';
import React from 'react';
import { __ } from '@saashq/ui/src/utils';
import dayjs from 'dayjs';

type Props = {
  customer: ICustomer;
  hasPosition?: boolean;
  fieldsVisibility: (key: string) => IFieldsVisibility;
  isDetail: boolean;
  fields: IField[];
};

class DetailInfo extends React.PureComponent<Props> {
  renderRow(field, value, type?) {
    const { fieldsVisibility, isDetail } = this.props;

    const isVisibleKey = isDetail ? 'isVisibleInDetail' : 'isVisible';

    const visibility = fieldsVisibility(isVisibleKey);

    if (!visibility[field]) {
      return null;
    }

    const label = visibility[field];

    if (type === 'description') {
      return (
        <SidebarFlexRow>
          {__(`Popis`)}:<span>{value || '-'}</span>
        </SidebarFlexRow>
      );
    }

    return (
      <li>
        <FieldStyle>{__(`${label}`)}:</FieldStyle>
        <SidebarCounter fullLength={label === 'Description'}>
          {value || '-'}
        </SidebarCounter>
      </li>
    );
  }

  renderEmail(status?: string, email?: string) {
    return (
      <li>
        <FieldStyle>{__('Primární Email')}:</FieldStyle>
        <SidebarCounter>
          <PrimaryEmail
            email={email}
            status={status}
            customerId={this.props.customer._id}
          />
        </SidebarCounter>
      </li>
    );
  }

  renderPhone(status?: string, phone?: string) {
    return (
      <li>
        <FieldStyle>{__('Hlavní telefon')}:</FieldStyle>
        <SidebarCounter>
          <PrimaryPhone phone={phone} status={status} />
        </SidebarCounter>
      </li>
    );
  }

  renderPosition(customer) {
    if (!this.props.hasPosition) {
      return null;
    }

    return this.renderRow('position', customer.position);
  }

  render() {
    const { customer, fields } = this.props;

    if (!fields || !fields.length) {
      return null;
    }

    return (
      <SidebarList className="no-link">
        {this.renderRow('kód', customer.code)}
        {this.renderEmail(
          customer.emailValidationStatus,
          customer.primaryEmail,
        )}
        {this.renderPhone(
          customer.phoneValidationStatus,
          customer.primaryPhone,
        )}
        {this.renderPosition(customer)}
        {this.renderRow(
          'majitel',
          customer.owner && customer.owner.details
            ? customer.owner.details.fullName
            : '',
        )}
        {this.renderRow('oddělení', customer.department)}
        {this.renderRow('zájmeno', GENDER_TYPES()[customer.sex || 0])}
        {this.renderRow(
          'datum narození',
          customer.birthDate && dayjs(customer.birthDate).format('MMM,DD YYYY'),
        )}
        {this.renderRow('je Předplaceno', customer.isSubscribed)}
        {this.renderRow('skóre', customer.score)}
        {this.renderRow('popis', customer.description, 'description')}
      </SidebarList>
    );
  }
}

export default DetailInfo;
