import Button from '@saashq/ui/src/components/Button';
import DropdownToggle from '@saashq/ui/src/components/DropdownToggle';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Icon from '@saashq/ui/src/components/Icon';
import Table from '@saashq/ui/src/components/table';
import { Count } from '@saashq/ui/src/styles/main';
import { IButtonMutateProps, IRouterProps } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils/core';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { withRouter } from 'react-router-dom';
import { CALENDAR_INTEGRATIONS } from '../constants';
import GroupForm from '../containers/GroupForm';
import { IBoard, ICalendar, IGroup } from '../types';
import CalendarForm from './CalendarForm';
import GroupRow from './GroupRow';
import { Title } from '@saashq/ui-settings/src/styles';

type Props = {
  groups: IGroup[];
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  updateOrder?: any;
  remove: (group: IGroup) => void;
  boardId: string;
  refetch: ({ boardId }: { boardId?: string }) => Promise<any>;
  currentBoard?: IBoard;
  customLink: (kind: string) => void;
  removeCalendar: (calendar: ICalendar) => void;
  renderCalendarButton: (props: IButtonMutateProps) => JSX.Element;
} & IRouterProps;

type State = {
  showModal: boolean;
  groups: IGroup[];
  showCalendarModal: boolean;
};

class Groups extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { history } = props;

    const showCalendarModal =
      history.location.hash.includes('showCalendarModal');

    this.state = {
      showModal: false,
      groups: props.groups || [],
      showCalendarModal,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.groups !== this.props.groups) {
      this.setState({ groups: nextProps.groups });
    }
  }

  renderAddForm = () => {
    const { boardId, renderButton } = this.props;

    const closeModal = () => this.setState({ showModal: false });

    return (
      <GroupForm
        boardId={boardId}
        renderButton={renderButton}
        show={this.state.showModal}
        closeModal={closeModal}
      />
    );
  };

  renderCalendarForm = () => {
    const { renderCalendarButton, groups } = this.props;

    const closeModal = () => {
      this.setState({ showCalendarModal: false });
    };

    return (
      <CalendarForm
        renderButton={renderCalendarButton}
        closeModal={closeModal}
        show={this.state.showCalendarModal}
        groups={groups}
      />
    );
  };

  addGroup = () => {
    this.setState({
      showModal: true,
    });
  };

  connectCalendar = (kind: string) => {
    this.props.customLink(kind);
  };

  renderRows() {
    const { renderButton, removeCalendar, renderCalendarButton } = this.props;
    const { groups } = this.state;

    return groups.map((group) => (
      <GroupRow
        key={group._id}
        group={group}
        renderButton={renderButton}
        remove={this.props.remove}
        groups={this.props.groups}
        removeCalendar={removeCalendar}
        renderCalendarButton={renderCalendarButton}
      />
    ));
  }

  renderContent() {
    const { groups } = this.props;

    if (groups.length === 0) {
      return (
        <EmptyState
          text="Začněte se svou skupinou"
          size="full"
          image="/images/actions/16.svg"
        />
      );
    }

    return (
      <>
        <Count>
          {groups.length} {__('skupina')}
          {groups.length > 1 && 's'}
        </Count>
        <Table>
          <tbody>{this.renderRows()}</tbody>
        </Table>
      </>
    );
  }

  addButton() {
    const { groups } = this.props;

    if (groups.length === 0) {
      return null;
    }

    return (
      <Dropdown className="dropdown-btn" alignRight={true}>
        <Dropdown.Toggle as={DropdownToggle} id="dropdown-customize">
          <Button btnStyle="simple">
            {__('Přidat kalendář')} <Icon icon="angle-down" />
          </Button>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {CALENDAR_INTEGRATIONS.map((i) => (
            <li key={i.kind}>
              <a
                href={`#${i.kind}`}
                onClick={this.connectCalendar.bind(this, i.kind)}
              >
                {i.name}
              </a>
            </li>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  renderButton() {
    const { boardId } = this.props;

    if (!boardId) {
      return null;
    }

    return (
      <>
        {this.addButton()}
        <Button btnStyle="success" icon="plus-circle" onClick={this.addGroup}>
          Přidat skupinu
        </Button>
      </>
    );
  }

  render() {
    const { currentBoard } = this.props;

    const leftActionBar = (
      <Title>{currentBoard ? currentBoard.name : ''}</Title>
    );

    return (
      <>
        <Wrapper.ActionBar left={leftActionBar} right={this.renderButton()} />

        {this.renderContent()}
        {this.renderAddForm()}
        {this.renderCalendarForm()}
      </>
    );
  }
}

export default withRouter(Groups);
