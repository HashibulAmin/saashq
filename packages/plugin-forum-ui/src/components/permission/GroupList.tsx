import { ActionButtons, Header } from '@saashq/ui-settings/src/styles';
import { FieldStyle, SidebarList } from '@saashq/ui/src/layout/styles';
import { __, router } from '@saashq/ui/src/utils';

import Button from '@saashq/ui/src/components/Button';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import GroupForm from '../../containers/permission/PermissionGroupForm';
import { IRouterProps } from '@saashq/ui/src/types';
import { IUserGroupDocument } from '../../types';
import Icon from '@saashq/ui/src/components/Icon';
import { Link } from 'react-router-dom';
import LoadMore from '@saashq/ui/src/components/LoadMore';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';
import { SidebarItem } from '../../styles';
import Tip from '@saashq/ui/src/components/Tip';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { withRouter } from 'react-router-dom';

const { Section } = Wrapper.Sidebar;

interface IProps extends IRouterProps {
  queryParams?: any;
  objects: IUserGroupDocument[];
  remove?: (id: string) => void;
}

class GroupList extends React.Component<IProps> {
  componentWillReceiveProps(nextProps: IProps) {
    const { objects = [], history, queryParams } = nextProps;
    const { groupId } = queryParams;

    if (!groupId && objects.length > 0) {
      router.setParams(history, { groupId: objects[0]._id || null }, true);
    }
  }

  renderFormTrigger(trigger: React.ReactNode, object?: IUserGroupDocument) {
    const content = (props) => <GroupForm {...props} group={object} />;

    return (
      <ModalTrigger title="Nová skupina" trigger={trigger} content={content} />
    );
  }

  isActive = (id: string) => {
    const { queryParams } = this.props;
    const currentGroup = queryParams.groupId || '';

    return currentGroup === id;
  };

  renderEditAction(object: IUserGroupDocument) {
    const trigger = (
      <Button btnStyle="link">
        <Tip text={__('Upravit')} placement="bottom">
          <Icon icon="edit" />
        </Tip>
      </Button>
    );

    return this.renderFormTrigger(trigger, object);
  }

  renderRemoveAction(object: IUserGroupDocument) {
    const { remove } = this.props;

    return (
      <Button btnStyle="link" onClick={() => remove(object._id)}>
        <Tip text={__('Remove')} placement="bottom">
          <Icon icon="cancel-1" />
        </Tip>
      </Button>
    );
  }

  renderObjects(objects: IUserGroupDocument[]) {
    return objects.map((object) => (
      <SidebarItem key={object._id} isActive={this.isActive(object._id)}>
        <Link to={`?groupId=${object._id}`}>
          <FieldStyle>{object.name}</FieldStyle>
        </Link>
        <ActionButtons>
          {this.renderEditAction(object)}
          {this.renderRemoveAction(object)}
        </ActionButtons>
      </SidebarItem>
    ));
  }

  renderContent() {
    const { objects } = this.props;

    return (
      <SidebarList noBackground={true} noTextColor={true}>
        {this.renderObjects(objects)}
      </SidebarList>
    );
  }

  renderSidebarHeader() {
    const trigger = (
      <Button
        id="permission-create-user-group"
        btnStyle="success"
        icon="plus-circle"
        block={true}
      >
        Create user group
      </Button>
    );

    return (
      <>
        <Header>{this.renderFormTrigger(trigger)}</Header>
        <Section.Title>{__('User groups')}</Section.Title>
      </>
    );
  }

  render() {
    const { objects } = this.props;

    return (
      <Sidebar wide={true} header={this.renderSidebarHeader()} hasBorder={true}>
        <DataWithLoader
          data={this.renderContent()}
          loading={false}
          count={objects.length}
          emptyText="Neexistuje žádná skupina"
          emptyImage="/images/actions/26.svg"
        />
        <LoadMore all={objects.length} loading={false} />
      </Sidebar>
    );
  }
}

export default withRouter<IProps, any>(GroupList);
