import { __ } from '@saashq/ui/src/utils';
import React from 'react';
import Table from '@saashq/ui/src/components/table';

function LastExpensesForm({ expenseAmountData }) {
  return (
    <Table whiteSpace="nowrap" hover={true}>
      <thead>
        <tr>
          <th>{__('PRODUKT / SLUŽBA')}</th>
          <th>{__('MNOŽSTVÍ')}</th>
          <th>{__('MNOŽSTVÍ')}</th>
          <th>{__('JEDNOTKOVÁ CENA')}</th>
          <th>{__('NÁKLADY')}</th>
          <th>{__('ČÁSTKA S NÁKLADEM')}</th>
        </tr>
      </thead>
      <tbody>
        {expenseAmountData.map((item, key) => {
          return (
            <tr key={key}>
              <td>{item.product.name}</td>
              <td>{item.quantity}</td>
              <td>{(item.amount || 0).toLocaleString()}</td>
              <td>{(item.unitPrice || 0).toLocaleString()}</td>
              <td>{(item.expenseAmount || 0).toLocaleString()}</td>
              <td>
                {(
                  (item.amount || 0) + (item.expenseAmount || 0)
                ).toLocaleString()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default LastExpensesForm;
