import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import Button from '@saashq/ui/src/components/Button';
import FormControl from '@saashq/ui/src/components/form/Control';
import Icon from '@saashq/ui/src/components/Icon';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import Tip from '@saashq/ui/src/components/Tip';
import { __ } from '@saashq/ui/src/utils';
import React from 'react';
import { IQuiz } from '../../types';
import QuizForm from '../../containers/quiz/QuizForm';
import { PostTitle } from '../../styles';

type Props = {
  quiz: IQuiz;
  history: any;
  remove: (pageId: string, emptyBulk?: () => void) => void;
  isChecked?: boolean;
  toggleBulk: (target: any, toAdd: boolean) => void;
};

class Row extends React.Component<Props> {
  renderEditAction(quiz) {
    const trigger = (
      <Button btnStyle="link">
        <Tip text={__('Upravit')} placement="top">
          <Icon icon="edit-3" />
        </Tip>
      </Button>
    );

    const content = (props) => <QuizForm {...props} quiz={quiz} />;

    return (
      <ModalTrigger
        title={`Upravit kvíz`}
        size="lg"
        trigger={trigger}
        content={content}
      />
    );
  }

  renderRemoveAction() {
    const { quiz, remove } = this.props;

    const onClick = () => remove(quiz._id);

    return (
      <Tip text={__('Vymazat')} placement="top">
        <Button
          id="quizDelete"
          btnStyle="link"
          onClick={onClick}
          icon="times-circle"
        />
      </Tip>
    );
  }

  render() {
    const { quiz, isChecked, toggleBulk } = this.props;

    const onChange = (e) => {
      if (toggleBulk) {
        toggleBulk(quiz, e.target.checked);
      }
    };

    const onClick = (e) => {
      e.stopPropagation();
    };

    return (
      <tr>
        <td id="quizCheckBox" onClick={onClick}>
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>{quiz.name}</td>
        <td>{quiz.description}</td>
        <td>
          {quiz.company && quiz.company.primaryName
            ? quiz.company.primaryName
            : ''}
        </td>
        <td>{quiz.state}</td>
        <td>{quiz.category ? quiz.category.name : ''}</td>
        <td>
          <ActionButtons>
            {this.renderEditAction(quiz)}
            {this.renderRemoveAction()}
          </ActionButtons>
        </td>
      </tr>
    );
  }
}

export default Row;
