import Button from '@saashq/ui/src/components/Button';
import Icon from '@saashq/ui/src/components/Icon';
import Info from '@saashq/ui/src/components/Info';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { LinkButton } from '@saashq/ui/src/styles/main';
import { IFieldLogic } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils';
import React, { useEffect, useState } from 'react';
import { FieldsCombinedByType } from '../types';

import PropertyLogic from './PropertyLogic';

type Props = {
  action: string;
  fields: FieldsCombinedByType[];
  logics: IFieldLogic[];
  onActionChange: (value: string) => void;
  onLogicsChange: (logics: IFieldLogic[]) => void;
};

const showOptions = [
  { value: 'show', label: 'Zobrazit toto pole' },
  { value: 'hide', label: 'Skryjte toto pole' },
];

function FieldLogics(props: Props) {
  const { fields, onLogicsChange, onActionChange } = props;

  const [logics, setLogics] = useState(
    (props.logics || []).map(
      ({ fieldId, tempFieldId, logicOperator, logicValue }) => {
        return {
          fieldId,
          tempFieldId,
          logicOperator,
          logicValue,
        };
      },
    ),
  );

  useEffect(() => {
    onLogicsChange(logics);
  }, [logics, onLogicsChange]);

  const [isEnabled, toggleState] = useState(
    props.logics ? props.logics.length > 0 : false,
  );

  const onChangeLogic = (name, value, index) => {
    // find current editing one
    const currentLogic = logics.find((l, i) => i === index);

    // set new value
    if (currentLogic) {
      currentLogic[name] = value;
    }

    setLogics(logics);
    onLogicsChange(logics);
  };

  const addLogic = () => {
    setLogics([
      ...logics,
      {
        fieldId: '',
        tempFieldId: '',
        logicOperator: 'is',
        logicValue: '',
      },
    ]);
  };

  const onEnableLogic = () => {
    toggleState(true);
    onActionChange('show');
    addLogic();
  };

  const removeLogic = (index: number) => {
    setLogics(logics.filter((l, i) => i !== index));
  };

  const renderContent = () => {
    if (isEnabled) {
      return (
        <>
          <FormGroup>
            <FormControl
              componentClass="select"
              value={props.action}
              name="logicAction"
              options={showOptions}
              onChange={(e: any) => {
                onActionChange(e.currentTarget.value);
              }}
            />
          </FormGroup>
          {logics.map((logic, index) => (
            <PropertyLogic
              key={index}
              fields={fields}
              logic={logic}
              onChangeLogic={onChangeLogic}
              removeLogic={removeLogic}
              index={index}
            />
          ))}

          <LinkButton onClick={addLogic}>
            <Icon icon="plus-1" /> Přidat Logické Pravidlo
          </LinkButton>
        </>
      );
    }

    return (
      <Button
        block={true}
        btnStyle="success"
        icon="check-circle"
        onClick={onEnableLogic}
      >
        Povolit Logiku
      </Button>
    );
  };

  return (
    <>
      <Info>
        {__(
          'Vytvořte pravidla pro zobrazení nebo skrytí tohoto prvku v závislosti na hodnotách ostatních vlastností',
        )}
      </Info>
      {renderContent()}
    </>
  );
}

export default FieldLogics;
