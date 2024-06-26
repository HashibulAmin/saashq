import Button from '@saashq/ui/src/components/Button';
import FormControl from '@saashq/ui/src/components/form/Control';
import Form from '@saashq/ui/src/components/form/Form';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import Info from '@saashq/ui/src/components/Info';
import { Step, Steps } from '@saashq/ui/src/components/step';
import {
  ControlWrapper,
  FlexItem,
  Indicator,
  LeftItem,
  Preview,
  StepWrapper,
} from '@saashq/ui/src/components/step/styles';
import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import * as React from 'react';
import { Link } from 'react-router-dom';

import SelectBrand from '@saashq/ui-inbox/src/settings/integrations/containers/SelectBrand';
import SelectChannels from '@saashq/ui-inbox/src/settings/integrations/containers/SelectChannels';
import {
  Content,
  ImageWrapper,
  MessengerPreview,
  TextWrapper,
} from '@saashq/ui-inbox/src/settings/integrations/styles';
import Accounts from '../containers/Accounts';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

type State = {
  channelIds: string[];
  accountId: string;
};

class Zalo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      channelIds: [],
      accountId: '',
    };
  }

  generateDoc = (values: { name: string; brandId: string }) => {
    const { channelIds, accountId } = this.state;

    return {
      ...values,
      kind: 'zalo',
      channelIds,
      accountId,
    };
  };

  channelOnChange = (values: string[]) => {
    this.setState({ channelIds: values } as Pick<State, keyof State>);
  };

  onSelectAccount = (accountId: string) => {
    this.setState({ accountId });
  };

  renderContent = (formProps: IFormProps) => {
    const { renderButton } = this.props;
    const { values, isSubmitted } = formProps;

    return (
      <>
        <Steps active={1}>
          <Step img="/images/icons/saashq-01.svg" title="Connect Zalo OA">
            <FlexItem>
              <LeftItem>
                <FormGroup>
                  <Info>
                    <strong>{__('How can i get a Zalo OA')}</strong>
                    <br />
                    {__('For register an account, go to this link:')}
                    <a href="https://oa.zalo.me/" target="_blank">
                      https://oa.zalo.me/
                    </a>
                  </Info>
                </FormGroup>

                <Accounts
                  formProps={formProps}
                  onSelectAccount={this.onSelectAccount}
                  accountId={this.state.accountId}
                />
              </LeftItem>
            </FlexItem>
          </Step>

          <Step
            img="/images/icons/saashq-16.svg"
            title="Integration Setup"
            noButton={true}
          >
            <FlexItem>
              <LeftItem>
                <FormGroup>
                  <ControlLabel required={true}>Integration Name</ControlLabel>
                  <p>
                    {__('Name this integration to differentiate from the rest')}
                  </p>
                  <FormControl
                    {...formProps}
                    name="name"
                    required={true}
                    autoFocus={true}
                  />
                </FormGroup>

                <SelectBrand
                  isRequired={true}
                  formProps={formProps}
                  description={__(
                    'Which specific Brand does this integration belong to?',
                  )}
                />

                <SelectChannels
                  defaultValue={this.state.channelIds}
                  isRequired={true}
                  onChange={this.channelOnChange}
                />
              </LeftItem>
            </FlexItem>
          </Step>
        </Steps>
        <ControlWrapper>
          <Indicator>
            {__('You are creating')}
            <strong> {__('Zalo')}</strong> {__('integration')}
          </Indicator>
          <Button.Group>
            <Link to="/settings/integrations">
              <Button btnStyle="simple" icon="times-circle">
                Cancel
              </Button>
            </Link>
            {renderButton({
              values: this.generateDoc(values),
              isSubmitted,
            })}
          </Button.Group>
        </ControlWrapper>
      </>
    );
  };

  renderForm = () => {
    return <Form renderContent={this.renderContent} />;
  };

  render() {
    const title = __('Zalo');

    const breadcrumb = [
      { title: __('Nastavení'), link: '/settings' },
      { title: __('Integrations'), link: '/settings/integrations' },
      { title },
    ];

    return (
      <StepWrapper>
        <Wrapper.Header title={title} breadcrumb={breadcrumb} />
        <Content>
          {this.renderForm()}

          <MessengerPreview>
            <Preview fullHeight={true}>
              <ImageWrapper>
                <TextWrapper>
                  <h1>
                    {__('Connect your')} {title}
                  </h1>
                  <p>
                    {__(
                      'Connect your Zalo to start receiving emails in your team inbox',
                    )}
                  </p>
                  <img alt={title} src="/images/previews/facebook.png" />
                </TextWrapper>
              </ImageWrapper>
            </Preview>
          </MessengerPreview>
        </Content>
      </StepWrapper>
    );
  }
}

export default Zalo;
