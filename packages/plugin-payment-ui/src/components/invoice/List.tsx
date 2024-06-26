import Button from '@saashq/ui/src/components/Button';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import FormControl from '@saashq/ui/src/components/form/Control';
import Pagination from '@saashq/ui/src/components/pagination/Pagination';
import Table from '@saashq/ui/src/components/table';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { BarItems } from '@saashq/ui/src/layout/styles';
import { IRouterProps } from '@saashq/ui/src/types';
import { __, Alert, confirm, router } from '@saashq/ui/src/utils';
import React, { useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import InvoiceDetail from '../../containers/invoice/Detail';
import { withRouter } from 'react-router-dom';

import { IInvoice, InvoicesCount } from '../../types';
import Row from './Row';
import Sidebar from './SideBar';

interface IProps extends IRouterProps {
  history: any;
  queryParams: any;
  invoices: IInvoice[];
  isAllSelected: boolean;
  bulk: any[];
  emptyBulk: () => void;
  remove: (invoiceIds: string[], emptyBulk: () => void) => void;
  check: (invoiceId: string) => void;
  toggleBulk: () => void;
  toggleAll: (targets: IInvoice[], containerId: string) => void;
  loading: boolean;
  searchValue: string;
  counts: InvoicesCount;
}

const List = (props: IProps) => {
  const [searchValue, setSearchValue] = useState(props.searchValue);
  const [showModal, setShowModal] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState(null);

  const {
    invoices,
    history,
    toggleBulk,
    toggleAll,
    bulk,
    isAllSelected,
    counts,
  } = props;

  React.useEffect(() => {
    let timeoutId: any = null;

    if (searchValue !== props.searchValue) {
      timeoutId = setTimeout(() => {
        router.removeParams(history, 'page');
        router.setParams(history, { searchValue });
      }, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [searchValue]);

  const renderRow = () => {
    const onClickRow = (invoiceId) => {
      setCurrentInvoiceId(invoiceId);

      setShowModal(!showModal);
    };

    return invoices.map((invoice) => (
      <Row
        onClick={onClickRow}
        history={history}
        key={invoice._id}
        invoice={invoice}
        toggleBulk={toggleBulk}
        check={props.check}
        isChecked={bulk.includes(invoice)}
      />
    ));
  };

  const onChange = () => {
    toggleAll(invoices, 'invoices');
  };
  const removeInvoices = (ids) => {
    const invoiceIds: string[] = [];
    ids.forEach((i) => {
      invoiceIds.push(i._id);
    });
    props.remove(invoiceIds, props.emptyBulk);
  };

  const search = (e) => {
    setSearchValue(e.target.value || '');
  };

  const moveCursorAtTheEnd = (e) => {
    const tmpValue = e.target.value;
    e.target.value = '';
    e.target.value = tmpValue;
  };

  let invoiceBarRight = (
    <BarItems>
      <FormControl
        type="text"
        placeholder={__('Zadejte a vyhledejte')}
        onChange={search}
        value={searchValue}
        autoFocus={true}
        onFocus={moveCursorAtTheEnd}
      />
    </BarItems>
  );
  const content = (
    <>
      <Table hover={true}>
        <thead>
          <tr>
            <th
              style={{
                width: 60,
              }}
            >
              <FormControl
                checked={isAllSelected}
                componentClass="checkbox"
                onChange={onChange}
              />
            </th>
            <th>{__('Payment name')}</th>
            <th>{__('Kind')}</th>
            <th>{__('Množství')}</th>
            <th>{__('Postavení')}</th>
            <th>{__('Zákazník')}</th>
            <th>{__('Customer Type')}</th>
            <th>{__('Popis')}</th>
            <th>{__('Created date')}</th>
            <th>{__('Resolved date')}</th>
            <th>{__('Akce')}</th>
          </tr>
        </thead>
        <tbody>{renderRow()}</tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton={true}>
          <Modal.Title>{__('Invoice detail')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InvoiceDetail id={currentInvoiceId || ''} />
        </Modal.Body>
      </Modal>
    </>
  );

  if (bulk.length > 0) {
    const onClick = () =>
      confirm(
        __('Invoices that are already paid will not be deleted. Are you sure?'),
      )
        .then(() => {
          removeInvoices(bulk);
        })
        .catch((error) => {
          Alert.error(error.message);
        });

    invoiceBarRight = (
      <BarItems>
        <Button
          btnStyle="danger"
          size="small"
          icon="cancel-1"
          onClick={onClick}
        >
          Remove
        </Button>
      </BarItems>
    );
  }

  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={__('Invoices')}
          breadcrumb={[
            {
              title: __('Invoices'),
            },
          ]}
          queryParams={props.queryParams}
        />
      }
      leftSidebar={<Sidebar counts={props.counts || ({} as InvoicesCount)} />}
      footer={<Pagination count={counts.total} />}
      actionBar={<Wrapper.ActionBar right={invoiceBarRight} />}
      content={
        <DataWithLoader
          data={content}
          loading={props.loading}
          count={counts.total}
          emptyText="Nejsou žádná data"
          emptyImage="/images/actions/5.svg"
        />
      }
      hasBorder={true}
      transparent={true}
    />
  );
};

export default withRouter(List);
