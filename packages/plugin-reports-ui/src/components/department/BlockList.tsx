import React from 'react';

import Box from '@saashq/ui/src/components/Box';
import { SidebarList } from '@saashq/ui/src/layout/styles';
import { __ } from '@saashq/ui/src/utils/core';

type Props = {
  allDatas: any[];
  title: string;
  renderItems: () => React.ReactNode;
};

export default function BlockList(props: Props) {
  const { allDatas, title, renderItems } = props;

  return (
    <Box
      title={__(title)}
      name={`show${title}`}
      isOpen={true}
      collapsible={allDatas.length > 6}
    >
      <SidebarList noTextColor noBackground className="no-link">
        {renderItems}
      </SidebarList>
    </Box>
  );
}
