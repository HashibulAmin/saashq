import Button from '@saashq/ui/src/components/Button';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import HeaderDescription from '@saashq/ui/src/components/HeaderDescription';
import Table from '@saashq/ui/src/components/table';
import { Title } from '@saashq/ui/src/styles/main';
import { __ } from '@saashq/ui/src/utils/core';
import { router as routerUtils } from '@saashq/ui/src/utils';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import React from 'react';
import { Link } from 'react-router-dom';
import { ICalendar, IPage } from '../../types';
import PageRow from './PageRow';
import Sidebar from './Sidebar';

type Props = {
  pages: IPage[];
  calendars: ICalendar[];
  history: any;
  queryParams: { accountId?: string };
  remove: (pageId: string) => void;
};

class Base extends React.Component<Props> {
  componentDidMount() {
    const { calendars, queryParams, history } = this.props;

    if (calendars.length > 0 && !queryParams.accountId) {
      routerUtils.setParams(history, { accountId: calendars[0].accountId });
    }
  }

  renderButtons() {
    if (this.props.calendars.length === 0) {
      return;
    }

    return (
      <Button btnStyle="success" icon="plus-circle">
        <Link
          to={`/settings/schedule/create/${this.props.queryParams.accountId}`}
        >
          Přidat novou stránku
        </Link>
      </Button>
    );
  }

  render() {
    const { pages, calendars, queryParams, remove } = this.props;
    const { accountId } = queryParams;

    const breadcrumb = [
      { title: __('Nastavení'), link: '/settings' },
      { title: __('Kalendář'), link: `/settings/calendars` },
      { title: __('Plán'), link: '' },
    ];

    let calendarName = '';

    if (accountId) {
      calendarName = (
        calendars.find((c) => c.accountId === accountId) || ({} as ICalendar)
      ).name;
    }

    const content =
      accountId && calendars.length > 0 ? (
        <div>
          <Wrapper.ActionBar
            left={<Title>{calendarName}</Title>}
            right={this.renderButtons()}
          />

          <Table>
            <thead>
              <tr>
                <th>{__('Vaše Stránky Plánování')}</th>
                <th> {__('Akce')}</th>
              </tr>
            </thead>

            <tbody>
              {pages.map((page) => (
                <PageRow
                  key={page._id}
                  page={page}
                  accountId={accountId}
                  remove={remove}
                />
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <EmptyState
          text={`Začněte na své desce`}
          image="/images/actions/16.svg"
        />
      );

    return (
      <Wrapper
        header={<Wrapper.Header title={__('Plán')} breadcrumb={breadcrumb} />}
        leftSidebar={
          calendars.length > 1 && (
            <Sidebar accountId={accountId} calendars={calendars} />
          )
        }
        mainHead={
          <HeaderDescription
            icon="/images/actions/34.svg"
            title={`Kalendář a Rozvrh`}
            description={`${__(
              'Spravujte své nástěnky a kalendáře tak, aby bylo snadné spravovat příchozí vyskakovací okna nebo požadavky, které lze přizpůsobit potřebám vašeho týmu',
            )}.${__(
              `Přidejte nebo odstraňte nástěnky a kalendáře, abyste udrželi rozvoj podnikání na správné cestě a pod kontrolou`,
            )}`}
          />
        }
        content={content}
      />
    );
  }
}

export default Base;
