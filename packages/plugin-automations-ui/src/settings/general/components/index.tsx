import { Title } from '@saashq/ui-settings/src/styles';
import {
  Button,
  EmptyContent,
  EmptyState,
  HeaderDescription,
} from '@saashq/ui/src/components';
import { Wrapper } from '@saashq/ui/src/layout';
import { __ } from '@saashq/ui/src/utils';
import React from 'react';
import Sidebar from '../../Sidebar';

const breadcrumb = [
  { title: __('Nastavení'), link: '/settings' },
  {
    title: __('Konfigurace automatizace'),
    link: '/settings/automations/general',
  },
  { title: __('Obecná konfigurace') },
];

function GeneralSettings() {
  const header = (
    <HeaderDescription
      icon="/images/actions/25.svg"
      title="Konfigurace automatizace"
      description=""
    />
  );

  const actionButtons = <></>;

  const content = (
    <>
      <EmptyState text="Již brzy" image="/images/actions/20.svg" />
    </>
  );

  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={__('Obecná Konfigurace')}
          breadcrumb={breadcrumb}
        />
      }
      mainHead={header}
      actionBar={
        <Wrapper.ActionBar
          left={
            <Title capitalize={true}>{__('Konfigurace automatizace')}</Title>
          }
          right={actionButtons}
          wideSpacing={true}
        />
      }
      content={content}
      leftSidebar={<Sidebar />}
      transparent={true}
      hasBorder={true}
    />
  );
}

export default GeneralSettings;
