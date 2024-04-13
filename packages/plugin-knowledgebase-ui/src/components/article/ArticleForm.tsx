import { FlexContent, FlexItem } from '@saashq/ui/src/layout/styles';
import { FlexRow, Forms, ReactionItem } from './styles';
import {
  IArticle,
  ISaasHQForm,
  ITopic,
} from '@saashq/ui-knowledgeBase/src/types';
import {
  IAttachment,
  IButtonMutateProps,
  IFormProps,
  IOption,
} from '@saashq/ui/src/types';
import { __, extractAttachment } from 'coreui/utils';

import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { RichTextEditor } from '@saashq/ui/src/components/richTextEditor/TEditor';
import { FILE_MIME_TYPES } from '@saashq/ui-settings/src/general/constants';
import Form from '@saashq/ui/src/components/form/Form';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import Icon from '@saashq/ui/src/components/Icon';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import React from 'react';
import Select from 'react-select-plus';
import Uploader from '@saashq/ui/src/components/Uploader';
import { articleReactions } from '../../icons.constant';

type Props = {
  article: IArticle;
  currentCategoryId: string;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  topics: ITopic[];
  topicId?: string;
};

type State = {
  content: string;
  reactionChoices: string[];
  topicId?: string;
  categoryId: string;
  attachments: IAttachment[];
  image: IAttachment | null;
  saashqForms: ISaasHQForm[];
  isPrivate: boolean;
};

class ArticleForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const article = props.article || ({ content: '' } as IArticle);
    const attachments =
      (article.attachments && extractAttachment(article.attachments)) || [];
    const image = article.image ? extractAttachment([article.image])[0] : null;

    this.state = {
      content: article.content,
      reactionChoices: article.reactionChoices || [],
      topicId: article.topicId,
      categoryId: article.categoryId,
      saashqForms: article.forms || [],
      image,
      attachments,
      isPrivate: article.isPrivate || false,
    };
  }

  componentDidUpdate(prevProps) {
    const { topics, currentCategoryId } = this.props;
    const self = this;

    if (!this.state.topicId && topics && topics.length > 0) {
      this.setState({
        topicId: self.props.topicId,
        categoryId: currentCategoryId,
      });
    }
  }

  getFirstAttachment = () => {
    const { attachments } = this.state;

    return attachments.length > 0 ? attachments[0] : ({} as IAttachment);
  };

  generateDoc = (values: {
    _id?: string;
    title: string;
    summary: string;
    status: string;
  }) => {
    const { article, currentCategoryId } = this.props;
    const {
      attachments,
      content,
      reactionChoices,
      topicId,
      categoryId,
      image,
      saashqForms,
      isPrivate,
    } = this.state;

    const finalValues = values;

    if (article) {
      finalValues._id = article._id;
    }

    return {
      _id: finalValues._id,
      doc: {
        title: finalValues.title,
        summary: finalValues.summary,
        content,
        reactionChoices,
        status: finalValues.status,
        isPrivate,
        categoryIds: [currentCategoryId],
        topicId,
        forms: saashqForms.map((f) => ({
          formId: f.formId,
          brandId: f.brandId,
        })),
        attachments,
        categoryId,
        image,
      },
    };
  };

  onChange = (content: string) => {
    this.setState({ content });
  };

  onChangeReactions = (options: IOption[]) => {
    this.setState({ reactionChoices: options.map((option) => option.value) });
  };

  onChangeAttachments = (attachments: IAttachment[]) =>
    this.setState({ attachments });

  onChangeImage = (images: IAttachment[]) => {
    if (images && images.length > 0) {
      this.setState({ image: images[0] });
    } else {
      this.setState({ image: null });
    }
  };

  onChangeIsCheckDate = (e) => {
    const isChecked = (e.currentTarget as HTMLInputElement).checked;
    this.setState({ isPrivate: isChecked });
  };

  onChangeAttachment = (key: string, value: string | number) => {
    this.setState({
      attachments: [
        {
          ...this.getFirstAttachment(),
          [key]: value,
        },
      ],
    });
  };

  onChangeForm = (formId: string, key: string, value: string | number) => {
    const saashqForms = this.state.saashqForms;

    // find current editing one
    const saashqForm = saashqForms.find((form) => form.formId === formId) || [];

    // set new value
    saashqForm[key] = value;

    this.setState({ saashqForms });
  };

  addSaasHQForm = () => {
    const saashqForms = this.state.saashqForms.slice();

    saashqForms.push({
      brandId: '',
      formId: '',
    });

    this.setState({ saashqForms });
  };

  removeForm = (formId) => {
    let saashqForms = this.state.saashqForms;

    saashqForms = saashqForms.filter((form) => form.formId !== formId);

    this.setState({ saashqForms });
  };

  renderOption = (option) => {
    return (
      <ReactionItem>
        <img src={option.value} alt={option.label} />
        {option.label}
      </ReactionItem>
    );
  };

  generateOptions = (options) => {
    return options.map((option) => ({
      value: option._id,
      label: option.title,
    }));
  };

  renderTopics(formProps: IFormProps) {
    const self = this;
    const { topics } = this.props;

    const onChange = (e) => {
      e.preventDefault();

      const selectedTopicId = e.target.value;

      const topic = topics.find((t) => t._id === selectedTopicId);
      const categories = topic ? topic.categories || [] : [];

      self.setState({
        topicId: selectedTopicId,
        categoryId: categories.length > 0 ? categories[0]._id : '',
      });
    };

    return (
      <FormGroup>
        <ControlLabel required={true}>Choose the knowledgebase</ControlLabel>
        <br />

        <FormControl
          {...formProps}
          name="topicId"
          componentClass="select"
          required={true}
          placeholder={__('Choose knowledgebase')}
          value={self.state.topicId}
          options={self.generateOptions(topics)}
          onChange={onChange}
        />
      </FormGroup>
    );
  }

  renderCategories(formProps: IFormProps) {
    const self = this;
    const topic = this.props.topics.find((t) => t._id === self.state.topicId);
    const categories = topic ? topic.categories || [] : [];

    const onChange = (e) => {
      e.preventDefault();

      self.setState({ categoryId: e.target.value });
    };

    return (
      <FormGroup>
        <ControlLabel required={true}>Choose the category</ControlLabel>
        <br />

        <FormControl
          {...formProps}
          name="categoryId"
          componentClass="select"
          placeholder={__('Choose category')}
          value={self.state.categoryId}
          options={self.generateOptions(categories)}
          onChange={onChange}
          required={true}
        />
      </FormGroup>
    );
  }

  renderSaasHQForm = (form: ISaasHQForm, formProps: IFormProps) => {
    const remove = () => {
      this.removeForm(form.formId);
    };

    return (
      <FlexRow key={form.formId}>
        <FormGroup>
          <ControlLabel required={true}>{__('Brand id')}</ControlLabel>
          <FormControl
            {...formProps}
            name="brandId"
            required={true}
            defaultValue={form.brandId}
            onChange={(e: any) =>
              this.onChangeForm(form.formId, 'brandId', e.target.value)
            }
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>{__('Form id')}</ControlLabel>
          <FormControl
            {...formProps}
            name="formId"
            required={true}
            defaultValue={form.formId}
            onChange={(e: any) =>
              this.onChangeForm(form.formId, 'formId', e.target.value)
            }
          />
        </FormGroup>

        <Button size="small" btnStyle="danger" onClick={remove}>
          <Icon icon="cancel-1" />
        </Button>
      </FlexRow>
    );
  };

  renderContent = (formProps: IFormProps) => {
    const { article, renderButton, closeModal } = this.props;
    const { attachments, reactionChoices, content, image, isPrivate } =
      this.state;
    const attachment = this.getFirstAttachment();

    const mimeTypeOptions = FILE_MIME_TYPES.map((item) => ({
      value: item.value,
      label: `${item.label} (${item.extension})`,
    }));

    const { isSubmitted, values } = formProps;

    const object = article || ({} as IArticle);

    return (
      <>
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

        <FormGroup>
          <ControlLabel>{__('Summary')}</ControlLabel>
          <FormControl
            {...formProps}
            name="summary"
            defaultValue={object.summary}
          />
        </FormGroup>

        <FlexContent>
          <FlexItem count={4}>
            <FormGroup>
              <ControlLabel required={true}>{__('Reactions')}</ControlLabel>
              <Select
                multi={true}
                value={reactionChoices}
                options={articleReactions}
                onChange={this.onChangeReactions}
                optionRenderer={this.renderOption}
                valueRenderer={this.renderOption}
                placeholder={__('Vybrat')}
              />
            </FormGroup>
          </FlexItem>
          <FlexItem count={2} hasSpace={true}>
            <FormGroup>
              <ControlLabel required={true}>{__('Postavení')}</ControlLabel>
              <FormControl
                {...formProps}
                name="status"
                componentClass="select"
                placeholder={__('Vybrat')}
                defaultValue={object.status || 'draft'}
                required={true}
              >
                {[{ value: 'draft' }, { value: 'publish' }].map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.value}
                  </option>
                ))}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel required={true}>{__('isPrivate')}</ControlLabel>
              <FormControl
                componentClass="checkbox"
                checked={isPrivate}
                onChange={this.onChangeIsCheckDate}
              />
            </FormGroup>
          </FlexItem>
        </FlexContent>

        <FlexContent>
          <FlexItem count={3}>{this.renderTopics(formProps)}</FlexItem>
          <FlexItem count={3} hasSpace={true}>
            {this.renderCategories(formProps)}
          </FlexItem>
        </FlexContent>

        <FormGroup>
          <ControlLabel>{__('Image')}</ControlLabel>
          <Uploader
            defaultFileList={image ? [image] : []}
            onChange={this.onChangeImage}
            single={true}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>{__('Attachment')}</ControlLabel>
          <Uploader
            defaultFileList={attachments}
            onChange={this.onChangeAttachments}
            single={true}
          />
        </FormGroup>

        <FlexContent>
          <FlexItem count={2} hasSpace={true}>
            <FormGroup>
              <ControlLabel>{__('File url')}</ControlLabel>
              <FormControl
                placeholder="Url"
                value={attachment.url || ''}
                onChange={(e: any) =>
                  this.onChangeAttachment('url', e.target.value)
                }
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{__('File name')}</ControlLabel>
              <FormControl
                placeholder="Name"
                value={attachment.name || ''}
                onChange={(e: any) =>
                  this.onChangeAttachment('name', e.target.value)
                }
              />
            </FormGroup>
          </FlexItem>
          <FlexItem count={2} hasSpace={true}>
            <FormGroup>
              <ControlLabel>{__('File size (byte)')}</ControlLabel>
              <FormControl
                placeholder="Size (byte)"
                value={attachment.size || ''}
                type="number"
                onChange={(e: any) =>
                  this.onChangeAttachment('size', parseInt(e.target.value, 10))
                }
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{__('File type')}</ControlLabel>
              <FormControl
                componentClass="select"
                value={attachment.type || ''}
                onChange={(e: any) =>
                  this.onChangeAttachment('type', e.target.value)
                }
                options={[
                  { value: '', label: 'Select type' },
                  ...mimeTypeOptions,
                ]}
              />
            </FormGroup>
          </FlexItem>
          <FlexItem count={2} hasSpace={true}>
            <FormGroup>
              <ControlLabel>{__('File duration (sec)')}</ControlLabel>
              <FormControl
                placeholder="Duration"
                value={attachment.duration || 0}
                onChange={(e: any) =>
                  this.onChangeAttachment(
                    'duration',
                    parseInt(e.target.value, 10),
                  )
                }
              />
            </FormGroup>
          </FlexItem>
        </FlexContent>

        <FormGroup>
          <ControlLabel>{__('saashq forms')}</ControlLabel>
          <Forms>
            {this.state.saashqForms.map((form) =>
              this.renderSaasHQForm(form, formProps),
            )}
          </Forms>

          <Button
            btnStyle="simple"
            size="small"
            onClick={this.addSaasHQForm}
            icon="add"
          >
            Add another form
          </Button>
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>{__('Content')}</ControlLabel>
          <RichTextEditor
            content={content}
            onChange={this.onChange}
            isSubmitted={isSubmitted}
            height={300}
            name={`knowledgeBase_${article ? article._id : 'create'}`}
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
            passedName: 'article',
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object: article,
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default ArticleForm;
