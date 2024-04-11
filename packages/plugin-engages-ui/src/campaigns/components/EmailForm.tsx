import {
  EditorContainer,
  TestEmailWrapper,
  VerifyCancel,
  VerifyCheck,
} from '@saashq/ui-engage/src/styles';
import { FlexItem, FlexPad } from '@saashq/ui/src/components/step/styles';
import {
  IEmailFormProps,
  IEngageEmail,
  IEngageScheduleDate,
} from '@saashq/ui-engage/src/types';

import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import RichTextEditor from '../containers/RichTextEditor';
import ErrorMsg from '@saashq/ui/src/components/ErrorMsg';
import { FlexContent } from '@saashq/ui-log/src/activityLogs/styles';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import HelpPopover from '@saashq/ui/src/components/HelpPopover';
import { ISelectedOption } from '@saashq/ui/src/types';
import { IUser } from '@saashq/ui/src/auth/types';
import Icon from '@saashq/ui/src/components/Icon';
import React from 'react';
import Scheduler from './Scheduler';
import Select from 'react-select-plus';
import Tip from '@saashq/ui/src/components/Tip';
import Uploader from '@saashq/ui/src/components/Uploader';
import { __ } from 'coreui/utils';
import { generateEmailTemplateParams } from '@saashq/ui-engage/src/utils';

type EmailParams = {
  content: string;
  from: string;
  to: string;
  title: string;
};

type Props = IEmailFormProps & {
  verifiedEmails: string[];
  error?: string;
  sendTestEmail: (params: EmailParams) => void;
};

type State = {
  fromUserId: string;
  content: string;
  email: IEngageEmail;
  scheduleDate?: IEngageScheduleDate;
  testEmail?: string;
};

const getEmail = (users: IUser[], fromUserId: string): string => {
  const user = users.find((u) => u._id === fromUserId);

  return user && user.email ? user.email : '';
};

class EmailForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      fromUserId: props.fromUserId,
      content: props.content,
      email: props.email,
      scheduleDate: props.scheduleDate,
      testEmail: getEmail(props.users, props.fromUserId),
    };
  }

  changeContent = (key, value) => {
    const email = { ...this.state.email } as IEngageEmail;

    email[key] = value;

    this.setState({ email });

    this.props.onChange('email', email);
  };

  changeUser = (fromUserId: string) => {
    this.setState({ fromUserId });
    this.props.onChange('fromUserId', fromUserId);
  };

  templateChange = (value) => {
    const email = { ...this.state.email } as IEngageEmail;

    email.templateId = value;

    this.setState({ content: this.findTemplate(value), email }, () => {
      this.props.onChange('email', this.state.email);
    });
  };

  findTemplate = (id) => {
    const template = this.props.templates.find((t) => t._id === id);

    if (template) {
      return template.content;
    }

    return '';
  };

  renderScheduler() {
    if (this.props.kind === 'manual') {
      return null;
    }

    return (
      <Scheduler
        scheduleDate={this.state.scheduleDate || ({} as IEngageScheduleDate)}
        onChange={this.props.onChange}
      />
    );
  }

  onEditorChange = (content: string) => {
    this.props.onChange('content', content);
  };

  renderFrom() {
    const { error } = this.props;

    if (error) {
      return <ErrorMsg>{error}</ErrorMsg>;
    }

    const onChangeUser = (value: ISelectedOption) => {
      const userId = value ? value.value : '';

      this.changeUser(userId);
    };

    const selectOptions = () => {
      const { users, verifiedEmails } = this.props;
      const options: any[] = [];

      users.map((user) =>
        options.push({
          value: user._id,
          label: user.email || user.username,
          disabled: !verifiedEmails.includes(user.email),
        }),
      );

      return options;
    };

    const optionRenderer = (option) => (
      <FlexContent>
        {!option.disabled ? (
          <Tip placement="auto" text="E-mail ověřen">
            <VerifyCheck>
              <Icon icon="check-circle" />
            </VerifyCheck>
          </Tip>
        ) : (
          <Tip placement="auto" text="E-mail není ověřen">
            <VerifyCancel>
              <Icon icon="times-circle" />
            </VerifyCancel>
          </Tip>
        )}
        {option.label}
      </FlexContent>
    );

    return (
      <Select
        placeholder={__('Choose users')}
        value={this.state.fromUserId}
        onChange={onChangeUser}
        optionRenderer={optionRenderer}
        options={selectOptions()}
      />
    );
  }

  renderTestEmailSection() {
    const { content: propContent, email, sendTestEmail, users } = this.props;
    const { content, fromUserId, testEmail } = this.state;

    const onChange = (e) => {
      const value = (e.target as HTMLInputElement).value;

      this.setState({ testEmail: value });
    };

    const sendAsTest = () => {
      sendTestEmail({
        from: getEmail(users, fromUserId),
        to: testEmail || '',
        content: propContent || content,
        title: email && email.subject ? email.subject : '',
      });
    };

    return (
      <TestEmailWrapper>
        <FormGroup>
          <ControlLabel>Odešlete na následující e-mail jako test:</ControlLabel>
          <HelpPopover>Musíte zadat pouze jednu e-mailovou adresu</HelpPopover>
          <FormControl
            type="text"
            onChange={onChange}
            defaultValue={testEmail}
          />
          <Button
            disabled={testEmail ? false : true}
            btnStyle="primary"
            icon="send"
            onClick={sendAsTest}
          >
            Poslat
          </Button>
        </FormGroup>
      </TestEmailWrapper>
    );
  }

  render() {
    const { attachments } = this.state.email;

    const onChangeSubject = (e) =>
      this.changeContent('subject', (e.target as HTMLInputElement).value);

    const onChangeReplyTo = (e) =>
      this.changeContent('replyTo', (e.target as HTMLInputElement).value);

    const onChangeSender = (e) =>
      this.changeContent('sender', (e.target as HTMLInputElement).value);

    const onChangeAttachment = (attachmentsArr) =>
      this.changeContent('attachments', attachmentsArr);

    const onChangeTemplate = (e) => {
      this.templateChange(e.value);
    };

    return (
      <FlexItem>
        <FlexPad direction="column" overflow="auto">
          <FormGroup>
            <ControlLabel>
              Z:
              <HelpPopover title="E-mailová adresa není ověřena (x) službami Amazon Ses.">
                <div>
                  Pokud chcete ověřit svůj e-mail:
                  <ol>
                    <li>Přihlaste se do své konzoly pro správu AWS</li>
                    <li>Klikněte na nabídku Služby z rozevírací nabídky</li>
                    <li>
                      Klikněte na nabídku Simple Email Services zleva postranní
                      panel
                    </li>
                    <li>
                      Klikněte na nabídku E-mailové adresy na levém postranním
                      panelu
                    </li>
                    <li>
                      Nakonec klikněte na tlačítko s názvem „Ověřit nový
                      emailová adresa"
                    </li>
                  </ol>
                </div>
              </HelpPopover>
            </ControlLabel>
            {this.renderFrom()}
          </FormGroup>

          <FormGroup>
            <ControlLabel>Odesílatel:</ControlLabel>
            <FormControl
              onChange={onChangeSender}
              defaultValue={this.state.email.sender}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Odpovědět:</ControlLabel>
            <HelpPopover>E-maily musí být odděleny mezerou</HelpPopover>
            <FormControl
              onChange={onChangeReplyTo}
              defaultValue={this.state.email.replyTo}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Předmět emailu:</ControlLabel>
            <FormControl
              onChange={onChangeSubject}
              defaultValue={this.state.email.subject}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Šablona e-mailu:</ControlLabel>
            <p>{__('Insert email template to content')}</p>

            <Select
              onChange={onChangeTemplate}
              value={this.state.email.templateId}
              options={generateEmailTemplateParams(this.props.templates)}
              clearable={false}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Přílohy: </ControlLabel>
            <Uploader
              defaultFileList={attachments || []}
              onChange={onChangeAttachment}
            />
          </FormGroup>

          {this.renderScheduler()}
          {this.renderTestEmailSection()}
        </FlexPad>

        <FlexItem overflow="auto" count="2">
          <EditorContainer>
            <ControlLabel>Obsah:</ControlLabel>
            <RichTextEditor
              content={this.state.content}
              isSubmitted={this.props.isSaved}
              onChange={this.onEditorChange}
              height={500}
              name={`engage_email_${this.props.kind}_${this.props.fromUserId}`}
            />
          </EditorContainer>
        </FlexItem>
      </FlexItem>
    );
  }
}

export default EmailForm;
