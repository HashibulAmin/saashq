import Button from '@saashq/ui/src/components/Button';
import DateControl from '@saashq/ui/src/components/form/DateControl';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import Icon from '@saashq/ui/src/components/Icon';
import Tip from '@saashq/ui/src/components/Tip';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import SelectBranches from '@saashq/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@saashq/ui/src/team/containers/SelectDepartments';
import SelectUnits from '@saashq/ui/src/team/containers/SelectUnits';
import SelectTeamMembers from '@saashq/ui/src/team/containers/SelectTeamMembers';

import { router, __ } from '@saashq/ui/src/utils';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SidebarFilters } from '../styles';

type Props = {
  params: any;
};

const { Section } = Wrapper.Sidebar;

export default function Sidebar(props: Props) {
  const history = useHistory();

  const [filters, setFilters] = useState(props.params);
  const { branch, department, unit, date, contribution, endDate } = filters;

  const clearFilter = () => {
    router.removeParams(
      history,
      'branch',
      'department',
      'unit',
      'contribution',
      'date',
      'endDate',
      'page',
    );
  };

  const runFilter = () => {
    router.setParams(history, { ...filters });
  };

  const setFilter = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  return (
    <Wrapper.Sidebar hasBorder>
      <Section.Title>
        {__('Filters')}
        <Section.QuickButtons>
          {(branch ||
            department ||
            unit ||
            contribution ||
            date ||
            endDate) && (
            <a href="#cancel" tabIndex={0} onClick={clearFilter}>
              <Tip text={__('Clear filter')} placement="bottom">
                <Icon icon="cancel-1" />
              </Tip>
            </a>
          )}
        </Section.QuickButtons>
      </Section.Title>
      <SidebarFilters>
        <FormGroup>
          <ControlLabel>Datum zahájení</ControlLabel>
          <DateControl
            value={date}
            name="date"
            placeholder={'Datum zahájení'}
            dateFormat={'YYYY-MM-DD'}
            onChange={(date: any) =>
              setFilter('date', dayjs(date).format('YYYY-MM-DD'))
            }
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Datum ukončení</ControlLabel>
          <DateControl
            value={endDate}
            name="endDate"
            placeholder={'Datum ukončení'}
            dateFormat={'YYYY-MM-DD'}
            onChange={(endDate: any) =>
              setFilter('endDate', dayjs(endDate).format('YYYY-MM-DD'))
            }
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Větev</ControlLabel>
          <SelectBranches
            label="Vyberte pobočku"
            name="branch"
            initialValue={branch || ''}
            customOption={{
              value: '',
              label: '...Vymazat filtr větví',
            }}
            onSelect={(branch) => setFilter('branch', branch)}
            multi={false}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Oddělení</ControlLabel>
          <SelectDepartments
            label="Vyberte oddělení"
            name="department"
            initialValue={department || ''}
            customOption={{
              value: '',
              label: '...Vymazat filtr oddělení',
            }}
            onSelect={(department) => setFilter('department', department)}
            multi={false}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Jednotky</ControlLabel>
          <SelectUnits
            label="Vyberte Jednotky"
            name="unit"
            initialValue={unit || ''}
            customOption={{
              value: '',
              label: '...Vyčistěte filtr jednotky',
            }}
            onSelect={(unit) => setFilter('unit', unit)}
            multi={false}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Člen týmu</ControlLabel>
          <SelectTeamMembers
            label="Vyberte Uživatel"
            name="contribution"
            initialValue={contribution || ''}
            customOption={{
              value: '',
              label: '...Vymazat uživatelský filtr',
            }}
            onSelect={(contribution) => setFilter('contribution', contribution)}
            multi={false}
          />
        </FormGroup>
        <FormGroup>
          <Button onClick={runFilter}>Filtr</Button>
        </FormGroup>
      </SidebarFilters>
    </Wrapper.Sidebar>
  );
}
