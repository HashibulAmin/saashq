import React from 'react';
import Select from 'react-select-plus';
import { IAction } from '@saashq/ui-automations/src/types';
import Common from '@saashq/ui-automations/src/components/forms/actions/Common';
import { BoardHeader, DrawerDetail } from '@saashq/ui-automations/src/styles';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { __ } from '@saashq/ui/src/utils/core';
import FormControl from '@saashq/ui/src/components/form/Control';

type Props = {
  closeModal: () => void;
  activeAction: IAction;
  triggerType: string;
  addAction: (action: IAction, actionId?: string, config?: any) => void;
};

type State = {
  config: any;
};

class Delay extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { config } = this.props.activeAction;

    this.state = { config: config || {} };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeAction !== this.props.activeAction) {
      this.setState({ config: nextProps.activeAction.config });
    }
  }

  onChangeField = (name: string, value: string) => {
    const { config } = this.state;
    config[name] = value;

    this.setState({ config });
  };

  renderContent() {
    const { config } = this.state;

    const onChangeSelect = (field, e) => this.onChangeField(field, e.value);
    const onChangeValue = (e) => this.onChangeField('value', e.target.value);

    return (
      <DrawerDetail>
        <FormGroup>
          <ControlLabel required={true}>{__('Typ')}</ControlLabel>

          <Select
            value={config.type || 'hour'}
            options={[
              {
                label: 'Hodina',
                value: 'hour',
              },
              {
                label: 'Den',
                value: 'day',
              },
            ]}
            onChange={onChangeSelect.bind(this, 'type')}
            clearable={false}
          />
        </FormGroup>

        <BoardHeader>
          <FormGroup>
            <div className="header-row">
              <ControlLabel required={true}>{__('Hodnota')}</ControlLabel>
            </div>
            <FormControl
              type="number"
              onChange={onChangeValue}
              value={config.value}
            />
          </FormGroup>
        </BoardHeader>
      </DrawerDetail>
    );
  }

  render() {
    return (
      <Common config={this.state.config} {...this.props}>
        {this.renderContent()}
      </Common>
    );
  }
}

export default Delay;
