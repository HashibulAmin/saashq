import Table from '@saashq/ui/src/components/table';
import withTableWrapper from '@saashq/ui/src/components/table/withTableWrapper';
import { __ } from '@saashq/ui/src/utils/core';
import React from 'react';
import { IAutomationHistory, ITrigger } from '../../types';
import Row from './Row';
import EmptyState from '@saashq/ui/src/components/EmptyState';

type Props = {
  histories: IAutomationHistory[];
  triggersConst: ITrigger[];
  actionsConst: any[];
};

class Histories extends React.Component<Props> {
  render() {
    const { histories, triggersConst, actionsConst } = this.props;

    const triggersByType = {};
    triggersConst.forEach((t) => {
      triggersByType[t.type] = `${t.label} based`;
    });

    const actionsByType = {};
    actionsConst.forEach((a) => {
      actionsByType[a.type] = a.label;
    });

    if (!histories || histories.length === 0) {
      return (
        <EmptyState
          image="/images/actions/5.svg"
          text="Historie ještě nebyla vytvořena"
        />
      );
    }

    return (
      <withTableWrapper.Wrapper>
        <Table whiteSpace="nowrap" bordered={true} hover={true}>
          <thead>
            <tr>
              <th>{__('Title')}</th>
              <th>{__('Popis')}</th>
              <th>{__('Trigger')}</th>
              <th>{__('Status')}</th>
              <th>{__('Time')}</th>
            </tr>
          </thead>
          <tbody id="automationHistories">
            {histories.map((history) => (
              <Row
                key={history._id}
                history={history}
                triggersByType={triggersByType}
                actionsByType={actionsByType}
              />
            ))}
          </tbody>
        </Table>
      </withTableWrapper.Wrapper>
    );
  }
}

export default Histories;
