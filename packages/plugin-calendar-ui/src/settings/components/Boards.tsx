import Button from '@saashq/ui/src/components/Button';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils/core';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';
import { SidebarList as List } from '@saashq/ui/src/layout/styles';
import React from 'react';
import { IBoard } from '../types';
import BoardForm from './BoardForm';
import BoardRow from './BoardRow';
import { Header } from '@saashq/ui-settings/src/styles';

type Props = {
  currentBoardId?: string;
  boards: IBoard[];
  remove: (boardId: string) => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  loading: boolean;
};

class Boards extends React.Component<Props, {}> {
  renderItems = () => {
    const { boards, remove, renderButton, currentBoardId } = this.props;

    return boards.map((board) => (
      <BoardRow
        key={board._id}
        isActive={currentBoardId === board._id}
        board={board}
        remove={remove}
        renderButton={renderButton}
      />
    ));
  };

  renderBoardForm(props) {
    return <BoardForm {...props} />;
  }

  renderSidebarHeader() {
    const { renderButton } = this.props;

    const addBoard = (
      <Button btnStyle="success" icon="plus-circle" block={true}>
        Přidat Novou Nástěnku
      </Button>
    );

    const content = (props) => {
      return this.renderBoardForm({ ...props, renderButton });
    };

    return (
      <Header>
        <ModalTrigger
          title={__('Nová Deska')}
          trigger={addBoard}
          autoOpenKey="showBoardModal"
          content={content}
        />
      </Header>
    );
  }

  render() {
    const { loading, boards } = this.props;

    return (
      <Sidebar noMargin wide header={this.renderSidebarHeader()} full hasBorder>
        <DataWithLoader
          data={<List>{this.renderItems()}</List>}
          loading={loading}
          count={boards.length}
          emptyText={__('Neexistuje žádná deska')}
          emptyImage="/images/actions/18.svg"
          objective={true}
        />
      </Sidebar>
    );
  }
}

export default Boards;
