import React from 'react';
import SelectTeamMembers from '@saashq/ui/src/team/containers/SelectTeamMembers';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { ControlLabel, FormControl } from '@saashq/ui/src/components/form';
import { __ } from '@saashq/ui/src/utils/core';
import { Operator } from '../types';
import Button from '@saashq/ui/src/components/Button';

type Props = {
  operator?: Operator;
  index: number;
  formProps?: any;
  onChangeDetails: (name: string, value: string, index: number) => void;
  onChange: (index: number, value: any) => void;
  removeOperator: (index: number) => void;
};

const OperatorForm = (props: Props) => {
  const {
    formProps,
    operator,
    onChange,
    onChangeDetails,
    removeOperator,
    index,
  } = props;

  const onChangeDetail = (e: any) => {
    onChangeDetails(e.target.name, e.target.value, index);
  };

  const onSelectUser = (value) => {
    onChange(index, { ...operator, userId: value });
  };

  const remove = () => {
    removeOperator(index);
  };

  return (
    <FormGroup>
      <FormGroup>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '90%' }}>
            <SelectTeamMembers
              label={`Vyberte operátora ${index + 1}`}
              name="selectedMembers"
              multi={false}
              initialValue={(operator && operator.userId) || ''}
              onSelect={onSelectUser}
            />
          </div>
          <Button
            onClick={remove}
            btnStyle="danger"
            icon="times"
            style={{ padding: '7px 15px' }}
          />
        </div>
      </FormGroup>
      <FormGroup>
        <ControlLabel required={true}>
          {__('Uživatelské jméno GrandStream')}
        </ControlLabel>

        <FormControl
          {...formProps}
          defaultValue={(operator && operator.gsUsername) || ''}
          name={`gsUsername`}
          onChange={onChangeDetail}
          required={true}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel required={true}>{__('heslo GrandStream')}</ControlLabel>

        <FormControl
          {...formProps}
          name={`gsPassword`}
          defaultValue={(operator && operator.gsPassword) || ''}
          onChange={onChangeDetail}
          required={true}
        />
      </FormGroup>
    </FormGroup>
  );
};

export default OperatorForm;
