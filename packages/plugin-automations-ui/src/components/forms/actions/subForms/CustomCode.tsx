import React from 'react';
import { IAction } from '@saashq/ui-automations/src/types';
import Common from '@saashq/ui-automations/src/components/forms/actions/Common';
import { BoardHeader, DrawerDetail } from '@saashq/ui-automations/src/styles';
import { __ } from 'coreui/utils';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { ControlLabel } from '@saashq/ui/src/components/form';
import FormGroup from '@saashq/ui/src/components/form/Group';

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

    const onChangeValue = (code) => this.onChangeField('code', code);

    return (
      <DrawerDetail>
        <FormGroup>
          <BoardHeader>
            <div className="header-row">
              <ControlLabel required={true}>{__('Hodnota')}</ControlLabel>
            </div>
            <Editor
              value={config.code || ''}
              onValueChange={onChangeValue}
              highlight={(code) => highlight(code, languages.javascript)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}
            />
          </BoardHeader>
        </FormGroup>
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
