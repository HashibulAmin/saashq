import { BottomMenu, FlexBox, LeftNavigation, NavImage } from '../../styles';
import { __, readFile } from 'modules/common/utils';

import { NavLink } from 'react-router-dom';
import NavigationGoto from './NavigationGoto';
import NavigationItem from './NavigationItem';
import NavigationList from './NavigationList';
import NavigationToggler from './NavigationToggler';
import React from 'react';
import { getThemeItem, getVersion } from '@saashq/ui/src/utils/core';

type Props = {
  navCollapse: number;
  onClickHandleIcon: (event: any) => void;
};

export default class Navigation extends React.Component<Props> {
  render() {
    const { navCollapse, onClickHandleIcon } = this.props;
    const { VERSION } = getVersion();

    const generateLogoSource = (): string => {
      const logo =
        this.props.navCollapse === 1 ? 'glyph_dark.png' : 'logo-dark.png';
      const thLogo = getThemeItem('logo');

      return thLogo ? readFile(thLogo) : `/images/${logo}`;
    };

    return (
      <LeftNavigation>
        <NavLink to="/welcome">
          <NavImage
            navCollapse={navCollapse}
            src={generateLogoSource()}
            alt="saashq"
          />
        </NavLink>

        <FlexBox navCollapse={navCollapse}>
          <NavigationToggler
            navCollapse={navCollapse}
            onClickHandleIcon={onClickHandleIcon}
          />
        </FlexBox>

        <NavigationGoto navCollapse={navCollapse} />

        <NavigationList navCollapse={navCollapse} />

        <BottomMenu>
          {!VERSION || VERSION !== 'saas' ? (
            <NavigationItem
              plugin={{
                text: 'Tržiště',
                url: '/marketplace',
                icon: 'icon-store',
              }}
              navCollapse={navCollapse}
            />
          ) : null}

          <NavigationItem
            plugin={{
              text: 'Nastavení',
              url: '/settings',
              icon: 'icon-settings',
            }}
            navCollapse={navCollapse}
          />
        </BottomMenu>
      </LeftNavigation>
    );
  }
}
