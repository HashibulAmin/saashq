import React from 'react';
import { IPage } from '../../types';
import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { FlexContent, FlexItem } from '@saashq/ui/src/layout/styles';
import Button from '@saashq/ui/src/components/Button';
import { RichTextEditor } from '@saashq/ui/src/components/richTextEditor/TEditor';
import Form from '@saashq/ui/src/components/form/Form';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { ModalFooter } from '@saashq/ui/src/styles/main';

type Props = {
  page?: IPage;
  closeModal: () => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

type State = {
  content: string;
  title: string;
};

class PageForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const page = props.page || ({} as IPage);

    this.state = {
      content: page.content ?? '',
      title: page.title ?? '',
    };
  }

  generateDoc = (values: {
    _id?: string;
    title: string;
    thumbnail: string;
    code: string;
    listOrder?: string;
    description: string;
  }) => {
    const { page } = this.props;
    const finalValues = values;

    if (page) {
      finalValues._id = page._id;
    }

    return {
      _id: finalValues._id,
      title: finalValues.title,
      content: this.state.content,
      thumbnail: finalValues.thumbnail,
      code: finalValues.code,
      listOrder: parseInt(finalValues.listOrder, 10),
      description: finalValues.description,
    };
  };

  onChange = (content: string) => {
    this.setState({ content });
  };

  renderContent = (formProps: IFormProps) => {
    const { page, renderButton, closeModal } = this.props;
    const { content } = this.state;

    const { isSubmitted, values } = formProps;

    const object = page || ({} as IPage);

    return (
      <>
        <FlexContent>
          <FlexItem count={4}>
            <FormGroup>
              <ControlLabel required={true}>{__('Titul')}</ControlLabel>
              <FormControl
                {...formProps}
                name="title"
                defaultValue={object.title}
                required={true}
                autoFocus={true}
              />
            </FormGroup>
          </FlexItem>
          <FlexItem count={2} hasSpace={true}>
            <FormGroup>
              <ControlLabel>{__('Code')}</ControlLabel>
              <FormControl
                {...formProps}
                name="code"
                defaultValue={object.code}
              />
            </FormGroup>
          </FlexItem>
        </FlexContent>
        <FlexContent>
          <FlexItem count={4}>
            <FormGroup>
              <ControlLabel>{__('Thumbnail')}</ControlLabel>
              <FormControl
                {...formProps}
                name="thumbnail"
                defaultValue={object.thumbnail}
              />
            </FormGroup>
          </FlexItem>
          <FlexItem count={2} hasSpace={true}>
            <FormGroup>
              <ControlLabel>{__('List Order')}</ControlLabel>
              <FormControl
                {...formProps}
                name="listOrder"
                type="number"
                defaultValue={object.listOrder}
              />
            </FormGroup>
          </FlexItem>
        </FlexContent>

        <FormGroup>
          <ControlLabel>{__('Popis')}</ControlLabel>
          <FormControl
            {...formProps}
            name="description"
            componentClass="textarea"
            defaultValue={object.description}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>{__('Content')}</ControlLabel>
          <RichTextEditor
            content={content}
            onChange={this.onChange}
            isSubmitted={isSubmitted}
            height={300}
            name={`page_${page ? page._id : 'create'}`}
          />
        </FormGroup>

        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={this.props.closeModal}
            icon="times-circle"
          >
            {__('Zrušení')}
          </Button>

          {renderButton({
            passedName: 'page',
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object: page,
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default PageForm;
