import {
  Box,
  CollapsibleContent,
  Content,
  IntegrationItem,
  IntegrationRow,
  IntegrationWrapper,
} from '@saashq/ui-inbox/src/settings/integrations/components/store/styles';
import { Title } from '@saashq/ui-settings/src/styles';
import { HeaderDescription } from '@saashq/ui/src/components';
import ErrorBoundary from '@saashq/ui/src/components/ErrorBoundary';
import { Wrapper } from '@saashq/ui/src/layout';
import { __ } from '@saashq/ui/src/utils';
import { RenderDynamicComponent } from '@saashq/ui/src/utils/core';
import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { Link } from 'react-router-dom';
import Sidebar from '../../Sidebar';

const breadcrumb = [
  { title: __('Nastavení'), link: '/settings' },
  {
    title: __('Konfigurace automatizace'),
    link: '/settings/automations/bots',
  },
  { title: __('Konfigurace robotů') },
];

const getBotsByPlatform = () => {
  let list: any[] = [];

  for (const plugin of (window as any).plugins || []) {
    if (!!plugin?.automationBots?.length) {
      list = [
        ...list,
        ...plugin.automationBots.map((item) => ({
          ...item,
          scope: plugin.scope,
        })),
      ];
    }
  }
  return list;
};

function Settings() {
  const [selectedPlatform, setPlatform] = useState(null as any);

  const header = (
    <HeaderDescription
      icon="/images/actions/25.svg"
      title="Konfigurace robotů"
      description=""
    />
  );

  const actionButtons = <></>;

  const renderBotsByPlatform = () => {
    const platforms = getBotsByPlatform();

    if (!platforms.length) {
      return <>Něco se pokazilo</>;
    }

    const handleSelectPlatform = (platform) => {
      setPlatform(selectedPlatform?.name !== platform.name ? platform : null);
    };

    return platforms.map((platform) => (
      <IntegrationItem
        key={platform.name}
        onClick={() => handleSelectPlatform(platform)}
      >
        <Box isInMessenger={false}>
          <img alt="logo" src={platform.logo} />

          <h5>{platform.label}</h5>
          <p>{__(platform.description)}</p>
        </Box>
        <Link to={platform.createUrl}>+ {__('Přidat')}</Link>
      </IntegrationItem>
    ));
  };

  const renderList = () => {
    if (!selectedPlatform) {
      return null;
    }

    return (
      <ErrorBoundary key={selectedPlatform.scope}>
        <RenderDynamicComponent
          scope={selectedPlatform.scope}
          component={selectedPlatform.list}
          injectedProps={{}}
        />
      </ErrorBoundary>
    );
  };

  const content = (
    <Content>
      <IntegrationWrapper>
        <IntegrationRow>{renderBotsByPlatform()}</IntegrationRow>

        <Collapse in={!!selectedPlatform} unmountOnExit={true}>
          <CollapsibleContent>{renderList()}</CollapsibleContent>
        </Collapse>
      </IntegrationWrapper>
    </Content>
  );

  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={__('Konfigurace robotů')}
          breadcrumb={breadcrumb}
        />
      }
      mainHead={header}
      actionBar={
        <Wrapper.ActionBar
          left={<Title capitalize={true}>{__('Konfigurace robotů')}</Title>}
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

export default Settings;
