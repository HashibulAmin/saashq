import {
  CustomRangeContainer,
  FilterBox,
  FilterButton,
  MenuFooter,
  RightMenuContainer,
  TabContent,
} from '../styles/rightMenu';
import { DATERANGES, PRIORITIES } from '../constants';
import { TabTitle, Tabs } from '@saashq/ui/src/components/tabs';

import Archive from './Archive';
import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import DateControl from '@saashq/ui/src/components/form/DateControl';
import FormControl from '@saashq/ui/src/components/form/Control';
import { IOption } from '@saashq/ui/src/types';
import { IOptions } from '../types';
import Icon from '@saashq/ui/src/components/Icon';
import RTG from 'react-transition-group';
import React from 'react';
import SegmentFilter from '../containers/SegmentFilter';
import Select from 'react-select-plus';
import SelectBranches from '@saashq/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@saashq/ui/src/team/containers/SelectDepartments';
import SelectLabel from './label/SelectLabel';
import SelectTeamMembers from '@saashq/ui/src/team/containers/SelectTeamMembers';
import { __ } from 'coreui/utils';
import dayjs from 'dayjs';
import { isEnabled } from '@saashq/ui/src/utils/core';

type Props = {
  onSearch: (search: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
  queryParams: any;
  link: string;
  extraFilter?: React.ReactNode;
  options: IOptions;
  isFiltered: boolean;
  clearFilter: () => void;
};

type StringState = {
  currentTab: string;
};

type State = {
  showMenu: boolean;
  dateRangeType: string;
  dateRange: any;
} & StringState;

export default class RightMenu extends React.Component<Props, State> {
  private wrapperRef;

  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'Filter',
      dateRangeType: '',
      showMenu: false,
      dateRange: {} as any,
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside = (event) => {
    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(event.target) &&
      this.state.currentTab === 'Filter'
    ) {
      this.setState({ showMenu: false });
    }
  };

  toggleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
  };

  onSearch = (e: React.KeyboardEvent<Element>) => {
    if (e.key === 'Enter') {
      const target = e.currentTarget as HTMLInputElement;
      this.props.onSearch(target.value || '');
    }
  };

  onChange = (name: string, value: string) => {
    this.setState({ [name]: value } as Pick<StringState, keyof StringState>);
  };

  onTypeChange = (type) => {
    return this.setState({ dateRangeType: type.value }, () => {
      switch (this.state.dateRangeType) {
        case 'createdAt':
          return this.setState({
            dateRange: {
              startDate: 'createdStartDate',
              endDate: 'createdEndDate',
            },
          });
        case 'stageChangedDate':
          return this.setState({
            dateRange: {
              startDate: 'stateChangedStartDate',
              endDate: 'stateChangedEndDate',
            },
          });
        case 'startDate':
          return this.setState({
            dateRange: {
              startDate: 'startDateStartDate',
              endDate: 'startDateEndDate',
            },
          });
        case 'closeDate':
          return this.setState({
            dateRange: {
              startDate: 'closeDateStartDate',
              endDate: 'closeDateEndDate',
            },
          });
      }
    });
  };

  startDateValue = () => {
    const { queryParams } = this.props;

    if (queryParams.createdStartDate) {
      return queryParams.createdStartDate;
    }

    if (queryParams.stateChangedStartDate) {
      return queryParams.stateChangedStartDate;
    }

    if (queryParams.startDateStartDate) {
      return queryParams.startDateStartDate;
    }

    if (queryParams.closeDateStartDate) {
      return queryParams.closeDateStartDate;
    }
  };

  endDateValue = () => {
    const { queryParams } = this.props;

    if (queryParams.createdEndDate) {
      return queryParams.createdEndDate;
    }

    if (queryParams.stateChangedEndDate) {
      return queryParams.stateChangedEndDate;
    }

    if (queryParams.startDateEndDate) {
      return queryParams.startDateEndDate;
    }

    if (queryParams.closeDateEndDate) {
      return queryParams.closeDateEndDate;
    }
  };

  dateRangeType = () => {
    const { queryParams } = this.props;

    if (queryParams.createdStartDate || queryParams.createdEndDate) {
      return 'createdAt';
    }

    if (queryParams.stateChangedStartDate || queryParams.stateChangedEndDate) {
      return 'stageChangedDate';
    }

    if (queryParams.startDateStartDate || queryParams.startDateEndDate) {
      return 'startDate';
    }

    if (queryParams.closeDateStartDate || queryParams.closeDateEndDate) {
      return 'closeDate';
    }
  };

  onChangeRangeFilter = (kind: string, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';

    const { queryParams, onSelect } = this.props;

    if (typeof kind === 'undefined') {
      return null;
    }

    if (queryParams[kind] !== formattedDate) {
      onSelect(formattedDate, kind);
    }
  };

  renderDates() {
    const { link } = this.props;

    if (link.includes('calendar')) {
      return null;
    }

    return (
      <>
        {this.renderLink('Přiděleno mně', 'assignedToMe', 'true')}
        {this.renderLink('Do zítřka', 'closeDateType', 'nextDay')}
        {this.renderLink('Termín příští týden', 'closeDateType', 'nextWeek')}
        {this.renderLink(
          'Splatnost příští měsíc',
          'closeDateType',
          'nextMonth',
        )}
        {this.renderLink(
          'Nemá žádné datum uzavření',
          'closeDateType',
          'noCloseDate',
        )}
        {this.renderLink('Zpožděný', 'overdue', 'closeDateType')}
      </>
    );
  }

  renderLink(label: string, key: string, value: string) {
    const { onSelect, queryParams } = this.props;

    const selected = queryParams[key] === value;

    const onClick = (_e) => {
      onSelect(value, key);
    };

    return (
      <FilterButton selected={selected} onClick={onClick}>
        {__(label)}
        {selected && <Icon icon="check-1" size={14} />}
      </FilterButton>
    );
  }

  renderFilter() {
    const { queryParams, onSelect, extraFilter, options } = this.props;
    const { dateRangeType, dateRange } = this.state;

    const priorityValues = PRIORITIES.map((p) => ({
      label: p,
      value: p,
    }));
    const daterangeValues = DATERANGES.map((p) => ({
      label: p.name,
      value: p.value,
    }));
    const priorities = queryParams ? queryParams.priority : [];

    const onPrioritySelect = (ops: IOption[]) =>
      onSelect(
        ops.map((option) => option.value),
        'priority',
      );

    return (
      <FilterBox>
        <FormControl
          defaultValue={queryParams.search}
          placeholder={__('Vyhledávání ...')}
          onKeyPress={this.onSearch}
          autoFocus={true}
        />

        <SelectTeamMembers
          label="Filtrujte podle vytvořených členů"
          name="userIds"
          queryParams={queryParams}
          onSelect={onSelect}
        />
        <SelectBranches
          name="branchIds"
          label="Filtrujte podle větví"
          initialValue={queryParams.branchIds}
          onSelect={onSelect}
        />
        <SelectDepartments
          name="departmentIds"
          label="Filtrujte podle oddělení"
          initialValue={queryParams.departmentIds}
          onSelect={onSelect}
        />
        <Select
          placeholder={__('Filtrujte podle priority')}
          value={priorities}
          options={priorityValues}
          name="priority"
          onChange={onPrioritySelect}
          multi={true}
          loadingPlaceholder={__('Načítání...')}
        />

        <SelectTeamMembers
          label="Filtrujte podle členů týmu"
          name="assignedUserIds"
          queryParams={queryParams}
          onSelect={onSelect}
          customOption={{
            value: '',
            label: 'Nikomu přiděleno',
          }}
        />

        <SelectLabel
          queryParams={queryParams}
          name="labelIds"
          onSelect={onSelect}
          filterParams={{
            pipelineId: queryParams.pipelineId || '',
          }}
          multi={true}
          customOption={{ value: '', label: 'Nebyl vybrán žádný štítek' }}
        />

        {extraFilter}

        <ControlLabel>Časové období:</ControlLabel>

        <Select
          placeholder={__('Vyberte typ období')}
          value={this.dateRangeType() || dateRangeType}
          options={daterangeValues}
          name="daterangeType"
          onChange={this.onTypeChange}
        />

        <CustomRangeContainer>
          <DateControl
            value={this.startDateValue()}
            required={false}
            name={dateRange.startDate}
            onChange={(date) =>
              this.onChangeRangeFilter(dateRange.startDate, date)
            }
            placeholder={'Datum zahájení'}
            dateFormat={'YYYY-MM-DD'}
          />

          <DateControl
            value={this.endDateValue()}
            required={false}
            name={dateRange.endDate}
            placeholder={'Datum ukončení'}
            onChange={(date) =>
              this.onChangeRangeFilter(dateRange.endDate, date)
            }
            dateFormat={'YYYY-MM-DD'}
          />
        </CustomRangeContainer>

        {this.renderDates()}

        {isEnabled('segments') && (
          <SegmentFilter
            type={`cards:${options.type}`}
            boardId={queryParams.id || ''}
            pipelineId={queryParams.pipelineId || ''}
          />
        )}
      </FilterBox>
    );
  }

  renderTabContent() {
    if (this.state.currentTab === 'Filter') {
      const { isFiltered, clearFilter } = this.props;

      return (
        <>
          <TabContent>{this.renderFilter()}</TabContent>
          {isFiltered && (
            <MenuFooter>
              <Button
                block={true}
                btnStyle="warning"
                onClick={clearFilter}
                icon="times-circle"
              >
                {__('Vymazat Filtr')}
              </Button>
            </MenuFooter>
          )}
        </>
      );
    }

    const { queryParams, options } = this.props;

    return (
      <TabContent>
        <Archive queryParams={queryParams} options={options} />
      </TabContent>
    );
  }

  render() {
    const tabOnClick = (name: string) => {
      this.onChange('currentTab', name);
    };

    const { currentTab, showMenu } = this.state;
    const { isFiltered } = this.props;

    return (
      <div ref={this.setWrapperRef}>
        {isFiltered && (
          <Button
            btnStyle="warning"
            icon="times-circle"
            onClick={this.props.clearFilter}
          >
            {__('Vymazat Filtrr')}
          </Button>
        )}
        <Button btnStyle="simple" icon="bars" onClick={this.toggleMenu}>
          {showMenu ? __('Skrýt Nabídku') : __('Zobrazit Nabídku')}
        </Button>

        <RTG.CSSTransition
          in={this.state.showMenu}
          timeout={300}
          classNames="slide-in-right"
          unmountOnExit={true}
        >
          <RightMenuContainer>
            <Tabs full={true}>
              <TabTitle
                className={currentTab === 'Filter' ? 'active' : ''}
                onClick={tabOnClick.bind(this, 'Filter')}
              >
                {__('Filtr')}
              </TabTitle>
              <TabTitle
                className={currentTab === 'Archived items' ? 'active' : ''}
                onClick={tabOnClick.bind(this, 'Archivované položky')}
              >
                {__('Archivované položky')}
              </TabTitle>
            </Tabs>
            {this.renderTabContent()}
          </RightMenuContainer>
        </RTG.CSSTransition>
      </div>
    );
  }
}
