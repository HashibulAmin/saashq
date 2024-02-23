import ActivityInputs from '@saashq/ui-log/src/activityLogs/components/ActivityInputs';
import ActivityLogs from '@saashq/ui-log/src/activityLogs/containers/ActivityLogs';
import { ContainerBox } from '../../../style';
import { IAsset } from '../../../common/types';
import { IUser } from '@saashq/ui/src/auth/types';
import LeftSidebar from './LeftSidebar';
import React from 'react';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { __ } from '@saashq/ui/src/utils';
import { isEnabled } from '@saashq/ui/src/utils/core';

type Props = {
  asset: IAsset;
  currentUser: IUser;
  history: any;
  refetchDetail: () => void;
};

function Details({ asset, currentUser, history, refetchDetail }: Props) {
  const title = asset.name || 'Unknown';

  const breadcrumb = [
    { title: __('Settings'), link: '/settings' },
    { title: __('Assets'), link: '/settings/assets' },
    { title }
  ];

  const content = (
    <ContainerBox marginY={20} marginX={20} column={true}>
      <ActivityInputs
        contentTypeId={asset._id}
        contentType="assets:asset"
        showEmail={false}
      />
      {isEnabled('logs') && (
        <ActivityLogs
          target={asset.name || ''}
          contentId={asset._id}
          contentType="assets:asset"
          extraTabs={[]}
        />
      )}
    </ContainerBox>
  );

  return (
    <Wrapper
      header={<Wrapper.Header title={title} breadcrumb={breadcrumb} />}
      leftSidebar={
        <LeftSidebar
          asset={asset}
          refetchDetail={refetchDetail}
          history={history}
        />
      }
      content={content}
      transparent={true}
      hasBorder={true}
    />
  );
}

export default Details;
