import EngageSettingsContent from '../containers/EngageSettingsContent';
import Header from '@saashq/ui-settings/src/general/components/Header';
import React from 'react';
import { Title } from '@saashq/ui-settings/src/styles';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { __ } from '@saashq/ui/src/utils';

function EngageConfigs() {
  const breadcrumb = [
    { title: __('Settings'), link: '/settings' },
    { title: __('Campaign config') }
  ];

  return (
    <Wrapper
      header={
        <Wrapper.Header title={__('Campaign config')} breadcrumb={breadcrumb} />
      }
      mainHead={
        <Header
          title="Campaign config"
          description="Set up your campaign config."
        />
      }
      actionBar={
        <Wrapper.ActionBar left={<Title>{__('Campaign config')}</Title>} />
      }
      content={<EngageSettingsContent />}
      transparent={true}
      hasBorder={true}
    />
  );
}

export default EngageConfigs;
