import {
  AccountBox,
  AccountItem,
  AccountTitle,
  Content,
  ImageWrapper,
  MessengerPreview,
  TextWrapper,
} from '../../styles';
import {
  ControlWrapper,
  FlexItem,
  Indicator,
  LeftItem,
  Preview,
  StepWrapper,
} from '@saashq/ui/src/components/step/styles';
import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';
import { Step, Steps } from '@saashq/ui/src/components/step';

import Accounts from '../../containers/Accounts';
import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Form from '@saashq/ui/src/components/form/Form';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { INTEGRATION_KINDS } from '@saashq/ui/src/constants/integrations';
import { IPages } from '../../types';
import { Link } from 'react-router-dom';
import React from 'react';
import SelectBrand from '../../containers/SelectBrand';
import SelectChannels from '../../containers/SelectChannels';
import Spinner from '@saashq/ui/src/components/Spinner';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { __ } from 'coreui/utils';

type Props = {
  kind: string;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  onAccountSelect: (accountId?: string) => void;
  pages: IPages[];
  accountId?: string;
  onRemoveAccount: (accountId: string) => void;
  callBack: () => void;
  loadingPages?: boolean;
};

type State = {
  selectedPages: string[];
  channelIds: string[];
};

class Facebook extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      selectedPages: [],
      channelIds: [],
    };
  }

  onSelectPages = (pageId: string) => {
    const { selectedPages } = this.state;
    if (selectedPages.includes(pageId)) {
      return this.setState({
        selectedPages: selectedPages.filter((item) => item !== pageId),
      });
    }

    this.setState({ selectedPages: [...selectedPages, pageId] });
  };

  generateDoc = (values: {
    messengerName: string;
    brandId: string;
    accountId: string;
  }) => {
    const { accountId, kind } = this.props;

    return {
      name: values.messengerName,
      brandId: values.brandId,
      kind,
      accountId: accountId ? accountId : values.accountId,
      channelIds: this.state.channelIds,
      data: {
        pageIds: this.state.selectedPages,
      },
    };
  };

  renderPages() {
    const { pages, loadingPages } = this.props;

    if (loadingPages) {
      return <Spinner objective={true} />;
    }

    if (pages.length === 0) {
      return (
        <EmptyState icon="folder-2" text={__('Nejsou zde žádné stránky')} />
      );
    }

    return (
      <FlexItem>
        <LeftItem>
          <AccountBox>
            <AccountTitle>{__('Facebook Stránky')}</AccountTitle>
            {pages.map((page) => (
              <AccountItem key={page.id}>
                {page.name}

                <Button
                  disabled={page.isUsed}
                  btnStyle={
                    this.state.selectedPages.includes(page.id)
                      ? 'primary'
                      : 'simple'
                  }
                  onClick={this.onSelectPages.bind(this, page.id)}
                >
                  {this.state.selectedPages.includes(page.id)
                    ? __('Vybraný')
                    : __('Vybrat')}
                </Button>
              </AccountItem>
            ))}
          </AccountBox>
        </LeftItem>
      </FlexItem>
    );
  }

  onChange = <T extends keyof State>(key: T, value: State[T]) => {
    this.setState({ [key]: value } as Pick<State, keyof State>);
  };

  channelOnChange = (values: string[]) => this.onChange('channelIds', values);

  renderContent = (formProps: IFormProps) => {
    const { renderButton } = this.props;
    const { values, isSubmitted } = formProps;
    const { onRemoveAccount, onAccountSelect } = this.props;

    return (
      <>
        <Steps active={1}>
          <Step img="/images/icons/saashq-01.svg" title="Connect Account">
            <FlexItem>
              <LeftItem>
                <Accounts
                  kind="facebook"
                  addLink="fblogin"
                  onSelect={onAccountSelect}
                  onRemove={onRemoveAccount}
                />
              </LeftItem>
            </FlexItem>
          </Step>

          <Step img="/images/icons/saashq-04.svg" title="Připojte Své Stránky">
            {this.renderPages()}
          </Step>

          <Step
            img="/images/icons/saashq-16.svg"
            title="Nastavení Integrace"
            noButton={true}
          >
            <FlexItem>
              <LeftItem>
                <FormGroup>
                  <ControlLabel required={true}>Název Integrace</ControlLabel>
                  <p>
                    {__(
                      'Pojmenujte tuto integraci, abyste ji odlišili od ostatních',
                    )}
                  </p>
                  <FormControl
                    {...formProps}
                    name="messengerName"
                    required={true}
                  />
                </FormGroup>

                <SelectBrand
                  isRequired={true}
                  description={__(
                    'Které konkrétní značce tato integrace patří?',
                  )}
                  formProps={formProps}
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
            {__('Vy tvoříte')}
            <strong> {this.props.kind}</strong> {__('integrace')}
          </Indicator>
          <Button.Group>
            <Link to="/settings/integrations">
              <Button btnStyle="simple" icon="times-circle">
                Zrušení
              </Button>
            </Link>
            {renderButton({
              name: 'integration',
              values: this.generateDoc(values),
              isSubmitted,
              callback: this.props.callBack,
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
    let title = __('Příspěvky na Facebooku');
    let description = __(
      'Propojte své příspěvky na Facebooku a začněte přijímat příspěvky a komentáře na Facebooku do vaší týmové schránky',
    );

    if (this.props.kind === INTEGRATION_KINDS.FACEBOOK_MESSENGER) {
      title = __('Facebook Messenger');
      description = __(
        'Připojte svůj Facebook Messenger a začněte přijímat zprávy z Facebooku do vaší týmové schránky',
      );
    }

    const breadcrumb = [
      { title: __('Nastavení'), link: '/settings' },
      { title: __('integrací'), link: '/settings/integrations' },
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
                    {__('Připojte svůj')} {title}
                  </h1>
                  <p>{description}</p>
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

export default Facebook;
