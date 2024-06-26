import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import Button from '@saashq/ui/src/components/Button';
import FormControl from '@saashq/ui/src/components/form/Control';
import Icon from '@saashq/ui/src/components/Icon';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import Tip from '@saashq/ui/src/components/Tip';
import { __ } from '@saashq/ui/src/utils';
import React from 'react';
import { IPage } from '../../types';
import PageForm from './PageForm';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { Link } from 'react-router-dom';
import { DetailLink } from '../../styles';

type Props = {
  page: IPage;
  history: any;
  remove: (pageId: string, emptyBulk?: () => void) => void;
  isChecked?: boolean;
  toggleBulk: (target: any, toAdd: boolean) => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class Row extends React.Component<Props> {
  renderEditAction(page) {
    const trigger = (
      <Button btnStyle="link">
        <Tip text={__('Upravit')} placement="top">
          <Icon icon="edit-3" />
        </Tip>
      </Button>
    );

    const content = (props) => (
      <PageForm {...props} renderButton={this.props.renderButton} page={page} />
    );

    return (
      <ModalTrigger
        title={`Upravit stránku`}
        size="lg"
        trigger={trigger}
        content={content}
      />
    );
  }

  renderRemoveAction() {
    const { page, remove } = this.props;

    const onClick = () => remove(page._id);

    return (
      <Tip text={__('Vymazat')} placement="top">
        <Button
          id="pageDelete"
          btnStyle="link"
          onClick={onClick}
          icon="times-circle"
        />
      </Tip>
    );
  }

  render() {
    const { page, isChecked, toggleBulk } = this.props;

    const onChange = (e) => {
      if (toggleBulk) {
        toggleBulk(page, e.target.checked);
      }
    };

    const onClick = (e) => {
      e.stopPropagation();
    };

    return (
      <tr>
        <td id="pagesCheckBox" onClick={onClick}>
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>
          <DetailLink>
            <Link to={`/forum/pages/${page._id}`}>{page.title}</Link>
          </DetailLink>
        </td>
        <td>{page.code}</td>
        <td>{page.listOrder}</td>
        <td>
          <ActionButtons>
            {this.renderEditAction(page)}
            {this.renderRemoveAction()}
          </ActionButtons>
        </td>
      </tr>
    );
  }
}

export default Row;
