import Button from '@saashq/ui/src/components/Button';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import Icon from '@saashq/ui/src/components/Icon';
import Info from '@saashq/ui/src/components/Info';
import { __ } from '@saashq/ui/src/utils';
import { IField, IFieldLogic } from '@saashq/ui/src/types';
import { LinkButton } from '@saashq/ui/src/styles/main';
import React, { useEffect, useState } from 'react';
import FieldLogic from './FieldLogic';

type Props = {
  onFieldChange: (
    name: string,
    value: string | boolean | string[] | IFieldLogic[],
  ) => void;
  fields: IField[];
  currentField: IField;
};

const showOptions = [
  { value: 'show', label: 'Zobrazit toto pole' },
  { value: 'hide', label: 'Skryjte toto pole' },
];

function FieldLogics(props: Props) {
  const { currentField, onFieldChange } = props;
  const subFieldIds = props.fields
    .filter((f) => f.subFieldIds)
    .map((f) => f.subFieldIds)
    .flat();

  const fields = props.fields.filter(
    (f) => f._id !== currentField._id && !subFieldIds.includes(f._id),
  );

  const [logics, setLogics] = useState(
    (currentField.logics || []).map(
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
    onFieldChange('logics', logics);
  }, [logics, onFieldChange]);

  const [isEnabled, toggleState] = useState(
    currentField.logics ? currentField.logics.length > 0 : false,
  );

  const onChangeLogicAction = (e) =>
    onFieldChange('logicAction', e.currentTarget.value);

  const onChangeLogic = (name, value, index) => {
    // find current editing one
    const currentLogic = logics.find((l, i) => i === index);

    // set new value
    if (currentLogic) {
      currentLogic[name] = value;
    }

    setLogics(logics);
    onFieldChange('logics', logics);
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
    onFieldChange('logicAction', 'show');
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
              defaultValue={currentField.logicAction}
              name="logicAction"
              options={showOptions}
              onChange={onChangeLogicAction}
            />
          </FormGroup>
          {logics.map((logic, index) => (
            <FieldLogic
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
          'Vytvořte pravidla pro zobrazení nebo skrytí tohoto prvku v závislosti na hodnotách ostatních polí',
        )}
      </Info>
      {renderContent()}
    </>
  );
}

export default FieldLogics;
