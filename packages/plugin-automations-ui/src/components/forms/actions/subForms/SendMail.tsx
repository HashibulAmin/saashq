import { DrawerDetail } from '@saashq/ui-automations/src/styles';
import { IAction } from '@saashq/ui-automations/src/types';
import AddTemplateForm from '@saashq/ui-emailtemplates/src/containers/Form';
import SelectEmailTemplates from '@saashq/ui-emailtemplates/src/containers/SelectEmailtTemplate';
import {
  BarItems,
  Button,
  Chip,
  ControlLabel,
  EmptyState,
  FormControl,
  FormGroup,
  HelpPopover,
  Icon,
  ModalTrigger,
  SelectTeamMembers,
  TabTitle,
  Tabs,
  __,
} from '@saashq/ui/src';
import { Avatar } from '@saashq/ui/src/components/SelectWithSearch';
import React from 'react';
import { BackIcon } from '@saashq/ui-automations/src/styles';
import { renderDynamicComponent } from '../../../../utils';
import PlaceHolderInput from '@saashq/ui-automations/src/components/forms/actions/placeHolder/PlaceHolderInput';
import Common from '@saashq/ui-automations/src/components/forms/actions/Common';
import { isEnabled } from '@saashq/ui/src/utils/core';
import { Padding } from '../styles';

type Props = {
  activeAction: any;
  addAction: (action: IAction, actionId?: string, config?: any) => void;
  closeModal: () => void;
  triggerType: string;
  triggerConfig: any;
  actionsConst: any[];
};

type State = {
  selectedTab: string;
  searchValue: string;
  config?: any;
};

class SendMail extends React.Component<Props, State> {
  private timer?: NodeJS.Timer;
  constructor(props) {
    super(props);

    this.state = {
      searchValue: '',
      selectedTab: 'general',
      config: props?.activeAction?.config || null,
    };
  }

  renderCustomMailInput() {
    const { config } = this.state;
    const onChange = (e) => {
      const { value } = e.currentTarget as HTMLInputElement;
      if (
        e.key === 'Enter' &&
        value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ) {
        this.setState({
          config: {
            ...config,
            customMails: (config?.customMails || []).concat(value),
          },
        });
        e.currentTarget.value = '';
      }
    };

    const removeMail = (mail) => {
      this.setState({
        config: {
          ...config,
          customMails: (config?.customMails || []).filter(
            (value) => value !== mail,
          ),
        },
      });
    };

    return (
      <FormGroup>
        <ControlLabel>{__('Vlastní Pošta')}</ControlLabel>
        {(config?.customMails || []).map((customMail) => (
          <Chip
            key={customMail}
            onClick={removeMail.bind(this, customMail)}
            frontContent={<Avatar src="/images/avatar-colored.svg" />}
          >
            {customMail}
          </Chip>
        ))}
        <FormControl onKeyPress={onChange} placeholder="zadejte email" />
      </FormGroup>
    );
  }

  renderAttrubutionInput() {
    const { triggerType, triggerConfig } = this.props;
    const { config } = this.state;

    const onChange = (updatedConfig) => {
      this.setState({
        config: updatedConfig,
      });
    };

    const isAviableTriggerExcutor = ['contacts', 'user'].some((c) =>
      triggerType.includes(c),
    );

    const customAttributions = isAviableTriggerExcutor
      ? [
          {
            _id: String(Math.random()),
            label: 'Spouštěcí exekutory',
            name: 'triggerExecutors',
            type: 'segment',
          },
        ]
      : [];

    return (
      <>
        <PlaceHolderInput
          config={config}
          triggerType={triggerType}
          inputName="attributionMails"
          label="Atribuční maily"
          attrTypes={['user', 'contact', 'segment']}
          attrWithSegmentConfig={triggerType === 'forms:form_submission'}
          triggerConfig={triggerConfig}
          onChange={onChange}
          customAttributions={customAttributions}
          additionalContent={
            <HelpPopover>
              <br>Tento typ nezahrnuje (z pošty) a (neověřené e-maily)</br>
            </HelpPopover>
          }
        />
      </>
    );
  }

  renderSegmentInput(key, onSelect) {
    const { config } = this.state;
    const { triggerType } = this.props;

    if (['contacts', 'user'].every((c) => !triggerType.includes(c))) {
      return null;
    }

    return (
      <FormGroup>
        <ControlLabel>{__('E-maily založené na segmentech')}</ControlLabel>
        <FormControl
          componentClass="checkbox"
          checked={config[key]}
          onClick={() => onSelect(!config[key], key)}
        />
      </FormGroup>
    );
  }

  renderRecipientTypeComponent({ serviceName, label, name, type }, onSelect) {
    const { config } = this.state;

    if (serviceName) {
      return renderDynamicComponent(
        {
          componentType: 'selectRecipients',
          type,
          value: config[name],
          label,
          name,
          onSelect,
        },
        `${serviceName}:${type}`,
      );
    }

    switch (type) {
      case 'customMail':
        return this.renderCustomMailInput();
      case 'teamMember':
        return (
          <FormGroup>
            <ControlLabel>{__(label)}</ControlLabel>
            <SelectTeamMembers
              name={name}
              initialValue={config[name]}
              label={label}
              onSelect={onSelect}
              filterParams={{
                status: 'Verified',
              }}
            />
          </FormGroup>
        );
      default:
        return null;
    }
  }

