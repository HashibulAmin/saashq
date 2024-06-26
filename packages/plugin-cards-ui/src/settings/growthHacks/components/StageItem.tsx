import Button from '@saashq/ui/src/components/Button';
import FormControl from '@saashq/ui/src/components/form/Control';
import { IStage } from '@saashq/ui-cards/src/boards/types';
import Icon from '@saashq/ui/src/components/Icon';
import React from 'react';
import { StageItemContainer } from '@saashq/ui-cards/src/settings/boards/styles';
import Tip from '@saashq/ui/src/components/Tip';
import { __ } from 'coreui/utils';
import { colors } from '@saashq/ui/src/styles';

type Props = {
  stage: IStage;
  remove: (stageId: string) => void;
  onChange: (stageId: string, name: string, value: string) => void;
  onClick: (stage: IStage) => void;
  onKeyPress: (e: any) => void;
};

class StageItem extends React.Component<Props, {}> {
  render() {
    const { stage, onChange, onKeyPress, remove, onClick } = this.props;

    const onChangeName = (stageId, e) =>
      onChange(stageId, e.target.name, e.target.value);

    const onBuildClick = (e) => {
      onClick(stage);
    };

    return (
      <StageItemContainer key={stage._id}>
        <FormControl
          defaultValue={stage.name}
          type="text"
          placeholder={__('Stage name')}
          onKeyPress={onKeyPress}
          autoFocus={true}
          name="name"
          onChange={onChangeName.bind(this, stage._id)}
        />
        <Tip text="Vytvořte formulář">
          <Button btnStyle="link" onClick={onBuildClick}>
            <Icon
              icon={stage.formId ? 'file-edit-alt' : 'file-plus-alt'}
              color={
                stage.formId ? colors.colorSecondary : colors.colorCoreGreen
              }
            />
          </Button>
        </Tip>

        <Button
          btnStyle="link"
          onClick={remove.bind(this, stage._id)}
          icon="times"
        />
      </StageItemContainer>
    );
  }
}

export default StageItem;
