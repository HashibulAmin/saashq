import React from 'react';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import FormControl from '@saashq/ui/src/components/form/Control';
import { IFormProps, IButtonMutateProps } from '@saashq/ui/src/types';
import Button from '@saashq/ui/src/components/Button';
import { __ } from '@saashq/ui/src/utils/core';

type Props = {
  formProps: IFormProps;
  id: string;
  name: string;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};

class TemplateForm extends React.Component<Props> {
  generateDoc = ({ name }: { name: string }) => {
    return {
      _id: this.props.id,
      name,
    };
  };

  render() {
    const { formProps, closeModal, renderButton, name } = this.props;

    const { values, isSubmitted } = formProps;

    return (
      <div>
        <FormControl
          {...formProps}
          defaultValue={`${name} (template)`}
          name="name"
          placeholder={__('Název šablony')}
        />
        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="times-circle"
          >
            {__('Zrušení')}
          </Button>

          {renderButton({
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal,
          })}
        </ModalFooter>
      </div>
    );
  }
}

export default TemplateForm;
