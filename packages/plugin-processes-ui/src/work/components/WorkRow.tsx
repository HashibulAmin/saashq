import React from 'react';
import { confirm } from '@saashq/ui/src/utils';
import { __ } from 'coreui/utils';
import { IWorkDocument } from '../types';
import moment from 'moment';
import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import Button from '@saashq/ui/src/components/Button';
import Tip from '@saashq/ui/src/components/Tip';
import Icon from '@saashq/ui/src/components/Icon';
import Form from '../containers/WorkForm';

type Props = {
  work: IWorkDocument;
  removeWork: (id: string) => void;
  history: any;
};

class Row extends React.Component<Props> {
  renderLoc(obj) {
    if (!obj) {
      return '';
    }

    const value = `${obj.code} - ${obj.title}`;

    if (value.length > 20) {
      return `${value.substring(0, 20)}...`;
    }

    return value;
  }

  remove = () => {
    const { removeWork, work } = this.props;

    confirm(__('Remove this work?')).then(() => {
      removeWork(work._id || '');
    });
  };

  render() {
    const { work } = this.props;

    const {
      name,
      status,
      flow,
      inBranch,
      inDepartment,
      outBranch,
      outDepartment,
      dueDate,
      count,
      needProducts,
      resultProducts,
      origin,
      type,
    } = work;

    const content = (props) => <Form {...props} work={work} />;

    return (
      <tr>
        <td>{name}</td>
        <td>{status}</td>
        <td>{flow ? flow.name : ''}</td>
        <td>{count || 0}</td>
        <td>{this.renderLoc(inBranch)}</td>
        <td>{this.renderLoc(inDepartment)}</td>
        <td>{this.renderLoc(outBranch)}</td>
        <td>{this.renderLoc(outDepartment)}</td>
        <td>{(needProducts || []).length}</td>
        <td>{(resultProducts || []).length}</td>
        <td>{moment(dueDate).format('YYYY-MM-DD HH:mm')}</td>
        <td>
          {origin === 'handle' ? (
            <ActionButtons>
              <ModalTrigger
                title={__(`Edit perform`)}
                trigger={
                  <Button btnStyle="link">
                    <Tip text={__('Upravit')} placement="bottom">
                      <Icon icon="edit" />
                    </Tip>
                  </Button>
                }
                size="xl"
                content={content}
              />
              <Button btnStyle="link" onClick={this.remove}>
                <Tip text={__('Vymazat')} placement="bottom">
                  <Icon icon="trash-alt" />
                </Tip>
              </Button>
            </ActionButtons>
          ) : (
            ''
          )}
        </td>
      </tr>
    );
  }
}

export default Row;
