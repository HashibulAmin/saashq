import Icon from 'modules/common/components/Icon';
import { __ } from 'modules/common/utils';
import { FlexPad } from 'modules/common/components/step/styles';
import React from 'react';
import { Box, TypeContent, ImportHeader } from '../../styles';
import { IImportHistoryContentType } from '../../types';

type Props = {
  onChangeContentType: (value: IImportHistoryContentType) => void;
  contentType: string;
  contentTypes: IImportHistoryContentType[];
  type: string;
  typeOptions: any[];
};

class TypeForm extends React.Component<Props> {
  componentDidMount() {
    const { contentType, typeOptions, onChangeContentType } = this.props;
    const type = typeOptions.find((t) => t.contentType === contentType);

    if (type) {
      onChangeContentType(type);
    }
  }

  renderSelected = (selectedType) => {
    const { contentTypes } = this.props;

    if (contentTypes.length > 0) {
      const contentType = contentTypes[0].contentType;

      return contentType === selectedType.contentType ? true : false;
    }

    return false;
  };

  renderBox(name, icon, selectedType) {
    return (
      <Box
        key={Math.random()}
        selected={this.renderSelected(selectedType)}
        onClick={() => this.props.onChangeContentType(selectedType)}
      >
        <Icon icon={icon} />
        <span>{__(name)}</span>
      </Box>
    );
  }

  renderText = () => {
    const { type } = this.props;

    if (type === 'single') {
      return 'Vyberte objekt, který chcete importovat';
    }

    return 'Vyberte dva objekty, které chcete importovat';
  };

  renderOptions = () => {
    const { typeOptions } = this.props;

    return typeOptions.map((option) => {
      return this.renderBox(option.text, option.icon, option);
    });
  };

  render() {
    return (
      <FlexPad type="stepper" direction="column">
        <ImportHeader>{__(this.renderText())}</ImportHeader>

        <TypeContent center={true}>{this.renderOptions()}</TypeContent>
      </FlexPad>
    );
  }
}

export default TypeForm;
