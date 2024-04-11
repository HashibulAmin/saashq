import {
  ClearButton,
  ColorPickerWrapper,
  Domain,
  FlexRow,
  StatusBox,
  StatusTitle,
  UpgradeButtons,
} from '../styles';
import { ColorPick, ColorPicker } from '@saashq/ui/src/styles/main';
import {
  ControlLabel,
  FormControl,
  FormGroup,
} from '@saashq/ui/src/components/form';

import Alert from 'react-bootstrap/Alert';
import AvatarUpload from '@saashq/ui/src/components/AvatarUpload';
import Button from '@saashq/ui/src/components/Button';
import { COLORS } from '@saashq/ui/src/constants/colors';
import EmailConfigForm from '@saashq/ui-settings/src/general/components/EmailConfigForm';
import { IConfigsMap } from '@saashq/ui-settings/src/general/types';
import { IOrganization } from '../types';
import Icon from '@saashq/ui/src/components/Icon';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import React from 'react';
import Table from '@saashq/ui/src/components/table';
import Tip from '@saashq/ui/src/components/Tip';
import TwitterPicker from 'react-color/lib/Twitter';
import { __ } from '@saashq/ui/src/utils';
import { colors } from '@saashq/ui/src/styles';

type Props = {
  currentOrganization: IOrganization;
  editDomain: ({ type, domain }: { type: string; domain: string }) => void;
  save: (
    {
      icon,
      link,
      name,
      iconColor,
      textColor,
      logo,
      favicon,
      backgroundColor,
      description,
      map,
    }: {
      icon: string;
      logo?: string;
      link: string;
      name: string;
      favicon?: string;
      iconColor?: string;
      textColor?: string;
      backgroundColor?: string;
      description?: string;
      map?: IConfigsMap;
    },
    callback?: () => void,
  ) => void;
  configsMap: IConfigsMap;
};

type State = {
  name: string;
  description?: string;
  iconColor?: string;
  dnsStatus?: string;
  domain: string;
  logo?: string;
  favicon?: string;
  subdomain: string;
  backgroundColor?: string;
  textColor?: string;
  icon: string;
  configsMap: IConfigsMap;
  isSaved: boolean;
};

