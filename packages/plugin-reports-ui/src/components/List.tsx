import React, { useState } from 'react';
import { Title } from '@saashq/ui-settings/src/styles';
import { FormControl } from '@saashq/ui/src/components';
import withTableWrapper from '@saashq/ui/src/components/table/withTableWrapper';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@saashq/ui/src/types';
import Button from '@saashq/ui/src/components/Button';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import Table from '@saashq/ui/src/components/table';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { BarItems } from '@saashq/ui/src/layout/styles';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { __, router } from '@saashq/ui/src/utils';
import { IReport } from '../types';
import Row from './Row';
import { isEnabled } from '@saashq/ui/src/utils/core';
import TaggerPopover from '@saashq/ui-tags/src/components/TaggerPopover';
import { TAG_TYPES } from '@saashq/ui-tags/src/constants';
import SideBar from '../containers/SideBar';
type Props = {
  reports: IReport[];
  renderButton?: (props: IButtonMutateProps) => JSX.Element;
  removeReports: (reportIds: string[], callback: any) => void;
  editReport?: (report: IReport) => void;
  loading: boolean;

  queryParams: any;
};

type FinalProps = Props & IRouterProps;

function List(props: FinalProps) {
  const { reports, loading, history, queryParams, removeReports } = props;
  const [searchValue, setSearchvalue] = useState(queryParams.searchValue || '');
  const [chosenReportIds, setChosenReportIds] = useState<any>([]);

  const [timer, setTimer] = useState<NodeJS.Timer>(undefined);

  // let timer: NodeJS.Timer;

  const search = (e) => {
    if (timer) {
      clearTimeout(timer);
      setTimer(undefined);
    }

    const value = e.target.value;
    setSearchvalue(value);

    setTimer(
      setTimeout(() => {
        router.removeParams(history, 'page');
        router.setParams(history, { searchValue: value });
      }, 500),
    );
  };

  const moveCursorAtTheEnd = (e) => {
    const tmpValue = e.target.value;
    e.target.value = '';
    e.target.value = tmpValue;
  };

  const title = <Title capitalize={true}>{__('Reports')}</Title>;

  const actionBarRight = (
    <BarItems>
      <FormControl
        type="text"
        placeholder={__('Search a report')}
        onChange={search}
        value={searchValue}
        autoFocus={true}
        onFocus={moveCursorAtTheEnd}
      />

      <Button
        btnStyle="success"
        size="small"
        icon="plus-circle"
        onClick={() => history.push('/reports/details/create-report')}
      >
        {__('Create a report')}
      </Button>
    </BarItems>
  );

  const toggleReport = (reportId: string, isChecked?: boolean) => {
    if (isChecked) {
      setChosenReportIds([...chosenReportIds, reportId]);
    } else {
      setChosenReportIds(chosenReportIds.filter((id) => id !== reportId));
    }
  };

  const updatedProps = {
    ...props,
    toggleReport,
  };
  const content = (
    <Table>
      <thead>
        <tr>
          <th>{__('')}</th>
          <th>{__('Název')}</th>
          <th>{__('Charts')}</th>
          <th>{__('Last updated by')}</th>
          <th>{__('Vytvořil')}</th>
          <th>{__('Last updated at')}</th>
          <th>{__('Vytvořeno v')}</th>
          <th>{__('Tags')}</th>
          <th>{__('Akce')}</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => {
          return (
            <Row
              key={report._id}
              report={report}
              {...updatedProps}
              isChecked={chosenReportIds.includes(report._id) || false}
            />
          );
        })}
      </tbody>
    </Table>
  );

  const afterTag = () => {
    setChosenReportIds([]);
  };

  const LeftSidebar = <SideBar {...props} />;

  const breadcrumb = [
    { title: __('Nastavení'), link: '/settings' },
    { title: __('Reports'), link: '/reports' },
  ];

  let actionBarLeft: React.ReactNode;

  if (chosenReportIds.length) {
    const tagButton = (
      <Button btnStyle="simple" size="small" icon="tag-alt">
        Tag
      </Button>
    );

    actionBarLeft = (
      <BarItems>
        <Button
          btnStyle="danger"
          size="small"
          icon="cancel-1"
          onClick={() =>
            removeReports(chosenReportIds, () => setChosenReportIds([]))
          }
        >
          Remove
        </Button>

        {isEnabled('tags') && (
          <TaggerPopover
            type={TAG_TYPES.REPORT}
            successCallback={afterTag}
            targets={reports.filter((r) => chosenReportIds.includes(r._id))}
            trigger={tagButton}
            refetchQueries={['reportsCountByTags']}
          />
        )}
      </BarItems>
    );
  }

  const actionBar = (
    <Wrapper.ActionBar
      right={actionBarRight}
      left={actionBarLeft}
      wideSpacing
    />
  );

  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={__('Reports')}
          breadcrumb={breadcrumb}
          queryParams={queryParams}
        />
      }
      actionBar={actionBar}
      content={
        <DataWithLoader
          data={content}
          loading={loading}
          count={reports.length}
          emptyText={__('There are no reports')}
          emptyImage="/images/actions/8.svg"
        />
      }
      transparent={true}
      leftSidebar={LeftSidebar}
      hasBorder
    />
  );
}

export default withTableWrapper('Reports', withRouter<IRouterProps>(List));
