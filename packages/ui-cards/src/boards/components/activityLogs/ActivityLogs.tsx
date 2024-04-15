import ActivityLogsByActionRow from './ActivityLogsByActionRow';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import { IActivityLog } from '@saashq/ui-log/src/activityLogs/types';
import { IRouterProps } from '@saashq/ui/src/types';
import Pagination from '@saashq/ui/src/components/pagination/Pagination';
import React from 'react';
import Sidebar from './Sidebar';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { withRouter } from 'react-router-dom';

type Props = {
  queryParams: any;
  isLoading: boolean;
  errorMessage: string;
} & commonProps;

type commonProps = {
  activityLogsByAction: IActivityLog[];
  count: number;
  refetchQueries: any;
} & IRouterProps;

class ActivityLogs extends React.Component<Props> {
  renderObjects() {
    const { activityLogsByAction } = this.props;
    const rows: JSX.Element[] = [];

    if (activityLogsByAction.length === 0) {
      return (
        <EmptyState
          image="/images/actions/26.svg"
          size="large"
          text="Momentálně neprobíhá žádná aktivita!"
        />
      );
    }

    for (const activityLog of activityLogsByAction) {
      rows.push(
        <ActivityLogsByActionRow
          key={activityLog._id}
          activityLog={activityLog}
        />,
      );
    }

    return rows;
  }

  render() {
    const { count, queryParams, isLoading } = this.props;

    return (
      <Wrapper
        footer={<Pagination count={count} />}
        leftSidebar={<Sidebar queryParams={queryParams} />}
        content={
          <DataWithLoader loading={isLoading} data={this.renderObjects()} />
        }
      />
    );
  }
}

export default withRouter(ActivityLogs);
