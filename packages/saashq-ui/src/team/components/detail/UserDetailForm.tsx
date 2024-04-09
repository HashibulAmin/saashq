import ActionSection from '../../containers/ActionSection';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import { IUser } from '@saashq/ui/src/auth/types';
import InfoSection from './InfoSection';
import LeftSidebar from './LeftSidebar';
import React, { useState } from 'react';
import { UserHeader, BoxWrapper } from './styles';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { loadDynamicComponent } from '@saashq/ui/src/utils/core';
import {
  Box,
  ControlLabel,
  FormGroup,
  __,
  Button,
  Form as CommonForm,
  ModalTrigger,
} from '@saashq/ui/src';
import { ButtonRelated, ModalFooter } from '@saashq/ui/src/styles/main';
import SelectBranches from '@saashq/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@saashq/ui/src/team/containers/SelectDepartments';
import SelectPositions from '@saashq/ui/src/team/containers/SelectPositions';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';
import { IButtonMutateProps } from '../../../types';
import UserMovementForm from '../../containers/UserMovementForm';

type Props = {
  user: IUser;
  channels: any[]; // check - IChannel
  skills: any[]; // check - ISkillDocument
  participatedConversations: any[]; // check - IConversation
  totalConversationCount: number;
  excludeUserSkill: (skillId: string, userId: string) => void;
  renderSkillForm: ({
    closeModal,
    user,
  }: {
    closeModal: () => void;
    user: IUser;
  }) => React.ReactNode;
  renderEditForm: ({
    closeModal,
    user,
  }: {
    closeModal: () => void;
    user: IUser;
  }) => React.ReactNode;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

function UserDetails({
  user,
  skills,
  channels,
  excludeUserSkill,
  renderSkillForm,
  renderEditForm,
  renderButton,
}: Props) {
  const { details = {} } = user;
  const [department, setDepartmentIds] = useState({
    ids: user.departmentIds || [],
    isChanged: false,
  });
  const [branch, setBranchIds] = useState({
    ids: user.branchIds || [],
    isChanged: false,
  });

  const [position, setPositionIds] = useState({
    ids: user.positionIds || [],
    isChanged: false,
  });

  const title = details.fullName || 'Neznámý';
  const breadcrumb = [
    { title: 'Uživatelé', link: '/settings/team' },
    { title },
  ];

  if (!user._id) {
    return (
      <EmptyState
        image="/images/actions/11.svg"
        text="Uživatel nenalezen"
        size="small"
      />
    );
  }

  const list = (
    ids: string[],
    isChanged: boolean,
    label: string,
    key: string,
    handleState,
  ) => {
    let Selection;

    const handleChange = (value) => {
      handleState({ ids: value, isChanged: true });
    };

    if (key === 'oddělení') {
      Selection = SelectDepartments;
    }
    if (key === 'větev') {
      Selection = SelectBranches;
    }

    if (key === 'pozice') {
      Selection = SelectPositions;
    }
    const content = (formProps) => {
      const callback = () => {
        handleState((prev) => ({ ids: prev.ids, isChanged: false }));
      };
      const handleCancel = () => {
        handleState({ ids: user[`${key}Ids`], isChanged: false });
      };

      const generateDoc = () => {
        user.details && delete user.details['__typename'];
        return { ...user, [`${key}Ids`]: ids };
      };

      const movementForm = () => {
        const trigger = (
          <ButtonRelated>
            <span>{`Viz Pohyb uživatelů ${label}`}</span>
          </ButtonRelated>
        );

        const content = (props) => {
          const updatedProps = {
            ...props,
            userId: user._id,
            contentType: key,
          };
          return <UserMovementForm {...updatedProps} />;
        };

        return (
          <ModalTrigger
            title={`Uživatel ${label} Pohyby`}
            content={content}
            trigger={trigger}
            size="xl"
          />
        );
      };

      return (
        <BoxWrapper>
          <FormGroup>
            <ControlLabel>{__(`${label}`)}</ControlLabel>
            <Selection
              label={`Vybrat ${label}`}
              name={`${key}Ids`}
              initialValue={ids}
              onSelect={(value) => handleChange(value)}
              filterParams={{ withoutUserFilter: true }}
            />
          </FormGroup>
          {isChanged && (
            <ModalFooter>
              <Button btnStyle="simple" onClick={handleCancel}>
                {__('Cancel')}
              </Button>
              {renderButton({
                text: 'pohyb uživatele',
                values: generateDoc(),
                isSubmitted: formProps.isSubmitted,
                callback,
              })}
            </ModalFooter>
          )}
          {movementForm()}
        </BoxWrapper>
      );
    };
    return <CommonForm renderContent={content} />;
  };

  const leftSidebar = (
    <Sidebar>
      <Box title="Větve">
        {list(branch.ids, branch.isChanged, 'Větve', 'větev', setBranchIds)}
      </Box>
      <Box title="Oddělení">
        {list(
          department.ids,
          department.isChanged,
          'Oddělení',
          'oddělení',
          setDepartmentIds,
        )}
      </Box>
      <Box title="Pozice">
        {list(
          position.ids,
          position.isChanged,
          'Pozice',
          'pozice',
          setPositionIds,
        )}
      </Box>
      {loadDynamicComponent('contactDetailRightSidebar', { user })}
    </Sidebar>
  );

  return (
    <Wrapper
      header={<Wrapper.Header title={title} breadcrumb={breadcrumb} />}
      mainHead={
        <UserHeader>
          <InfoSection
            nameSize={16}
            avatarSize={60}
            user={user}
            renderEditForm={renderEditForm}
          >
            <ActionSection user={user} renderEditForm={renderEditForm} />
          </InfoSection>
          {loadDynamicComponent('contactDetailHeader', { customer: user })}
        </UserHeader>
      }
      leftSidebar={
        <LeftSidebar
          user={user}
          channels={channels}
          skills={skills}
          excludeUserSkill={excludeUserSkill}
          renderSkillForm={renderSkillForm}
        />
      }
      rightSidebar={leftSidebar}
      content={loadDynamicComponent('contactDetailContent', { contact: user })}
      transparent={true}
    />
  );
}

export default UserDetails;
