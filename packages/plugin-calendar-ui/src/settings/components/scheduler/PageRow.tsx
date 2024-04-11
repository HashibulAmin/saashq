import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import Button from '@saashq/ui/src/components/Button';
import Tip from '@saashq/ui/src/components/Tip';
import React from 'react';
import { IPage } from '../../types';

type Props = {
  page: IPage;
  accountId: string;
  remove: (pageId: string) => void;
};

declare function editSchedule(editToken: string, inDarkMode: boolean): any;

class PageRow extends React.Component<Props> {
  onEdit = (pageEditToken) => {
    editSchedule(pageEditToken, false);
  };

  onView = (e) => {
    e.preventDefault();
    window.open(`/schedule/${this.props.page.slug}`);
  };

  remove = (pageId) => {
    this.props.remove(pageId);
  };

  renderExtraLinks() {
    const { page } = this.props;

    return (
      <>
        <Tip text="Vymazat">
          <Button
            btnStyle="link"
            onClick={this.remove.bind(this, page._id)}
            icon="times-circle"
          />
        </Tip>

        <Tip text="Pohled">
          <Button btnStyle="link" onClick={this.onView} icon="eye" />
        </Tip>
      </>
    );
  }

  render() {
    const { page } = this.props;

    return (
      <tr key={page._id}>
        <td>{page.name}</td>
        <td>
          <ActionButtons>{this.renderExtraLinks()}</ActionButtons>
        </td>
      </tr>
    );
  }
}

export default PageRow;
