import { IBoard } from '@saashq/ui-cards/src/boards/types';
import Button from '@saashq/ui/src/components/Button';
import FormControl from '@saashq/ui/src/components/form/Control';
import Form from '@saashq/ui/src/components/form/Form';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';
import React from 'react';

type Props = {
  board: IBoard;
  closeModal: () => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  type: string;
  history: any;
};

class BoardForm extends React.Component<Props, {}> {
  generateDoc = (values: { _id?: string; name: string }) => {
    const { board, type } = this.props;
    const finalValues = values;

    if (board) {
      finalValues._id = board._id;
    }

    return {
      ...finalValues,
      type
    };
  };

  renderContent = (formProps: IFormProps) => {
    const { board, renderButton, closeModal } = this.props;
    const { values, isSubmitted } = formProps;
    const object = board || { name: '' };

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>Name</ControlLabel>

          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.name}
            required={true}
            autoFocus={true}
          />
        </FormGroup>

        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            icon="cancel-1"
            onClick={closeModal}
          >
            Cancel
          </Button>

          {renderButton({
            name: 'board',
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object: board
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default BoardForm;
