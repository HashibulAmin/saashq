import React from 'react';
// saashq
import { __ } from '@saashq/ui/src/utils/core';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import Table from '@saashq/ui/src/components/table';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import Pagination from '@saashq/ui/src/components/pagination/Pagination';
import EmptyState from '@saashq/ui/src/components/EmptyState';
// local
import Row from './Row';
import ActionBarContent from '../containers/ActionBarContent';
import { SUBMENU } from '../../constants';

type Props = {
  loading: boolean;
  data: any[];
};

const List = (props: Props) => {
  const { loading = false, data = [] } = props;

  const renderRow = () =>
    data.map((item: any, index: number) => <Row key={index} data={item} />);

  const content = (
    <Table>
      <thead>
        <tr>
          <th>{__('Větev')}</th>
          <th>{__('Oddělení')}</th>
          <th>{__('Content Type')}</th>
          <th>{__('Vytvořeno v')}</th>
          <th>{__('Akce')}</th>
        </tr>
      </thead>
      <tbody>{renderRow()}</tbody>
    </Table>
  );

  return (
    <Wrapper
      header={<Wrapper.Header title={__('Transactions')} submenu={SUBMENU} />}
      footer={<Pagination count={data.length || 0} />}
      actionBar={<Wrapper.ActionBar right={<ActionBarContent />} />}
      content={
        <DataWithLoader
          data={content}
          loading={loading}
          count={data.length}
          emptyContent={
            <EmptyState
              image="/images/actions/5.svg"
              text="No transactions"
              size=""
            />
          }
        />
      }
    />
  );
};

export default List;
