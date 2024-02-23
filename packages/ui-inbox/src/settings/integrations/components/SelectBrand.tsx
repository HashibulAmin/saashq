import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';

import BrandForm from '@saashq/ui/src/brands/components/BrandForm';
import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { IBrand } from '@saashq/ui/src/brands/types';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import { Row } from '../styles';
import { __ } from '@saashq/ui/src/utils';

type Props = {
  brands: IBrand[];
  onChange?: (e: any) => any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  defaultValue?: string;
  creatable?: boolean;
  isRequired?: boolean;
  formProps?: IFormProps;
  description?: string;
};

class SelectBrand extends React.Component<Props, {}> {
  renderAddBrand = () => {
    const { renderButton, creatable = true } = this.props;

    if (!creatable) {
      return;
    }

    const trigger = (
      <Button btnStyle="primary" icon="plus-circle">
        Create brand
      </Button>
    );

    const content = props => (
      <BrandForm {...props} renderButton={renderButton} />
    );

    return (
      <ModalTrigger title="Create brand" trigger={trigger} content={content} />
    );
  };

  render() {
    const {
      brands,
      onChange,
      defaultValue,
      formProps,
      isRequired,
      description
    } = this.props;

    return (
      <FormGroup>
        <ControlLabel required={isRequired}>Brand</ControlLabel>
        {description && <p>{description}</p>}
        <Row>
          <FormControl
            {...formProps}
            name="brandId"
            componentClass="select"
            placeholder={__('Select Brand')}
            defaultValue={defaultValue}
            onChange={onChange}
            required={isRequired}
          >
            <option />
            {brands.map(brand => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </FormControl>
          {this.renderAddBrand()}
        </Row>
      </FormGroup>
    );
  }
}

export default SelectBrand;
