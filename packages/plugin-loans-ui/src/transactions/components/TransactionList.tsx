import {
  Alert,
  Button,
  confirm,
  DataWithLoader,
  FormControl,
  ModalTrigger,
  Pagination,
  SortHandler,
  Table,
  Wrapper,
  BarItems,
  DropdownToggle,
  Icon,
} from '@saashq/ui/src';
import { IRouterProps } from '@saashq/ui/src/types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { ORGANIZATION_TYPE, menuContracts } from '../../constants';
import Dropdown from 'react-bootstrap/Dropdown';
import TransactionForm from '../containers/TransactionForm';
import { ContractsTableWrapper } from '../../contracts/styles';
import { ITransaction } from '../types';
import TransactionRow from './TransactionRow';
import RightMenu from './RightMenu';
import { can } from '@saashq/ui/src/utils/core';
import withConsumer from '../../withConsumer';
import { IUser } from '@saashq/ui/src/auth/types';
import { __ } from 'coreui/utils';
import InterestChange from '../../contracts/containers/detail/InterestChange';

interface IProps extends IRouterProps {
  transactions: ITransaction[];
  loading: boolean;
  totalCount: number;
  // TODO: check is below line not throwing error ?
  toggleBulk: () => void;
  toggleAll: (targets: ITransaction[], containerId: string) => void;
  bulk: any[];
  isAllSelected: boolean;
  emptyBulk: () => void;
  removeTransactions: (
    doc: { transactionIds: string[] },
    emptyBulk: () => void,
  ) => void;

  onSearch: (search: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
  queryParams: any;
  isFiltered: boolean;
  clearFilter: () => void;
  currentUser: IUser;
}

class TransactionsList extends React.Component<IProps> {
  private timer?: NodeJS.Timer = undefined;

  constructor(props) {
    super(props);
  }

  onChange = () => {
    const { toggleAll, transactions } = this.props;
    toggleAll(transactions, 'transactions');
  };

  removeTransactions = (transactions) => {
    const transactionIds: string[] = [];

    transactions.forEach((transaction) => {
      transactionIds.push(transaction._id);
    });

    this.props.removeTransactions({ transactionIds }, this.props.emptyBulk);
  };

  render() {
    const {
      transactions,
      history,
      loading,
      toggleBulk,
      bulk,
      isAllSelected,
      totalCount,
      queryParams,
      onSelect,
      onSearch,
      isFiltered,
      clearFilter,
      currentUser,
    } = this.props;

    const mainContent = (
      <ContractsTableWrapper>
        <Table whiteSpace="nowrap" bordered={true} hover={true} striped>
          <thead>
            <tr>
              <th>
                <FormControl
                  checked={isAllSelected}
                  componentClass="checkbox"
                  onChange={this.onChange}
                />
              </th>
              <th>
                <SortHandler
                  sortField={'contract.number'}
                  label={__('Contract Number')}
                />
              </th>
              <th>
                <SortHandler
                  sortField={'contract.description'}
                  label={__('Popis')}
                />
              </th>
              <th>
                <SortHandler sortField={'payDate'} label={__('Date')} />
              </th>
              <th>
                <SortHandler sortField={'payment'} label={__('Payment')} />
              </th>
              <th>
                <SortHandler
                  sortField={'interestEve'}
                  label={__('Interest Eve')}
                />
              </th>
              <th>
                <SortHandler
                  sortField={'interestNonce'}
                  label={__('Interest Nonce')}
                />
              </th>
              <th>
                <SortHandler sortField={'undue'} label={__('Loss')} />
              </th>
              <th>
                <SortHandler sortField={'insurance'} label={__('Insurance')} />
              </th>
              <th>
                <SortHandler sortField={'total'} label={__('Total')} />
              </th>
              <th>
                <SortHandler sortField={'ebarimt'} label={__('EBarimt')} />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody id="transactions">
            {transactions.map((transaction) => (
              <TransactionRow
                transaction={transaction}
                isChecked={bulk.includes(transaction)}
                key={transaction._id}
                history={history}
                toggleBulk={toggleBulk}
              />
            ))}
          </tbody>
        </Table>
      </ContractsTableWrapper>
    );

    let actionBarLeft: React.ReactNode;

    if (bulk.length > 0) {
      const onClick = () =>
        confirm()
          .then(() => {
            this.removeTransactions(bulk);
          })
          .catch((error) => {
            Alert.error(error.message);
          });

      actionBarLeft = (
        <BarItems>
          {currentUser?.configs?.loansConfig?.organizationType ===
            ORGANIZATION_TYPE.ENTITY &&
            can('transactionsRemove', currentUser) && (
              <Button btnStyle="danger" icon="cancel-1" onClick={onClick}>
                {__('Vymazat')}
              </Button>
            )}
        </BarItems>
      );
    }

    const repaymentForm = (props) => {
      return (
        <TransactionForm
          {...props}
          type="repayment"
          queryParams={queryParams}
        />
      );
    };

    const giveForm = (props) => {
      return (
        <TransactionForm {...props} type="give" queryParams={queryParams} />
      );
    };

    const interestChangeForm = (props) => (
      <InterestChange {...props} type="interestChange" />
    );

    const interestReturnForm = (props) => (
      <InterestChange {...props} type="interestReturn" />
    );

    const rightMenuProps = {
      onSelect,
      onSearch,
      isFiltered,
      clearFilter,
      queryParams,
    };

    const actionBarRight = (
      <BarItems>
        {can('manageTransactions', currentUser) && (
          <Dropdown>
            <Dropdown.Toggle as={DropdownToggle} id="dropdown-info">
              <Button btnStyle="success" size="medium">
                {__('New transaction')}
                <Icon icon="angle-down" />
              </Button>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <li>
                <ModalTrigger
                  title={`${__('Repayment Transaction')}`}
                  trigger={
                    <a href="#Repayment">{__('Repayment Transaction')}</a>
                  }
                  size="lg"
                  content={repaymentForm}
                />
              </li>
              <li>
                <ModalTrigger
                  title={`${__('Give Transaction')}`}
                  trigger={<a href="#Give">{__('Give Transaction')}</a>}
                  size="lg"
                  content={giveForm}
                />
              </li>
              <li>
                <ModalTrigger
                  title={__('Interest Change')}
                  trigger={
                    <a href="#Interest Change">{__('Interest Change')}</a>
                  }
                  size="lg"
                  content={interestChangeForm}
                />
              </li>
              <li>
                <ModalTrigger
                  title={__('Interest Return')}
                  trigger={
                    <a href="#Interest Return">{__('Interest Return')}</a>
                  }
                  size="lg"
                  content={interestReturnForm}
                />
              </li>
            </Dropdown.Menu>
          </Dropdown>
        )}

        <RightMenu {...rightMenuProps} />
      </BarItems>
    );

    const actionBar = (
      <Wrapper.ActionBar right={actionBarRight} left={actionBarLeft} />
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__(`Transactions`) + ` (${totalCount})`}
            queryParams={queryParams}
            submenu={menuContracts.filter((row) =>
              can(row.permission, currentUser),
            )}
          />
        }
        hasBorder
        actionBar={actionBar}
        footer={<Pagination count={totalCount} />}
        content={
          <DataWithLoader
            data={mainContent}
            loading={loading}
            count={transactions.length}
            emptyText="Add in your first transaction!"
            emptyImage="/images/actions/1.svg"
          />
        }
      />
    );
  }
}

export default withRouter<IRouterProps>(withConsumer(TransactionsList));
