import { ActionButtons, SidebarListItem } from '@saashq/ui-settings/src/styles';
import { FieldStyle, SidebarList } from '@saashq/ui/src/layout/styles';
import { IButtonMutateProps, IRouterProps } from '@saashq/ui/src/types';
import {
  ISkillType,
  ISkillTypesDocument,
} from '@saashq/ui-inbox/src/settings/skills/types';
import { Link, withRouter } from 'react-router-dom';

import Button from '@saashq/ui/src/components/Button';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import { Header } from '@saashq/ui-settings/src/styles';
import Icon from '@saashq/ui/src/components/Icon';
import LoadMore from '@saashq/ui/src/components/LoadMore';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';
import SkillTypeForm from './SkillTypeForm';
import Tip from '@saashq/ui/src/components/Tip';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { __ } from 'coreui/utils';

type Props = {
  queryParams: any;
  history: any;
  totalCount: number;
  loading: boolean;
  refetch: any;
  remove: (id: string) => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  objects: ISkillTypesDocument[];
} & IRouterProps;

const { Section } = Wrapper.Sidebar;

function SkillTypes({
  objects,
  queryParams,
  history,
  totalCount,
  loading,
  refetch,
  remove,
  renderButton,
}: Props) {
  const isItemActive = (id: string) => {
    const currentType = queryParams.typeId || '';

    return currentType === id;
  };

  function renderEditAction(object: ISkillTypesDocument) {
    const trigger = (
      <Button id="skilltype-edit" btnStyle="link">
        <Tip text={__('Upravit')} placement="bottom">
          <Icon icon="edit" />
        </Tip>
      </Button>
    );

    return renderFormTrigger(trigger, object);
  }

  function renderRemoveAction(object: ISkillTypesDocument) {
    const handleRemove = () => remove(object._id);

    return (
      <Button btnStyle="link" onClick={handleRemove}>
        <Tip text={__('Remove')} placement="bottom">
          <Icon icon="cancel-1" />
        </Tip>
      </Button>
    );
  }

  function renderForm(props) {
    return (
      <SkillTypeForm {...props} refetch={refetch} renderButton={renderButton} />
    );
  }

  function renderFormTrigger(trigger: React.ReactNode, object?: ISkillType) {
    const content = (props) => renderForm({ ...props, object });

    return (
      <ModalTrigger
        title="New skill type"
        trigger={trigger}
        content={content}
      />
    );
  }

  function renderHeader() {
    const trigger = (
      <Button
        id="skilltype-new"
        btnStyle="success"
        icon="plus-circle"
        block={true}
      >
        Create skill type
      </Button>
    );

    return (
      <>
        <Header>{renderFormTrigger(trigger)}</Header>
        <Section.Title>{__('Skill types')}</Section.Title>
      </>
    );
  }

  function renderContent() {
    return (
      <SidebarList noTextColor noBackground>
        {objects.map((object) => (
          <SidebarListItem key={object._id} isActive={isItemActive(object._id)}>
            <Link to={`?typeId=${object._id}`}>
              <FieldStyle>{object.name}</FieldStyle>
            </Link>
            <ActionButtons>
              {renderEditAction(object)}
              {renderRemoveAction(object)}
            </ActionButtons>
          </SidebarListItem>
        ))}
      </SidebarList>
    );
  }

  return (
    <Sidebar wide={true} header={renderHeader()} hasBorder>
      <DataWithLoader
        data={renderContent()}
        loading={loading}
        count={totalCount}
        emptyText={`${__('Get started by grouping the skills into types')}.${__(
          'For example, language skills',
        )}`}
        emptyImage="/images/actions/26.svg"
      />
      <LoadMore all={totalCount} loading={loading} />
    </Sidebar>
  );
}

export default withRouter<Props>(SkillTypes);
