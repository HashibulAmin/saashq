import IfForm from '../../../containers/forms/actions/subForms/IfForm';
import SetProperty from '../../../containers/forms/actions/subForms/SetProperty';
import { IAction } from '@saashq/ui-automations/src/types';
import Button from '@saashq/ui/src/components/Button';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import { __ } from '@saashq/ui/src/utils/core';
import React from 'react';
import Common from '@saashq/ui-automations/src/components/forms/actions/Common';
import CustomCode from './subForms/CustomCode';
import Delay from './subForms/Delay';
import { renderDynamicComponent } from '../../../utils';
import SendMail from './subForms/SendMail';
type Props = {
  onSave: () => void;
  closeModal: () => void;
  activeAction: IAction;
  addAction: (action: IAction, actionId?: string, config?: any) => void;
  actionsConst: any[];
  propertyTypesConst: any[];
};

const renderExtraContent = (props) => {
  const {
    activeAction: { type },
  } = props;

  const response = {
    default: <DefaultForm {...props} />,
    delay: <Delay {...props} />,
    setProperty: <SetProperty {...props} />,
    if: <IfForm {...props} />,
    customCode: <CustomCode {...props} />,
    sendEmail: <SendMail {...props} />,
  };

  const Component = renderDynamicComponent(
    {
      ...props,
      componentType: 'actionForm',
    },
    type,
  );

  if (Component) {
    response[type] = Component;
  }

  return response;
};
class DefaultForm extends React.Component<Props> {
  render() {
    const { activeAction, onSave, closeModal, actionsConst } = this.props;

    const currentAction = actionsConst.find(
      (action) => action.type === activeAction.type && action.component,
    );

    if (currentAction) {
      const Component = currentAction.component;
      return <Component {...this.props} common={Common} />;
    }

    return (
      <>
        <div>
          {__('obsah')} {activeAction.type}
        </div>
        <ModalFooter>
          <Button
            btnStyle="simple"
            size="small"
            icon="times-circle"
            onClick={closeModal}
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

export const ActionForms = renderExtraContent;
