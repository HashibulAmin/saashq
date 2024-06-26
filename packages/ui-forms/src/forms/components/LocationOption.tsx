import Button from '@saashq/ui/src/components/Button';
import {
  ControlLabel,
  FormControl,
  FormGroup,
} from '@saashq/ui/src/components/form';
import { __ } from '@saashq/ui/src/utils';
import { ILocationOption } from '@saashq/ui/src/types';
import React from 'react';
import { LogicItem, LogicRow, RowFill, RowSmall } from '../styles';

type Props = {
  onChangeOption: (option: ILocationOption, index: number) => void;
  option: ILocationOption;
  index: number;
  removeOption: (index: number) => void;
};

function LocationOption(props: Props) {
  const { option, onChangeOption, removeOption, index } = props;

  const onChangeDescription = (e) => {
    option.description = e.target.value;
    onChangeOption(option, index);
  };

  const onChangeLat = (e) => {
    option.lat = Number(e.target.value);

    onChangeOption(option, index);
  };

  const onChangeLng = (e) => {
    option.lng = Number(e.target.value);
    onChangeOption(option, index);
  };

  const remove = () => {
    removeOption(index);
  };

  return (
    <LogicItem>
      <LogicRow>
        <RowFill>
          <LogicRow>
            <RowSmall>
              <ControlLabel htmlFor="lat">
                {__('Zeměpisná šířka')}:
              </ControlLabel>
              <FormControl
                defaultValue={option.lat}
                value={option.lat}
                name="lat"
                onChange={onChangeLat}
                type="number"
              />
            </RowSmall>
            <RowFill>
              <ControlLabel htmlFor="lng">
                {__('Zeměpisná délka')}:
              </ControlLabel>
              <FormControl
                defaultValue={option.lng}
                value={option.lng}
                name="lng"
                onChange={onChangeLng}
                type="number"
              />
            </RowFill>
          </LogicRow>
          <FormGroup>
            <ControlLabel htmlFor="description">{__('Popis')}:</ControlLabel>
            <FormControl
              defaultValue={option.description}
              name="description"
              onChange={onChangeDescription}
            />
          </FormGroup>
        </RowFill>
        <Button onClick={remove} btnStyle="danger" icon="times" />
      </LogicRow>
    </LogicItem>
  );
}

export default LocationOption;
