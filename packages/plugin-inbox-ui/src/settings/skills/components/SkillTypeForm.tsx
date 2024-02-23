import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';

import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import Form from '@saashq/ui/src/components/form/Form';
import FormControl from '@saashq/ui/src/components/form/Control';
import { ISkillTypesDocument } from '@saashq/ui-inbox/src/settings/skills/types';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import React from 'react';

type Props = {
  closeModal: () => void;
  object: ISkillTypesDocument;
  refetch: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

function SkillTypeForm({ closeModal, object, renderButton }: Props) {
  const generateDoc = (values: { _id?: string; name: string }) => {
    const item = object || ({} as ISkillTypesDocument);

    if (item._id) {
      values._id = item._id;
    }

    return values;
  };

  const renderContent = (formProps: IFormProps) => {
    const { values, isSubmitted } = formProps;
    const item = object || ({} as ISkillTypesDocument);

    if (item) {
      values._id = item._id;
    }

    return (
      <>
        <ControlLabel>Name</ControlLabel>
        <FormControl
          {...formProps}
          name="name"
          defaultValue={item.name}
          autoFocus={true}
          required={true}
        />
        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="times-circle"
          >
            Cancel
          </Button>

          {renderButton({
            name: 'skill type',
            values: generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object
          })}
        </ModalFooter>
      </>
    );
  };

  return <Form renderContent={renderContent} />;
}

export default SkillTypeForm;
