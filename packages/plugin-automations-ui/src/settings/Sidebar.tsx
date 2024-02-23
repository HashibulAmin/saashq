import { __ } from '@saashq/ui/src/utils';
import {
  Sidebar as LeftSidebar,
  SidebarList as List,
} from '@saashq/ui/src/layout';
import React from 'react';
import { Link } from 'react-router-dom';
import SidebarHeader from '@saashq/ui-settings/src/common/components/SidebarHeader';
function Sidebar() {
  const renderListItem = (url: string, text: string) => {
    return (
      <li>
        <Link
          to={url}
          className={window.location.href.includes(url) ? 'active' : ''}
        >
          {__(text)}
        </Link>
      </li>
    );
  };

  return (
    <LeftSidebar header={<SidebarHeader />} hasBorder>
      <List id="SettingsSidebar">
        {renderListItem('/settings/automations/general', 'General config')}
        {renderListItem('/settings/automations/bots', 'Bots')}
      </List>
    </LeftSidebar>
  );
}

export default Sidebar;
