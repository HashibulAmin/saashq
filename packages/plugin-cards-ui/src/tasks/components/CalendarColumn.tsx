import {
  ColumnContainer,
  ColumnContentBody,
  ColumnFooter,
} from '@saashq/ui-cards/src/boards/components/Calendar';
import { AddNew } from '@saashq/ui-cards/src/boards/styles/stage';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Icon from '@saashq/ui/src/components/Icon';
import { IDateColumn } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils/core';
import React from 'react';
import options from '@saashq/ui-cards/src/tasks/options';
import { ITask } from '@saashq/ui-cards/src/tasks/types';
import Task from '@saashq/ui-cards/src/tasks/components/TaskItem';

type Props = {
  tasks: ITask[];
  totalCount: number;
  date: IDateColumn;
  onLoadMore: (skip: number) => void;
};

class TaskColumn extends React.Component<Props, {}> {
  onLoadMore = () => {
    const { tasks, onLoadMore } = this.props;
    onLoadMore(tasks.length);
  };

  renderContent() {
    const { tasks } = this.props;

    if (tasks.length === 0) {
      return <EmptyState icon="postcard" text="Žádné úkoly" />;
    }

    const contents = tasks.map((task: ITask, index: number) => (
      <Task options={options} key={index} item={task} portable={true} />
    ));

    return <ColumnContentBody>{contents}</ColumnContentBody>;
  }

  renderFooter() {
    const { tasks, totalCount } = this.props;

    if (tasks.length === totalCount || tasks.length > totalCount) {
      return null;
    }

    return (
      <ColumnFooter>
        <AddNew onClick={this.onLoadMore}>
          <Icon icon="refresh" /> {__('Load more')}
        </AddNew>
      </ColumnFooter>
    );
  }

  render() {
    return (
      <ColumnContainer>
        {this.renderContent()}
        {this.renderFooter()}
      </ColumnContainer>
    );
  }
}

export default TaskColumn;
