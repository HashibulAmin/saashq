import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import Button from '@saashq/ui/src/components/Button';
import Icon from '@saashq/ui/src/components/Icon';
import Label from '@saashq/ui/src/components/Label';
import React from 'react';
import Tip from '@saashq/ui/src/components/Tip';
import { __ } from 'coreui/utils';
import { FormControl } from '@saashq/ui/src/components/form';
import { IFlowDocument } from '../../types';

type Props = {
  flow: IFlowDocument;
  history: any;
  isChecked: boolean;
  toggleBulk: (flow: IFlowDocument, isChecked?: boolean) => void;
};

class Row extends React.Component<Props> {
  render() {
    const { flow, history, toggleBulk, isChecked } = this.props;

    const onChange = (e) => {
      if (toggleBulk) {
        toggleBulk(flow, e.target.checked);
      }
    };

    const onClick = (e) => {
      e.stopPropagation();
    };

    const renderLabelInfo = (style, text) => {
      return <Label lblStyle={style}>{text}</Label>;
    };

    const onTrClick = () => {
      history.push(`/processes/flows/details/${flow._id}`);
    };

    const {
      name,
      status,
      jobCount,
      flowValidation,
      product,
      latestBranch,
      latestDepartment,
      isSub,
    } = flow;

    return (
      <tr onClick={onTrClick}>
        <td onClick={onClick}>
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>
          {(isSub && renderLabelInfo('primary', 'SUB')) ||
            renderLabelInfo('success', 'Main')}
        </td>
        <td>{name}</td>
        <td>{(product && `${product.code} - ${product.name}`) || ''}</td>
        <td>
          {(latestBranch &&
            `${latestBranch.code || ''} - ${latestBranch.title || ''}`) ||
            ''}
        </td>
        <td>
          {(latestDepartment &&
            `${latestDepartment.code || ''} - ${
              latestDepartment.title || ''
            }`) ||
            ''}
        </td>
        <td>{status}</td>
        <td>
          {flowValidation === '' && renderLabelInfo('success', 'True')}
          {flowValidation && renderLabelInfo('danger', flowValidation)}
        </td>
        <td>{jobCount || 0}</td>
        <td onClick={onClick}>
          <ActionButtons>
            <Button btnStyle="link" onClick={onTrClick}>
              <Tip text={__('Upravit')} placement="bottom">
                <Icon icon="edit" />
              </Tip>
            </Button>
          </ActionButtons>
        </td>
      </tr>
    );
  }
}

export default Row;
