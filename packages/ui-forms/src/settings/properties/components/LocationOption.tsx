import Button from '@saashq/ui/src/components/Button';
import {
  ControlLabel,
  FormControl,
  FormGroup,
} from '@saashq/ui/src/components/form';
import { ILocationOption } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils';
import React, { useEffect } from 'react';
import {
  LogicItem,
  LogicRow,
  RowSmall,
} from '@saashq/ui-forms/src/forms/styles';
import { Column } from '@saashq/ui/src/styles/main';

type Props = {
  onChangeOption: (option: ILocationOption, index: number) => void;
  option: ILocationOption;
  index: number;
  removeOption?: (index: number) => void;
};

function LocationOption(props: Props) {
  const { option, onChangeOption, removeOption, index } = props;

  const onChangeDescription = (e) => {
    option.description = e.target.value;
    onChangeOption(option, index);
  };

  const onChangeLat = (e) => {
    onChangeOption({ ...option, lat: Number(e.target.value) }, index);
  };

  const onChangeLng = (e) => {
    onChangeOption({ ...option, lng: Number(e.target.value) }, index);
  };

  const remove = () => {
    removeOption && removeOption(index);
  };

  return (
    <LogicItem>
      <LogicRow>
        <Column>
          <LogicRow>
            <RowSmall>
              <ControlLabel htmlFor="lat">
                {__('Zeměpisná šířka')}:
              </ControlLabel>
              <FormControl
                value={option.lat}
                name="lat"
                onChange={onChangeLat}
                type="number"
              />
            </RowSmall>
            <Column>
              <ControlLabel htmlFor="lng">
                {__('Zeměpisná délka')}:
              </ControlLabel>
              <FormControl
                value={option.lng}
                name="lng"
                onChange={onChangeLng}
                type="number"
              />
            </Column>
          </LogicRow>
          <FormGroup>
            <ControlLabel htmlFor="description">{__('Popis')}:</ControlLabel>
            <FormControl
              defaultValue={option.description}
              name="description"
              onChange={onChangeDescription}
            />
          </FormGroup>
        </Column>
        {removeOption && (
          <Button onClick={remove} btnStyle="danger" icon="times" />
        )}
      </LogicRow>
    </LogicItem>
  );
}

export default LocationOption;
