import { __ } from '@saashq/ui/src/utils';
import {
  Sidebar as LeftSidebar,
  SidebarList as List
} from '@saashq/ui/src/layout';
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
      <LeftSidebar header={<SidebarHeader />} hasBorder>
        <List id="SettingsSidebar">
          {this.renderListItem(
            '/saashq-plugin-loyalty/settings/general',
            'General config'
          )}
          {this.renderListItem(
            '/saashq-plugin-loyalty/settings/voucher',
            'Voucher'
          )}
          {this.renderListItem(
            '/saashq-plugin-loyalty/settings/lottery',
            'Lottery'
          )}
          {this.renderListItem('/saashq-plugin-loyalty/settings/spin', 'Spin')}
          {this.renderListItem(
            '/saashq-plugin-loyalty/settings/donate',
            'Donate'
          )}
          {this.renderListItem(
            '/saashq-plugin-loyalty/settings/assignment',
            'Assignment'
          )}
        </List>
      </LeftSidebar>
    );
  }
}

export default Sidebar;
