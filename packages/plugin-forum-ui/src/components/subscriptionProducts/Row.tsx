import React from 'react';
import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import Button from '@saashq/ui/src/components/Button';
import Icon from '@saashq/ui/src/components/Icon';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import Tip from '@saashq/ui/src/components/Tip';
import Label from '@saashq/ui/src/components/Label';
import { __ } from '@saashq/ui/src/utils';
import Form from './SubscriptionProductForm';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { IProduct } from '../../types';

type Props = {
  product: IProduct;
  onDelete?: (item: IProduct) => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class Row extends React.Component<Props> {
  render() {
    const { product, onDelete, renderButton } = this.props;
    const { name, description, multiplier, unit, price, userType, listOrder } =
      product;

    const editTrigger = (
      <Button btnStyle="link">
        <Tip text={__('Upravit')} placement="top">
          <Icon icon="edit-3" />
        </Tip>
      </Button>
    );

    const content = (props) => (
      <Form
        {...props}
        renderButton={renderButton}
        subscriptionProduct={product}
      />
    );

    return (
      <>
        <tr>
          <td>{name}</td>
          <td>{description}</td>
          <td>{multiplier}</td>
          <td>{unit}</td>
          <td>
            {price.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </td>
          <td>
            <Label
              lblStyle={
                userType === null
                  ? 'success'
                  : userType === 'customer'
                    ? 'warning'
                    : 'default'
              }
            >
              {userType ? userType : 'All'}
            </Label>
          </td>
          <td>{listOrder.toLocaleString()}</td>
          <td>
            <ActionButtons>
              <ModalTrigger
                title="Upravit produkt"
                trigger={editTrigger}
                size="lg"
                content={content}
              />

              <Tip text={__('Vymazat')} placement="top">
                <Button
                  btnStyle="link"
                  onClick={() => onDelete(product)}
                  icon="times-circle"
                />
              </Tip>
            </ActionButtons>
          </td>
        </tr>
      </>
    );
  }
}

export default Row;
