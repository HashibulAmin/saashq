import { FormFooter } from '../../boards/styles/item';
import Button from '@saashq/ui/src/components/Button';
import FormControl from '@saashq/ui/src/components/form/Control';
import Form from '@saashq/ui/src/components/form/Form';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';
import * as React from 'react';

type IProps = {
  itemId: string;
  type: string;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  afterSave?: () => void;
};

type State = {
  title: string;
};

class AddForm extends React.Component<IProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      title: 'Kontrolní seznam',
    };
  }

  generateDoc = (values: {
    title: string;
    contentType: string;
    contentTypeId: string;
  }) => {
    const { itemId, type } = this.props;
    const { title } = this.state;

    const finalValues = values;

    return {
      title: finalValues.title || title,
      contentType: type,
      contentTypeId: itemId,
    };
  };

  onChangeTitle = (e) =>
    this.setState({ title: (e.currentTarget as HTMLInputElement).value });

  close = () => {
    const { afterSave } = this.props;

    if (afterSave) {
      afterSave();
    }
  };

  handleFocus = (event) => event.target.select();

  renderContent = (formProps: IFormProps) => {
    const { renderButton } = this.props;
    const { isSubmitted, values } = formProps;

    return (
      <>
        <div>
          <ControlLabel required={true}>Name</ControlLabel>
          <FormControl
            {...formProps}
            autoFocus={true}
            onChange={this.onChangeTitle}
            value={this.state.title}
            placeholder="Kontrolní seznam"
            onFocus={this.handleFocus}
            name="title"
            required={true}
          />
        </div>
        <FormFooter>
          <Button
            btnStyle="simple"
            icon="times"
            onClick={this.close}
            size="small"
          >
            Zavřít
          </Button>

          {renderButton({
            values: this.generateDoc(values),
            isSubmitted,
            callback: this.close,
          })}
        </FormFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default AddForm;
