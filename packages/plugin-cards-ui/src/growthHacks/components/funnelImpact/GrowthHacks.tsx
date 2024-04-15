import PriorityIndicator from '@saashq/ui-cards/src/boards/components/editForm/PriorityIndicator';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Table from '@saashq/ui/src/components/table';
import { __ } from '@saashq/ui/src/utils/core';
import { GrowthRow, TableContainer } from '../../styles';
import { IGrowthHack } from '../../types';
import Participators from '@saashq/ui-inbox/src/inbox/components/conversationDetail/workarea/Participators';
import React from 'react';

type Props = {
  queryParams: any;
  growthHacks: IGrowthHack[];
};

class GrowthHacks extends React.Component<Props> {
  renderPriority(priority) {
    if (!priority) {
      return null;
    }

    return (
      <>
        <PriorityIndicator value={priority} /> {priority}{' '}
      </>
    );
  }

  renderRow = (growthHack: IGrowthHack) => {
    return (
      <GrowthRow key={growthHack._id}>
        <td>{growthHack.name}</td>
        <td>{growthHack.stage && growthHack.stage.name}</td>
        <td>{this.renderPriority(growthHack.priority)}</td>
        <td>
          <Participators
            participatedUsers={growthHack.assignedUsers}
            limit={3}
          />
        </td>
      </GrowthRow>
    );
  };

  render() {
    const { growthHacks } = this.props;

    if (growthHacks.length === 0) {
      return (
        <EmptyState
          icon="comment-info-alt"
          text="Neexistují žádné experimenty"
        />
      );
    }

    return (
      <TableContainer>
        <Table hover={true}>
          <thead>
            <tr>
              <th>{__('Experiment name')}</th>
              <th>{__('Etapa')}</th>
              <th>{__('Priority')}</th>
              <th>{__('Assigned user')}</th>
            </tr>
          </thead>
          <tbody>
            {growthHacks.map((growthHack) => this.renderRow(growthHack))}
          </tbody>
        </Table>
      </TableContainer>
    );
  }
}

export default GrowthHacks;
