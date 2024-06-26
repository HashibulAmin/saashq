import React from 'react';
// saashq
import { __ } from '@saashq/ui/src/utils/core';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import Button from '@saashq/ui/src/components/Button';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import FormControl from '@saashq/ui/src/components/form/Control';
import Pagination from '@saashq/ui/src/components/pagination/Pagination';
import Table from '@saashq/ui/src/components/table';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import { BarItems } from '@saashq/ui/src/layout/styles';
// local
import Row from './Row';
import Sidebar from './Sidebar';
import Form from '../containers/Form';
import { SUBMENU } from '../../constants';
import { ISafeRemainder } from '../types';

type Props = {
  remainders: ISafeRemainder[];
  totalCount: number;
  loading: boolean;
  searchValue: string;
  handleSearch: (event: any) => void;
  removeItem: (remainder: ISafeRemainder) => void;
};

export default function ListComponent(props: Props) {
  const {
    remainders = [],
    totalCount = 0,
    loading = false,
    searchValue,
    handleSearch,
    removeItem,
  } = props;

  const renderRow = () => {
    return remainders.map((item: ISafeRemainder) => (
      <Row key={item._id} remainder={item} removeItem={removeItem} />
    ));
  };

  const modalContent = (modalProps: any) => <Form {...modalProps} />;

  const trigger = (
    <Button btnStyle="success" size="small" icon="plus-circle">
      Add safe remainder
    </Button>
  );

  let actionBarRight = (
    <BarItems>
      <FormControl
        type="text"
        placeholder={__('Zadejte a vyhledejte')}
        onChange={handleSearch}
        defaultValue={searchValue}
        autoFocus={true}
      />
      <ModalTrigger
        title="Add Safe Remainder"
        trigger={trigger}
        autoOpenKey="showAddSafeRemainderModal"
        content={modalContent}
        size="lg"
      />
    </BarItems>
  );

  let content = (
    <Table>
      <thead>
        <tr>
          <th>{__('Date')}</th>
          <th>{__('Větev')}</th>
          <th>{__('Oddělení')}</th>
          <th>{__('Product Category')}</th>
          <th>{__('Popis')}</th>
          <th>{__('Postavení')}</th>
          <th>{__('ModifiedAt')}</th>
          <th>{__('ModifiedBy')}</th>
          <th>{__('Akce')}</th>
        </tr>
      </thead>
      <tbody>{renderRow()}</tbody>
    </Table>
  );

  return (
    <Wrapper
      header={
        <Wrapper.Header title={__('Safe Remainders')} submenu={SUBMENU} />
      }
      actionBar={<Wrapper.ActionBar right={actionBarRight} />}
      leftSidebar={<Sidebar />}
      footer={<Pagination count={totalCount} />}
      content={
        <DataWithLoader
          data={content}
          loading={loading}
          count={totalCount}
          emptyContent={
            <EmptyState
              image="/images/actions/5.svg"
              text="No safe remainders"
              size=""
            />
          }
        />
      }
    />
  );
}
