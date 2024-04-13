import { AppConsumer } from '@saashq/ui/src/appContext';
import { COLORS } from '@saashq/ui/src/constants/colors';
import { Flex } from '@saashq/ui/src/styles/main';
import Button from '@saashq/ui/src/components/Button';
import FormControl from '@saashq/ui/src/components/form/Control';
import Form from '@saashq/ui/src/components/form/Form';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { colors } from '@saashq/ui/src/styles';
import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils/core';
import { ColorPick, ColorPicker } from '@saashq/ui/src/styles/main';
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import TwitterPicker from 'react-color/lib/Twitter';
import Select from 'react-select-plus';
import { ICalendar, IGroup } from '../types';

type Props = {
  show: boolean;
  calendar?: ICalendar;
  groups: IGroup[];
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};

type FinalProps = {
  currentUserId: string;
} & Props;

type State = {
  backgroundColor: string;
  groupId: string;
  isPrimary: boolean;
};

class CalendarForm extends React.Component<FinalProps, State> {
  constructor(props: FinalProps) {
    super(props);

    this.state = {
      backgroundColor: colors.colorPrimaryDark,
      groupId: '',
      isPrimary: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { show, calendar } = nextProps;

    if (show && calendar && calendar._id) {
      this.setState({
        backgroundColor: calendar.color,
        groupId: calendar.groupId,
        isPrimary: calendar.isPrimary || false,
      });
    }
  }

  onChangeIsPrimary = (e) => {
    const isChecked = (e.currentTarget as HTMLInputElement).checked;
    this.setState({ isPrimary: isChecked });
  };

  onColorChange = (e) => {
    this.setState({ backgroundColor: e.hex });
  };

  generateDoc = (values: { _id?: string }) => {
    const { calendar } = this.props;
    const { backgroundColor, isPrimary, groupId } = this.state;
    const finalValues = values;

    if (calendar) {
      finalValues._id = calendar._id;
    }

    return {
      ...finalValues,
      groupId,
      isPrimary,
      color: backgroundColor,
    };
  };

  renderOptions = (array) => {
    return array.map((obj) => ({
      value: obj._id,
      label: obj.name,
    }));
  };

  renderGroups() {
    const { groups, calendar } = this.props;

    const onChange = (item) => this.setState({ groupId: item.value });

    return (
      <FormGroup>
        <ControlLabel required={true}>Skupina</ControlLabel>
        <Select
          placeholder={__('Vyberte skupinu')}
          value={this.state.groupId || (calendar && calendar.groupId)}
          options={this.renderOptions(groups)}
          onChange={onChange}
          clearable={false}
        />
      </FormGroup>
    );
  }

  renderContent = (formProps: IFormProps) => {
    const { calendar, renderButton, closeModal, currentUserId } = this.props;
    const { values, isSubmitted } = formProps;
    const calendarName = 'kalendář';
    const showPrimary =
      !calendar || (calendar && currentUserId === calendar.userId);

    const popoverBottom = (
      <Popover id="color-picker">
        <TwitterPicker
          width="266px"
          triangle="hide"
          color={this.state.backgroundColor}
          onChange={this.onColorChange}
          colors={COLORS}
        />
      </Popover>
    );

    return (
      <div id="manage-calendar-modal">
        <Modal.Header closeButton={true}>
          <Modal.Title>
            {calendar ? `Upravit ${calendarName}` : `Přidat ${calendarName}`}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Flex>
            <FormGroup>
              <ControlLabel>Pozadí</ControlLabel>
              <div>
                <OverlayTrigger
                  trigger="click"
                  rootClose={true}
                  placement="bottom"
                  overlay={popoverBottom}
                >
                  <ColorPick>
                    <ColorPicker
                      style={{ backgroundColor: this.state.backgroundColor }}
                    />
                  </ColorPick>
                </OverlayTrigger>
              </div>
            </FormGroup>
          </Flex>

          {this.renderGroups()}

          {showPrimary && (
            <FormGroup>
              <ControlLabel>Je primární</ControlLabel>

              <FormControl
                {...formProps}
                name="isPrimary"
                defaultChecked={this.state.isPrimary}
                componentClass="checkbox"
                onChange={this.onChangeIsPrimary}
              />
            </FormGroup>
          )}

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
              name: calendarName,
              values: this.generateDoc(values),
              isSubmitted,
              callback: closeModal,
              object: calendar,
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

export default (props: Props) => (
  <AppConsumer>
    {({ currentUser }) => (
      <CalendarForm
        {...props}
        currentUserId={(currentUser && currentUser._id) || ''}
      />
    )}
  </AppConsumer>
);
