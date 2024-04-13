import { RowTitle } from '@saashq/ui-engage/src/styles';
import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import Button from '@saashq/ui/src/components/Button';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import Tip from '@saashq/ui/src/components/Tip';
import { __ } from '@saashq/ui/src/utils/core';
import React from 'react';

import ConfigForm from '../../containers/paymentConfig/Form';
import { IPaymentConfig } from '../../types';

type Props = {
  config: IPaymentConfig;
  remove: (configId: string) => void;
};

const Row = (props: Props) => {
  const { config, remove } = props;

  const renderRemoveAction = () => {
    const onClick = () => {
      remove(config._id);
    };

    return (
      <Tip text={__('Vymazat')} placement="top">
        <Button
          id="configDelete"
          btnStyle="link"
          onClick={onClick}
          icon="times-circle"
        />
      </Tip>
    );
  };

  const formContent = (formProps) => (
    <ConfigForm {...formProps} config={config} />
  );

  return (
    <tr>
      <td key={Math.random()}>
        <RowTitle>Form integration</RowTitle>
      </td>

      <td key={Math.random()}>
        <RowTitle>{config.contentName || '-'}</RowTitle>
      </td>

      <td key={Math.random()}>
        <RowTitle>{config.payments.map((c) => c.name).join(', ')}</RowTitle>
      </td>
      <td>
        <ActionButtons>
          <ModalTrigger
            title={'Edit config'}
            trigger={<Button btnStyle="link" icon="edit-3" />}
            content={formContent}
            size={'lg'}
          />
          {renderRemoveAction()}
        </ActionButtons>
      </td>
    </tr>
  );
};

export default Row;
