import { RowTitle } from '@saashq/ui-engage/src/styles';
import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import Button from '@saashq/ui/src/components/Button';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import Tip from '@saashq/ui/src/components/Tip';
import { __ } from '@saashq/ui/src/utils/core';
import React from 'react';
import Form from '../containers/Form';

import { IKhanbankConfigsItem } from '../types';

type Props = {
  config: IKhanbankConfigsItem;
  remove: (id: string) => void;
};

const Row = (props: Props) => {
  const { config, remove } = props;

  const renderRemoveAction = () => {
    const onClick = () => {
      remove(config._id);
    };

    return (
      <Tip text={__('Delete')} placement="top">
        <Button
          id="configDelete"
          btnStyle="link"
          onClick={onClick}
          icon="times-circle"
        />
      </Tip>
    );
  };

  const formContent = props => <Form {...props} config={config} />;

  return (
    <tr>
      <td key={Math.random()}>
        <RowTitle>{config.name || '-'}</RowTitle>
      </td>
      <td>
        <ActionButtons>
          <ModalTrigger
            title={'Corporate Gateway'}
            trigger={<Button btnStyle="link" icon="edit-3" />}
            content={formContent}
            size={'sm'}
          />
          {renderRemoveAction()}
        </ActionButtons>
      </td>
    </tr>
  );
};

export default Row;
