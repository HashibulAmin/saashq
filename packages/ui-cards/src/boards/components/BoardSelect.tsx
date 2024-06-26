import React from 'react';
import Select from 'react-select-plus';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { IBoard, IPipeline, IStage } from '../types';
import { selectOptions } from '../utils';
import { FormContainer } from '../styles/common';

type Props = {
  boards: IBoard[];
  pipelines: IPipeline[];
  stages: IStage[];
  boardId?: string;
  pipelineId?: string;
  stageId?: string;
  onChangeBoard: (value: string) => void;
  onChangePipeline: (value: string) => void;
  onChangeStage: (value: string, callback?: () => void) => void;
  callback?: () => void;
  translator?: (key: string, options?: any) => string;
};

class BoardSelect extends React.Component<Props> {
  renderOptions = (option) => {
    return (
      <div className="simple-option">
        <span>{option.label}</span>
      </div>
    );
  };

  renderSelect(placeholder, value, onChange, options) {
    return (
      <Select
        isRequired={true}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        optionRenderer={this.renderOptions}
        options={options}
        clearable={false}
      />
    );
  }

  renderContent() {
    const {
      boards,
      pipelines,
      stages,
      boardId,
      pipelineId,
      stageId,
      onChangeBoard,
      onChangePipeline,
      onChangeStage,
      callback,
    } = this.props;

    const __ = (key: string, options?: any) => {
      const { translator } = this.props;
      if (!translator) {
        return key;
      }
      return translator(key, options);
    };

    return (
      <>
        <FormGroup>
          <ControlLabel>Deska</ControlLabel>
          {this.renderSelect(
            __('Vyberte desku'),
            boardId,
            (board) => onChangeBoard(board.value),
            selectOptions(boards),
          )}
        </FormGroup>

        <FormGroup>
          <ControlLabel>Potrubí</ControlLabel>
          {this.renderSelect(
            __('Vyberte potrubí'),
            pipelineId,
            (pipeline) => onChangePipeline(pipeline.value),
            selectOptions(pipelines),
          )}
        </FormGroup>

        <FormGroup>
          <ControlLabel>Etapa</ControlLabel>
          {this.renderSelect(
            __('Vyberte fázi'),
            stageId,
            (stage) => onChangeStage(stage.value, callback),
            selectOptions(stages),
          )}
        </FormGroup>
      </>
    );
  }

  render() {
    return <>{this.renderContent()}</>;
  }
}

export default BoardSelect;
