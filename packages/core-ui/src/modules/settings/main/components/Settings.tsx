import WithPermission from 'modules/common/components/WithPermission';
import { __, getEnv } from 'modules/common/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import { pluginsSettingsNavigations } from 'pluginUtils';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  BoxName,
  MenusContainer,
  Row,
  RowTitle,
  Divider,
} from '@saashq/ui-settings/src/main/styles';
import { getVersion } from '@saashq/ui/src/utils/core';

const breadcrumb = [{ title: __('Nastavení'), link: '/settings' }];
const permissionActions = [
  'managePermissions',
  'showPermissions',
  'showPermissionModules',
  'showPermissionActions',
  'exportPermissions',
];
const teamPermissions = [
  'showUsers',
  'usersEdit',
  'usersInvite',
  'usersSetActiveStatus',
  'exportUsers',
];

class Settings extends React.PureComponent {
  renderBox(
    name: string,
    image: string,
    to: string,
    action: string,
    permissions?: string[],
    type?: string,
    color?: string,
  ) {
    const box = (
      <Box color={color}>
        <Link to={to || '#'}>
          {type && <em>{type}</em>}
          <img src={image} alt={name} />
          <BoxName>{__(name)}</BoxName>
        </Link>
      </Box>
    );

    if (!action) {
      return box;
    }

    return (
      <WithPermission key={to} action={action} actions={permissions}>
        {box}
      </WithPermission>
    );
  }

  renderSettingsofPlugins(menu) {
    const { to, type, text, image, action, permissions } = menu.props;

    return this.renderBox(text, image, to, action, permissions, type);
  }

  renderPluginSettings() {
    const plugins = pluginsSettingsNavigations(this.renderBox);

    if (plugins.length === 0) {
      return null;
    }
    return (
      <>
        <Divider />
        <Row>
          <RowTitle>
            {__('Nastavení Pluginu')}
            <span>{__('Nastavte další nastavení pluginu')}</span>
          </RowTitle>
          <div id={'PluginSettings'}>{plugins}</div>
        </Row>
      </>
    );
  }

  render() {
    const { VERSION } = getVersion();
    const content = (
      <MenusContainer id={'SettingsMain'}>
        <Row>
          <RowTitle>
            {__('Obecné nastavení')}
            <span>{__('Proveďte základní nastavení')}</span>
          </RowTitle>
          <div id={'SettingsGeneralSettings'}>
            {VERSION && VERSION === 'saas' ? (
              <>
                {this.renderBox(
                  'Nastavení organizace',
                  '/images/icons/saashq-35.png',
                  '/settings/organizations',
                  'editOrganizationInfo',
                )}
                <Box>
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://shq.saashq.org/organizations"
                  >
                    <img
                      src="/images/icons/saashq-24.svg"
                      alt="Globální účet"
                    />
                    <BoxName>{__('Globální profil účtu')}</BoxName>
                  </a>
                </Box>
              </>
            ) : null}

            {this.renderBox(
              'Konfigurace Systému',
              '/images/icons/saashq-16.svg',
              '/settings/general',
              'generalSettingsAll',
              ['manageGeneralSettings', 'showGeneralSettings'],
            )}
            {this.renderBox(
              'Oprávnění',
              '/images/icons/saashq-02.svg',
              '/settings/permissions',
              'permissionsAll',
              permissionActions,
            )}
            {this.renderBox(
              'Členové týmu',
              '/images/icons/saashq-23.svg',
              '/settings/team',
              'usersAll',
              teamPermissions,
            )}
            {this.renderBox(
              'Značky',
              '/images/icons/saashq-03.svg',
              '/settings/brands',
              'brandsAll',
              ['showBrands', 'manageBrands'],
            )}
            {/* {this.renderBox(
              "Vlastnosti",
              "/images/icons/saashq-01.svg",
              "/settings/properties",
              ""
            )} */}
            {this.renderBox(
              'Import & Export',
              '/images/icons/saashq-22.svg',
              '/settings/selectMenu',
              'importHistoriesAll',
              ['importHistories', 'removeImportHistories', 'importXlsFile'],
            )}
            {this.renderBox(
              'Aplikace',
              '/images/icons/saashq-20.svg',
              '/settings/apps',
              '',
              [],
            )}
            {this.renderBox(
              'Struktura',
              '/images/icons/saashq-15.svg',
              '/settings/structure',
              'usersAll',
              teamPermissions,
            )}
          </div>
        </Row>
        {this.renderPluginSettings()}
      </MenusContainer>
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header title={__('Nastavení')} breadcrumb={breadcrumb} />
        }
        content={content}
        transparent={true}
      />
    );
  }
}

export default Settings;
