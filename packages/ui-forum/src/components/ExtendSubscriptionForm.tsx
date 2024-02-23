import React, { useState } from 'react';
import { timeDuractionUnits } from '../constants';
import { IFormProps } from '@saashq/ui/src/types';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import Form from '@saashq/ui/src/components/form/Form';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import Button from '@saashq/ui/src/components/Button';

const ExtendSubscriptionForm = ({
  user = {} as any,
  renderButton,
  closeModal
}) => {
  const generateDoc = (values: {
    multiplier?: string;
    unit?: string;
    price?: string;
  }) => {
    const finalValues = values;

    return {
      ...values,
      cpUserId: user._id,
      multiplier: parseInt(finalValues.multiplier, 10),
      unit: finalValues.unit,
      price: parseInt(finalValues.price, 10),
      userType: user.type
    };
  };

  const renderContent = (formProps: IFormProps) => {
    const { values, isSubmitted } = formProps;

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>Multiplier</ControlLabel>
          <FormControl
            {...formProps}
            name="multiplier"
            type="number"
            required={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Unit</ControlLabel>
          <FormControl {...formProps} name="unit" componentClass="select">
            {timeDuractionUnits.map(tdu => (
              <option value={tdu} key={tdu}>
                {tdu}
              </option>
            ))}
          </FormControl>
        </FormGroup>
        <FormGroup>
          <ControlLabel required={true}>Price</ControlLabel>
          <FormControl
            {...formProps}
            name="price"
            type="number"
            required={true}
          />
        </FormGroup>

        <ModalFooter id={'ExtendSubscriptionButtons'}>
          <Button btnStyle="simple" onClick={closeModal} icon="times-circle">
            Cancel
          </Button>

          {renderButton({
            values: generateDoc(values),
            isSubmitted,
            callback: closeModal
          })}
        </ModalFooter>
      </>
    );
  };

  return <Form renderContent={renderContent} />;
};

export default ExtendSubscriptionForm;
