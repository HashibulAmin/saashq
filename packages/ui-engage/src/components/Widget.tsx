import { IEmailTemplate, IEngageMessageDoc } from '../types';

import Button from '@saashq/ui/src/components/Button';
import { IBrand } from '@saashq/ui/src/brands/types';
import { ICustomer } from '@saashq/ui-contacts/src/customers/types';
import { IUser } from '@saashq/ui/src/auth/types';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import WidgetForm from './WidgetForm';

type Props = {
  emailTemplates: IEmailTemplate[];
  brands: IBrand[];
  customers: ICustomer[];
  messengerKinds: any[];
  sentAsChoices: any[];
  modalTrigger?: React.ReactNode;
  currentUser: IUser;
  save: (doc: IEngageMessageDoc, closeModal: () => void) => void;
};

class Widget extends React.Component<Props> {
  getTrigger = () => {
    const trigger = this.props.modalTrigger;

    if (trigger) {
      return trigger;
    }

    return (
      <Button btnStyle="success" size="small" icon="envelope-alt">
        Zpráva
      </Button>
    );
  };

  render() {
    const content = (props) => <WidgetForm {...this.props} {...props} />;

    return (
      <ModalTrigger
        size="lg"
        title="Rychlá zpráva"
        trigger={this.getTrigger()}
        content={content}
        enforceFocus={false}
      />
    );
  }
}

export default Widget;
