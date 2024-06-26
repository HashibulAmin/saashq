import Box from '@saashq/ui/src/components/Box';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import { IRouterProps, Counts } from '@saashq/ui/src/types';
import { __, router } from 'coreui/utils';
import {
  FieldStyle,
  SidebarCounter,
  SidebarList,
} from '@saashq/ui/src/layout/styles';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { statusFilters } from '../../constants';

interface IProps extends IRouterProps {
  counts: Counts;
  emptyText?: string;
}

function StatusFilter({ history, counts, emptyText }: IProps) {
  const data = (
    <SidebarList>
      {statusFilters.map((status, index) => {
        const onClick = () => {
          router.setParams(history, { status: status.key });
          router.removeParams(history, 'page');
        };

        return (
          <li key={index}>
            <a
              href="#filter"
              tabIndex={0}
              className={
                router.getParam(history, 'status') === status.key
                  ? 'active'
                  : ''
              }
              onClick={onClick}
            >
              <FieldStyle>{__(status.value)}</FieldStyle>
              <SidebarCounter>{counts[status.key]}</SidebarCounter>
            </a>
          </li>
        );
      })}
    </SidebarList>
  );

  return (
    <Box
      title={__('Filtrujte podle stavu')}
      collapsible={statusFilters.length > 5}
      name="showFilterByStatus"
    >
      <DataWithLoader
        data={data}
        loading={false}
        count={statusFilters.length}
        emptyText={emptyText ? emptyText : 'Načítání'}
        emptyIcon="leaf"
        size="small"
        objective={true}
      />
    </Box>
  );
}

export default withRouter<IProps, any>(StatusFilter);
