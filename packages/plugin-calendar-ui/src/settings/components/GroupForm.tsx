import Button from '@saashq/ui/src/components/Button';
import FormControl from '@saashq/ui/src/components/form/Control';
import Form from '@saashq/ui/src/components/form/Form';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils/core';
import SelectTeamMembers from '@saashq/ui/src/team/containers/SelectTeamMembers';
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select-plus';
import { IBoard, IGroup } from '../types';

type Props = {
  show: boolean;
  group?: IGroup;
  boards: IBoard[];
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};

type State = {
  boardId: string;
  isPrivate: boolean;
  selectedMemberIds: string[];
};

class GroupForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const group = this.props.group || ({} as IGroup);

    this.state = {
      boardId: group.boardId || '',
      isPrivate: group.isPrivate || false,
      selectedMemberIds: group ? group.memberIds || [] : [],
    };
  }

  onChangeMembers = (items) => {
    this.setState({ selectedMemberIds: items });
  };

  onChangeIsPrivate = (e) => {
    const isChecked = (e.currentTarget as HTMLInputElement).checked;
    this.setState({ isPrivate: isChecked });
  };

  generateDoc = (values: {
    _id?: string;
    name: string;
    visibility: string;
  }) => {
    const { group } = this.props;
    const { boardId, isPrivate, selectedMemberIds } = this.state;
    const finalValues = values;

    if (group) {
      finalValues._id = group._id;
    }

    return {
      ...finalValues,
      memberIds: selectedMemberIds,
      isPrivate,
      boardId,
    };
  };

  renderOptions = (array) => {
    return array.map((obj) => ({
      value: obj._id,
      label: obj.name,
    }));
  };

  renderBoards() {
    const { boards } = this.props;

    const onChange = (item) => this.setState({ boardId: item.value });

    return (
      <FormGroup>
        <ControlLabel required={true}>Deska</ControlLabel>
        <Select
          placeholder={__('Vyberte desku')}
          value={this.state.boardId}
          options={this.renderOptions(boards)}
          onChange={onChange}
          clearable={false}
        />
      </FormGroup>
    );
  }

  renderSelectMembers() {
    const { isPrivate, selectedMemberIds } = this.state;

    if (!isPrivate) {
      return;
    }

    return (
      <FormGroup>
        <ControlLabel>členové</ControlLabel>

        <SelectTeamMembers
          label="Vyberte členy"
          name="selectedMemberIds"
          initialValue={selectedMemberIds}
          onSelect={this.onChangeMembers}
        />
      </FormGroup>
    );
  }

  renderContent = (formProps: IFormProps) => {
    const { group, renderButton, closeModal } = this.props;
    const { values, isSubmitted } = formProps;
    const object = group || ({} as IGroup);
    const groupName = 'group';

    return (
      <div id="manage-group-modal">
        <Modal.Header closeButton={true}>
          <Modal.Title>
            {group ? `Upravit ${groupName}` : `Přidat ${groupName}`}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup>
            <ControlLabel required={true}>Název</ControlLabel>
            <FormControl
              {...formProps}
              name="name"
              defaultValue={object.name}
              autoFocus={true}
              required={true}
            />
          </FormGroup>

          {this.renderBoards()}

          <FormGroup>
            <ControlLabel>Je soukromý</ControlLabel>

            <FormControl
              {...formProps}
              name="isPrivate"
              defaultChecked={this.state.isPrivate}
              componentClass="checkbox"
              onChange={this.onChangeIsPrivate}
            />
          </FormGroup>

          {this.renderSelectMembers()}

          <Modal.Footer>
            <Button
              btnStyle="simple"
              type="button"
              icon="times-circle"
              onClick={closeModal}
            >
              Zrušení
            </Button>

            {renderButton({
              name: groupName,
              values: this.generateDoc(values),
              isSubmitted,
              callback: closeModal,
              object: group,
              confirmationUpdate: true,
            })}
          </Modal.Footer>
        </Modal.Body>
      </div>
    );
  };

  render() {
    const { show, closeModal } = this.props;

    if (!show) {
      return null;
    }

    return (
      <Modal
        show={show}
        onHide={closeModal}
        enforceFocus={false}
        animation={false}
      >
        <Form renderContent={this.renderContent} />
      </Modal>
    );
  }
}

export default GroupForm;
