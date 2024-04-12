import BlockList from '../containers/common/BlockList';
import React from 'react';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';
import { loadDynamicComponent } from '@saashq/ui/src/utils/core';

export default function LeftSidebar({
  loadingMainQuery,
  queryParams,
}: {
  loadingMainQuery: boolean;
  queryParams: string;
}) {
  return (
    <Sidebar hasBorder={true}>
      <BlockList queryType="branches" title="Větev" queryParams={queryParams} />
      <BlockList
        queryType="departments"
        title="Oddělení"
        queryParams={queryParams}
      />
      <BlockList queryType="units" title="Jednotka" queryParams={queryParams} />
      {loadDynamicComponent('teamMemberSidebarComp', {
        loadingMainQuery,
      })}
    </Sidebar>
  );
}
