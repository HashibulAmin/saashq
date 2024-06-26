import { ColorButton } from '../../boards/styles/common';
import Icon from '@saashq/ui/src/components/Icon';
import { __ } from '@saashq/ui/src/utils';
import * as React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import AddForm from '../containers/AddForm';
import { Wrapper } from '@saashq/ui/src/styles/main';

type Props = {
  itemId: string;
  type: string;
};

class ChecklistAdd extends React.Component<Props> {
  private overlayTrigger;

  hidePopover = () => {
    this.overlayTrigger.hide();
  };

  renderForm() {
    return (
      <Popover id="checklist-popover">
        <Popover.Title as="h3">Přidat kontrolní seznam</Popover.Title>
        <Popover.Content>
          <Wrapper>
            <AddForm {...this.props} afterSave={this.hidePopover} />
          </Wrapper>
        </Popover.Content>
      </Popover>
    );
  }

  render() {
    return (
      <OverlayTrigger
        ref={(overlayTrigger) => {
          this.overlayTrigger = overlayTrigger;
        }}
        trigger="click"
        placement="bottom"
        overlay={this.renderForm()}
        rootClose={true}
      >
        <ColorButton>
          <Icon icon="check-square" />
          {__('Kontrolní seznam')}
        </ColorButton>
      </OverlayTrigger>
    );
  }
}

export default ChecklistAdd;
