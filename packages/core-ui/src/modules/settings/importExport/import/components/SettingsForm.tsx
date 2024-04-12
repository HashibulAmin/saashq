import Icon from 'modules/common/components/Icon';

import { __ } from 'modules/common/utils';
import { FlexItem, FlexPad } from 'modules/common/components/step/styles';
import React from 'react';

import { Box, FullContent } from '../../styles';
import { Description, SubHeading } from '@saashq/ui-settings/src/styles';

type Props = {
  onChangeType: (value: string) => void;
  type: string;
};

class SettingsForm extends React.Component<Props> {
  renderBox(name, icon, selectedType) {
    const { type } = this.props;

    return (
      <Box
        selected={selectedType === type}
        onClick={() => this.props.onChangeType(selectedType)}
      >
        <Icon icon={icon} />
        <span>{__(name)}</span>
      </Box>
    );
  }

  render() {
    return (
      <FlexItem>
        <FlexPad direction="column">
          <SubHeading>{__('Vyberte typ')}</SubHeading>
          <Description>
            Můžete nahrát jeden soubor nebo více souborů najednou. Budeš moci a
            vyberte, kolik objektů později importujete. Můžete nahrát jeden
            soubor nebo více souborů najednou.
          </Description>

          <FullContent center={true}>
            {this.renderBox('One file', 'file-alt', 'single')}
            {/* {this.renderBox(
              'Multiple files with associations',
              'file-copy-alt',
              'multi'
            )} */}
          </FullContent>
        </FlexPad>
      </FlexItem>
    );
  }
}

export default SettingsForm;
