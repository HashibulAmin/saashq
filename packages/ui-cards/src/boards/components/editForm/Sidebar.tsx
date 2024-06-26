import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import SelectTeamMembers from '@saashq/ui/src/team/containers/SelectTeamMembers';
import React from 'react';
import { RightContent } from '../../styles/item';
import { IItem, IOptions } from '../../types';
import SidebarConformity from './SidebarConformity';
import { isEnabled } from '@saashq/ui/src/utils/core';
import { __ } from '@saashq/ui/src/utils';
import SelectBranches from '@saashq/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@saashq/ui/src/team/containers/SelectDepartments';
import { IUser } from '@saashq/ui/src/auth/types';

type Props = {
  item: IItem;
  saveItem: (doc: { [key: string]: any }) => void;
  sidebar?: (
    saveItem?: (doc: { [key: string]: any }) => void,
  ) => React.ReactNode;
  options: IOptions;
  renderItems: () => React.ReactNode;
  updateTimeTrack: (
    {
      _id,
      status,
      timeSpent,
    }: { _id: string; status: string; timeSpent: number; startDate?: string },
    callback?: () => void,
  ) => void;
  childrenSection: () => any;
  currentUser: IUser;
};

class Sidebar extends React.Component<Props> {
  render() {
    const { item, saveItem, sidebar, childrenSection, currentUser } =
      this.props;

    const userOnChange = (usrs) => saveItem({ assignedUserIds: usrs });
    const onChangeStructure = (values, name) => saveItem({ [name]: values });
    const assignedUserIds = (item.assignedUsers || []).map((user) => user._id);
    const branchIds = currentUser.branchIds;
    const departmentIds = currentUser.departmentIds;

    return (
      <RightContent>
        <FormGroup>
          <ControlLabel>Přiřazen</ControlLabel>
          <SelectTeamMembers
            label="Vyberte uživatele"
            name="assignedUserIds"
            initialValue={assignedUserIds}
            onSelect={userOnChange}
            filterParams={{
              isAssignee: true,
              departmentIds,
              branchIds,
            }}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Větve')}</ControlLabel>
          <SelectBranches
            name="branchIds"
            label="Vyberte pobočky"
            initialValue={item?.branchIds}
            onSelect={onChangeStructure}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Oddělení')}</ControlLabel>
          <SelectDepartments
            name="departmentIds"
            label="Vyberte si oddělení"
            onSelect={onChangeStructure}
            initialValue={item?.departmentIds}
          />
        </FormGroup>
        {isEnabled('products') && sidebar && sidebar(saveItem)}

        <SidebarConformity {...this.props} />
        {childrenSection()}
      </RightContent>
    );
  }
}

export default Sidebar;
