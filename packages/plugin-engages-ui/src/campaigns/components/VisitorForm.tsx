import Button from '@saashq/ui/src/components/Button';
import FormControl from '@saashq/ui/src/components/form/Control';
import ConditionsRule from '@saashq/ui/src/components/rule/ConditionsRule';
import Step from '@saashq/ui/src/components/step/Step';
import Steps from '@saashq/ui/src/components/step/Steps';
import {
  StepWrapper,
  TitleContainer,
} from '@saashq/ui/src/components/step/styles';
import { __ } from '@saashq/ui/src/utils/core';
import { MESSAGE_KINDS, METHODS } from '@saashq/ui-engage/src/constants';
import {
  IEngageMessage,
  IEngageMessageDoc,
  IEngageMessenger,
  IEngageScheduleDate,
} from '@saashq/ui-engage/src/types';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import React from 'react';
import { Link } from 'react-router-dom';
import MessengerForm from './MessengerForm';
import { IBrand } from '@saashq/ui/src/brands/types';
import { IUser } from '@saashq/ui/src/auth/types';
import { IBreadCrumbItem, IConditionsRule } from '@saashq/ui/src/types';

type Props = {
  kind: string;
  message?: IEngageMessage;
  brands: IBrand[];
  users: IUser[];
  handleSubmit?: (name: string, e: React.MouseEvent) => void;
  save: (doc: IEngageMessageDoc) => Promise<any>;
  validateDoc: (
    type: string,
    doc: IEngageMessageDoc,
  ) => { status: string; doc?: IEngageMessageDoc };
  renderTitle: () => string;
  breadcrumbs: IBreadCrumbItem[];
  isActionLoading: boolean;
};

type State = {
  maxStep: number;
  activeStep: number;
  method: string;
  title: string;
  content: string;
  fromUserId: string;
  rules: IConditionsRule[];
  messenger?: IEngageMessenger;
  scheduleDate?: IEngageScheduleDate;
  isSaved: boolean;
};

class VisitorForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const message = props.message || ({} as IEngageMessage);
    const messenger = message.messenger || ({} as IEngageMessenger);
    const rules = messenger.rules
      ? messenger.rules.map((rule) => ({ ...rule }))
      : [];

    this.state = {
      maxStep: 2,
      activeStep: 1,
      method: METHODS.MESSENGER,
      title: message.title || '',
      content: messenger.content || '',
      fromUserId: message.fromUserId || '',
      rules,
      messenger: message.messenger,
      scheduleDate: message.scheduleDate,
      isSaved: false,
    };
  }

  changeState = <T extends keyof State>(key: T, value: State[T]) => {
    this.setState({ [key]: value } as unknown as Pick<State, keyof State>);
  };

  handleSubmit = (type: string): Promise<any> | void => {
    const messenger = this.state.messenger || ({} as IEngageMessenger);

    const doc = {
      kind: MESSAGE_KINDS.VISITOR_AUTO,
      title: this.state.title,
      fromUserId: this.state.fromUserId,
      method: METHODS.MESSENGER,
      messenger: {
        rules: this.state.rules,
        brandId: messenger.brandId,
        sentAs: messenger.sentAs,
        content: this.state.content,
      },
      scheduleDate: this.state.scheduleDate,
    };

    const response = this.props.validateDoc(type, doc);

    if (response.status === 'ok' && response.doc) {
      this.setState({ isSaved: true });

      return this.props.save(response.doc);
    }
  };

  renderSaveButton = () => {
    const { isActionLoading, kind } = this.props;

    const cancelButton = (
      <Link to="/campaigns">
        <Button btnStyle="simple" icon="times-circle">
          Cancel
        </Button>
      </Link>
    );

    const saveButton = () => {
      if (kind === 'visitorAuto') {
        return (
          <>
            <Button
              disabled={isActionLoading}
              btnStyle="warning"
              icon={isActionLoading ? undefined : 'file-alt'}
              onClick={this.handleSubmit.bind(this, 'draft')}
            >
              Save & Draft
            </Button>
            <Button
              disabled={isActionLoading}
              btnStyle="success"
              icon={isActionLoading ? undefined : 'check-circle'}
              onClick={this.handleSubmit.bind(this, 'live')}
            >
              Save & Live
            </Button>
          </>
        );
      }
      return;
    };

    return (
      <Button.Group>
        {cancelButton}
        {saveButton()}
      </Button.Group>
    );
  };

  render() {
    const {
      activeStep,
      maxStep,
      messenger,
      fromUserId,
      content,
      scheduleDate,
      isSaved,
    } = this.state;

    const { renderTitle, breadcrumbs, kind, users, brands } = this.props;

    const onChange = (e) =>
      this.changeState('title', (e.target as HTMLInputElement).value);

    return (
      <StepWrapper>
        <Wrapper.Header title={renderTitle()} breadcrumb={breadcrumbs} />

        <TitleContainer>
          <div>{__('Titul')}</div>
          <FormControl
            required={true}
            onChange={onChange}
            defaultValue={this.state.title}
            autoFocus={true}
          />
          {this.renderSaveButton()}
        </TitleContainer>

        <Steps maxStep={maxStep} active={activeStep}>
          <Step
            img="/images/icons/saashq-02.svg"
            title="Who is this campaign for?"
          >
            <ConditionsRule
              rules={this.state.rules}
              onChange={this.changeState}
            />
          </Step>

          <Step
            img="/images/icons/saashq-08.svg"
            title="Compose your campaign"
            noButton={true}
          >
            <MessengerForm
              brands={brands}
              onChange={this.changeState}
              users={users}
              messageKind={kind}
              hasKind={false}
              messenger={messenger || ({} as IEngageMessenger)}
              fromUserId={fromUserId}
              content={content}
              scheduleDate={scheduleDate || ({} as IEngageScheduleDate)}
              isSaved={isSaved}
            />
          </Step>
        </Steps>
      </StepWrapper>
    );
  }
}

export default VisitorForm;
