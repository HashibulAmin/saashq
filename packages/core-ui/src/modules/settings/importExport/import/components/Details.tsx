import React from 'react';

import { FlexItem, FlexPad } from 'modules/common/components/step/styles';
import { InputBar } from '@saashq/ui-settings/src/styles';
import {
  ControlLabel,
  FormControl,
  FormGroup,
} from '@saashq/ui/src/components/form';
import { __ } from 'modules/common/utils';
import { ImportHeader } from '../../styles';

type Props = {
  disclaimer: boolean;
  importName: string;
  type?: string;

  onChangeImportName: (value) => void;
  onChangeDisclaimer: (value) => void;
};

class Details extends React.Component<Props, {}> {
  onChangeName = (e) => {
    const value = (e.currentTarget as HTMLInputElement).value;

    this.props.onChangeImportName(value);
  };

  onChangeDisclaimer = (e) => {
    const value = e.target.checked;

    this.props.onChangeDisclaimer(value);
  };

  render() {
    const { disclaimer, importName, type } = this.props;
    return (
      <FlexItem slimmer={true}>
        <FlexPad
          type={type}
          direction="column"
          overflow="auto"
          value={importName}
        >
          <FormGroup>
            <ImportHeader>
              {__(
                'Pojmenování pomůže s identifikací položek v historii importů.',
              )}
              .
            </ImportHeader>
            <InputBar>
              <FormControl
                required={true}
                name="title"
                value={importName}
                onChange={this.onChangeName}
                placeholder={__('Název Importu')}
              />
            </InputBar>
          </FormGroup>

          <FormGroup>
            <FormControl
              componentClass="checkbox"
              required={true}
              name="title"
              checked={disclaimer}
              onChange={this.onChangeDisclaimer}
            />
            <ControlLabel required={true}>
              {__('Zřeknutí se odpovědnosti')}
            </ControlLabel>

            <p>
              {__(
                `Souhlasím s tím, že všechny kontakty v tomto importu očekávají, že se mi ozve moje organizace. S těmito kontakty mám předchozí vztah a za poslední rok jsem jim alespoň jednou poslal e-mail. Mohu potvrdit, že tento seznam nebyl zakoupen, pronajat, připojen nebo poskytnut třetí stranou`,
              )}
              .
            </p>
          </FormGroup>
        </FlexPad>
      </FlexItem>
    );
  }
}

export default Details;
