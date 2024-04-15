import { BarItems } from '@saashq/ui/src/layout/styles';
import Button from '@saashq/ui/src/components/Button';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import { EMPTY_CONTENT_BOOKINGS } from '../constants';
import EmptyContent from '@saashq/ui/src/components/empty/EmptyContent';
import FormControl from '@saashq/ui/src/components/form/Control';
import { IBookingIntegration } from '../types';
import { IntegrationsCount } from '@saashq/ui-leads/src/types';
import { Link } from 'react-router-dom';
import Pagination from '@saashq/ui/src/components/pagination/Pagination';
import React from 'react';
import Row from './BookingRow';
import Sidebar from './Sidebar';
import { TAG_TYPES } from '@saashq/ui-tags/src/constants';
import Table from '@saashq/ui/src/components/table';
import TaggerPopover from '@saashq/ui-tags/src/components/TaggerPopover';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { __ } from 'coreui/utils';
import { isEnabled } from '@saashq/ui/src/utils/core';

type Props = {
  queryParams: any;
  isAllSelected: boolean;
  bulk: IBookingIntegration[];
  emptyBulk: () => void;
  loading: boolean;
  refetch: () => void;
  toggleBulk: (target: IBookingIntegration, toAdd: boolean) => void;
  toggleAll: (bulk: IBookingIntegration[], name: string) => void;
  history: any;
  remove: (bookingId: string) => void;
  totalCount: number;
  counts: IntegrationsCount;
  archive: (_id: string, status: boolean) => IBookingIntegration;
  integrations: IBookingIntegration[];
};

function BookingList(props: Props) {
  const {
    isAllSelected,
    bulk,
    toggleBulk,
    toggleAll,
    queryParams,
    remove,
    refetch,
    emptyBulk,
    totalCount,
    counts,
    archive,
    integrations,
  } = props;

  const onChange = () => {
    toggleAll(integrations, 'integrations');
  };

  const renderRow = () => {
    return integrations.map((integration) => (
      <Row
        key={integration._id}
        integration={integration}
        isChecked={bulk.includes(integration)}
        toggleBulk={toggleBulk}
        remove={remove}
        refetch={refetch}
        archive={archive}
      />
    ));
  };

  let actionBarLeft: React.ReactNode;

  if (bulk.length > 0) {
    const tagButton = (
      <Button btnStyle="simple" size="small" icon="tag-alt">
        Tag
      </Button>
    );

    actionBarLeft = (
      <BarItems>
        {isEnabled('tags') && (
          <TaggerPopover
            type={TAG_TYPES.INTEGRATION}
            successCallback={emptyBulk}
            targets={bulk}
            trigger={tagButton}
          />
        )}
      </BarItems>
    );
  }

  const actionBarRight = (
    <Link to="/bookings/create">
      <Button btnStyle="success" size="small" icon="plus-circle">
        Create Booking
      </Button>
    </Link>
  );

  const actionBar = (
    <Wrapper.ActionBar right={actionBarRight} left={actionBarLeft} />
  );

  const content = (
    <Table whiteSpace="nowrap" hover={true}>
      <thead>
        <tr>
          <th>
            <FormControl
              componentClass="checkbox"
              checked={isAllSelected}
              onChange={onChange}
            />
          </th>
          <th>{__('Listings')}</th>
          <th>{__('Brand')}</th>
          <th>{__('Views')}</th>
          <th>{__('Postavení')}</th>
          <th>{__('Vytvořil')}</th>
          <th>{__('Vytvořeno v')}</th>
          <th>{__('Tags')}</th>
          <th>{__('Akce')}</th>
        </tr>
      </thead>
      <tbody>{renderRow()}</tbody>
    </Table>
  );

  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={__('Bookings')}
          breadcrumb={[{ title: __('Bookings') }]}
          queryParams={queryParams}
        />
      }
      leftSidebar={<Sidebar counts={counts || ({} as any)} />}
      actionBar={actionBar}
      footer={<Pagination count={2} />}
      content={
        <DataWithLoader
          data={content}
          loading={false}
          count={totalCount}
          emptyContent={
            <EmptyContent
              content={EMPTY_CONTENT_BOOKINGS}
              maxItemWidth="360px"
            />
          }
        />
      }
      hasBorder
    />
  );
}

export default BookingList;
