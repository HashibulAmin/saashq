import { Wrapper, __ } from '@saashq/ui/src';

import BoxContainer from '../../containers/structure/Box';
import LeftSidebar from '@saashq/ui/src/layout/components/Sidebar';
import React from 'react';
import SettingsSideBar from '../../containers/common/SettingSideBar';
import SidebarHeader from '@saashq/ui-settings/src/common/components/SidebarHeader';

export default function Structure() {
  return (
    <Wrapper
      header={
        <Wrapper.Header
          title="Struktura"
          breadcrumb={[
            { title: __('Nastavení'), link: '/settings' },
            { title: __('Struktura') },
          ]}
        />
      }
      content={<BoxContainer />}
      leftSidebar={
        <LeftSidebar header={<SidebarHeader />} hasBorder={true}>
          <SettingsSideBar />
        </LeftSidebar>
      }
      hasBorder={true}
    />
  );
}
