import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';

import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import Form from '@saashq/ui/src/components/form/Form';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { IChannel } from '../types';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import React from 'react';
import SelectTeamMembers from '@saashq/ui/src/team/containers/SelectTeamMembers';

type Props = {
  channel?: IChannel;
  selectedMembers: string[];
  closeModal: () => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

type State = {
  selectedMembers: string[];
};

class ChannelForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedMembers: props.selectedMembers || [],
    };
  }

  generateDoc = (values: {
    _id?: string;
    name: string;
    description: string;
  }) => {
    const { channel } = this.props;
    const finalValues = values;

    if (channel) {
      finalValues._id = channel._id;
    }

    return {
      ...finalValues,
      memberIds: this.state.selectedMembers,
    };
  };

  renderContent = (formProps: IFormProps) => {
    const { closeModal, channel, renderButton, selectedMembers } = this.props;
    const { values, isSubmitted } = formProps;

    const object = channel || ({} as IChannel);
    const self = this;

    const onChange = (items) => {
      self.setState({ selectedMembers: items });
    };

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>Název</ControlLabel>

          <FormControl
            {...formProps}
            name="name"
            autoFocus={true}
            defaultValue={object.name}
            required={true}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Popis</ControlLabel>

          <FormControl
            {...formProps}
            name="description"
            componentClass="textarea"
            rows={5}
            defaultValue={object.description}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>členové</ControlLabel>

          <SelectTeamMembers
            label="Vyberte členy"
            name="selectedMembers"
            initialValue={selectedMembers}
            onSelect={onChange}
          />
        </FormGroup>
        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            icon="cancel-1"
            onClick={closeModal}
          >
            Zrušení
          </Button>

          {renderButton({
            name: 'channel',
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object: channel,
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default ChannelForm;
