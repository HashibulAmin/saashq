import React from 'react';
import Box from '@saashq/ui/src/components/Box';
import Icon from '@saashq/ui/src/components/Icon';
import { FieldStyle, SidebarList } from '@saashq/ui/src/layout/styles';
import { IRouterProps } from '@saashq/ui/src/types';
import { router, __ } from '@saashq/ui/src/utils';
import { assetStatusChoises } from '../../../common/utils';

type Props = {
  queryParams: any;
  history: any;
};

function StatusFilter({ queryParams, history }: Props) {
  React.useEffect(() => {
    if (queryParams.status === undefined || queryParams.status === null) {
      router.removeParams(history, 'assetCategoryId');
    }
  }, [queryParams.status]);

  const onClick = (value) => {
    router.setParams(history, { status: value });
    router.removeParams(history, 'assetId');
    router.removeParams(history, 'assetCategoryId');
  };

  return (
    <Box
      title={__('Filtrujte kategorii podle stavu')}
      name="showFilterByType"
      isOpen={queryParams.status}
    >
      <SidebarList>
        {assetStatusChoises().map(
          ({ value, label }: { value: string; label: string }) => {
            return (
              <li key={Math.random()}>
                <a
                  href="#filter"
                  tabIndex={0}
                  className={queryParams.status === value ? 'active' : ''}
                  onClick={onClick.bind(this, value)}
                >
                  <FieldStyle>{label}</FieldStyle>
                </a>
              </li>
            );
          },
        )}
      </SidebarList>
    </Box>
  );
}

export default StatusFilter;
