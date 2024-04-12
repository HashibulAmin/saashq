import { Description, SubHeading } from '@saashq/ui-settings/src/styles';
import { FlexItem, FlexPad } from 'modules/common/components/step/styles';

import { ColumnTable } from 'modules/settings/importExport/styles';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import { Info } from '@saashq/ui/src/styles/main';
import React from 'react';
import Row from './Row';
import { __ } from 'modules/common/utils';

type Props = {
  columns: any[];
  fields: any[];
  columnWithChosenField: any;
  onChangeColumn: (column, value, contentType, columns) => void;
  contentType: string;
};

class MapColumn extends React.Component<Props, {}> {
  // fix this function after
  renderText = (value) => {
    switch (value) {
      case 'customer':
        return 'Customers';
      case 'company':
        return 'Companies';
      case 'deal':
        return 'Deals';
      case 'purchase':
        return 'Purchases';
      case 'ticket':
        return 'Tickets';
      case 'task':
        return 'Tasks';
      default:
        return value;
    }
  };

  renderInfo = () => {
    const { contentType } = this.props;
    const isBoardKind = (contentType?: string) =>
      ['deal', 'ticket', 'task', 'purchase'].includes(contentType || '');

    if (isBoardKind(contentType)) {
      return (
        <Info>
          {__('Pro dokončení importu musíte vybrat Deska, Potrubí, Etapa.')}
        </Info>
      );
    }

    return null;
  };

  render() {
    const { columns, fields, columnWithChosenField, contentType } = this.props;

    const content = (
      <ColumnTable>
        <thead>
          <tr>
            <th>Zápas</th>
            <th>Záhlaví sloupce</th>
            <th>Náhled dat</th>
            <th>Vlastnictví</th>
          </tr>
        </thead>
        <tbody className={'expand'}>
          {Object.keys(columns).map((column) => (
            <Row
              contentType={contentType}
              key={Math.random()}
              columns={columns}
              column={column}
              fields={fields}
              columnWithChosenField={columnWithChosenField}
              onChangeColumn={this.props.onChangeColumn}
            />
          ))}
        </tbody>
      </ColumnTable>
    );

    return (
      <>
        <FlexItem>
          <FlexPad type="stepper" direction="column">
            <SubHeading>
              {__(`${this.renderText(contentType)} mapování`)}
            </SubHeading>
            <Description>Mapujte sloupce v souboru na vlastnosti</Description>

            {this.renderInfo()}
            <DataWithLoader
              data={content}
              loading={false}
              emptyText="Nahrajte svůj soubor"
              emptyImage="/images/actions/18.svg"
            />
          </FlexPad>
        </FlexItem>
      </>
    );
  }
}

export default MapColumn;