  renderToEmailsContent(emailRecipientsConst, onSelect) {
    const { selectedTab } = this.state;

    if (selectedTab === 'general') {
      return this.renderAttrubutionInput();
    }

    if (selectedTab === 'static') {
      return (emailRecipientsConst || []).map((emailRType) =>
        this.renderRecipientTypeComponent(emailRType, onSelect),
      );
    }

    return null;
  }

  renderConfig(emailRecipientsConst) {
    const { config, selectedTab } = this.state;
    const { addAction, activeAction, closeModal, triggerType } = this.props;

    const onBackAction = () => {
      this.setState({ config: null });
    };

    const onSelect = (value, name) => {
      this.setState({ config: { ...config, [name]: value } });
    };

    const onChange = (e) => {
      const { value, name } = e.currentTarget as HTMLInputElement;

      this.setState({ config: { ...config, [name]: value } });
    };

    const onAddAction = () => {
      addAction(activeAction, activeAction.id, config);
      closeModal();
    };

    const handleSelectTab = (name) => {
      this.setState({ selectedTab: name });
    };

    return (
      <Common
        closeModal={closeModal}
        addAction={onAddAction}
        activeAction={activeAction}
        config={config}
      >
        <DrawerDetail>
          <BackIcon onClick={onBackAction}>
            <Icon icon="angle-left" size={20} /> {__('Back')}
          </BackIcon>
          <FormGroup>
            <ControlLabel>{'Z'}</ControlLabel>
            <SelectTeamMembers
              name="fromUserId"
              initialValue={config?.fromUserId}
              label="Vyberte z uživatele"
              onSelect={onSelect}
              filterParams={{
                status: 'Verified',
              }}
              multi={false}
            />
          </FormGroup>

          <PlaceHolderInput
            inputName="sender"
            label="Odesílatel"
            config={config}
            onChange={() => null}
            onKeyPress={onChange}
            triggerType={triggerType}
          />

          <PlaceHolderInput
            inputName="subject"
            label="Předmět emailu"
            config={config}
            onChange={() => null}
            onKeyPress={onChange}
            triggerType={triggerType}
          />
          <FormGroup>
            <ControlLabel>{__('Na Emaily')}</ControlLabel>
            <DrawerDetail>
              <Tabs full>
                <TabTitle
                  className={selectedTab === 'general' ? 'active' : ''}
                  onClick={handleSelectTab.bind(this, 'general')}
                >
                  {__('Všeobecné')}
                </TabTitle>
                <TabTitle
                  className={selectedTab === 'static' ? 'active' : ''}
                  onClick={handleSelectTab.bind(this, 'static')}
                >
                  {__('Statický')}
                </TabTitle>
              </Tabs>
              <Padding>
                {this.renderToEmailsContent(emailRecipientsConst, onSelect)}
              </Padding>
            </DrawerDetail>
          </FormGroup>
        </DrawerDetail>
      </Common>
    );
  }

  renderAddTemplate() {
    const { triggerType } = this.props;

    const trigger = (
      <Button btnStyle="success" icon="plus-circle">
        {__('Přidat šablonu')}
      </Button>
    );
    const content = ({ closeModal }) => {
      const updatedProps = {
        closeModal,
        contentType: triggerType,
        params: { searchValue: this.state.searchValue },
      };

      return <AddTemplateForm {...updatedProps} />;
    };

    return (
      <ModalTrigger
        title="Přidat nový"
        content={content}
        trigger={trigger}
        size="lg"
      />
    );
  }

  render() {
    const { searchValue, config } = this.state;
    const { actionsConst } = this.props;
    const { emailRecipientsConst = [] } =
      actionsConst.find((action) => action.type === 'sendEmail') || {};

    const onSearch = (e) => {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      const searchValue = e.target.value;

      this.setState({ searchValue });
    };

    const selectTemplate = (id) => {
      this.setState({ config: { ...config, templateId: id } });
    };

    if (!isEnabled('emailtemplates')) {
      return (
        <EmptyState
          image="/images/actions/33.svg"
          text=""
          extra={
            <span>
              Akce odeslání e-mailu není k dispozici.
              <br />
              Protože plugin šablony e-mailu nefunguje
            </span>
          }
        />
      );
    }

    if (config?.templateId) {
      return this.renderConfig(emailRecipientsConst);
    }

    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Vyhledávání')}</ControlLabel>
          <BarItems>
            <FormControl
              name="searchValue"
              placeholder="zadejte vyhledávání"
              value={searchValue}
              onChange={onSearch}
            />
            {this.renderAddTemplate()}
          </BarItems>
        </FormGroup>
        <SelectEmailTemplates
          searchValue={searchValue}
          handleSelect={selectTemplate}
          selectedTemplateId={config?.templateId}
        />
      </>
    );
  }
}

export default SendMail;
