import React from 'react';
import { __ } from '@saashq/ui/src/utils';
import { colors } from '@saashq/ui/src/styles';
import { Status } from '../../styles/item';

function ItemArchivedStatus({
  status,
  skipContainer,
}: {
  status: string;
  skipContainer: boolean;
}) {
  if (status !== 'archived') {
    return null;
  }

  const renderStatus = () => (
    <span style={{ backgroundColor: colors.colorCoreYellow, float: 'right' }}>
      {__('Archivováno')}
    </span>
  );

  if (!skipContainer) {
    return <Status>{renderStatus()}</Status>;
  }

  return renderStatus();
}

export default ItemArchivedStatus;
