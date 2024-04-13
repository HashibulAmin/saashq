import React from 'react';

import EmptyState from '@saashq/ui/src/components/EmptyState';
import Table from '@saashq/ui/src/components/table';
import { Count } from '@saashq/ui/src/styles/main';
import { __ } from '@saashq/ui/src/utils';

import { IPaymentDocument } from '../types';
import PaymentListItem from './PaymentListItem';

type Props = {
  payments: IPaymentDocument[];
  removePayment: (payment: IPaymentDocument, callback?: any) => void;
  queryParams: any;
  paymentsCount: number;
};

class IntegrationList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  renderRows() {
    const {
      payments,
      queryParams: { _id },
      removePayment,
    } = this.props;

    return payments.map((payment) => (
      <PaymentListItem
        key={payment._id}
        _id={_id}
        payment={payment}
        removePayment={removePayment}
      />
    ));
  }

  render() {
    const { payments, paymentsCount } = this.props;

    if (!payments || payments.length < 1) {
      return (
        <EmptyState
          text="Start adding payments now!"
          image="/images/actions/2.svg"
        />
      );
    }

    return (
      <>
        <Count>
          {paymentsCount} config{paymentsCount > 1 && 's'}
        </Count>
        <Table>
          <thead>
            <tr>
              <th>{__('Název')}</th>
              <th>{__('Status')}</th>
              <th style={{ width: 130 }}>{__('Akce')}</th>
            </tr>
          </thead>
          <tbody>{this.renderRows()}</tbody>
        </Table>
      </>
    );
  }
}

export default IntegrationList;
