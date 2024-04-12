import { FieldStyle, SidebarCounter } from '@saashq/ui/src/layout/styles';
import { SidebarList, __ } from '@saashq/ui/src';

import { Link } from 'react-router-dom';
import React from 'react';

function ListItem(url, text, totalCount?) {
  return (
    <li>
      <Link
        to={url}
        className={window.location.href.includes(url) ? 'active' : ''}
      >
        <FieldStyle>{__(text)}</FieldStyle>
        <SidebarCounter nowrap={true}>{totalCount}</SidebarCounter>
      </Link>
    </li>
  );
}

type Props = {
  branchTotalCount: number;
  unitTotalCount: number;
  departmentTotalCount: number;
  positionTotalCount: number;
};

export default class SettingsSideBar extends React.Component<Props> {
  render() {
    return (
      <SidebarList>
        {ListItem('/settings/structure', 'Structure')}
        {ListItem('/settings/branches', 'Větve', this.props.branchTotalCount)}
        {ListItem(
          '/settings/departments',
          'Oddělení',
          this.props.departmentTotalCount,
        )}
        {ListItem('/settings/units', 'Jednotky', this.props.unitTotalCount)}
        {ListItem(
          '/settings/positions',
          'Pozice',
          this.props.positionTotalCount,
        )}
      </SidebarList>
    );
  }
}
