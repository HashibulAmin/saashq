import {
  FieldStyle,
  SidebarCounter,
  SidebarList,
} from '@saashq/ui/src/layout/styles';
import { List, SkillList } from './styles';
import { isEnabled, loadDynamicComponent } from '@saashq/ui/src/utils/core';

import Button from '@saashq/ui/src/components/Button';
import { EmptyState } from '@saashq/ui/src/components';
import { IUser } from '@saashq/ui/src/auth/types';
import Icon from '@saashq/ui/src/components/Icon';
import { Link } from 'react-router-dom';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';
import { __ } from '@saashq/ui/src/utils';
import dayjs from 'dayjs';

type Props = {
  user: IUser;
  channels: any[]; //check - IChannel
  skills: any[]; //check - ISkillDocument
  excludeUserSkill: (skillId: string, userId: string) => void;
  renderSkillForm: ({
    closeModal,
    user,
  }: {
    closeModal: () => void;
    user: IUser;
  }) => React.ReactNode;
};

const { Section } = Sidebar;
const { Title } = Section;

function LeftSidebar({
  user,
  skills = [],
  channels,
  excludeUserSkill,
  renderSkillForm,
}: Props) {
  const { details = {} } = user;

  const renderRow = (title: string, value: any, nowrap?: boolean) => {
    return (
      <li>
        <FieldStyle>{__(title)}:</FieldStyle>
        <SidebarCounter nowrap={nowrap}>{value || '-'}</SidebarCounter>
      </li>
    );
  };

  function renderUserInfo() {
    return (
      <Section>
        <SidebarList className="no-link">
          {renderRow('Primární Email', user.email)}
          {renderRow('Telefonní číslo Operátora', details.operatorPhone)}
          {renderRow('Uživatelské jméno', user.username)}
          {renderRow('Krátké jméno', details.shortName)}
          {renderRow('Umístění', details.location)}
          {renderRow(
            'Datum narození',
            details.birthDate
              ? dayjs(details.birthDate).format('YYYY-MM-DD')
              : '-',
          )}
          {renderRow('Pozice', details.position)}
          {renderRow('Skóre', user.score)}
          {renderRow(
            'Datum připojení',
            details.workStartedDate
              ? dayjs(details.workStartedDate).format('YYYY-MM-DD')
              : '-',
          )}
          {renderRow('Popis', details.description, true)}
        </SidebarList>
      </Section>
    );
  }

  function renderChannels() {
    return (
      <Section>
        <Title>{__('Kanály')}</Title>
        <List>
          {channels.map((channel) => {
            return (
              <li key={channel._id}>
                <Link to={`/settings/channels?id=${channel._id}`}>
                  <FieldStyle>{channel.name || ''}</FieldStyle>
                  <SidebarCounter>{channel.description || ''}</SidebarCounter>
                </Link>
              </li>
            );
          })}
        </List>
      </Section>
    );
  }

  function renderSkills() {
    const getContent = (props) => {
      return renderSkillForm(props);
    };

    return (
      <Section>
        <Title>{__('Dovednosti')}</Title>
        <Section.QuickButtons>
          <ModalTrigger
            title="Upravit"
            trigger={<Button btnStyle="simple" size="small" icon="cog" />}
            content={getContent}
          />
        </Section.QuickButtons>
        <SkillList>
          {skills.length > 0 ? (
            skills.map((skill) => {
              const handleRemove = () => excludeUserSkill(skill._id, user._id);

              return (
                <Button
                  key={skill._id}
                  btnStyle="simple"
                  size="small"
                  onClick={handleRemove}
                >
                  {skill.name}&nbsp;
                  <Icon icon="times-circle" color="#EA475D" />
                </Button>
              );
            })
          ) : (
            <EmptyState icon="ban" text="No skills" size="small" />
          )}
        </SkillList>
      </Section>
    );
  }

  function renderForms() {
    const content = () =>
      loadDynamicComponent('contactDetailLeftSidebar', {
        user: user,
        isDetail: true,
      });

    const extraButton = (
      <ModalTrigger
        title="Vlastnosti"
        trigger={
          <Icon icon="expand-arrows-alt" style={{ cursor: 'pointer' }} />
        }
        size="xl"
        content={content}
      />
    );

    return loadDynamicComponent('contactDetailLeftSidebar', {
      user: user,
      isDetail: true,
    });
  }

  return (
    <Sidebar wide={true}>
      {renderUserInfo()}
      {isEnabled('inbox') && renderChannels()}
      {isEnabled('inbox') && renderSkills()}
      {isEnabled('forms') && renderForms()}
    </Sidebar>
  );
}

export default LeftSidebar;
