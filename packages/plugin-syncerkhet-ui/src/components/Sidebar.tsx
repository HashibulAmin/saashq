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
            '/saashq-plugin-sync-erkhet/settings/general',
            'General config'
          )}
          {this.renderListItem(
            '/saashq-plugin-sync-erkhet/settings/stage',
            'Stage in Erkhet config'
          )}
          {this.renderListItem(
            '/saashq-plugin-sync-erkhet/settings/return-stage',
            'Stage in Return Erkhet config'
          )}
          {this.renderListItem(
            '/saashq-plugin-sync-erkhet/settings/pipeline',
            'Pipeline remiainder config'
          )}
          {this.renderListItem(
            '/saashq-plugin-sync-erkhet/settings/move-stage',
            'Stage in Erkhet movement config'
          )}
          {this.renderListItem(
            '/saashq-plugin-sync-erkhet/settings/income-stage',
            'Stage in Erkhet income config'
          )}
        </List>
      </LeftSidebar>
    );
  }
}

export default Sidebar;
