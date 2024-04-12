import { IUser } from '@saashq/ui/src/auth/types';
import Button from '@saashq/ui/src/components/Button';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import { __ } from '@saashq/ui/src/utils/core';
import Sidebar from '../containers/leftSidebar/Sidebar';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  queryParams?: any;
  currentUser: IUser;
};

function Empty({ queryParams, currentUser }: Props) {
  const menuInbox = [{ title: 'Týmová schránka', link: '/inbox/index' }];

  const suggestContent = (
    <>
      <Link to="/settings/channels">
        <Button btnStyle="simple" icon="sitemap-1">
          {__('Správa Kanálů')}
        </Button>
      </Link>
      <Link to="/tutorial#usingStage?open=teamInbox">
        <Button icon="laptop-1">{__('Podívejte se na Tutoriál')}</Button>
      </Link>
    </>
  );

  const content = (
    <EmptyState
      text="Jejda! Nejsou zde žádné zprávy, ale vždy můžete začít"
      size="full"
      image="/images/actions/12.svg"
      extra={suggestContent}
    />
  );

  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={__('Team Inbox')}
          queryParams={queryParams}
          submenu={menuInbox}
        />
      }
      content={content}
      leftSidebar={<Sidebar queryParams={queryParams} />}
    />
  );
}

export default Empty;
