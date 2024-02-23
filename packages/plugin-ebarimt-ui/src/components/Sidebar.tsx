import {
  Sidebar as LeftSidebar,
  SidebarList as List
} from '@saashq/ui/src/layout';
import { __ } from '@saashq/ui/src/utils';
import React from 'react';
import { Link } from 'react-router-dom';
import SidebarHeader from '@saashq/ui-settings/src/common/components/SidebarHeader';

class Sidebar extends React.Component {
  renderListItem(url: string, text: string) {
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
  }

  render() {
    return (
      <LeftSidebar header={<SidebarHeader />} hasBorder={true}>
        <List id="SettingsSidebar">
          {this.renderListItem(
            '/saashq-plugin-ebarimt/settings/general',
            'General config'
          )}
          {this.renderListItem(
            '/saashq-plugin-ebarimt/settings/stage',
            'Stage in Ebarimt config'
          )}
          {this.renderListItem(
            '/saashq-plugin-ebarimt/settings/return-stage',
            'Stage in Return Ebarimt config'
          )}
        </List>
      </LeftSidebar>
    );
  }
}

export default Sidebar;
