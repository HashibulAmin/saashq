import { ItemBox, ItemIndicator, Quantity } from '../styles/stage';

import { ICompany } from '@saashq/ui-contacts/src/companies/types';
import { ICustomer } from '@saashq/ui-contacts/src/customers/types';
import { IProduct } from '@saashq/ui-products/src/types';
import React from 'react';
import { renderFullName } from '@saashq/ui/src/utils';

type Props = {
  items: ICompany[] | ICustomer[] | IProduct[];
  color: string;
};

class Details extends React.Component<Props> {
  renderItem(item, color, index) {
    return (
      <ItemBox key={index}>
        <ItemIndicator color={color} />
        {item.name || item.primaryName || renderFullName(item)}
        {item.quantity && (
          <Quantity>
            ({item.quantity} {item.uom ? item.uom : 'PC'})
          </Quantity>
        )}
        {item.unitPrice && (
          <>
            {' '}
            -{' '}
            {item.unitPrice.toLocaleString(undefined, {
              maximumFractionDigits: 0
            })}
          </>
        )}
      </ItemBox>
    );
  }

  renderItems(items) {
    const { color } = this.props;

    return items.map((item, index) => this.renderItem(item, color, index));
  }

  render() {
    const { items } = this.props;
    const length = items.length;

    if (length === 0) {
      return null;
    }

    return <>{this.renderItems(items)}</>;
  }
}

export default Details;
