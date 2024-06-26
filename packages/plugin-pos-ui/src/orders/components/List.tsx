import {
  __,
  DataWithLoader,
  Pagination,
  SortHandler,
  Table,
  Wrapper,
  BarItems,
} from '@saashq/ui/src';
import { IRouterProps, IQueryParams } from '@saashq/ui/src/types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { menuPos } from '../../constants';

import { TableWrapper } from '../../styles';
import { IOrder } from '../types';
import HeaderDescription from './MainHead';
import RightMenu from './RightMenu';
import Row from './Row';

interface IProps extends IRouterProps {
  orders: IOrder[];
  loading: boolean;
  bulk: any[];
  isAllSelected: boolean;
  history: any;
  queryParams: any;

  onSearch: (search: string) => void;
  onFilter: (filterParams: IQueryParams) => void;
  onSelect: (values: string[] | string, key: string) => void;
  isFiltered: boolean;
  clearFilter: () => void;
  summary: any;

  onReturnBill: (orderId: string) => void;
}

class Orders extends React.Component<IProps, {}> {
  private timer?: NodeJS.Timer = undefined;

  constructor(props) {
    super(props);
  }

  moveCursorAtTheEnd = (e) => {
    const tmpValue = e.target.value;
    e.target.value = '';
    e.target.value = tmpValue;
  };

  render() {
    const {
      orders,
      history,
      loading,
      queryParams,
      onFilter,
      onSelect,
      onSearch,
      isFiltered,
      clearFilter,
      summary,
      onReturnBill,
    } = this.props;

    const rightMenuProps = {
      onFilter,
      onSelect,
      onSearch,
      isFiltered,
      clearFilter,
      queryParams,
    };

    const actionBarRight = (
      <BarItems>
        <RightMenu {...rightMenuProps} />
      </BarItems>
    );

    const staticKeys = ['count', 'totalAmount', 'cashAmount', 'mobileAmount'];
    const otherPayTitles = (summary ? Object.keys(summary) || [] : [])
      .filter((a) => !['_id'].includes(a))
      .filter((a) => !staticKeys.includes(a))
      .sort();

    const header = (
      <HeaderDescription
        icon="/images/actions/26.svg"
        title=""
        summary={summary}
        staticKeys={staticKeys}
        actionBar={actionBarRight}
      />
    );

    const mainContent = (
      <TableWrapper>
        <Table whiteSpace="nowrap" bordered={true} hover={true}>
          <thead>
            <tr>
              <th>
                <SortHandler sortField={'number'} label={__('Bill number')} />
              </th>
              <th>
                <SortHandler sortField={'paidDate'} label={__('Date')} />
              </th>
              <th>
                <SortHandler
                  sortField={'cashAmount'}
                  label={__('Cash Amount')}
                />
              </th>
              <th>
                <SortHandler
                  sortField={'mobileAmount'}
                  label={__('Mobile Amount')}
                />
              </th>
              {otherPayTitles.map((key) => (
                <th key={Math.random()}>{__(key)}</th>
              ))}
              <th>
                <SortHandler sortField={'totalAmount'} label={__('Množství')} />
              </th>
              <th>
                <SortHandler sortField={'customerId'} label={__('Zákazník')} />
              </th>
              <th>
                <SortHandler sortField={'posName'} label={__('Pos')} />
              </th>
              <th>
                <SortHandler sortField={'type'} label={__('Typ')} />
              </th>
              <th>
                <SortHandler sortField={'user'} label={__('Uživatel')} />
              </th>
              <th>Үйлдлүүд</th>
            </tr>
          </thead>
          <tbody id="orders">
            {(orders || []).map((order) => (
              <Row
                order={order}
                key={order._id}
                history={history}
                otherPayTitles={otherPayTitles}
                onReturnBill={onReturnBill}
              />
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__(`Pos Orders`)}
            queryParams={queryParams}
            submenu={menuPos}
          />
        }
        mainHead={header}
        footer={<Pagination count={(summary || {}).count} />}
        content={
          <DataWithLoader
            data={mainContent}
            loading={loading}
            count={(orders || []).length}
            emptyText="Add in your first order!"
            emptyImage="/images/actions/1.svg"
          />
        }
      />
    );
  }
}

export default withRouter<IRouterProps>(Orders);
