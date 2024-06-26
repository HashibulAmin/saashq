import Alert from '@saashq/ui/src/utils/Alert';
import { BarItems } from '@saashq/ui/src/layout/styles';
import Button from '@saashq/ui/src/components/Button';
import confirm from '@saashq/ui/src/utils/confirmation/confirm';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import FormControl from '@saashq/ui/src/components/form/Control';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import Pagination from '@saashq/ui/src/components/pagination/Pagination';
import { router } from '@saashq/ui/src/utils/core';
import SortHandler from '@saashq/ui/src/components/SortHandler';
import Table from '@saashq/ui/src/components/table';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';

import { IRouterProps } from '@saashq/ui/src/types';
import React from 'react';
import { withRouter } from 'react-router-dom';

import ContractTypeForm from '../containers/ContractTypeForm';
import { ContractTypesTableWrapper } from '../styles';
import { IContractType } from '../types';
import ContractTypeRow from './ContractTypeRow';
import { __ } from 'coreui/utils';
interface IProps extends IRouterProps {
  contractTypes: IContractType[];
  loading: boolean;
  searchValue: string;
  totalCount: number;
  // TODO: check is below line not throwing error ?
  toggleBulk: () => void;
  toggleAll: (targets: IContractType[], containerId: string) => void;
  bulk: any[];
  isAllSelected: boolean;
  emptyBulk: () => void;
  removeContractTypes: (
    doc: { contractTypeIds: string[] },
    emptyBulk: () => void,
  ) => void;
  history: any;
  queryParams: any;
}

type State = {
  searchValue?: string;
};

class ContractTypesList extends React.Component<IProps, State> {
  private timer?: NodeJS.Timer = undefined;

  constructor(props) {
    super(props);

    this.state = {
      searchValue: this.props.searchValue,
    };
  }

  onChange = () => {
    const { toggleAll, contractTypes } = this.props;
    toggleAll(contractTypes, 'contractTypes');
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

  removeContractTypes = (contractTypes) => {
    const contractTypeIds: string[] = [];

    contractTypes.forEach((contractType) => {
      contractTypeIds.push(contractType._id);
    });

    this.props.removeContractTypes({ contractTypeIds }, this.props.emptyBulk);
  };

  moveCursorAtTheEnd = (e) => {
    const tmpValue = e.target.value;
    e.target.value = '';
    e.target.value = tmpValue;
  };

  render() {
    const {
      contractTypes,
      history,
      loading,
      toggleBulk,
      bulk,
      isAllSelected,
      totalCount,
      queryParams,
    } = this.props;

    const mainContent = (
      <ContractTypesTableWrapper>
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
                <SortHandler sortField={'code'} label={__('Code')} />
              </th>
              <th>
                <SortHandler sortField={'name'} label={__('Název')} />
              </th>
              <th>
                <SortHandler sortField={'number'} label={__('Start Number')} />
              </th>
              <th>{__('After vacancy count')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="contractTypes">
            {contractTypes.map((contractType) => (
              <ContractTypeRow
                contractType={contractType}
                isChecked={bulk.includes(contractType)}
                key={contractType._id}
                history={history}
                toggleBulk={toggleBulk}
              />
            ))}
          </tbody>
        </Table>
      </ContractTypesTableWrapper>
    );

    const addTrigger = (
      <Button btnStyle="success" icon="plus-circle">
        {__('Add contractType')}
      </Button>
    );

    let actionBarLeft: React.ReactNode;

    if (bulk.length > 0) {
      const onClick = () =>
        confirm()
          .then(() => {
            this.removeContractTypes(bulk);
          })
          .catch((error) => {
            Alert.error(error.message);
          });

      actionBarLeft = (
        <BarItems>
          <Button btnStyle="danger" icon="cancel-1" onClick={onClick}>
            {__('Vymazat')}
          </Button>
        </BarItems>
      );
    }

    const contractTypeForm = (props) => {
      return <ContractTypeForm {...props} queryParams={queryParams} />;
    };

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

        <ModalTrigger
          title="New contractType"
          size="lg"
          trigger={addTrigger}
          autoOpenKey="showContractTypeModal"
          content={contractTypeForm}
          backDrop="static"
        />
      </BarItems>
    );

    const actionBar = (
      <Wrapper.ActionBar right={actionBarRight} left={actionBarLeft} />
    );

    return (
      <Wrapper
        hasBorder
        header={
          <Wrapper.Header
            title={__(`ContractTypes`) + ` (${totalCount})`}
            queryParams={queryParams}
            breadcrumb={[
              { title: __('Nastavení'), link: '/settings' },
              { title: __('Contract Type') },
            ]}
          />
        }
        actionBar={actionBar}
        footer={<Pagination count={totalCount} />}
        content={
          <DataWithLoader
            data={mainContent}
            loading={loading}
            count={contractTypes.length}
            emptyText="Add in your first contractType!"
            emptyImage="/images/actions/1.svg"
          />
        }
      />
    );
  }
}

export default withRouter<IRouterProps>(ContractTypesList);
