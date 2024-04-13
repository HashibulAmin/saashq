import {
  DepartmentsMainQueryResponse,
  IDepartment,
} from '@saashq/ui/src/team/types';
import {
  FilterContainer,
  InputBar,
  LeftActionBar,
  Title,
} from '@saashq/ui-settings/src/styles';
import { __, router } from '@saashq/ui/src/utils';

import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import { BarItems } from 'modules/layout/styles';
import Button from 'modules/common/components/Button';
import DataWithLoader from 'modules/common/components/DataWithLoader';
import Form from '../../containers/common/BlockForm';
import FormControl from 'modules/common/components/form/Control';
import Icon from '@saashq/ui/src/components/Icon';
import LeftSidebar from '@saashq/ui/src/layout/components/Sidebar';
import ModalTrigger from 'modules/common/components/ModalTrigger';
import Pagination from 'modules/common/components/pagination/Pagination';
import React from 'react';
import SettingsSideBar from '../../containers/common/SettingSideBar';
import SidebarHeader from '@saashq/ui-settings/src/common/components/SidebarHeader';
import Table from 'modules/common/components/table';
import Tip from '@saashq/ui/src/components/Tip';
import Wrapper from 'modules/layout/components/Wrapper';
import { generatePaginationParams } from '@saashq/ui/src/utils/router';
import { generateTree } from '../../utils';
import { gql } from '@apollo/client';
import { queries } from '@saashq/ui/src/team/graphql';

type Props = {
  listQuery: DepartmentsMainQueryResponse;
  queryParams: any;
  history: any;
  deleteDepartments: (ids: string[], callback: () => void) => void;
};

type State = {
  selectedItems: string[];
  searchValue: string;
};

