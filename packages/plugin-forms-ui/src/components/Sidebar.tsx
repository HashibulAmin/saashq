import { __ } from '@saashq/ui/src/utils';
import LeftSidebar from '@saashq/ui/src/layout/components/Sidebar';
import { SidebarList as List } from '@saashq/ui/src/layout/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderItems } from '@saashq/ui/src/layout/styles';
import Icon from '@saashq/ui/src/components/Icon';
import SidebarHeader from '@saashq/ui-settings/src/common/components/SidebarHeader';

type Props = {
  currentType: string;
  services: string[];
};

class Sidebar extends React.Component<Props> {
  renderListItem(service) {
    const className =
      this.props.currentType && this.props.currentType === service.contentType
        ? 'active'
        : '';

    return (
      <li key={service.contentType}>
        <Link to={`?type=${service.contentType}`} className={className}>
          {__(service.description)}
          <HeaderItems rightAligned={true}>
            {this.props.currentType === service.contentType ? (
              <Icon icon="angle-right" />
            ) : null}
          </HeaderItems>
        </Link>
      </li>
    );
  }

  render() {
    return (
      <LeftSidebar header={<SidebarHeader />} hasBorder>
        <List>
          {this.props.services.map(service => this.renderListItem(service))}
        </List>
      </LeftSidebar>
    );
  }
}

export default Sidebar;
