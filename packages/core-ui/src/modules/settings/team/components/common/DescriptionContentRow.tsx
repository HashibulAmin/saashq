import React from 'react';
import { __ } from '@saashq/ui/src';
import { FlexRow, DescriptionContent } from '../../styles';
export function DescriptionContentRow({ label, totalCount, teamMembersCount }) {
  return (
    <FlexRow>
      <DescriptionContent>
        {__(`Celkový ${label} počet`)}
        <h4>{totalCount || 0}</h4>
      </DescriptionContent>
      <DescriptionContent>
        {__('Celkový počet členů týmu')}
        <h4>{teamMembersCount || 0}</h4>
      </DescriptionContent>
    </FlexRow>
  );
}
