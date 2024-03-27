import Button from '@saashq/ui/src/components/Button';
import CollapseContent from '@saashq/ui/src/components/CollapseContent';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { FormControl } from '@saashq/ui/src/components/form';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { IConfigsMap } from '@saashq/ui-settings/src/general/types';
import Icon from '@saashq/ui/src/components/Icon';
import Info from '@saashq/ui/src/components/Info';
import React from 'react';
import { __ } from '@saashq/ui/src/utils/core';

const KEY_LABELS = {
  STUN_SERVER_URL: 'Stun server url',
  TURN_SERVER_URL: 'Turn server url',
  TURN_SERVER_USERNAME: 'Turn server username',
  TURN_SERVER_CREDENTIAL: 'Turn server credential',
};

type Props = {
  loading: boolean;
  updateConfigs: (configsMap: IConfigsMap) => void;
  configsMap: IConfigsMap;
};

type State = {
  configsMap: IConfigsMap;
};

export default class UpdateConfigs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { configsMap: props.configsMap };
  }

  onChangeConfig = (code: string, value) => {
    const { configsMap } = this.state;

    configsMap[code] = value;

    this.setState({ configsMap });
  };

  onChangeInput = (code: string, e) => {
    this.onChangeConfig(code, e.target.value);
  };

  renderItem = (
    key: string,
    type?: string,
    description?: string,
    defaultValue?: string,
    label?: string,
  ) => {
    const { configsMap } = this.state;

    return (
      <FormGroup>
        <ControlLabel>{label || KEY_LABELS[key]}</ControlLabel>
        {description && <p>{__(description)}</p>}
        <FormControl
          type={type || 'text'}
          defaultValue={configsMap[key] || defaultValue}
          onChange={this.onChangeInput.bind(this, key)}
        />
      </FormGroup>
    );
  };

  render() {
    const onClick = () => {
      this.props.updateConfigs(this.state.configsMap);
    };

    return (
      <CollapseContent
        beforeTitle={<Icon icon="phone" />}
        transparent={true}
        title="Call"
      >
        <Info>
          <a
            target="_blank"
            href="https://docs.saashq.org/"
            rel="noopener noreferrer"
          >
            {__('Learn how to set Call Integration Variables')}
          </a>
        </Info>
        {this.renderItem('STUN_SERVER_URL')}
        {this.renderItem('TURN_SERVER_URL')}
        {this.renderItem('TURN_SERVER_USERNAME')}
        {this.renderItem('TURN_SERVER_CREDENTIAL')}
        <Button onClick={onClick}>{__('Save')}</Button>
      </CollapseContent>
    );
  }
}
