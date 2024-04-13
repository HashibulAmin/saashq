import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
} from '@saashq/ui/src/components';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import { IFormProps } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils';
import React, { useState } from 'react';

interface IProps {
  closeModal?: () => void;
  data: any;
  callData?: { callerNumber: string };
  setConfig?: any;
}

const renderInput = (
  name: string,
  label: string,
  defaultValue: string,
  formProps: any,
) => {
  return (
    <FormGroup>
      <ControlLabel>{label}</ControlLabel>
      <FormControl
        name={name}
        value={defaultValue}
        disabled={true}
        {...formProps}
      />
    </FormGroup>
  );
};

const CallIntegrationForm = (props: IProps) => {
  const { closeModal, data = {}, setConfig } = props;
  const [selectedIntegrationId, setSelectedIntegrationId] = useState('');
  const integration = selectedIntegrationId
    ? data?.find((d) => d._id === selectedIntegrationId)
    : data?.[0];

  const saveCallConfig = () => {
    // tslint:disable-next-line:no-unused-expression
    integration &&
      localStorage.setItem(
        'config:call_integrations',
        JSON.stringify({
          inboxId: integration?.inboxId,
          phone: integration?.phone,
          wsServer: integration?.wsServer,
          token: integration?.token,
          operators: integration?.operators,
          isAvailable: true,
        }),
      );
    // tslint:disable-next-line:no-unused-expression
    integration &&
      setConfig({
        inboxId: integration.inboxId,
        phone: integration.phone,
        wsServer: integration.wsServer,
        token: integration.token,
        operators: integration.operators,
        isAvailable: true,
      });
    closeModal();
  };

  const skipCallConnection = () => {
    // tslint:disable-next-line:no-unused-expression
    integration &&
      localStorage.setItem(
        'config:call_integrations',
        JSON.stringify({
          inboxId: integration?.inboxId,
          phone: integration?.phone,
          wsServer: integration?.wsServer,
          token: integration?.token,
          operators: integration?.operators,
          isAvailable: false,
        }),
      );
    // tslint:disable-next-line:no-unused-expression
    integration &&
      setConfig({
        inboxId: integration.inboxId,
        phone: integration.phone,
        wsServer: integration.wsServer,
        token: integration.token,
        operators: integration.operators,
        isAvailable: false,
      });
    closeModal();
  };

  const onChange = (e) => {
    setSelectedIntegrationId(e.target.value);
  };

  const renderContent = (formProps: IFormProps) => {
    return (
      <>
        <FormGroup>
          <FormControl
            {...formProps}
            name="phone"
            componentClass="select"
            placeholder={__('Vyberte telefon')}
            defaultValue={integration?.phone}
            onChange={onChange}
            required={true}
          >
            {data?.map((int) => (
              <option key={int._id} value={int._id}>
                {int.phone}
              </option>
            ))}
          </FormControl>
        </FormGroup>
        {renderInput(
          'wsServer',
          'Webový soketový server',
          integration?.wsServer,
          formProps,
        )}

        {integration?.operators.map((operator: any, index: number) => {
          return (
            <div key={index}>
              <ControlLabel>Operátor {index + 1}</ControlLabel>
              {renderInput(
                'userId',
                'uživatelské ID',
                operator.userId,
                formProps,
              )}
              {renderInput(
                'gsUsername',
                'uživatelské jméno grandstream',
                operator.gsUsername,
                formProps,
              )}
              {renderInput(
                'gsPassword',
                'heslo grandstream',
                operator.gsPassword,
                formProps,
              )}
            </div>
          );
        })}

        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="times-circle"
          >
            Zrušení
          </Button>

          <Button
            btnStyle="primary"
            type="button"
            onClick={skipCallConnection}
            icon="times-circle"
          >
            Přeskočit připojení
          </Button>
          <Button
            type="submit"
            btnStyle="success"
            icon="check-circle"
            onClick={saveCallConfig}
          >
            {__('Uložit')}
          </Button>
        </ModalFooter>
      </>
    );
  };

  return <Form renderContent={renderContent} />;
};

export default CallIntegrationForm;
