import { IButtonMutateProps } from '@saashq/ui/src/types';
import { StepFormWrapper } from '@saashq/ui-engage/src/styles';
import BrandForm from '@saashq/ui/src/brands/components/BrandForm';
import React from 'react';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  afterSave: () => void;
};

const Form = ({ renderButton, afterSave }: Props) => {
  return (
    <StepFormWrapper>
      <BrandForm
        afterSave={afterSave}
        modal={false}
        renderButton={renderButton}
      />
    </StepFormWrapper>
  );
};

export default Form;
