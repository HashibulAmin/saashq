import {
  ControlLabel,
  Form,
  FormControl,
} from '@saashq/ui/src/components/form';
import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';
import { IClientPortalUser, IVerificationRequest } from '../../types';
import React, { useState } from 'react';

import AttachmentsGallery from '@saashq/ui/src/components/AttachmentGallery';
import Button from '@saashq/ui/src/components/Button';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { ModalFooter } from '@saashq/ui/src/styles/main';

type Props = {
  clientPortalUser: IClientPortalUser;
  closeModal?: () => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

const VerificationForm = (props: Props) => {
  const { clientPortalUser, closeModal, renderButton } = props;
  const { status, attachments } =
    clientPortalUser.verificationRequest || ({} as IVerificationRequest);

  const [vStatus, setStatus] = useState(status ? status : 'notVerified');

  const renderFooter = (formProps: IFormProps) => {
    const { isSubmitted } = formProps;

    return (
      <ModalFooter>
        <Button
          btnStyle="simple"
          type="button"
          icon="times-circle"
          onClick={closeModal}
        >
          Zrušení
        </Button>

        {renderButton({
          name: 'clientPortalUser',
          values: {
            userId: clientPortalUser._id,
            status: vStatus,
          },
          isSubmitted,
          callback: closeModal,
        })}
      </ModalFooter>
    );
  };

  const renderContent = (formProps: IFormProps) => {
    const onChange = (e) => {
      setStatus(e.target.value);
    };

    const renderAttachment = () => {
      if (!attachments || attachments.length === 0) {
        return <EmptyState icon="ban" text="Žádné přílohy" size="small" />;
      }

      return (
        <AttachmentsGallery
          attachments={attachments}
          onChange={() => null}
          removeAttachment={() => null}
        />
      );
    };

    return (
      <>
        <FormGroup>
          <ControlLabel>Stav ověření</ControlLabel>
          <FormControl
            componentClass="select"
            onChange={onChange}
            defaultValue={vStatus}
          >
            <option value="notVerified">neověřeno</option>
            <option value="pending">čekající</option>
            <option value="verified">ověřeno</option>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Ověřovací příloha</ControlLabel>
          {renderAttachment()}
        </FormGroup>

        {renderFooter({ ...formProps })}
      </>
    );
  };

  return <Form renderContent={renderContent} />;
};

export default VerificationForm;
