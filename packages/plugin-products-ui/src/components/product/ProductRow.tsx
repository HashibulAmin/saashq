import Tags from '@saashq/ui/src/components/Tags';
import TextInfo from '@saashq/ui/src/components/TextInfo';
import React from 'react';
import { IProduct } from '../../types';

import ProductForm from '@saashq/ui-products/src/containers/ProductForm';

import {
  Button,
  FormControl,
  Icon,
  ModalTrigger,
  Tip,
  __,
  ActionButtons,
} from '@saashq/ui/src';

type Props = {
  product: IProduct;
  history: any;
  isChecked: boolean;
  toggleBulk: (product: IProduct, isChecked?: boolean) => void;
};

class Row extends React.Component<Props> {
  render() {
    const { product, history, toggleBulk, isChecked } = this.props;

    const tags = product.getTags || [];

    const trigger = (
      <Button btnStyle="link">
        <Tip text={__('Upravit')} placement="bottom">
          <Icon icon="edit-3" />
        </Tip>
      </Button>
    );

    const onChange = (e) => {
      if (toggleBulk) {
        toggleBulk(product, e.target.checked);
      }
    };

    const onClick = (e) => {
      e.stopPropagation();
    };

    const onTrClick = () => {
      history.push(`/settings/product-service/details/${product._id}`);
    };

    const content = (props) => <ProductForm {...props} product={product} />;

    const { code, name, type, category, unitPrice } = product;

    return (
      <tr onClick={onTrClick}>
        <td onClick={onClick}>
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>{code}</td>
        <td>{name}</td>
        <td>
          <TextInfo>{type}</TextInfo>
        </td>
        <td>{category ? category.name : ''}</td>
        <td>{(unitPrice || 0).toLocaleString()}</td>
        <td>
          <Tags tags={tags} limit={2} />
        </td>
        <td onClick={onClick}>
          <ActionButtons>
            <ModalTrigger
              title="Edit basic info"
              trigger={trigger}
              size="xl"
              content={content}
            />
          </ActionButtons>
        </td>
      </tr>
    );
  }
}

export default Row;
