import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import { FormControl } from '@saashq/ui/src/components/form';
import Pagination from '@saashq/ui/src/components/pagination/Pagination';
import Table from '@saashq/ui/src/components/table';
import { colors } from '@saashq/ui/src/styles';
import { Title } from '@saashq/ui/src/styles/main';
import { __, router } from '@saashq/ui/src/utils';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { BarItems } from '@saashq/ui/src/layout/styles';
import * as React from 'react';
import Select from 'react-select-plus';
import { EMAIL_TYPES } from '../containers/EmailDelivery';
import Row from './Row';
import { isEnabled } from '@saashq/ui/src/utils/core';
import { FlexItem, FlexRow, InputBar } from '@saashq/ui-settings/src/styles';
import Icon from '@saashq/ui/src/components/Icon';

type Props = {
  list: any;
  history: any;
  searchValue?: string;
  loading: boolean;
  count: number;
  emailType: string;
  handleSelectEmailType: (type: string) => void;
  handleSelectStatus: (status: string) => void;
  status: string;
};

const breadcrumb = [
  { title: 'Settings', link: '/settings' },
  { title: __('Email deliveries') },
];

const emailTypeOptions = [
  { value: 'transaction', label: __('Transaction') },
  { value: 'engage', label: __('SES Engage') },
];

const tableHeaders = {
  transaction: ['Subject', 'To', 'Cc', 'Bcc', 'From', 'Status', 'Created at'],
  engage: ['Customer', 'Email', 'Title', 'Status', 'Created at'],
};

export const STATUS_OPTIONS = [
  { value: 'send', label: 'Sent', color: colors.colorPrimary },
  { value: 'delivery', label: 'Delivered', color: colors.colorCoreBlue },
  { value: 'open', label: 'Opened', color: colors.colorCoreGreen },
  { value: 'click', label: 'Clicked', color: colors.colorCoreTeal },
  {
    value: 'complaint',
    label: 'Complained/Spammed',
    color: colors.colorCoreOrange,
  },
  { value: 'bounce', label: 'Bounced', color: colors.colorCoreGray },
  {
    value: 'renderingfailure',
    label: 'Rendering failure',
    color: colors.colorCoreBlack,
  },
  { value: 'reject', label: 'Rejected', color: colors.colorCoreRed },
];

function EmailDelivery({
  emailType,
  loading,
  count,
  list = [],
  handleSelectEmailType,
  searchValue,
  history,
  handleSelectStatus,
  status,
}: Props) {
  const [search, setSearch] = React.useState(searchValue);
  const timerRef = React.useRef<number | null>(null);

  const handleSearch = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const value = e.target.value;
    setSearch(value);

    timerRef.current = window.setTimeout(() => {
      router.removeParams(history, 'page');
      router.setParams(history, { searchValue: value });
    }, 500);
  };

  const handleEmailtype = ({ value }: { value: string }) => {
    setSearch('');
    return handleSelectEmailType(value);
  };

  const handleStatusChange = ({ value }: { value: string }) => {
    return handleSelectStatus(value);
  };

  function renderContent() {
    return (
      <Table whiteSpace="wrap" hover={true} bordered={true} condensed={true}>
        <thead>
          <tr>
            {(tableHeaders[emailType] || []).map((item, idx) => (
              <th key={idx}>{__(item)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <Row key={item._id} item={item} emailType={emailType} />
          ))}
        </tbody>
      </Table>
    );
  }

  function renderActionBar() {
    const isTransaction = emailType === EMAIL_TYPES.TRANSACTION;

    const content = (
      <BarItems>
        <FlexRow>
          <InputBar type="searchBar">
            <Icon icon="search-1" size={20} />
            <FlexItem>
              <FormControl
                type="text"
                placeholder={__('Zadejte a vyhledejte')}
                onChange={handleSearch}
                value={search}
              />
            </FlexItem>
          </InputBar>

          <React.Fragment>
            {isEnabled('engages') && (
              <InputBar type="selectBar">
                <Select
                  placeholder={__('Choose Email type')}
                  value={emailType}
                  options={emailTypeOptions}
                  onChange={handleEmailtype}
                  clearable={false}
                />
              </InputBar>
            )}
            {isTransaction ? null : (
              <InputBar type="selectBar">
                <Select
                  placeholder={__('Choose status')}
                  value={status}
                  options={STATUS_OPTIONS}
                  onChange={handleStatusChange}
                  resetValue={[]}
                />
              </InputBar>
            )}
          </React.Fragment>
        </FlexRow>
      </BarItems>
    );

    return (
      <Wrapper.ActionBar
        left={<Title>{__(`Email Deliveries (${count})`)}</Title>}
        right={content}
      />
    );
  }

  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={__('Email Deliveries')}
          breadcrumb={breadcrumb}
        />
      }
      actionBar={renderActionBar()}
      footer={<Pagination count={count} />}
      content={
        <DataWithLoader
          data={renderContent()}
          loading={loading}
          count={count}
          emptyText={__('There are no logs')}
          emptyImage="/images/actions/21.svg"
        />
      }
      hasBorder={true}
    />
  );
}

export default EmailDelivery;
