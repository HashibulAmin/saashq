import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import Button from '@saashq/ui/src/components/Button';
import Icon from '@saashq/ui/src/components/Icon';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import Tip from '@saashq/ui/src/components/Tip';
import { IPackage } from '../types';
import PackageForm from './PackageForm';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { __ } from 'coreui/utils';

type Props = {
  item: IPackage;
  removeItem: (item: IPackage) => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

function PackageRow({ item, renderButton, removeItem }: Props) {
  const handleRemove = () => removeItem(item);

  const renderForm = (formProps) => {
    return (
      <PackageForm data={item} renderButton={renderButton} {...formProps} />
    );
  };

  function renderActions() {
    const trigger = (
      <Button id="item-edit-item" btnStyle="link">
        <Tip text={__('Edit')} placement="bottom">
          <Icon icon="edit-3" />
        </Tip>
      </Button>
    );

    return (
      <ActionButtons>
        <ModalTrigger
          title="Upravit položku"
          trigger={trigger}
          content={renderForm}
        />
        <Tip text={__('Delete')} placement="top">
          <Button btnStyle="link" onClick={handleRemove}>
            <Icon icon="times-circle" />
          </Button>
        </Tip>
      </ActionButtons>
    );
  }

  return (
    <tr key={item._id}>
      <td>{item.name}</td>
      <td>{item.description}</td>
      <td>{renderActions()}</td>
    </tr>
  );
}

export default PackageRow;
