import Form from '@saashq/ui/src/components/form/Form';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import Button from '@saashq/ui/src/components/Button';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { IButtonMutateProps, IFormProps, IOption } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils';
import React, { useState } from 'react';
import { ICommonFormProps } from '@saashq/ui-settings/src/common/types';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  stageId: string;
} & ICommonFormProps;

export const DealForm = (props: Props) => {
  const { stageId } = props;

  const [name, setName] = useState('');

  const generateDoc = (values: { name: string; stageId: string }) => {
    const finalValues = values;

    if (name) {
      finalValues.name = name;
    }
    if (stageId) {
      finalValues.stageId = stageId;
    }
    return {
      ...finalValues
    };
  };

  const onChange = e => {
    setName(e.target.value);
  };

  const renderContent = (formProps: IFormProps) => {
    const { closeModal, renderButton } = props;
    const { values, isSubmitted } = formProps;

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>Name</ControlLabel>
          <FormControl
            {...formProps}
            name="Create a new Deal"
            defaultValue={name}
            type="input"
            required={true}
            autoFocus={true}
            onChange={onChange}
          />
        </FormGroup>

        <ModalFooter id={'AddTagButtons'}>
          <Button btnStyle="simple" onClick={closeModal} icon="times-circle">
            Cancel
          </Button>

          {renderButton({
            passedName: 'meeting',
            values: generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object: name
          })}
        </ModalFooter>
      </>
    );
  };

  return <Form renderContent={renderContent} />;
};
