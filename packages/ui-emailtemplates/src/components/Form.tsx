import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import RichTextEditor from '@saashq/ui/src/containers/RichTextEditor';
import { IFormProps } from '@saashq/ui/src/types';
import React from 'react';
import CommonForm from '@saashq/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@saashq/ui-settings/src/common/types';
import { IEmailTemplate } from '../types';

type Props = {
  object?: IEmailTemplate;
  contentType?: string;
} & ICommonFormProps;

type State = {
  content: string;
};

class Form extends React.Component<Props & ICommonFormProps, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: (props.object && props.object.content) || '',
    };
  }

  onEditorChange = (content: string) => {
    this.setState({ content });
  };

  generateDoc = (values: { _id?: string; name: string; content: string }) => {
    const { object } = this.props;
    const finalValues = values;

    if (object) {
      finalValues._id = object._id;
    }

    return {
      _id: finalValues._id,
      name: finalValues.name,
      content: this.state.content,
    };
  };

  renderContent = (formProps: IFormProps) => {
    const object = this.props.object || ({} as IEmailTemplate);

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>Název</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.name}
            type="text"
            required={true}
            autoFocus={true}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Obsah</ControlLabel>
          <RichTextEditor
            content={this.state.content}
            onChange={this.onEditorChange}
            autoGrow={true}
            autoGrowMinHeight={300}
            isSubmitted={formProps.isSaved}
            name={`emailTemplates_${object._id || 'create'}`}
            contentType={this?.props?.contentType}
          />
        </FormGroup>
      </>
    );
  };

  render() {
    const { object } = this.props;

    return (
      <CommonForm
        {...this.props}
        name="email template"
        renderContent={this.renderContent}
        generateDoc={this.generateDoc}
        object={object}
        createdAt={
          object && object.modifiedAt !== object.createdAt && object.createdAt
        }
      />
    );
  }
}

export default Form;
