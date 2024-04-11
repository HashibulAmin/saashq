import { ContentBox, MainContent } from '@saashq/ui/src/layout/styles';
import DmWorkArea, {
  resetDmWithQueryCache,
} from '../../containers/conversationDetail/DmWorkArea';
import {
  getPluginConfig,
  loadDynamicComponent,
} from '@saashq/ui/src/utils/core';

import ConversationDetailLoader from './ConversationDetailLoader';
import EmptySidebar from '@saashq/ui/src/layout/components/Sidebar';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import { IConversation } from '@saashq/ui-inbox/src/inbox/types';
import { IField } from '@saashq/ui/src/types';
import React from 'react';
import Sidebar from '../../containers/conversationDetail/Sidebar';
import SidebarLoader from './sidebar/SidebarLoader';
import WorkArea from './workarea/WorkArea';

type Props = {
  currentConversation: IConversation;
  loading: boolean;
  conversationFields: IField[];
  refetchDetail: () => void;
};

export default class ConversationDetail extends React.Component<Props> {
  renderSidebar() {
    const { loading, currentConversation, conversationFields } = this.props;

    if (loading) {
      return (
        <EmptySidebar full={true}>
          <SidebarLoader />
        </EmptySidebar>
      );
    }

    if (currentConversation) {
      return (
        <Sidebar
          conversation={currentConversation}
          conversationFields={conversationFields}
        />
      );
    }

    return (
      <EmptySidebar full={true}>
        <EmptyState
          text="Zákazník nenalezen"
          size="full"
          image="/images/actions/18.svg"
        />
      </EmptySidebar>
    );
  }

  componentWillReceiveProps(nextProps: Readonly<Props>) {
    const current = this.props.currentConversation;
    const ncurrent = nextProps.currentConversation;

    if (
      current &&
      ncurrent &&
      current.integration.kind !== ncurrent.integration.kind
    ) {
      resetDmWithQueryCache();
    }
  }

  renderContent() {
    const { loading, currentConversation } = this.props;

    if (loading) {
      return (
        <ContentBox>
          <ConversationDetailLoader />
        </ContentBox>
      );
    }

    if (currentConversation) {
      const { integration } = currentConversation;
      const kind = integration.kind.split('-')[0];

      let content;

      if (
        !['messenger', 'lead', 'booking', 'webhook', 'callpro'].includes(
          currentConversation.integration.kind,
        )
      ) {
        const integrations = getPluginConfig({
          pluginName: kind,
          configName: 'inboxIntegrations',
        });

        if (integrations) {
          const entry = integrations.find((i) => i.kind === integration.kind);
          const key = 'inboxConversationDetail';

          if (entry && entry.components && entry.components.includes(key)) {
            content = loadDynamicComponent(
              key,
              {
                ...this.props,
                conversation: currentConversation,
              },
              false,
              kind,
            );
          }
        }

        if (content) {
          if (currentConversation.integration.kind === 'imap') {
            return <DmWorkArea content={content} {...this.props} />;
          }

          return (
            <WorkArea
              currentConversation={currentConversation}
              content={content}
            />
          );
        }
      }

      const dmConfig = getPluginConfig({
        pluginName: kind,
        configName: 'inboxDirectMessage',
      });

      if (dmConfig) {
        return <DmWorkArea {...this.props} dmConfig={dmConfig} />;
      }

      return <DmWorkArea {...this.props} />;
    }

    return (
      <EmptyState
        text="Konverzace nenalezena"
        size="full"
        image="/images/actions/14.svg"
      />
    );
  }

  render() {
    return (
      <React.Fragment>
        <MainContent>{this.renderContent()}</MainContent>
        {this.renderSidebar()}
      </React.Fragment>
    );
  }
}
