import { COMMUNITY, STEPS, SETUP, DOCS, VIDEO } from '../constants';
import {
  BoxHeader,
  BoxedStep,
  Boxes,
  Header,
  Left,
  LinkedButton,
  Setup,
  SetupContent,
  BoxContent,
  VideoLink,
  Card,
  VideoFrame,
} from '../styles';
import Button from '@saashq/ui/src/components/Button';
import { DescImg } from '@saashq/ui/src/components/HeaderDescription';
import { IUser } from 'modules/auth/types';
import Icon from '@saashq/ui/src/components/Icon';
import ProgressBar from '@saashq/ui/src/components/ProgressBar';
import React, { useState } from 'react';
import { WidgetBackgrounds } from '@saashq/ui-settings/src/styles';
import Wrapper from 'modules/layout/components/Wrapper';
import _ from 'lodash';
import { __ } from 'modules/common/utils';
import { useHistory } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownToggle from 'modules/common/components/DropdownToggle';

type Props = {
  currentUser: IUser;
  branchesLength: number;
  departmentLength: number;
};

function Welcome({ currentUser, branchesLength, departmentLength }: Props) {
  const history = useHistory();
  const { onboardingHistory } = currentUser;
  const completedSteps = onboardingHistory && onboardingHistory.completedSteps;

  const [collapsed, setCollapsed] = useState([] as string[]);
  const handleClick = (id: string) => {
    if (collapsed.includes(id)) {
      const index = collapsed.indexOf(id);
      setCollapsed(collapsed.splice(index, 1));
    } else {
      setCollapsed(collapsed.splice(1, 0, id));
    }
  };

  let active = 0;

  if (completedSteps && completedSteps.includes('generalSettingsCreate')) {
    active = active + 1;
  }

  if (completedSteps && completedSteps.includes('brandCreate')) {
    active = active + 1;
  }

  if (completedSteps && completedSteps.includes('userGroupCreate')) {
    active = active + 1;
  }

  if (completedSteps && completedSteps.includes('userCreate')) {
    active = active + 1;
  }

  if (branchesLength > 0 || departmentLength > 0) {
    active = active + 1;
  }

  const renderUserName = () => {
    if (!currentUser) {
      return null;
    }

    if (currentUser.details) {
      return currentUser.details.fullName;
    }

    if (currentUser.username) {
      return `@${currentUser.username}`;
    }

    return null;
  };

  const renderHeader = () => {
    return (
      <Header>
        <h1>
          {__('Vítejte!')} {renderUserName()} &nbsp;
          <span role="img" aria-label="Wave">
            👋
          </span>
        </h1>
        <div>
          {__(
            'Užijte si jeden, ale kompletní operační systém (SHQ), abyste si vytvořili svůj vlastní zážitek.',
          )}
          <br />
          {__(
            'Cenově efektivní platforma typu vše v jednom pro služby zákazníkům, marketing, prodej a zaměstnance. ',
          )}
        </div>
      </Header>
    );
  };

  const renderBoxHeader = (
    title: string,
    handleOpen: () => void,
    image?: string,
    isOpen?: boolean,
  ) => {
    const percentage = Math.floor((active / 5) * 100);
    const icon = isOpen ? 'angle-down' : 'angle-right';

    return (
      <BoxHeader
        onClick={() => handleOpen()}
        isOpen={isOpen}
        isSetup={title === 'Začínáme'}
      >
        <Left>
          {image && <DescImg src={image} />}
          <div>
            <h4>{title}</h4>
          </div>
        </Left>
        {title === 'Začínáme' && (
          <ProgressBar
            percentage={percentage}
            color={percentage === 100 ? '#3CCC38' : '#673FBD'}
            type="circle"
            height="70px"
          />
        )}
        {title !== 'Začínáme' && <Icon icon={icon} size={25} color="#673FBD" />}
      </BoxHeader>
    );
  };

  const renderDocContent = (
    title: string,
    description: string,
    url: string,
    icon: string,
  ) => {
    return (
      <LinkedButton href={url} target="_blank">
        <Icon icon={icon} size={20} color="#888888" />
        <div>
          <h3>{title}</h3>
          <span>{description}</span>
        </div>
      </LinkedButton>
    );
  };

  const renderDocumentation = () => {
    return (
      <WidgetBackgrounds>
        <Boxes>
          {DOCS.slice(0, 2).map((item) =>
            renderDocContent(item.title, item.desc, item.url, item.icon),
          )}
        </Boxes>
        <Boxes>
          {DOCS.slice(2, 4).map((item) =>
            renderDocContent(item.title, item.desc, item.url, item.icon),
          )}
        </Boxes>
      </WidgetBackgrounds>
    );
  };

  const renderSetup = () => {
    return SETUP.map((item) => {
      const { url, title, icon, btnText, action } = item;
      const [isOpen, setIsOpen] = useState(false);
      const isComplete =
        url === '/settings/structure'
          ? branchesLength > 0 || departmentLength > 0
          : completedSteps?.includes(action);

      const handleOpen = () => {
        setIsOpen(!isOpen);
      };

      const dropdownIcon = isComplete
        ? 'check'
        : isOpen
          ? 'uparrow'
          : 'downarrow-2';

      return (
        <Setup key={title}>
          <LinkedButton onClick={() => handleOpen()}>
            <Icon
              icon={icon}
              size={20}
              color={isComplete ? '#3CCC38' : '#888888'}
            />
            <div>
              <h3>{title}</h3>
            </div>
            <Button
              icon={dropdownIcon}
              btnStyle={isComplete ? 'success' : 'link'}
              size="small"
            />
          </LinkedButton>
          {isOpen && (
            <SetupContent>
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
              <Button onClick={() => history.push(url)}>{btnText}</Button>
            </SetupContent>
          )}
        </Setup>
      );
    });
  };

  const renderVideo = (
    title: string,
    description: string,
    icon: string,
    url: string,
  ) => {
    return (
      <Dropdown alignRight={true}>
        <Dropdown.Toggle as={DropdownToggle} id="dropdown-user">
          <LinkedButton>
            <Icon icon={icon} size={20} color="#888888" />
            <div>
              <h3>{title}</h3>
              <span>{description}</span>
            </div>
            <VideoLink onClick={() => handleClick(title)}>
              {__('Sledovat video')}
              <Icon icon="play-1" size={15} color="#fff" />
            </VideoLink>
          </LinkedButton>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <VideoFrame>
            <iframe
              width="100%"
              height="478"
              src={url}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </VideoFrame>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const renderGuide = () => {
    return (
      <WidgetBackgrounds>
        {VIDEO.map((item) => {
          return renderVideo(item.title, item.desc, item.icon, item.url);
        })}
      </WidgetBackgrounds>
    );
  };

  const renderCommunity = () => {
    return (
      <WidgetBackgrounds>
        <h5>
          Připojte se k naší komunitě a zapojte se do diskuzí se členy týmu,
          přispěvatelé a vývojáři napříč různými kanály.
        </h5>
        <br />
        {COMMUNITY.map((com, index) => (
          <Button
            key={index}
            href={com.link}
            btnStyle="simple"
            icon={com.icon}
            img={com.image}
            iconColor="black"
            target="_blank"
          >
            {com.name}
          </Button>
        ))}
      </WidgetBackgrounds>
    );
  };

  const content = (
    <>
      {renderHeader()}
      {STEPS.map((group, index) => {
        const [isOpen, setIsOpen] = useState(
          window.location.hash.includes(group.key) ? true : false,
        );

        const handleOpen = () => {
          if (group.key !== 'setup') {
            setIsOpen(!isOpen);
          }
        };

        return (
          <BoxedStep key={index}>
            {renderBoxHeader(group.title, handleOpen, group.image, isOpen)}
            {isOpen && (
              <BoxContent>
                {group.key === 'documentation' && renderDocumentation()}
                {group.key === 'usingGuide' && renderGuide()}
                {group.key === 'community' && renderCommunity()}
              </BoxContent>
            )}
            {group.key === 'setup' && renderSetup()}
          </BoxedStep>
        );
      })}
      <React.Fragment>
        <Card>
          <div>
            <h4>{__('Onboarding optimalizovaný pro vás')}</h4>
            <p>{__('Chcete-li zahájit proces registrace, kontaktujte nás')}</p>
            <br />
            <Button
              size="large"
              btnStyle="white"
              href={'https://shq.saashq.org/service'}
              target="_blank"
            >
              {__('Žádost')}
            </Button>
          </div>
        </Card>
      </React.Fragment>
    </>
  );

  return (
    <Wrapper
      content={content}
      transparent={true}
      center={true}
      initialOverflow={true}
    />
  );
}

export default Welcome;
