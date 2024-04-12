import { ColorPick, ColorPicker } from '@saashq/ui/src/styles/main';
import {
  ContentBox,
  FlexRow,
  ImageWrapper,
  Title,
} from '@saashq/ui-settings/src/styles';
import {
  DATA_RETENTION_DURATION,
  FILE_MIME_TYPES,
  FILE_SYSTEM_TYPES,
  KEY_LABELS,
  LANGUAGES,
  LOG_RETENTION_DURATION,
  SERVICE_TYPES,
} from '@saashq/ui-settings/src/general/constants';
import {
  __,
  loadDynamicComponent,
  readFile,
  uploadHandler,
} from 'modules/common/utils';

import ActivateInstallation from './ActivateInstallation';
import Button from 'modules/common/components/Button';
import CURRENCIES from '@saashq/ui/src/constants/currencies';
import CollapseContent from 'modules/common/components/CollapseContent';
import ControlLabel from 'modules/common/components/form/Label';
import EmailConfigForm from '@saashq/ui-settings/src/general/components/EmailConfigForm';
import { FormControl } from 'modules/common/components/form';
import FormGroup from 'modules/common/components/form/Group';
import Header from '@saashq/ui-settings/src/general/components/Header';
import { IConfigsMap } from '@saashq/ui-settings/src/general/types';
import Icon from 'modules/common/components/Icon';
import Info from 'modules/common/components/Info';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import React from 'react';
import Select from 'react-select-plus';
import { SelectTeamMembers } from '@saashq/ui/src';
import TwitterPicker from 'react-color/lib/Twitter';
import Wrapper from 'modules/layout/components/Wrapper';

type Props = {
  currentLanguage: string;
  changeLanguage: (language: string) => void;
  save: (configsMap: IConfigsMap) => void;
  configsMap: IConfigsMap;
  constants;
};

type State = {
  configsMap: IConfigsMap;
  language: string;
  isSaved: boolean;
};

class GeneralSettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      configsMap: props.configsMap,
      language: props.currentLanguage,
      isSaved: false,
    };
  }

  save = (e) => {
    e.preventDefault();

    const { configsMap, language } = this.state;

    this.setState({ isSaved: true });

    this.props.save(configsMap);

    this.props.changeLanguage(language);
  };

  onChangeConfig = (code: string, value) => {
    const { configsMap } = this.state;

    configsMap[code] = value;

    this.setState({ configsMap });
  };

  onChangeEmailConfig = (emailConfig: any) => {
    this.onChangeConfig('COMPANY_EMAIL_FROM', emailConfig.email);
    this.onChangeConfig('COMPANY_EMAIL_TEMPLATE_TYPE', emailConfig.type);
    this.onChangeConfig('COMPANY_EMAIL_TEMPLATE', emailConfig.template);
  };

  onChangeMultiCombo = (code: string, values) => {
    let value = values;

    if (Array.isArray(values)) {
      value = values.map((el) => el.value);
    }

    this.onChangeConfig(code, value);
  };

  onChangeSingleCombo = (code: string, obj) => {
    this.onChangeConfig(code, obj.value);
  };

  onChangeInput = (code: string, e) => {
    this.onChangeConfig(code, e.target.value);
  };

  onLanguageChange = (language) => {
    this.setState({ language: language.value });
  };

  renderItem = (key: string, description?: string, componentClass?: string) => {
    const { configsMap } = this.state;

    return (
      <FormGroup>
        <ControlLabel>{KEY_LABELS[key]}</ControlLabel>
        {description && <p>{__(description)}</p>}
        <FormControl
          componentClass={componentClass}
          defaultValue={configsMap[key]}
          onChange={this.onChangeInput.bind(this, key)}
        />
      </FormGroup>
    );
  };

  onChangeColor = (field, e) => {
    this.onChangeConfig(field, e.hex);
  };

  renderColorPicker = (field) => {
    const { configsMap } = this.state;
    const value = configsMap[field];

    const popoverContent = (
      <Popover id="color-picker">
        <TwitterPicker
          color={value}
          onChange={this.onChangeColor.bind(this, field)}
          triangle="hide"
        />
      </Popover>
    );

    return (
      <OverlayTrigger
        trigger="click"
        rootClose={true}
        placement="bottom-start"
        overlay={popoverContent}
      >
        <ColorPick>
          <ColorPicker style={{ backgroundColor: value }} />
        </ColorPick>
      </OverlayTrigger>
    );
  };

  handleLogoChange = (field, e) => {
    const imageFile = e.target.files;

    uploadHandler({
      files: imageFile,

      beforeUpload: () => {
        return;
      },

      afterUpload: ({ response }) => {
        this.onChangeConfig(field, response);
      },

      afterRead: ({ result }) => {
        return;
      },
    });
  };

  renderUploadImage(field, description?) {
    const { configsMap } = this.state;
    const value = configsMap[field];

    return (
      <FormGroup>
        <ControlLabel>{KEY_LABELS[field]}</ControlLabel>
        {description && <p>{__(description)}</p>}
        {value ? (
          <ImageWrapper>
            <img alt={field} src={readFile(value)} />
          </ImageWrapper>
        ) : null}
        <input type="file" onChange={this.handleLogoChange.bind(this, field)} />
      </FormGroup>
    );
  }

  renderConstant(kind: string) {
    const { constants } = this.props;
    const { configsMap } = this.state;
    const allValues = constants.allValues || {};
    const defaultValues = constants.defaultValues || {};

    const constant = allValues[kind] || [];

    let value = configsMap[kind];

    if (!value || value.length === 0) {
      value = defaultValues[kind] || '';
    }

    return (
      <FormGroup>
        <ControlLabel>{KEY_LABELS[kind]}</ControlLabel>

        <Select
          options={constant}
          value={value}
          onChange={this.onChangeMultiCombo.bind(this, kind)}
          multi={true}
        />
      </FormGroup>
    );
  }

  renderCloudflare() {
    const { configsMap } = this.state;

    return (
      <CollapseContent
        transparent={true}
        title={__('Cloudflare')}
        description={__(
          'Konfigurace Cloudflare R2 Bucket, Obrázky a Stream CDN',
        )}
        beforeTitle={<Icon icon="comment-upload" />}
      >
        <FlexRow alignItems="flex-start" justifyContent="space-between">
          {this.renderItem('CLOUDFLARE_ACCOUNT_ID')}
          {this.renderItem('CLOUDFLARE_API_TOKEN')}
        </FlexRow>
        <FlexRow alignItems="flex-start" justifyContent="space-between">
          {this.renderItem('CLOUDFLARE_ACCESS_KEY_ID')}
          {this.renderItem('CLOUDFLARE_SECRET_ACCESS_KEY')}
        </FlexRow>
        <FlexRow alignItems="flex-start" justifyContent="space-between">
          {this.renderItem('CLOUDFLARE_BUCKET_NAME')}
          {this.renderItem('CLOUDFLARE_ACCOUNT_HASH')}
        </FlexRow>
        <FormGroup>
          <ControlLabel>{KEY_LABELS.CLOUDFLARE_USE_CDN}</ControlLabel>
          <p>{__('Nahrajte obrázky/videa na Cloudflare cdn')}</p>
          <FormControl
            componentClass={'checkbox'}
            checked={configsMap.CLOUDFLARE_USE_CDN}
            onChange={(e: any) => {
              this.onChangeConfig('CLOUDFLARE_USE_CDN', e.target.checked);
            }}
          />
        </FormGroup>
      </CollapseContent>
    );
  }

  render() {
    const { configsMap, language } = this.state;

    const breadcrumb = [
      { title: __('Nastavení'), link: '/settings' },
      { title: __('Obecná konfigurace systému') },
    ];

    const actionButtons = (
      <Button
        id="generalSettingsSave"
        btnStyle="success"
        onClick={this.save}
        icon="check-circle"
      >
        Save
      </Button>
    );

    const mimeTypeOptions = FILE_MIME_TYPES.map((item) => ({
      value: item.value,
      label: `${item.label} (${item.extension})`,
    }));
    const mimeTypeDesc = __(
      'Seznam typů médií oddělených čárkami. Chcete-li přijímat všechny typy médií, nechte pole prázdné',
    );

    const content = (
      <ContentBox id={'GeneralSettingsMenu'}>
        <CollapseContent
          transparent={true}
          title={__('Obecné nastavení')}
          beforeTitle={<Icon icon="settings" />}
        >
          <FormGroup>
            <ControlLabel>Jazyk</ControlLabel>
            <Select
              options={LANGUAGES}
              value={language}
              onChange={this.onLanguageChange}
              searchable={false}
              clearable={false}
              placeholder={__('Vybrat')}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Měna</ControlLabel>
            <Select
              options={CURRENCIES}
              value={configsMap.dealCurrency}
              onChange={this.onChangeMultiCombo.bind(this, 'dealCurrency')}
              multi={true}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>{__('s omezením členů týmu')}</ControlLabel>
            <FormControl
              componentClass="checkbox"
              checked={configsMap.CHECK_TEAM_MEMBER_SHOWN}
              onChange={(e) =>
                this.onChangeConfig(
                  'CHECK_TEAM_MEMBER_SHOWN',
                  (e.target as any).checked,
                )
              }
            />
          </FormGroup>

          {configsMap.CHECK_TEAM_MEMBER_SHOWN && (
            <>
              <FormGroup>
                <ControlLabel>
                  {__('Členové týmu, kteří mají přístup ke všem pobočkám')}
                </ControlLabel>
                <SelectTeamMembers
                  name="BRANCHES_MASTER_TEAM_MEMBERS_IDS"
                  initialValue={configsMap.BRANCHES_MASTER_TEAM_MEMBERS_IDS}
                  label="Vyberte členy týmu"
                  onSelect={(values, name) => this.onChangeConfig(name, values)}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>
                  {__('Členové týmu, kteří mají přístup ke všem oddělením')}
                </ControlLabel>
                <SelectTeamMembers
                  name="DEPARTMENTS_MASTER_TEAM_MEMBERS_IDS"
                  label="Vyberte členy týmu"
                  initialValue={configsMap.DEPARTMENTS_MASTER_TEAM_MEMBERS_IDS}
                  onSelect={(values, name) => this.onChangeConfig(name, values)}
                />
              </FormGroup>
            </>
          )}
        </CollapseContent>

        <CollapseContent
          transparent={true}
          title={__('Téma')}
          beforeTitle={<Icon icon="puzzle" />}
        >
          <FlexRow alignItems="flex-start" justifyContent="space-between">
            {this.renderUploadImage(
              'LOGO_TÉMATU',
              'Průhledný PNG, poměr stran přibližně 3:1. Maximální šířka: 600 pixelů.',
            )}
            {this.renderUploadImage('TÉMA_FAVICON', '16x16px průhledný PNG.')}
            <FormGroup>
              <ControlLabel>{__('Barva textu')}</ControlLabel>
              <p>{__('Používá se v textu přihlašovací stránky')}</p>
              {this.renderColorPicker('THEME_TEXT_COLOR')}
            </FormGroup>

            <FormGroup>
              <ControlLabel>{__('Pozadí')}</ControlLabel>
              <p>{__('Používá se na přihlašovacím pozadí')}</p>
              {this.renderColorPicker('THEME_BACKGROUND')}
            </FormGroup>
          </FlexRow>
          {this.renderItem('THEME_MOTTO', '', 'textarea')}

          {this.renderItem('THEME_LOGIN_PAGE_DESCRIPTION', '', 'textarea')}
        </CollapseContent>

        <CollapseContent
          transparent={true}
          title={__('Nahrání souboru')}
          beforeTitle={<Icon icon="file-upload-alt" />}
        >
          <Info>
            <a
              target="_blank"
              href="https://docs.saashq.io/conversations"
              rel="noopener noreferrer"
            >
              {__('Přečtěte si, jak nastavit nahrávání souborů') + '.'}
            </a>
          </Info>
          <FlexRow alignItems="flex-start" justifyContent="space-between">
            <FormGroup>
              <ControlLabel>{KEY_LABELS.UPLOAD_FILE_TYPES}</ControlLabel>
              {mimeTypeDesc && <p>{__(mimeTypeDesc)}</p>}
              <Select
                value={configsMap.UPLOAD_FILE_TYPES}
                options={mimeTypeOptions}
                onChange={this.onChangeMultiCombo.bind(
                  this,
                  'UPLOAD_FILE_TYPES',
                )}
                multi={true}
                delimiter=","
                simpleValue={true}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>
                {KEY_LABELS.WIDGETS_UPLOAD_FILE_TYPES}
              </ControlLabel>
              {mimeTypeDesc && <p>{__(mimeTypeDesc)}</p>}
              <Select
                value={configsMap.WIDGETS_UPLOAD_FILE_TYPES}
                options={mimeTypeOptions}
                onChange={this.onChangeMultiCombo.bind(
                  this,
                  'WIDGETS_UPLOAD_FILE_TYPES',
                )}
                multi={true}
                delimiter=","
                simpleValue={true}
              />
            </FormGroup>
          </FlexRow>
          <FlexRow alignItems="flex-start" justifyContent="space-between">
            <FormGroup>
              <ControlLabel>{KEY_LABELS.UPLOAD_SERVICE_TYPE}</ControlLabel>
              <Select
                options={SERVICE_TYPES}
                value={configsMap.UPLOAD_SERVICE_TYPE || 'AWS'}
                clearable={false}
                onChange={this.onChangeSingleCombo.bind(
                  this,
                  'UPLOAD_SERVICE_TYPE',
                )}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>{KEY_LABELS.FILE_SYSTEM_PUBLIC}</ControlLabel>
              <Select
                options={FILE_SYSTEM_TYPES}
                value={configsMap.FILE_SYSTEM_PUBLIC || 'true'}
                clearable={false}
                searchable={false}
                onChange={this.onChangeSingleCombo.bind(
                  this,
                  'FILE_SYSTEM_PUBLIC',
                )}
              />
            </FormGroup>
          </FlexRow>
        </CollapseContent>

        <CollapseContent
          transparent={true}
          title={__('Google Cloud Storage')}
          beforeTitle={<Icon icon="cloud-1" />}
        >
          <Info>
            <a
              target="_blank"
              href="https://docs.saashq.io/conversations"
              rel="noopener noreferrer"
            >
              {__(
                'Přečtěte si, jak vytvořit nebo najít svůj segment Google Cloud Storage',
              )}
            </a>
          </Info>
          <FormGroup>
            <ControlLabel>Název Segmentu Google</ControlLabel>
            {this.renderItem('GOOGLE_CLOUD_STORAGE_BUCKET')}
          </FormGroup>
        </CollapseContent>

        {this.renderCloudflare()}

        <CollapseContent
          transparent={true}
          title="AWS S3"
          beforeTitle={<Icon icon="server-network" />}
        >
          <Info>
            <a
              target="_blank"
              href="https://docs.saashq.io/conversations"
              rel="noopener noreferrer"
            >
              {__('Přečtěte si, jak nastavit proměnné AWS S3')}
            </a>
          </Info>
          <FlexRow alignItems="flex-start" justifyContent="space-between">
            {this.renderItem('AWS_ACCESS_KEY_ID')}
            {this.renderItem('AWS_SECRET_ACCESS_KEY')}
          </FlexRow>
          <FlexRow alignItems="flex-start" justifyContent="space-between">
            {this.renderItem('AWS_BUCKET')}
            {this.renderItem('AWS_PREFIX')}
          </FlexRow>
          {this.renderItem(
            'AWS_COMPATIBLE_SERVICE_ENDPOINT',
            __('Používá se při používání služby kompatibilní s s3'),
          )}
          {this.renderItem('AWS_FORCE_PATH_STYLE')}
        </CollapseContent>

        <CollapseContent
          transparent={true}
          title="AWS SES"
          beforeTitle={<Icon icon="shield-check" />}
        >
          <Info>
            <p>
              {__(
                'V tomto poli je konfigurace AWS SES věnována poskytování transakčních e-mailů',
              ) + '.'}
            </p>
            <a
              target="_blank"
              href="https://docs.saashq.io/conversations"
              rel="noopener noreferrer"
            >
              {__('Přečtěte si, jak nastavit proměnné Amazon SES')}
            </a>
          </Info>
          <FlexRow alignItems="flex-start" justifyContent="space-between">
            {this.renderItem('AWS_SES_ACCESS_KEY_ID')}
            {this.renderItem('AWS_SES_SECRET_ACCESS_KEY')}
          </FlexRow>
          <FlexRow alignItems="flex-start" justifyContent="space-between">
            {this.renderItem('AWS_REGION')}
            {this.renderItem('AWS_SES_CONFIG_SET')}
          </FlexRow>
        </CollapseContent>

        <CollapseContent
          transparent={true}
          title="Google"
          beforeTitle={<Icon icon="google" />}
        >
          <Info>
            <a
              target="_blank"
              href="https://docs.saashq.io/conversations"
              rel="noopener noreferrer"
            >
              {__('Přečtěte si, jak nastavit proměnné Google')}
            </a>
          </Info>
          <FlexRow alignItems="flex-start" justifyContent="space-between">
            {this.renderItem('GOOGLE_PROJECT_ID')}
            {this.renderItem('GOOGLE_CLIENT_ID')}
          </FlexRow>
          <FlexRow alignItems="flex-start" justifyContent="space-between">
            {this.renderItem(
              'GOOGLE_CLIENT_SECRET',
              'Tajný klíč klienta je vyžadován pro účely ověřování a autorizace',
            )}
            {this.renderItem(
              'GOOGLE_GMAIL_TOPIC',
              'Hodnota tématu vytvořená v nastavení Gmailu',
            )}
          </FlexRow>
          <FlexRow alignItems="flex-start" justifyContent="space-between">
            {this.renderItem(
              'GOOGLE_APPLICATION_CREDENTIALS_JSON',
              'Konfigurace Firebase pro oznámení',
            )}
            {this.renderItem('GOOGLE_MAP_API_KEY', 'Google Map Api Key')}
          </FlexRow>
        </CollapseContent>

        <CollapseContent
          transparent={true}
          title={__('Konfigurace běžné pošty')}
          beforeTitle={<Icon icon="envelopes" />}
        >
          <Info>
            <a
              target="_blank"
              href="https://docs.saashq.io/conversations"
              rel="noopener noreferrer"
            >
              {__('Další informace o nastavení e-mailu')}
            </a>
          </Info>

          <EmailConfigForm
            emailConfig={{
              email: configsMap.COMPANY_EMAIL_FROM,
              type: configsMap.COMPANY_EMAIL_TEMPLATE_TYPE,
              template: configsMap.COMPANY_EMAIL_TEMPLATE,
            }}
            emailText="Nastavte e-mailovou adresu, ze které chcete zasílat své interní transakční e-maily. Například upozornění na úkoly, zmínky o členech týmu atd."
            setEmailConfig={this.onChangeEmailConfig}
            isSaved={this.state.isSaved}
          />
          <FormGroup>
            <ControlLabel>VÝCHOZÍ E-MAILOVÁ SLUŽBA</ControlLabel>
            <p>
              {__(
                'Vyberte název e-mailové služby. Výchozí e-mailová služba je SES.',
              )}
            </p>
            <Select
              options={[
                { label: 'SES', value: 'SES' },
                { label: 'Zvyk', value: 'custom' },
              ]}
              value={configsMap.DEFAULT_EMAIL_SERVICE || 'SES'}
              clearable={false}
              searchable={false}
              onChange={this.onChangeSingleCombo.bind(
                this,
                'DEFAULT_EMAIL_SERVICE',
              )}
            />
          </FormGroup>
        </CollapseContent>

        <CollapseContent
          transparent={true}
          title={__('Vlastní poštovní služba')}
          beforeTitle={<Icon icon="server-alt" />}
        >
          <Info>
            <a
              target="_blank"
              href="https://docs.saashq.io/conversations"
              rel="noopener noreferrer"
            >
              {__('Seznamte se s případem vlastní e-mailové služby')}
            </a>
          </Info>
          <FlexRow alignItems="flex-start" justifyContent="space-between">
            {this.renderItem('MAIL_SERVICE')}
            {this.renderItem('MAIL_PORT')}
          </FlexRow>
          <FlexRow alignItems="flex-start" justifyContent="space-between">
            {this.renderItem('MAIL_USER')}
            {this.renderItem('MAIL_PASS')}
          </FlexRow>
          {this.renderItem('MAIL_HOST')}
        </CollapseContent>

        <CollapseContent
          transparent={true}
          title={__('Uchovávání dat')}
          beforeTitle={<Icon icon="cloud-data-connection" />}
        >
          <FlexRow alignItems="flex-start" justifyContent="space-between">
            <FormGroup>
              <ControlLabel>
                {KEY_LABELS.NOTIFICATION_DATA_RETENTION}
              </ControlLabel>
              <Select
                options={DATA_RETENTION_DURATION}
                value={configsMap.NOTIFICATION_DATA_RETENTION || 3}
                clearable={false}
                searchable={false}
                onChange={this.onChangeSingleCombo.bind(
                  this,
                  'NOTIFICATION_DATA_RETENTION',
                )}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{KEY_LABELS.LOG_DATA_RETENTION}</ControlLabel>
              <Select
                options={LOG_RETENTION_DURATION}
                value={configsMap.LOG_DATA_RETENTION || 1}
                clearable={false}
                searchable={false}
                onChange={this.onChangeSingleCombo.bind(
                  this,
                  'LOG_DATA_RETENTION',
                )}
              />
            </FormGroup>
          </FlexRow>
        </CollapseContent>

        <CollapseContent
          transparent={true}
          title={__('Konstanty')}
          beforeTitle={<Icon icon="link-1" />}
        >
          {this.renderConstant('sex_choices')}
          {this.renderConstant('company_industry_types')}
          {this.renderConstant('social_links')}
        </CollapseContent>

        <CollapseContent
          transparent={true}
          title={__('Služby připojení')}
          beforeTitle={<Icon icon="share-alt" />}
        >
          <ActivateInstallation />
        </CollapseContent>

        <CollapseContent
          transparent={true}
          title="MessagePro"
          beforeTitle={<Icon icon="comment-alt-verify" />}
        >
          <FlexRow alignItems="flex-start" justifyContent="space-between">
            {this.renderItem('MESSAGE_PRO_API_KEY')}
            {this.renderItem('MESSAGE_PRO_PHONE_NUMBER')}
          </FlexRow>
        </CollapseContent>

        {loadDynamicComponent(
          'extendSystemConfig',
          { ...this.props, onChangeConfig: this.onChangeConfig },
          true,
        )}
      </ContentBox>
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('Konfigurace systému')}
            breadcrumb={breadcrumb}
          />
        }
        mainHead={
          <Header
            title="Konfigurace systému"
            description={
              __(
                'Nastavte počáteční nastavení účtu tak, aby vše běželo hladce a jednotně',
              ) + '.'
            }
          />
        }
        actionBar={
          <Wrapper.ActionBar
            left={<Title>{__('Konfigurace systému')}</Title>}
            right={actionButtons}
          />
        }
        content={content}
        hasBorder={true}
      />
    );
  }
}

export default GeneralSettings;
