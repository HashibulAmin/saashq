import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { IField } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils/core';
import React from 'react';
import Select from 'react-select-plus';
import Info from '@saashq/ui/src/components/Info';

type Props = {
  field?: IField;
  fields: IField[];
  onChange: (field: any) => void;
};

const GroupedField = (props: Props) => {
  const { field } = props;
  const [subFieldIds, setSubFieldIds] = React.useState<string[]>(
    field?.subFieldIds || [],
  );

  const otherFields = props.fields.filter((f) => {
    if (f.type === 'parentField') {
      return false;
    }

    if (f._id === field?._id) {
      return false;
    }

    return true;
  });

  if (otherFields.length === 0) {
    return <p>Zatím zde nejsou žádná pole.</p>;
  }

  React.useEffect(() => {
    if (props.field) {
      setSubFieldIds(props.field.subFieldIds || []);
    }
  }, [props.field]);

  return (
    <FormGroup>
      <ControlLabel>Fields</ControlLabel>
      <p>{__('Vyberte podpole')}</p>
      <Info>
        {__(
          'Poznámka: Pokud mají podpole logiku, budou ignorována. Ale bude použita logika hlavního pole.',
        )}
      </Info>
      <Select
        placeholder={__('Vybrat')}
        options={otherFields.map((f) => ({ label: f.text, value: f._id }))}
        onChange={(values: any) => {
          props.onChange({
            ...field,
            subFieldIds: values.map((v) => v.value),
          });
        }}
        clearable={true}
        value={subFieldIds}
        multi={true}
      />
    </FormGroup>
  );
};

export default GroupedField;
