import { IApp, IAppParams } from '../types';

import AppForm from './AppForm';
import AppRow from './AppRow';
import Button from 'modules/common/components/Button';
import DataWithLoader from 'modules/common/components/DataWithLoader';
import EmptyState from 'modules/common/components/EmptyState';
import ModalTrigger from 'modules/common/components/ModalTrigger';
import Pagination from 'modules/common/components/pagination/Pagination';
import React from 'react';
import Table from 'modules/common/components/table';
import { Title } from '@saashq/ui-settings/src/styles';
import Wrapper from 'modules/layout/components/Wrapper';
import { __ } from 'modules/common/utils';
import styled from 'styled-components';

// due to token column containing too long value
const FixedTable = styled(Table)`
  table-layout: fixed;
  word-break: break-word;
`;

const breadcrumb = [
  { title: 'Settings', link: '/settings' },
  { title: __('Apps') },
];

type Props = {
  apps: IApp[];
  isLoading: boolean;
  count: number;
  errorMessage: string;
  userGroups: any[];
  addApp: (doc: IAppParams) => void;
  editApp: (_id: string, doc: IAppParams) => void;
  removeApp: (_id: string) => void;
};

export default class AppList extends React.Component<Props> {
  renderObjects() {
    const { apps, editApp, removeApp, userGroups } = this.props;
    const rows: JSX.Element[] = [];

    if (!apps) {
      return rows;
    }

    for (const app of apps) {
      rows.push(
        <AppRow
          key={app._id}
          app={app}
          removeApp={removeApp}
          editApp={editApp}
          userGroups={userGroups}
        />,
      );
    }

    return rows;
  }

  renderContent() {
    return (
      <FixedTable whiteSpace="wrap" bordered={true} condensed={true}>
        <thead>
          <tr>
            <th>{__('Date')}</th>
            <th>{__('Název')}</th>
            <th>{__('User group')}</th>
            <th>{__('Token')}</th>
            <th>{__('Token expire date')}</th>
            <th>{__('Akce')}</th>
          </tr>
        </thead>
        <tbody>{this.renderObjects()}</tbody>
      </FixedTable>
    );
  }

  render() {
    const { isLoading, count, errorMessage, userGroups, addApp, editApp } =
      this.props;

    if (errorMessage.indexOf('Permission required') !== -1) {
      return (
        <EmptyState
          text={__('Přístup odepřen')}
          image="/images/actions/21.svg"
        />
      );
    }

    const trigger = (
      <Button
        id={'new-app-btn'}
        btnStyle="success"
        block={true}
        icon="plus-circle"
      >
        Přidat novou aplikaci
      </Button>
    );

    const content = (props) => (
      <AppForm
        {...props}
        extended={true}
        userGroups={userGroups}
        addApp={addApp}
        editApp={editApp}
      />
    );

    const righActionBar = (
      <ModalTrigger
        size="lg"
        title="Nová aplikace"
        autoOpenKey="showAppAddModal"
        trigger={trigger}
        content={content}
      />
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header title={__('Aplikace')} breadcrumb={breadcrumb} />
        }
        footer={<Pagination count={count} />}
        actionBar={
          <Wrapper.ActionBar
            left={<Title>{__('Aplikace')}</Title>}
            right={righActionBar}
          />
        }
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={isLoading}
            count={count}
            emptyText={__('Nejsou žádné aplikace')}
            emptyImage="/images/actions/21.svg"
          />
        }
        hasBorder={true}
      />
    );
  }
}
