import React from 'react';
import Icon from '@saashq/ui/src/components/Icon';
import { LinkButton } from '@saashq/ui/src/styles/main';
import { __ } from 'coreui/utils';
import { Alert } from '@saashq/ui/src/utils';
import Select from 'react-select-plus';
import Table from '@saashq/ui/src/components/table';
import Button from '@saashq/ui/src/components/Button';
import { FormControl } from '@saashq/ui/src/components/form';

const ExpensesForm = ({
  expensesQueryData,
  expensesData,
  onChangeExpensesData,
}) => {
  const onChangeField = (field, value, expenseId: string) => {
    const updatedExpensesData = expensesData;
    if (updatedExpensesData) {
      const expenseData = updatedExpensesData.find((p) => p._id === expenseId);
      if (expenseData) {
        expenseData[field] = value;
      }
      onChangeExpensesData(updatedExpensesData);
    }
  };

  const deleteElement = (index) => {
    const newItems = [...expensesData];
    newItems.splice(index, 1);
    onChangeExpensesData(newItems);
  };

  const addElement = () => {
    if (!nameOptions.length) {
      Alert.error('Vyplňte prosím výdajové odkazy');
      return;
    }

    const newElement = {
      _id: Math.random().toString(),
      type: typeOptions[0].value,
      name: nameOptions[0].value,
      value: 0,
    };

    onChangeExpensesData([...expensesData, newElement]);
  };
  const options = [
    { value: 'quantity', label: 'podle množství' },
    { value: 'amount', label: 'podle částky' },
  ];

  const nameOptions = (expensesQueryData || []).map((result) => ({
    value: result.name,
    label: result.name,
  }));

  const typeOptions = options.map((result) => ({
    value: result.value,
    label: result.value,
  }));

  return (
    <>
      <Table whiteSpace="nowrap" hover={true}>
        <thead>
          <tr>
            <th>{__('Typ')}</th>
            <th>{__('Název')}</th>
            <th>{__('Cena')}</th>
            <th>{__('Akce')}</th>
          </tr>
        </thead>
        <tbody>
          {(expensesData || []).map((element, index) => (
            <tr key={index}>
              <td>
                <Select
                  placeholder={__('Vyberte typ')}
                  value={element.type}
                  options={typeOptions}
                  onChange={(value: any) =>
                    onChangeField('type', value.value, element._id)
                  }
                  clearable={false}
                />
              </td>

              <td>
                <Select
                  placeholder={__('Vyberte jméno')}
                  value={element.name}
                  options={nameOptions}
                  onChange={(value: any) =>
                    onChangeField('name', value.value, element._id)
                  }
                  clearable={false}
                />
              </td>
              <td>
                <FormControl
                  type="number"
                  defaultValue={element.value}
                  placeholder="Zadejte výdaj"
                  onChange={(e: any) =>
                    onChangeField('value', e.target.value, element._id)
                  }
                />
              </td>
              <td>
                <Button
                  btnStyle="simple"
                  type="button"
                  icon="times"
                  onClick={() => deleteElement(index)}
                ></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button
        btnStyle="simple"
        type="button"
        icon="plus-1"
        onClick={addElement}
      >
        {__('Přidejte další výdaj')}
      </Button>
    </>
  );
};
export default ExpensesForm;
