import colors from '@saashq/ui/src/styles/colors';
import Icon from '@saashq/ui/src/components/Icon';
import FormControl from '@saashq/ui/src/components/form/Control';
import React, { useRef } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { PopoverContent } from '@saashq/ui/src/components/filterableList/styles';
import { Padding } from '../../styles';
type Props = {
  onChange: (e) => void;
  link?: string;
  name?: string;
  container: any;
};

function LinkAction({ onChange, link, name, container }: Props) {
  return (
    <OverlayTrigger
      trigger="click"
      placement="top"
      overlay={
        <Popover id="link-popover">
          <PopoverContent>
            <Padding>
              <FormControl
                name={name}
                onChange={onChange}
                value={link || ''}
                placeholder="type or paste link"
              />
            </Padding>
          </PopoverContent>
        </Popover>
      }
      rootClose={true}
      container={container}
    >
      <span>
        <Icon icon="link" color={link ? colors.colorCoreBlue : ''} />
      </span>
    </OverlayTrigger>
  );
}

export default LinkAction;
