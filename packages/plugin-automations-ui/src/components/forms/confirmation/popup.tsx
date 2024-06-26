import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { IconWrapper, ModalFooter, ModalBody } from './styles';
import Icon from '@saashq/ui/src/components/Icon';
import Button from '@saashq/ui/src/components/Button';
import { __ } from '@saashq/ui/src/utils/core';

type Props = {
  isOpen: boolean;
  queryParams: any;
  onConfirm: () => void;
  onCancel: () => void;
};

class ConfirmationPopup extends React.Component<Props> {
  render() {
    const { isOpen, onConfirm, onCancel, queryParams } = this.props;

    const description = queryParams.isCreate
      ? `Uložte nebo odstraňte tuto automatizaci`
      : `Tyto změny prosím uložte nebo zahoďte`;
    const confirmText = queryParams.isCreate
      ? 'Ušetřete automatizaci'
      : 'Uložit';
    const cancelText = queryParams.isCreate ? 'Smazat automatizaci' : 'Vyřadit';

    return (
      <Modal
        show={isOpen}
        onHide={onCancel}
        centered={true}
        backdrop="static"
        keyboard={false}
      >
        <ModalBody>
          <IconWrapper>
            <Icon icon="exclamation-triangle" />
          </IconWrapper>
          {__(description)}
        </ModalBody>
        <ModalFooter>
          <Button
            btnStyle={queryParams.isCreate ? 'danger' : 'simple'}
            onClick={onCancel}
            icon="times-circle"
            uppercase={false}
          >
            {cancelText}
          </Button>
          <Button
            btnStyle="success"
            onClick={onConfirm}
            icon="check-circle"
            uppercase={false}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmationPopup;
