import { IAction } from '@saashq/ui-automations/src/types';
import React from 'react';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import Button from '@saashq/ui/src/components/Button';
import FormSubmit from '../../../containers/forms/triggers/subForms/FormSubmit';
import { __ } from '@saashq/ui/src/utils/core';

type Props = {
  closeModal: () => void;
  onSave: () => void;
  action: IAction;
};

class DefaultForm extends React.Component<Props> {
  render() {
    const { action, closeModal, onSave } = this.props;

    return (
      <>
        <div>
          {__('obsah')} {action.type}
        </div>
        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="times-circle"
          >
            {__('Zrušení')}
          </Button>

          <Button btnStyle="success" icon="checked-1" onClick={onSave}>
            Uložit
          </Button>
        </ModalFooter>
      </>
    );
  }
}

export const TriggerForms = {
  default: DefaultForm,
  formSubmit: FormSubmit,
};
