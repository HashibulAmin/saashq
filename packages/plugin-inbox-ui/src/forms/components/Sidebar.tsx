import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import React from 'react';
import BrandFilter from '@saashq/ui-leads/src/containers/filters/BrandFilter';
import StatusFilter from '@saashq/ui-leads/src/containers/filters/StatusFilter';
import TagFilter from '@saashq/ui-leads/src/containers/filters/TagFilter';
import { Counts } from '@saashq/ui/src/types';
import { isEnabled } from '@saashq/ui/src/utils/core';

type Props = {
  counts: {
    byTag: Counts;
    byBrand: Counts;
    byStatus: Counts;
  };
};

function Sidebar({ counts }: Props) {
  return (
    <Wrapper.Sidebar hasBorder>
      {isEnabled('tags') && <TagFilter counts={counts.byTag} />}
      <BrandFilter counts={counts.byBrand} />
      <StatusFilter counts={counts.byStatus} />
    </Wrapper.Sidebar>
  );
}

export default Sidebar;
