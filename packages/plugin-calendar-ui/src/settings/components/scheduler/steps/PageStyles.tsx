import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { FlexItem, LeftItem } from '@saashq/ui/src/components/step/styles';
import { __ } from '@saashq/ui/src/utils/core';
import { ColorPick, ColorPicker } from '@saashq/ui/src/styles/main';
import { SubItem } from '@saashq/ui-settings/src/styles';
import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import TwitterPicker from 'react-color/lib/Twitter';

type NameInput =
  | 'companyName'
  | 'slug'
  | 'color'
  | 'submitText'
  | 'thankYouText';

type Props = {
  onChange: (name: NameInput, value: string) => void;
  companyName?: string;
  slug?: string;
  color?: string;
  submitText?: string;
  thankYouText?: string;
};

type State = {
  companyName?: string;
  slug?: string;
  color?: string;
  submitText?: string;
  thankYouText?: string;
};

class PageStyles extends React.Component<Props, State> {
  onChangeInput = (name: NameInput, e: React.FormEvent) => {
    const { value } = e.target as HTMLInputElement;

    this.setState({ [name]: value }, () => this.props.onChange(name, value));
  };

  onChangeColor = (name: 'color', e: any) => {
    const value = e.hex;

    this.setState({ [name]: value }, () => this.props.onChange(name, value));
  };

  renderField = (name: NameInput, label: string) => {
    return (
      <FormGroup>
        <ControlLabel>{label}</ControlLabel>

        <FormControl
          value={this.props[name]}
          onChange={this.onChangeInput.bind(null, name)}
        />
      </FormGroup>
    );
  };

  render() {
    const { color } = this.props;

    const popoverContent = (
      <Popover id="color-picker">
        <TwitterPicker
          color={color}
          onChange={this.onChangeColor.bind(null, 'color')}
          triangle="hide"
        />
      </Popover>
    );

    return (
      <FlexItem>
        <LeftItem>
          {this.renderField('companyName', 'Company name')}

          <SubItem>
            <ControlLabel>{__('Vyberte barvu pozadí')}</ControlLabel>
            <OverlayTrigger
              trigger="click"
              rootClose={true}
              placement="bottom-start"
              overlay={popoverContent}
            >
              <ColorPick>
                <ColorPicker style={{ backgroundColor: color }} />
              </ColorPick>
            </OverlayTrigger>
          </SubItem>

          {this.renderField('slug', 'Vlastní stránka slimák')}
          {this.renderField('submitText', 'Štítek tlačítka Odeslat')}
          {this.renderField('thankYouText', 'Děkovná zpráva')}
        </LeftItem>
      </FlexItem>
    );
  }
}

export default PageStyles;