class MainList extends React.Component<Props, State> {
  private timer?: NodeJS.Timer;
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      searchValue: props.queryParams.searchValue || '',
    };
  }

  refetchQueries = () => [
    {
      query: gql(queries.departmentsMain),
      variables: {
        withoutUserFilter: true,
        searchValue: undefined,
        ...generatePaginationParams(this.props.queryParams || {}),
      },
    },
  ];

  remove = (_id?: string) => {
    if (_id) {
      this.props.deleteDepartments([_id], () =>
        this.setState({ selectedItems: [] }),
      );
    } else {
      this.props.deleteDepartments(this.state.selectedItems, () =>
        this.setState({ selectedItems: [] }),
      );
    }
  };

  renderForm() {
    const trigger = (
      <Button btnStyle="success" icon="plus-circle">
        {__('Přidat Oddělení')}
      </Button>
    );

    const content = ({ closeModal }) => (
      <Form
        closeModal={closeModal}
        queryType="departments"
        additionalRefetchQueries={this.refetchQueries()}
      />
    );

    return (
      <ModalTrigger
        title="Přidat Oddělení"
        content={content}
        trigger={trigger}
      />
    );
  }

  renderSearch() {
    const search = (e) => {
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

    const moveCursorAtTheEnd = (e) => {
      const tmpValue = e.target.value;

      e.target.value = '';
      e.target.value = tmpValue;
    };

    return (
      <FilterContainer marginRight={true}>
        <InputBar type="searchBar">
          <Icon icon="search-1" size={20} />
          <FormControl
            type="text"
            placeholder={__('Zadejte a vyhledejte')}
            onChange={search}
            value={this.state.searchValue}
            autoFocus={true}
            onFocus={moveCursorAtTheEnd}
          />
        </InputBar>
      </FilterContainer>
    );
  }

  renderRow(department: IDepartment, level) {
    const { selectedItems } = this.state;

    const handleSelect = () => {
      if (selectedItems.includes(department._id)) {
        const removedSelectedItems = selectedItems.filter(
          (selectItem) => selectItem !== department._id,
        );
        return this.setState({ selectedItems: removedSelectedItems });
      }
      this.setState({ selectedItems: [...selectedItems, department._id] });
    };

    const onclick = (e) => {
      e.stopPropagation();
    };

    const trigger = (
      <Button btnStyle="link">
        <Tip text={__('Upravit')} placement="top">
          <Icon icon="edit-3" />
        </Tip>
      </Button>
    );

    return (
      <tr key={department._id}>
        <td onClick={onclick}>
          <FormControl
            componentClass="checkbox"
            checked={selectedItems.includes(department._id)}
            onClick={handleSelect}
          />
        </td>
        <td>{__(`${'\u00A0 \u00A0 '.repeat(level)}  ${department.code}`)}</td>
        <td>{__(department.title)}</td>
        <td>{__(department?.supervisor?.email || '-')}</td>
        <td>{department.userCount}</td>
        <td>
          <ActionButtons>
            <ModalTrigger
              key={department._id}
              title="Upravit oddělení"
              content={({ closeModal }) => (
                <Form
                  item={department}
                  queryType="departments"
                  additionalRefetchQueries={this.refetchQueries()}
                  closeModal={closeModal}
                />
              )}
              trigger={trigger}
            />
            <Tip text={__('Vymazat')} placement="top">
              <Button
                btnStyle="link"
                onClick={() => this.remove(department._id)}
                icon="times-circle"
              />
            </Tip>
          </ActionButtons>
        </td>
      </tr>
    );
  }

  renderContent() {
    const { listQuery } = this.props;
    const departments = listQuery.departmentsMain?.list || [];
    const { selectedItems } = this.state;

    const handleSelectAll = () => {
      if (!selectedItems.length) {
        const departmentIds = departments.map((department) => department._id);
        return this.setState({ selectedItems: departmentIds });
      }

      this.setState({ selectedItems: [] });
    };

    return (
      <Table>
        <thead>
          <tr>
            <th>
              <FormControl
                componentClass="checkbox"
                checked={departments?.length === selectedItems.length}
                onClick={handleSelectAll}
              />
            </th>
            <th>{__('Code')}</th>
            <th>{__('Titul')}</th>
            <th>{__('Supervisor')}</th>
            <th>{__('Team member count')}</th>
            <th>{__('Akce')}</th>
          </tr>
        </thead>
        <tbody>
          {generateTree(departments, null, (department, level) => {
            return this.renderRow(department, level);
          })}
          {generateTree(departments, '', (department, level) => {
            return this.renderRow(department, level);
          })}
        </tbody>
      </Table>
    );
  }

  render() {
    const { listQuery } = this.props;

    const { totalCount } = listQuery.departmentsMain;

    const { selectedItems } = this.state;

    const rightActionBar = (
      <BarItems>
        {this.renderSearch()}
        {this.renderForm()}
      </BarItems>
    );

    const leftActionBar = selectedItems.length > 0 && (
      <Button
        btnStyle="danger"
        size="small"
        icon="times-circle"
        onClick={() => this.remove()}
      >
        Remove
      </Button>
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title="Oddělení"
            breadcrumb={[
              { title: __('Nastavení'), link: '/settings' },
              { title: __('Oddělení') },
            ]}
          />
        }
        actionBar={
          <Wrapper.ActionBar
            right={rightActionBar}
            left={
              <LeftActionBar>
                <Title capitalize={true}>
                  {__('Oddělení')}&nbsp;
                  {`(${totalCount || 0})`}
                </Title>
                {leftActionBar}
              </LeftActionBar>
            }
          />
        }
        content={
          <DataWithLoader
            loading={listQuery.loading}
            count={totalCount || 0}
            data={this.renderContent()}
            emptyImage="/images/actions/5.svg"
            emptyText="Žádné Pobočky"
          />
        }
        leftSidebar={
          <LeftSidebar header={<SidebarHeader />} hasBorder={true}>
            <SettingsSideBar />
          </LeftSidebar>
        }
        footer={<Pagination count={totalCount || 0} />}
        hasBorder={true}
      />
    );
  }
}

export default MainList;
