import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import React from 'react';
import StatusFilter from '../containers/filters/StatusFilter';
import { AutomationsCount } from '../types';
import { TagsSection } from '@saashq/ui-tags/src/components/TagsSection';
import { isEnabled } from '@saashq/ui/src/utils/core';

type Props = {
  counts: AutomationsCount;
  history: any;
  queryParams: any;
};

function Sidebar({ counts, history, queryParams }: Props) {
  return (
    <Wrapper.Sidebar hasBorder>
      <StatusFilter counts={counts.byStatus} />
      {isEnabled('tags') && (
        <TagsSection
          queryParams={queryParams}
          history={history}
          type="automations:automations"
        />
      )}
    </Wrapper.Sidebar>
  );
}

export default Sidebar;
