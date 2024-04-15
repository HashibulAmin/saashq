import React from 'react';
// saashq
import FormGroup from '@saashq/ui/src/components/form/Group';
import FormLabel from '@saashq/ui/src/components/form/Label';
import SelectBranches from '@saashq/ui/src/team/containers/SelectBranches';
import SelectDepartment from '@saashq/ui/src/team/containers/SelectDepartments';
import { isEnabled } from '@saashq/ui/src/utils/core';
import BoardSelectContainer from '@saashq/ui-cards/src/boards/containers/BoardSelect';
import { FlexItem, LeftItem } from '@saashq/ui/src/components/step/styles';
import { __ } from '@saashq/ui/src/utils';
// local
import { Block } from '../../../styles';
import { PricingPlan } from '../../../types';

type Props = {
  formValues: PricingPlan;
  handleState: (key: string, value: any) => void;
};

export default function Options(props: Props) {
  const { formValues, handleState } = props;

  // Functions
  const renderProductForm = () => (
    <Block>
      <h4>{__('Location')}</h4>
      <FormGroup>
        <FormLabel>{__('Departments')}</FormLabel>
        <SelectDepartment
          name="departmentIds"
          label="Choose Departments"
          initialValue={formValues.departmentIds || []}
          onSelect={(departments) => handleState('departmentIds', departments)}
          multi={true}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>{__('Branches')}</FormLabel>
        <SelectBranches
          name="branchIds"
          label="Choose Branches"
          initialValue={formValues.branchIds || []}
          onSelect={(branches) => handleState('branchIds', branches)}
          multi={true}
        />
      </FormGroup>
    </Block>
  );

  const renderBoardForm = () => {
    if (isEnabled('cards'))
      return (
        <Block>
          <h4>{__('Etapa')}</h4>
          <BoardSelectContainer
            type="deal"
            autoSelectStage={false}
            boardId={formValues.boardId}
            pipelineId={formValues.pipelineId}
            stageId={formValues.stageId}
            onChangeBoard={(boardId) => handleState('boardId', boardId)}
            onChangePipeline={(pipelineId) =>
              handleState('pipelineId', pipelineId)
            }
            onChangeStage={(stageId) => handleState('stageId', stageId)}
          />
        </Block>
      );

    return;
  };

  return (
    <FlexItem>
      <LeftItem>
        {renderProductForm()}
        {renderBoardForm()}
      </LeftItem>
    </FlexItem>
  );
}
