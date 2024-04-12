import React from 'react';
import { FlexItem, FlexPad } from 'modules/common/components/step/styles';

import { IImportHistoryContentType } from '../../types';
import { SubHeading } from '@saashq/ui-settings/src/styles';
import {
  ControlLabel,
  FormControl,
  FormGroup,
} from '@saashq/ui/src/components/form';
import { __ } from 'modules/common/utils';

type Props = {
  duplicatedHeaders: string[];
  contentTypes: IImportHistoryContentType[];
  onChangeAssociateHeader: (value: string) => void;
  onChangeAssociateContentType: (value: string) => void;
};

class AccociateForm extends React.Component<Props, {}> {
  render() {
    const onChangeHeader = (e) =>
      this.props.onChangeAssociateHeader((e.target as HTMLInputElement).value);

    const onChangeContentType = (e) =>
      this.props.onChangeAssociateContentType(
        (e.target as HTMLInputElement).value,
      );

    return (
      <FlexItem>
        <FlexPad direction="column" overflow="auto">
          <SubHeading>{__('Vyberte, jak svá data přidružit')}</SubHeading>

          <div>
            <FormGroup>
              <ControlLabel>
                {__('Běžná záhlaví sloupců nalezená ve vašem souboru')}
              </ControlLabel>
              <p>
                {__(
                  'Vyberte společný sloupec, který chcete použít k přiřazení dat.',
                )}
                .
              </p>
              <FormControl componentClass="select" onChange={onChangeHeader}>
                <option />
                {this.props.duplicatedHeaders.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>
                {__('Pro který objekt je jedinečný klíč')}
              </ControlLabel>
              <p>
                {__(
                  'Společný sloupec mezi vašimi soubory by měl být také jedinečným klíčem pro jeden z vašich objektů. Tento jedinečný klíč se používá k přiřazení objektů na základě jednotlivých dat, ale patří pouze k jednomu objektu.',
                )}
                .
              </p>
              <FormControl
                componentClass="select"
                onChange={onChangeContentType}
              >
                <option />
                {this.props.contentTypes.map((contentType) => (
                  <option
                    key={contentType.contentType}
                    value={contentType.contentType}
                  >
                    {contentType}
                  </option>
                ))}
              </FormControl>
            </FormGroup>
          </div>
        </FlexPad>
      </FlexItem>
    );
  }
}

export default AccociateForm;
