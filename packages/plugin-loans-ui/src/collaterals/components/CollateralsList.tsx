import { BarItems } from '@saashq/ui/src/layout/styles';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import FormControl from '@saashq/ui/src/components/form/Control';
import Pagination from '@saashq/ui/src/components/pagination/Pagination';
import SortHandler from '@saashq/ui/src/components/SortHandler';
import Table from '@saashq/ui/src/components/table';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';

import SelectProducts from '@saashq/ui-products/src/containers/SelectProducts';
import { IRouterProps } from '@saashq/ui/src/types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { menuContracts } from '../../constants';
import { CollateralsTableWrapper } from '../styles';
import { ICollateral } from '../types';
import CollateralRow from './CollateralRow';
import Sidebar from './Sidebar';
import { can, router } from '@saashq/ui/src/utils/core';
import withConsumer from '../../withConsumer';
import { IUser } from '@saashq/ui/src/auth/types';
import { __ } from 'coreui/utils';

interface IProps extends IRouterProps {
  collaterals: ICollateral[];
  loading: boolean;
  searchValue: string;
  productIds: string[];
  totalCount: number;
  history: any;
  queryParams: any;
  currentUser: IUser;
}

type State = {
  searchValue?: string;
  productIds?: string[];
};

class CollateralsList extends React.Component<IProps, State> {
  private timer?: NodeJS.Timer = undefined;

  constructor(props) {
    super(props);

    this.state = {
      searchValue: this.props.searchValue,
      productIds: this.props.productIds,
    };
  }

  onSelectProducts = (productIds) => {
    const { history } = this.props;

    this.setState({ productIds });
    router.removeParams(history, 'page');
    router.setParams(history, { productIds });
  };

  search = (e) => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    const { history } = this.props;
    const searchValue = e.target.value;

    this.setState({ searchValue });
    this.timer = setTimeout(() => {
      router.removeParams(history, 'page');
      router.setParams(history, { searchValue });
    }, 500);
  };

  moveCursorAtTheEnd = (e) => {
    const tmpValue = e.target.value;
    e.target.value = '';
    e.target.value = tmpValue;
  };

  render() {
    const {
      collaterals,
      history,
      loading,
      totalCount,
      queryParams,
      currentUser,
    } = this.props;

    const mainContent = (
      <CollateralsTableWrapper>
        <Table whiteSpace="nowrap" bordered={true} hover={true} striped>
          <thead>
            <tr>
              <th>
                <SortHandler sortField={'code'} label={__('Code')} />
              </th>
              <th>
                <SortHandler sortField={'name'} label={__('Název')} />
              </th>
              <th>
                <SortHandler
                  sortField={'certificate'}
                  label={__('Certificate №')}
                />
              </th>
              <th>
                <SortHandler sortField={'vinNumber'} label={__('VINNumber')} />
              </th>
              <th>
                <SortHandler sortField={'cost'} label={__('Cost')} />
              </th>
              <th>
                <SortHandler
                  sortField={'marginAmount'}
                  label={__('margin Amount')}
                />
              </th>
              <th>
                <SortHandler
                  sortField={'leaseAmount'}
                  label={__('Lease Amount')}
                />
              </th>
            </tr>
          </thead>
          <tbody id="collaterals">
            {collaterals.map((collateral) => (
              <CollateralRow
                collateral={collateral}
                key={`${
                  collateral.collateralData
                    ? collateral.collateralData._id
                    : collateral._id
                }`}
                history={history}
              />
            ))}
          </tbody>
        </Table>
      </CollateralsTableWrapper>
    );

    const actionBarRight = (
      <BarItems>
        <FormControl
          type="text"
          placeholder={__('Zadejte a vyhledejte')}
          onChange={this.search}
          value={this.state.searchValue}
          autoFocus={true}
          onFocus={this.moveCursorAtTheEnd}
        />
        <SelectProducts
          label="Filter by products"
          name="productIds"
          queryParams={queryParams}
          onSelect={this.onSelectProducts}
        />
      </BarItems>
    );

    const actionBar = <Wrapper.ActionBar right={actionBarRight} />;

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__(`Collaterals`) + ` (${totalCount})`}
            submenu={menuContracts.filter((row) =>
              can(row.permission, currentUser),
            )}
          />
        }
        actionBar={actionBar}
        hasBorder
        footer={<Pagination count={totalCount} />}
        leftSidebar={
          <Sidebar
            loadingMainQuery={loading}
            queryParams={queryParams}
            history={history}
          />
        }
        content={
          <DataWithLoader
            data={mainContent}
            loading={loading}
            count={collaterals.length}
            emptyText="Add in your first collateral!"
            emptyImage="/images/actions/1.svg"
          />
        }
      />
    );
  }
}

export default withRouter<IRouterProps>(withConsumer(CollateralsList));
