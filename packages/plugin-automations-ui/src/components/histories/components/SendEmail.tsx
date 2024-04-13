import React from 'react';
import EmailTemplate from '@saashq/ui-emailtemplates/src/containers/EmailTemplate';
import {
  Button,
  ControlLabel,
  FormGroup,
  Label,
  ModalTrigger,
  Tip,
  __,
} from '@saashq/ui/src';
import { Columns } from '@saashq/ui/src/styles/chooser';
import { Column } from '@saashq/ui/src/styles/main';
import { LabelContainer } from '../styles';

type Props = {
  result: any;
  action: any;
};

class SendEmail extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.renderContent = this.renderContent.bind(this);
  }

  renderTemplate(action) {
    const { actionConfig } = action;

    return (
      <FormGroup>
        <ControlLabel>{__('Šablona E-mailu')}</ControlLabel>
        <EmailTemplate templateId={actionConfig.templateId} onlyPreview />
      </FormGroup>
    );
  }

  renderEmails({ fromEmail, title, responses }) {
    const getLabelColor = (response) => {
      if (response?.messageId) {
        return 'success';
      }
      if (response?.error) {
        return 'danger';
      }
      return 'default';
    };

    const getLabelText = (response) => {
      if (response.error) {
        return typeof response?.error === 'object'
          ? JSON.stringify(response.error || {})
          : `${response?.error}`;
      }

      if (response.messageId) {
        return 'Odesláno';
      }

      return '';
    };

    return (
      <li>
        <ul>
          <strong>{`Z: `}</strong>
          {`${fromEmail || ''}`}
        </ul>
        <ul>
          <strong>{`Předmět: `}</strong>
          {`${title || ''}`}
        </ul>
        <ul>
          <LabelContainer>
            <strong>{`Na:`}</strong>
            {responses.map((response, i) => (
              <>
                <Tip text={getLabelText(response)}>
                  <Label key={i} lblStyle={getLabelColor(response)}>
                    {response?.toEmail || ''}
                  </Label>
                </Tip>
              </>
            ))}
          </LabelContainer>
        </ul>
      </li>
    );
  }

  renderContent() {
    const { action, result } = this.props;

    return (
      <Columns>
        {this.renderTemplate(action)}
        <Column>{this.renderEmails(result)}</Column>
      </Columns>
    );
  }

  render() {
    const trigger = <Button size="small" icon="eye" btnStyle="simple" />;

    return (
      <ModalTrigger
        title=""
        size="lg"
        hideHeader
        trigger={trigger}
        content={this.renderContent}
      />
    );
  }
}

export default SendEmail;
