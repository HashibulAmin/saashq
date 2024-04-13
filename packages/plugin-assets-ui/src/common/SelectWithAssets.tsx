import React from 'react';
import { SelectWithAssets } from './utils';

type Props = {
  onSelect: (value: string | string[], name: string) => void;
  value: string;
};

class SelectWithAssetOnProperties extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { onSelect, value } = this.props;

    return (
      <SelectWithAssets
        label="Vyberte Aktivum"
        name="assets"
        multi={false}
        initialValue={value}
        onSelect={onSelect}
        customOption={{ value: '', label: 'Vyberte Aktivum' }}
      />
    );
  }
}

export default SelectWithAssetOnProperties;
