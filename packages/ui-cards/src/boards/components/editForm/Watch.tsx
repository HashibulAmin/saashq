import { ColorButton } from '../../styles/common';
import { IItem } from '../../types';
import Icon from '@saashq/ui/src/components/Icon';
import { __ } from '@saashq/ui/src/utils';
import * as React from 'react';
import { RightButton, WatchIndicator } from '../../styles/item';

type IProps = {
  item: IItem;
  onChangeWatch: (isAdd: boolean) => void;
  isSmall?: boolean;
};

class Watch extends React.Component<IProps> {
  render() {
    const {
      onChangeWatch,
      item: { isWatched },
      isSmall,
    } = this.props;

    const onClick = () => onChangeWatch(!isWatched);

    if (isSmall) {
      return (
        <ColorButton onClick={onClick}>
          <Icon icon={isWatched ? 'eye' : 'eye-slash'} />
          {__('Hodinky')}
        </ColorButton>
      );
    }

    return (
      <RightButton icon="eye" onClick={onClick}>
        {__('Hodinky')}
        {isWatched && (
          <WatchIndicator>
            <Icon icon="check-1" />
          </WatchIndicator>
        )}
      </RightButton>
    );
  }
}

export default Watch;
