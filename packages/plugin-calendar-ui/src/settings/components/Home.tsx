import EmptyState from '@saashq/ui/src/components/EmptyState';
import HeaderDescription from '@saashq/ui/src/components/HeaderDescription';
import { __ } from '@saashq/ui/src/utils/core';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import React from 'react';
import Boards from '../containers/Boards';
import Groups from '../containers/Groups';

type Props = {
  boardId: string;
  queryParams: any;
  history: any;
};

class Home extends React.Component<Props, {}> {
  render() {
    const { boardId, queryParams, history } = this.props;

    const breadcrumb = [
      { title: __('Nastavení'), link: '/settings' },
      { title: __('Kalendář'), link: `/settings/calendars` },
    ];

    return (
      <Wrapper
        header={
          <Wrapper.Header title={__('Kalendář')} breadcrumb={breadcrumb} />
        }
        mainHead={
          <HeaderDescription
            icon="/images/actions/34.svg"
            title={__(`Skupina a Kalendář`)}
            description={`${__(
              `Spravujte své nástěnky a kalendáře tak, aby bylo snadné spravovat příchozí vyskakovací okna nebo požadavky, které lze přizpůsobit potřebám vašeho týmu`,
            )}.${__(
              `Přidejte nebo odstraňte nástěnky a kalendáře, abyste udrželi rozvoj podnikání na správné cestě a pod kontrolou`,
            )}`}
          />
        }
        leftSidebar={<Boards currentBoardId={boardId} />}
        content={
          boardId ? (
            <Groups
              boardId={boardId}
              queryParams={queryParams}
              history={history}
            />
          ) : (
            <EmptyState
              text={`Začněte na své desce`}
              image="/images/actions/16.svg"
            />
          )
        }
        hasBorder={true}
        transparent={true}
      />
    );
  }
}

export default Home;
