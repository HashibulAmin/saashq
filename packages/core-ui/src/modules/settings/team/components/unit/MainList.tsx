import {
  FilterContainer,
  InputBar,
  LeftActionBar,
  Title,
} from '@saashq/ui-settings/src/styles';
import { IUnit, UnitsMainQueryResponse } from '@saashq/ui/src/team/types';
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

type Props = {
  listQuery: UnitsMainQueryResponse;
  deleteUnits: (ids: string[], callback: () => void) => void;
  queryParams: any;
  history: any;
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

  remove = (_id?: string) => {
    if (_id) {
      this.props.deleteUnits([_id], () => this.setState({ selectedItems: [] }));
    } else {
      this.props.deleteUnits(this.state.selectedItems, () =>
        this.setState({ selectedItems: [] }),
      );
    }
  };

  renderForm() {
    const trigger = (
      <Button btnStyle="success" icon="plus-circle">
        {__('Přidat Jednotku')}
      </Button>
    );

    const content = ({ closeModal }) => (
      <Form queryType="units" showMainList={true} closeModal={closeModal} />
    );

    return (
      <ModalTrigger
        title="Přidat Jednotku"
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

  renderRow(unit: IUnit) {
    const { selectedItems } = this.state;

    const handleSelect = () => {
      if (selectedItems.includes(unit._id)) {
        const removedSelectedItems = selectedItems.filter(
          (selectItem) => selectItem !== unit._id,
        );
        return this.setState({ selectedItems: removedSelectedItems });
      }
      this.setState({ selectedItems: [...selectedItems, unit._id] });
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
      <tr key={unit._id}>
        <td onClick={onclick}>
          <FormControl
            componentClass="checkbox"
            checked={selectedItems.includes(unit._id)}
            onClick={handleSelect}
          />
        </td>
        <td>{__(unit.code)}</td>
        <td>{__(unit.title)}</td>
        <td>{__(unit?.supervisor?.email)}</td>
        <td>{__(unit?.department?.title || '')}</td>
        <td>{unit.userIds?.length || 0}</td>
        <td>{unit.userCount}</td>
        <td>
          <ActionButtons>
            <ModalTrigger
              key={unit._id}
              title="Upravit jednotku"
              content={({ closeModal }) => (
                <Form closeModal={closeModal} item={unit} queryType="units" />
              )}
              trigger={trigger}
            />
            <Tip text={__('Vymazat')} placement="top">
              <Button
                btnStyle="link"
                onClick={() => this.remove(unit._id)}
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

    const units = listQuery.unitsMain.list || [];

    const { selectedItems } = this.state;

    const handleSelectAll = () => {
      if (!selectedItems.length) {
        const unitIds = units.map((unit) => unit._id);
        return this.setState({ selectedItems: unitIds });
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
                checked={units?.length === selectedItems.length}
                onClick={handleSelectAll}
              />
            </th>
            <th>{__('Code')}</th>
            <th>{__('Titul')}</th>
            <th>{__('Supervisor')}</th>
            <th>{__('Oddělení')}</th>
            <th>{__('Team member count')}</th>
            <th>{__('Akce')}</th>
          </tr>
        </thead>
        <tbody>{(units || []).map((unit) => this.renderRow(unit))}</tbody>
      </Table>
    );
  }
  render() {
    const { listQuery } = this.props;

    const { totalCount } = listQuery.unitsMain;

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
            title="Jednotky"
            breadcrumb={[
              { title: __('Nastavení'), link: '/settings' },
              { title: __('Jednotky') },
            ]}
          />
        }
        actionBar={
          <Wrapper.ActionBar
            right={rightActionBar}
            left={
              <LeftActionBar>
                <Title capitalize={true}>
                  {__('Jednotky')}&nbsp;
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
            count={totalCount}
            data={this.renderContent()}
            emptyImage="/images/actions/25.svg"
            emptyText="Žádné jednotky"
          />
        }
        leftSidebar={
          <LeftSidebar header={<SidebarHeader />} hasBorder={true}>
            <SettingsSideBar />
          </LeftSidebar>
        }
        footer={<Pagination count={totalCount} />}
        hasBorder={true}
      />
    );
  }
}

export default MainList;
