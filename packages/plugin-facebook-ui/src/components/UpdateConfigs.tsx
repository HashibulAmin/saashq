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
  FACEBOOK_APP_ID: 'Facebook App Id',
  FACEBOOK_APP_SECRET: 'Facebook App Secret',
  FACEBOOK_VERIFY_TOKEN: 'Facebook Verify Token',
  FACEBOOK_PERMISSIONS: 'Facebook Permissions',
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
        beforeTitle={<Icon icon="facebook" />}
        transparent={true}
        title="Facebook"
      >
        <Info>
          <a
            target="_blank"
            href="https://docs.saashq.org/"
            rel="noopener noreferrer"
          >
            {__('Learn how to set Facebook Integration Variables')}
          </a>
        </Info>
        {this.renderItem('FACEBOOK_APP_ID')}
        {this.renderItem('FACEBOOK_APP_SECRET')}
        {this.renderItem('FACEBOOK_VERIFY_TOKEN')}
        {this.renderItem(
          'FACEBOOK_PERMISSIONS',
          '',
          '',
          'pages_messaging,pages_manage_ads,pages_manage_engagement,pages_manage_metadata,pages_read_user_content',
        )}
        <Button onClick={onClick}>{__('Save')}</Button>
      </CollapseContent>
    );
  }
}
