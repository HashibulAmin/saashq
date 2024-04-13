import Tip from '@saashq/ui/src/components/Tip';
import Button from '@saashq/ui/src/components/Button';
import React from 'react';
import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import { __ } from 'coreui/utils';
import Icon from '@saashq/ui/src/components/Icon';
import Form from '../containers/Form';
import { ModalTrigger } from '@saashq/ui/src/components';

type Props = {
  obj: any;
  remove: (_id: string) => void;
};

function Row({ obj, remove }: Props) {
  const modalContent = (modalProps) => {
    const props = {
      ...modalProps,
      _id: obj._id,
    };

    return <Form {...props} />;
  };

  const trigger = (
    <Button btnStyle="link">
      <Icon icon="edit-3" />
    </Button>
  );

  const actionButtons = () => {
    return (
      <ActionButtons>
        <ModalTrigger
          content={modalContent}
          size="lg"
          title="Upravit dokument"
          autoOpenKey="showDocumentModal"
          trigger={trigger}
        />
        <Tip text={__('Vymazat')} placement="top">
          <Button
            btnStyle="link"
            onClick={remove.bind(this, obj._id)}
            icon="times-circle"
          />
        </Tip>
      </ActionButtons>
    );
  };

  return (
    <tr key={obj._id}>
      <td>{obj.name}</td>
      <td>{actionButtons()}</td>
    </tr>
  );
}

export default Row;
