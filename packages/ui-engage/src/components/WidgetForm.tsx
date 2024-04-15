import { FlexContent, FlexItem } from '@saashq/ui/src/layout/styles';
import { Half, Recipient, Recipients } from '../styles';
import {
  IEmailTemplate,
  IEngageEmail,
  IEngageMessageDoc,
  IEngageMessenger,
} from '../types';

import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import RichTextEditor from '@saashq/ui/src/containers/RichTextEditor';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { IAttachment } from '@saashq/ui/src/types';
import { IBrand } from '@saashq/ui/src/brands/types';
import { ICustomer } from '@saashq/ui-contacts/src/customers/types';
import { IUser } from '@saashq/ui/src/auth/types';
import { MAIL_TOOLBARS_CONFIG } from '@saashq/ui/src/constants/integrations';
import { METHODS } from '../constants';
import MessengerPreview from '../containers/MessengerPreview';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import React from 'react';
import Select from 'react-select-plus';
import Uploader from '@saashq/ui/src/components/Uploader';
import { __ } from '@saashq/ui/src/utils';
import { generateEmailTemplateParams } from '../utils';

type Props = {
  customers: ICustomer[];
  emailTemplates: IEmailTemplate[];
  brands: IBrand[];
  messengerKinds: any[];
  sentAsChoices: any[];
  save: (doc: IEngageMessageDoc, closeModal: () => void) => void;
  closeModal: () => void;
  channelType?: string;
  currentUser: IUser;
};

type State = {
  content: string;
  channel: string;
  attachments: IAttachment[];
  sentAs: string;
  templateId: string;
  isSaved: boolean;
};

class WidgetForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: '',
      channel: props.channelType || 'email',
      attachments: [],
      sentAs: 'snippet',
      templateId: '',
      isSaved: false,
    };

    this.close = this.close.bind(this);
  }

  save = (e) => {
    e.preventDefault();

    const { save, customers } = this.props;

    const doc = {
      title: (document.getElementById('title') as HTMLInputElement).value,
      customerIds: customers.map((customer) => customer._id),
      method: '',
    } as IEngageMessageDoc;

    if (this.state.channel === 'email') {
      doc.method = METHODS.EMAIL;
      doc.email = {
        subject: (document.getElementById('emailSubject') as HTMLInputElement)
          .value,
        attachments: this.state.attachments,
        content: this.state.content,
      } as IEngageEmail;
    }

    if (this.state.channel === 'messenger') {
      doc.method = METHODS.MESSENGER;
      doc.messenger = {
        brandId: (document.getElementById('brandId') as HTMLInputElement).value,
        kind: (document.getElementById('messengerKind') as HTMLInputElement)
          .value,
        sentAs: (document.getElementById('sentAs') as HTMLInputElement).value,
        content: this.state.content,
      } as IEngageMessenger;
    }

    return save(doc, () => this.close);
  };

  onChangeCommon = <T extends keyof State>(name: T, value: State[T]) => {
    this.setState({ [name]: value } as unknown as Pick<State, keyof State>);
  };

  onChannelChange = (e) => {
    this.setState({ channel: e.target.value });
  };

  templateChange = (e) => {
    this.setState({ content: this.findTemplate(e.value), templateId: e.value });
  };

  onEditorChange = (content: string) => {
    this.onChangeCommon('content', content);
  };

  onSentAsChange = (e) => {
    this.onChangeCommon('sentAs', e.target.value);
  };

  findTemplate = (id) => {
    const template = this.props.emailTemplates.find((t) => t._id === id);

    if (template) {
      return template.content;
    }

    return '';
  };

  renderReceivers() {
    return (
      <FormGroup>
        <ControlLabel>Odesílání na:</ControlLabel>
        <Recipients>
          {this.props.customers.map((customer) => (
            <Recipient key={customer._id}>
              <strong>{customer.firstName}</strong>
              <span>({customer.primaryEmail || 'Unknown'})</span>
            </Recipient>
          ))}
        </Recipients>
      </FormGroup>
    );
  }

  renderChannelType() {
    if (this.props.channelType) {
      return null;
    }

    return (
      <Half>
        <FormGroup>
          <ControlLabel>Kanál:</ControlLabel>
          <FormControl
            componentClass="select"
            onChange={this.onChannelChange}
            defaultValue={this.state.channel}
          >
            <option value="email">{__('E-mailem')}</option>
            <option value="messenger">{__('Posel')}</option>
          </FormControl>
        </FormGroup>
      </Half>
    );
  }

  close() {
    this.setState({ isSaved: true }, () => {
      this.props.closeModal();
    });
  }

  renderFormContent() {
    const currentUser = this.props.currentUser;

    const editor = (options?) => (
      <RichTextEditor
        {...options}
        content={this.state.content}
        onChange={this.onEditorChange}
        toolbar={MAIL_TOOLBARS_CONFIG}
        name={`engage_widget_${this.state.channel}_${currentUser._id}`}
        isSubmitted={this.state.isSaved}
      />
    );

    if (this.state.channel === 'messenger') {
      return (
        <FlexContent>
          <FlexItem>
            <FormGroup>
              <ControlLabel required={true}>Značka:</ControlLabel>

              <FormControl id="brandId" componentClass="select" required={true}>
                <option />
                {this.props.brands.map((b, index) => (
                  <option key={`brand-${index}`} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </FormControl>
            </FormGroup>
            <div>
              <FlexContent>
                <FlexItem>
                  <FormGroup>
                    <ControlLabel required={true}>Posel druh:</ControlLabel>

                    <FormControl
                      id="messengerKind"
                      componentClass="select"
                      required={true}
                    >
                      <option />
                      {this.props.messengerKinds.map((t, index) => (
                        <option key={`messengerKind-${index}`} value={t.value}>
                          {t.text}
                        </option>
                      ))}
                    </FormControl>
                  </FormGroup>
                </FlexItem>
                <FlexItem hasSpace={true}>
                  <FormGroup>
                    <ControlLabel>Odesláno jako:</ControlLabel>

                    <FormControl
                      id="sentAs"
                      defaultValue={this.state.sentAs}
                      componentClass="select"
                      onChange={this.onSentAsChange}
                    >
                      {this.props.sentAsChoices.map((t, index) => (
                        <option key={`sentAs-${index}`} value={t.value}>
                          {t.text}
                        </option>
                      ))}
                    </FormControl>
                  </FormGroup>
                </FlexItem>
              </FlexContent>
            </div>

            {editor()}
          </FlexItem>

          <FlexItem>
            <MessengerPreview
              sentAs={this.state.sentAs}
              content={this.state.content}
              fromUserId={this.props.currentUser._id}
            />
          </FlexItem>
        </FlexContent>
      );
    }

    const { attachments } = this.state;
    const onChange = (attachmentsAtt) =>
      this.onChangeCommon('attachments', attachmentsAtt);

    return (
      <>
        <Half>
          <FormGroup>
            <ControlLabel>Předmět emailu:</ControlLabel>
            <FormControl id="emailSubject" type="text" required={true} />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Šablony e-mailů:</ControlLabel>
            <p>{__('Vložte šablonu e-mailu do obsahu')}</p>

            <Select
              value={this.state.templateId}
              onChange={this.templateChange}
              options={generateEmailTemplateParams(this.props.emailTemplates)}
              clearable={false}
            />
          </FormGroup>
        </Half>

        <FormGroup>{editor({ height: 300 })}</FormGroup>

        <FormGroup>
          <ControlLabel>Přílohy:</ControlLabel>
          <Uploader defaultFileList={attachments} onChange={onChange} />
        </FormGroup>
      </>
    );
  }

  render() {
    return (
      <form onSubmit={this.save}>
        {this.renderReceivers()}
        {this.renderChannelType()}

        <Half>
          <FormGroup>
            <ControlLabel required={true}>Titul:</ControlLabel>
            <FormControl
              autoFocus={true}
              id="title"
              type="text"
              required={true}
            />
          </FormGroup>
        </Half>

        {this.renderFormContent()}

        <ModalFooter>
          <Button btnStyle="simple" icon="times-circle" onClick={this.close}>
            Zavřít
          </Button>
          <Button type="submit" btnStyle="success" icon="message">
            Poslat
          </Button>
        </ModalFooter>
      </form>
    );
  }
}

export default WidgetForm;
