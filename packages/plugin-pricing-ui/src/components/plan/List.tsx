import React from 'react';
// saashq
import { __ } from '@saashq/ui/src/utils';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Table from '@saashq/ui/src/components/table';
// local
import Row from '../../containers/plan/Row';

type Props = {
  data: any[];
  count: number;
  loading: boolean;
};

export default function List(props: Props) {
  const { data, loading, count } = props;

  // Functions
  const renderRow = () =>
    data.map((item: any, index: number) => (
      <Row key={`pricing-row-${index}`} data={item} />
    ));

  const renderTable = () => (
    <Table>
      <thead>
        <tr>
          <th>{__('Název')}</th>
          <th>{__('Postavení')}</th>
          <th>{__('isPriority')}</th>
          <th>{__('Apply type')}</th>
          <th>{__('Vytvořil')}</th>
          <th>{__('Created at')}</th>
          <th>{__('Last updated at')}</th>
          <th>{__('Akce')}</th>
        </tr>
      </thead>
      <tbody>{renderRow()}</tbody>
    </Table>
  );

  return (
    <DataWithLoader
      loading={loading}
      count={count}
      data={renderTable()}
      emptyContent={
        <EmptyState
          image="/images/actions/5.svg"
          text="No pricing plans"
          size=""
        />
      }
    />
  );
}
