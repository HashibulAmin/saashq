import Box from '@saashq/ui/src/components/Box';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import {
  FieldStyle,
  SidebarCounter,
  SidebarList
} from '@saashq/ui/src/layout/styles';
import { Counts, IRouterProps } from '@saashq/ui/src/types';
import { __, router } from '@saashq/ui/src/utils';
import React from 'react';
import { withRouter } from 'react-router-dom';

import { PAYMENT_KINDS } from '../../components/constants';

interface IProps extends IRouterProps {
  counts: Counts;
  emptyText?: string;
}

function KindFilter({ history, counts, emptyText }: IProps) {
  const data = (
    <SidebarList>
      {PAYMENT_KINDS.ALL.map((kind, index) => {
        const onClick = () => {
          router.setParams(history, { kind });
          router.removeParams(history, 'page');
        };

        return (
          <li key={index}>
            <a
              href="#filter"
              tabIndex={0}
              className={
                router.getParam(history, 'kind') === kind ? 'active' : ''
              }
              onClick={onClick}
            >
              <FieldStyle>{__(kind)}</FieldStyle>
              <SidebarCounter>{counts[kind]}</SidebarCounter>
            </a>
          </li>
        );
      })}
    </SidebarList>
  );

  return (
    <Box
      title={__('Filter by kind')}
      collapsible={PAYMENT_KINDS.ALL.length > 5}
      name="showFilterByKind"
    >
      <DataWithLoader
        data={data}
        loading={false}
        count={PAYMENT_KINDS.ALL.length}
        emptyText={emptyText ? emptyText : 'Loading'}
        emptyIcon="leaf"
        size="small"
        objective={true}
      />
    </Box>
  );
}

export default withRouter<IProps>(KindFilter);
