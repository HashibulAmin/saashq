import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import Button from '@saashq/ui/src/components/Button';
import Icon from '@saashq/ui/src/components/Icon';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import Tip from '@saashq/ui/src/components/Tip';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils';
import React from 'react';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import Form from './UomsForm';
import { IUom } from '../../types';

export const TagWrapper = styledTS<{ space: number }>(styled.div)`
  padding-left: ${(props) => props.space * 20}px;
`;

type Props = {
  uom: IUom;
  remove: (brandId: string) => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

type State = {
  showMerge: boolean;
  mergeDestination?: { value: string; label: string };
};
class Row extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { showMerge: false };
  }

  onChangeDestination = (option) => {
    this.setState({ mergeDestination: option });
  };

  renderEditAction = (uom) => {
    const { renderButton } = this.props;

    const editTrigger = (
      <Button btnStyle="link">
        <Tip text={__('Upravit')} placement="bottom">
          <Icon icon="edit-3" />
        </Tip>
      </Button>
    );

    const content = (props) => (
      <Form {...props} uom={uom} extended={true} renderButton={renderButton} />
    );

    return (
      <ModalTrigger
        size="lg"
        title="Edit"
        trigger={editTrigger}
        content={content}
      />
    );
  };

  remove = (uom) => {
    const { remove } = this.props;

    remove(uom);
  };

  render() {
    const { uom } = this.props;

    return (
      <tr>
        <td>{uom.code || ''}</td>
        <td>{uom.name || ''}</td>
        <td>
          <ActionButtons>
            {this.renderEditAction(uom)}
            <Tip text={__('Vymazat')} placement="bottom">
              <Button
                btnStyle="link"
                onClick={() => this.remove(uom)}
                icon="times-circle"
              />
            </Tip>
          </ActionButtons>
        </td>
      </tr>
    );
  }
}

export default Row;
