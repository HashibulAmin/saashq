import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import Button from '@saashq/ui/src/components/Button';
import Icon from '@saashq/ui/src/components/Icon';
import Tip from '@saashq/ui/src/components/Tip';
import { __ } from '@saashq/ui/src/utils';
import React from 'react';
import { IPermission } from '../../types';

type Props = {
  permissions: IPermission[];
  removeItem?: (id: string, permission: string, categoryIds: string[]) => void;
};

class PermissionRow extends React.Component<Props> {
  render() {
    const { removeItem, permissions } = this.props;
    return permissions.map((item) => (
      <tr key={item._id}>
        <td>{item.category?.name || ''}</td>
        <td>{item.permission || ''}</td>
        <td>{item.permissionGroup?.name || ''}</td>
        <td>
          <ActionButtons>
            <Tip text="Vymazat" placement="top">
              <Button
                btnStyle="link"
                onClick={() =>
                  removeItem(item._id, item.permission, [item.category._id])
                }
              >
                <Icon icon="times-circle" />
              </Button>
            </Tip>
          </ActionButtons>
        </td>
      </tr>
    ));
  }
}

export default PermissionRow;
