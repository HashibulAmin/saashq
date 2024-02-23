import ControlLabel from '@saashq/ui/src/components/form/Label';
import DateControl from '@saashq/ui/src/components/form/DateControl';
import FormGroup from '@saashq/ui/src/components/form/Group';
import Icon from '@saashq/ui/src/components/Icon';
import moment from 'moment';
import queryString from 'query-string';
import React from 'react';
import Tip from '@saashq/ui/src/components/Tip';
import { router } from '@saashq/ui/src/utils';
import { __ } from 'coreui/utils';
import { DateContainer } from '@saashq/ui/src/styles/main';
import { MenuFooter } from '../../styles';
import { SidebarList as List } from '@saashq/ui/src/layout';
import { Wrapper } from '@saashq/ui/src/layout';
import { IQueryParams } from '@saashq/ui/src/types';
import Button from '@saashq/ui/src/components/Button';
import SelectPos from './SelectPos';
import SelectTeamMembers from '@saashq/ui/src/team/containers/SelectTeamMembers';

interface Props {
  history: any;
  queryParams: any;
}

type State = {
  filterParams: IQueryParams;
};

const { Section } = Wrapper.Sidebar;

const generateQueryParams = ({ location }) => {
  return queryString.parse(location.search);
};

class CoverSidebar extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      filterParams: this.props.queryParams
    };
  }

  isFiltered = (): boolean => {
    const params = generateQueryParams(this.props.history);

    for (const param in params) {
      if (['posId', 'startDate', 'endDate', 'userId'].includes(param)) {
        return true;
      }
    }

    return false;
  };

  clearFilter = () => {
    const params = generateQueryParams(this.props.history);
    router.removeParams(this.props.history, ...Object.keys(params));
  };

  setFilter = (name, value) => {
    const { filterParams } = this.state;
    this.setState({ filterParams: { ...filterParams, [name]: value } });
  };

  onchangeType = e => {
    const { filterParams } = this.state;
    const value = (e.currentTarget as HTMLInputElement).value;

    const filters: IQueryParams = {
      ...filterParams,
      type: value
    };

    delete filters.jobReferId;
    delete filters.productIds;
    delete filters.productCategoryId;

    this.setState({
      filterParams: filters
    });
  };

  onSelectDate = (value, name) => {
    const strVal = moment(value).format('YYYY-MM-DD HH:mm');
    this.setFilter(name, strVal);
  };

  runFilter = () => {
    const { filterParams } = this.state;

    router.setParams(this.props.history, { ...filterParams, page: 1 });
  };

  render() {
    const { filterParams } = this.state;

    return (
      <Wrapper.Sidebar hasBorder>
        <Section.Title>
          {__('Filters')}
          <Section.QuickButtons>
            {this.isFiltered() && (
              <a href="#cancel" tabIndex={0} onClick={this.clearFilter}>
                <Tip text={__('Clear filter')} placement="bottom">
                  <Icon icon="cancel-1" />
                </Tip>
              </a>
            )}
          </Section.QuickButtons>
        </Section.Title>
        <List id="SettingsSidebar">
          <FormGroup>
            <ControlLabel>{__('POS')}</ControlLabel>
            <SelectPos
              label="Choose pos"
              name="posId"
              initialValue={filterParams.posId}
              onSelect={posId => this.setFilter('posId', posId)}
              customOption={{ value: '', label: '...Clear user filter' }}
              multi={false}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>User</ControlLabel>
            <SelectTeamMembers
              label="Choose users"
              name="userId"
              initialValue={filterParams.userId}
              onSelect={userId => this.setFilter('userId', userId)}
              customOption={{ value: '', label: '...Clear user filter' }}
              multi={false}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel required={true}>{__(`Start Date`)}</ControlLabel>
            <DateContainer>
              <DateControl
                name="startDate"
                dateFormat="YYYY/MM/DD"
                timeFormat={true}
                placeholder="Choose date"
                value={filterParams.startDate || ''}
                onChange={value => this.onSelectDate(value, 'startDate')}
              />
            </DateContainer>
          </FormGroup>
          <FormGroup>
            <ControlLabel required={true}>{__(`End Date`)}</ControlLabel>
            <DateContainer>
              <DateControl
                name="endDate"
                dateFormat="YYYY/MM/DD"
                timeFormat={true}
                placeholder="Choose date"
                value={filterParams.endDate || ''}
                onChange={value => this.onSelectDate(value, 'endDate')}
              />
            </DateContainer>
          </FormGroup>
        </List>
        <MenuFooter>
          <Button
            block={true}
            btnStyle="success"
            uppercase={false}
            onClick={this.runFilter}
            icon="filter"
          >
            {__('Filter')}
          </Button>
        </MenuFooter>
      </Wrapper.Sidebar>
    );
  }
}

export default CoverSidebar;
