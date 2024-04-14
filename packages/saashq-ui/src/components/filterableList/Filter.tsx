import FormControl from '../form/Control';
import { __ } from '../../utils/core';
import React from 'react';

type Props = {
  placeholder?: string;
  onChange: (e) => void;
};

function Filter({ placeholder = 'Vyhledávání', onChange }: Props) {
  return (
    <FormControl
      type="text"
      placeholder={__(placeholder)}
      onChange={onChange}
      autoFocus={true}
    />
  );
}

export default Filter;