class OrganizationProfile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const {
      icon = '',
      subdomain,
      name,
      description,
      iconColor = colors.colorWhite,
      textColor = colors.colorWhite,
      logo,
      dnsStatus,
      favicon = '',
      domain,
      backgroundColor = colors.colorPrimaryDark,
    } = props.currentOrganization;

    this.state = {
      configsMap: props.configsMap,
      icon,
      subdomain,
      name,
      favicon,
      dnsStatus,
      domain: domain || '',
      logo: logo || '/images/logo.png',
      iconColor,
      textColor,
      description,
      backgroundColor,
      isSaved: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentOrganization !== prevProps.currentOrganization) {
      const {
        icon = '',
        subdomain,
        name,
        logo = '',
        iconColor,
        description,
        textColor = colors.colorWhite,
        backgroundColor = colors.colorPrimaryDark,
      } = this.props.currentOrganization;

      this.setState({
        icon,
        logo,
        subdomain,
        name,
        iconColor,
        textColor,
        description,
        backgroundColor,
      });
    }
  }

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

  clearBackground = () => {
    this.setState({ backgroundColor: undefined });
  };

  onChangeInput = <T extends keyof State>(name: T, value: State[T]) => {
    this.setState({ [name]: value } as any);
  };

  onUpload = <T extends keyof State>(name: T, value: State[T]) => {
    this.setState({ [name]: value } as any);
  };

  onBackgroundColorChange = (e) => {
    this.setState({ backgroundColor: e.hex });
  };

  onIconColorChange = (e) => {
    this.setState({ iconColor: e.hex });
  };

  onTextColorChange = (e) => {
    this.setState({ textColor: e.hex });
  };

  save = () => {
    const { save } = this.props;
    const {
      icon,
      subdomain,
      name,
      backgroundColor,
      description,
      iconColor,
      textColor,
      favicon,
      logo,
      configsMap,
    } = this.state;

    save({
      favicon,
      icon,
      link: subdomain,
      name,
      backgroundColor,
      description,
      iconColor,
      textColor,
      logo,
      map: configsMap,
    });

    this.setState({ isSaved: true });
  };

  renderSaveButton() {
    return (
      <Button btnStyle="success" uppercase={false} onClick={this.save}>
        Uložit podrobnosti organizace
      </Button>
    );
  }

  editDomain = (type: string) => {
    const { editDomain } = this.props;
    const { domain } = this.state;

    editDomain({
      type,
      domain,
    });

    this.setState({ isSaved: true });
  };

  renderFavicon = () => {
    const { favicon } = this.state;

    const handleAvatarUploader = (url) => this.onUpload('favicon', url);

    return (
      <FormGroup>
        <ControlLabel>Favicon</ControlLabel>
        <p>16x16px průhledný PNG.</p>
        <AvatarUpload
          avatar={favicon}
          onAvatarUpload={handleAvatarUploader}
          title="favicon"
          extraFormData={[{ key: 'isPublic', value: 'true' }]}
          defaultAvatar={favicon}
          square={true}
        />
      </FormGroup>
    );
  };

  renderMainLogo = () => {
    const { logo } = this.state;

    const handleAvatarUploader = (url) => this.onUpload('logo', url);

    return (
      <FormGroup>
        <ControlLabel>Logo přihlašovací stránky</ControlLabel>
        <p>
          Průhledný PNG, poměr stran přibližně 3:1. Maximální šířka: 600 pixelů.
        </p>
        <AvatarUpload
          avatar={logo}
          onAvatarUpload={handleAvatarUploader}
          title="logo"
          extraFormData={[{ key: 'isPublic', value: 'true' }]}
          defaultAvatar={logo}
          square={true}
          width={300}
          backgroundColor={colors.bgMain}
        />
      </FormGroup>
    );
  };

  renderEmailFields() {
    const { configsMap } = this.state;

    return (
      <FormGroup>
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
      </FormGroup>
    );
  }

  renderColors() {
    const { textColor, iconColor, backgroundColor } = this.state;

    const colorPopover = (color, onChange, id: string) => {
      return (
        <Popover id={id}>
          <TwitterPicker
            width="266px"
            triangle="hide"
            color={{ hex: color }}
            onChange={onChange}
            colors={COLORS}
          />
        </Popover>
      );
    };

    const textPopover = colorPopover(
      textColor,
      this.onTextColorChange,
      'text-popover',
    );
    const backgroundPopover = colorPopover(
      backgroundColor,
      this.onBackgroundColorChange,
      'background-popover',
    );

    const iconPopover = colorPopover(
      iconColor,
      this.onIconColorChange,
      'icon-color-popover',
    );

    return (
      <>
        <FormGroup>
          <ControlLabel>Barva textu</ControlLabel>
          <p>Používá se v textu přihlašovací stránky</p>
          <ColorPickerWrapper>
            <OverlayTrigger
              trigger="click"
              rootClose={true}
              placement="bottom"
              overlay={textPopover}
            >
              <ColorPick>
                <ColorPicker style={{ backgroundColor: textColor }} />
              </ColorPick>
            </OverlayTrigger>
          </ColorPickerWrapper>
        </FormGroup>

        <div className="hide">
          <FormGroup>
            <ControlLabel>Icon color</ControlLabel>
            <div>
              <OverlayTrigger
                trigger="click"
                rootClose={true}
                placement="bottom"
                overlay={iconPopover}
              >
                <ColorPick>
                  <ColorPicker style={{ backgroundColor: iconColor }} />
                </ColorPick>
              </OverlayTrigger>
            </div>
          </FormGroup>
        </div>

        <FormGroup>
          <ControlLabel>Pozadí</ControlLabel>
          <Tip text={__('Clear background')} placement="top">
            <ClearButton>
              <Icon icon="history" onClick={this.clearBackground} />
            </ClearButton>
          </Tip>
          <p>Používá se na přihlašovacím pozadí</p>
          <ColorPickerWrapper>
            <OverlayTrigger
              trigger="click"
              rootClose={true}
              placement="bottom"
              overlay={backgroundPopover}
            >
              <ColorPick>
                <ColorPicker style={{ backgroundColor }} />
              </ColorPick>
            </OverlayTrigger>
          </ColorPickerWrapper>
        </FormGroup>
      </>
    );
  }

  renderLoginPage() {
    const { description } = this.state;
    const descriptionOnChange = (e) =>
      this.onChangeInput('description', (e.target as HTMLInputElement).value);

    return (
      <>
        <FormGroup>
          <ControlLabel>Popis přihlašovací stránky</ControlLabel>
          <FormControl
            value={description || ''}
            type="text"
            componentClass="textarea"
            onChange={descriptionOnChange}
            required={false}
          />
        </FormGroup>
      </>
    );
  }

  renderDNS() {
    const { subdomain, dnsStatus, domain } = this.state;

    const { currentOrganization } = this.props;

    const customDomainStatus = currentOrganization.customDomainStatus || {};

    const ownershipVerification =
      customDomainStatus.ownership_verification || {};
    const sslVerification = customDomainStatus.ssl || {};

    const { sslStatus, hostNameStatus } = currentOrganization;

    const domainOnChange = (e) =>
      this.onChangeInput('domain', (e.target as HTMLInputElement).value);

    return (
      <StatusBox>
        <StatusTitle>{__('Custom Domain')}</StatusTitle>
        <FlexRow>
          <FormGroup>
            <ControlLabel>Vlastní doména</ControlLabel>
            <Domain>
              <FormControl
                name="domain"
                value={domain}
                type="text"
                componentClass="text"
                onChange={domainOnChange}
              />
            </Domain>
          </FormGroup>
          <FormGroup>
            <ControlLabel>DNS záznam</ControlLabel>
            <Alert variant="info">
              <Alert.Heading>
                Přidejte níže uvedené záznamy do nastavení DNS pro {subdomain}
                .app.saashq.org
              </Alert.Heading>
              <p>
                Níže je třeba přidat oba záznamy. Druhý záznam bude pouze být k
                dispozici, jakmile bude první nastaven a jeho stav je AKTIVNÍ.
                Počkejte prosím až 24 hodin, než se tak stane, pokud můžete si
                vynutit obnovení DNS u svého poskytovatele hostingu. jestli ty
                používáte Cloudflare, ujistěte se, že jste nastavili záznamy na
                „DNS pouze" (šedý cloud). Nejste si jisti, jak změnit záznamy
                DNS pro váš doména? Kontaktujte nás a můžeme si s vámi
                promluvit. Pro informace specifické pro poskytovatele, viz{' '}
                <a
                  rel="noopener noreferrer"
                  href="https://help.saashq.org/help/knowledge-base/article/detail?catId=ogZPWFSy78Anc5Ras&_id=dfggSKv8ZCKdkwK26"
                  target="_blank"
                >
                  tohoto průvodce
                </a>
                .
              </p>
            </Alert>
          </FormGroup>
        </FlexRow>
        {this.props.currentOrganization.domain ? (
          <FormGroup>
            <Table striped={true} condensed={true} bordered={true}>
              <thead>
                <tr>
                  <th>Typ</th>
                  <th>Název</th>
                  <th>Hodnota</th>
                  <th>Postavení</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CNAME</td>
                  <td>{domain || 'Vaše doména'}</td>
                  <td>{subdomain}.app.saashq.org</td>
                  <td>
                    <b>{(dnsStatus || 'Undefined').toUpperCase()}</b>
                  </td>
                </tr>
                <tr>
                  <td>Ověření certifikátu TXT</td>
                  <td>{sslVerification.txt_name}</td>
                  <td>{sslVerification.txt_value}</td>
                  <td>
                    <b>{(sslStatus || 'Undefined').toUpperCase()}</b>
                  </td>
                </tr>
                <tr>
                  <td>TXT před ověřením názvu hostitele</td>
                  <td>{ownershipVerification.name}</td>
                  <td>{ownershipVerification.value}</td>
                  <td>
                    <b>{(hostNameStatus || 'Undefined').toUpperCase()}</b>
                  </td>
                </tr>
              </tbody>
            </Table>
          </FormGroup>
        ) : null}
        {this.props.currentOrganization.domain ? (
          <>
            <Button
              btnStyle="default"
              uppercase={false}
              onClick={() => this.editDomain('refresh')}
            >
              Obnovit
            </Button>
            <Button
              btnStyle="danger"
              uppercase={false}
              onClick={() => this.editDomain('reset')}
            >
              Resetovat doménu
            </Button>
          </>
        ) : (
          <Button
            btnStyle="success"
            uppercase={false}
            onClick={() => this.editDomain('save')}
          >
            Uložit
          </Button>
        )}
      </StatusBox>
    );
  }

  render() {
    const { subdomain, name, icon } = this.state;
    const avatar = icon || '/images/saashq.png';
    const isWhiteLabel = localStorage.getItem('organizationInfo') !== null;

    const nameOnChange = (e) =>
      this.onChangeInput('name', (e.target as HTMLInputElement).value);
    const subdomainOnChange = (e) =>
      this.onChangeInput('subdomain', (e.target as HTMLInputElement).value);
    const handleAvatarUploader = (url) => this.onUpload('icon', url);

    return (
      <StatusBox largePadding={true} largeMargin={true}>
        <StatusTitle>{__('Organization Profile')}</StatusTitle>
        <FlexRow>
          <FormGroup>
            <FormGroup>
              <ControlLabel>Název organizace</ControlLabel>

              <FormControl
                value={name}
                type="text"
                onChange={nameOnChange}
                required={true}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Organization URL</ControlLabel>
              <Domain>
                <FormControl
                  name="subdomain"
                  value={subdomain}
                  type="text"
                  onChange={subdomainOnChange}
                  required={true}
                />
                <span>.app.saashq.org</span>
              </Domain>
            </FormGroup>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Hlavní ikona</ControlLabel>
            <p>
              Čtvercový průhledný PNG, doporučená šířka přibližně 150 pixelů.
            </p>
            <AvatarUpload
              avatar={icon}
              onAvatarUpload={handleAvatarUploader}
              title="icon"
              extraFormData={[{ key: 'isPublic', value: 'true' }]}
              defaultAvatar={avatar}
              square={true}
            />
          </FormGroup>
        </FlexRow>
        {isWhiteLabel && (
          <>
            <StatusTitle>{__('Company Branding')}</StatusTitle>
            <FlexRow>
              {this.renderMainLogo()}
              {this.renderFavicon()}
              {this.renderColors()}
            </FlexRow>
            {this.renderLoginPage()}
            {this.renderDNS()}
            <FlexRow>{this.renderEmailFields()}</FlexRow>
          </>
        )}
        <UpgradeButtons>{this.renderSaveButton()}</UpgradeButtons>
      </StatusBox>
    );
  }
}

export default OrganizationProfile;
