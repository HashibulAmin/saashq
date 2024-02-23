import React from 'react';
import Button from '@saashq/ui/src/components/Button';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import Tip from '@saashq/ui/src/components/Tip';
import Icon from '@saashq/ui/src/components/Icon';
import QuestionForm from '../../containers/quiz/QuestionForm';
import { IChoice } from '../../types';
import { __ } from '@saashq/ui/src/utils';
import { FlexItem } from '@saashq/ui/src/layout/styles';
import { MarginAuto, ChoiceList, ChoiseTitle } from '../../styles';

type Props = {
  index?: number;
  choice: IChoice;
  quizId: string;
  onDelete?: () => void;
};

const ChoiceDetail = ({ choice, index, onDelete, quizId }: Props) => {
  const renderQuestionForm = props => (
    <QuestionForm type="choice" choice={choice} {...props} quizId={quizId} />
  );

  return (
    <ChoiceList>
      <FlexItem>
        <ChoiseTitle isCorrect={choice.isCorrect}>
          {index != null && `${index + 1}. `}
          {choice.text}
        </ChoiseTitle>
      </FlexItem>
      <MarginAuto>
        <FlexItem count={1.05}>
          <ActionButtons>
            <ModalTrigger
              trigger={
                <Button btnStyle="link">
                  <Tip text={__('Edit')} placement="top">
                    <Icon icon="edit-3" />
                  </Tip>
                </Button>
              }
              content={renderQuestionForm}
              title="Edit Choice"
            />

            <Tip text={__('Delete')} placement="top">
              <Button
                id="choiceDelete"
                btnStyle="link"
                icon="times-circle"
                onClick={onDelete}
              />
            </Tip>
          </ActionButtons>
        </FlexItem>
      </MarginAuto>
    </ChoiceList>
  );
};

export default ChoiceDetail;
