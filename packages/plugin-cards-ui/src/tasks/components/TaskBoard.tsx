import Board from '@saashq/ui-cards/src/boards/containers/Board';
import MainActionBar from '@saashq/ui-cards/src/boards/containers/MainActionBar';
import {
  BoardContainer,
  BoardContent
} from '@saashq/ui-cards/src/boards/styles/common';
import { __ } from '@saashq/ui/src/utils/core';
import Header from '@saashq/ui/src/layout/components/Header';
import React from 'react';
import options from '@saashq/ui-cards/src/tasks/options';
import TaskMainActionBar from './TaskMainActionBar';

type Props = {
  queryParams: any;
  viewType: string;
};
class TaskBoard extends React.Component<Props> {
  renderContent() {
    const { queryParams, viewType } = this.props;

    return (
      <Board viewType={viewType} queryParams={queryParams} options={options} />
    );
  }

  renderActionBar() {
    return <MainActionBar type="task" component={TaskMainActionBar} />;
  }

  render() {
    const breadcrumb = [{ title: __('Task') }];

    return (
      <BoardContainer>
        <Header title={__('Task')} breadcrumb={breadcrumb} />
        <BoardContent transparent={true}>
          {this.renderActionBar()}
          {this.renderContent()}
        </BoardContent>
      </BoardContainer>
    );
  }
}

export default TaskBoard;
