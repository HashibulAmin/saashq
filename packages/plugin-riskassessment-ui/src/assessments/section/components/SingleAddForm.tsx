import {
  ControlLabel,
  FormGroup,
  SelectTeamMembers,
  Toggle,
  __,
} from '@saashq/ui/src';
import SelectBranches from '@saashq/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@saashq/ui/src/team/containers/SelectDepartments';
import React from 'react';
import { SelectOperations } from '../../../common/utils';
import { FormContainer } from '../../../styles';
import { RiskAssessmentTypes } from '../../common/types';
import BulkAddForm from '../containers/BulkAddForm';
import Chooser from './Chooser';

type Props = {
  riskAssessment: RiskAssessmentTypes;
  cardId: string;
  cardType: string;
  closeModal: () => void;
  handleSelect: (doc: any) => void;
};
type State = {
  page: number;
  perPage: number;
  branchId: string;
  departmentId: string;
  operationId: string;
  useBulkCreate: boolean;
  usePrivateRA: boolean;
  permittedUserIds: string[];
};

class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const { riskAssessment } = props;

    this.state = {
      perPage: 10,
      page: 1,
      branchId: riskAssessment?.branchId || '',
      departmentId: riskAssessment?.departmentId || '',
      operationId: riskAssessment?.operationId || '',
      permittedUserIds: riskAssessment?.permittedUserIds || [],
      useBulkCreate: false,
      usePrivateRA: riskAssessment?.permittedUserIds?.length || false,
    };
  }

  renderFilter = () => {
    const { departmentId, branchId, operationId } = this.state;
    const handleSelect = (value, name) => {
      this.setState({ [name]: value } as Pick<State, keyof State>);
    };

    return (
      <>
        <FormContainer row gap flex>
          <FormGroup>
            <ControlLabel>{__('Větev')}</ControlLabel>
            <SelectBranches
              name={'branchId'}
              label={`Select Branch`}
              initialValue={branchId}
              onSelect={handleSelect}
              multi={false}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>{__('Oddělení')}</ControlLabel>
            <SelectDepartments
              name={'departmentId'}
              label={`Select Department`}
              initialValue={departmentId}
              onSelect={handleSelect}
              multi={false}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>{__('Operation')}</ControlLabel>
            <SelectOperations
              name={'operationId'}
              label={`Select Operation`}
              initialValue={operationId}
              multi={false}
              onSelect={handleSelect}
            />
          </FormGroup>
        </FormContainer>
      </>
    );
  };

  renderSingleAssessment() {
    const { riskAssessment, cardId, cardType, closeModal } = this.props;
    const { branchId, departmentId, operationId, permittedUserIds } =
      this.state;

    const handleSelect = (props) => {
      this.props.handleSelect({
        ...props,
        branchId,
        departmentId,
        operationId,
        permittedUserIds: !!permittedUserIds?.length
          ? permittedUserIds
          : undefined,
      });
    };

    const updatedProps = {
      cardId,
      cardType,
      detail: riskAssessment,
      closeModal,
      refetchQueries: () => [],
      handleSelect,
      filters: { branchId, departmentId, operationId },
    };

    return (
      <>
        {this.renderFilter()}
        <Chooser {...updatedProps} />
      </>
    );
  }

  renderBulkAssessment() {
    const { cardId, cardType, closeModal } = this.props;

    const updatedProps = {
      closeModal,
      cardId,
      cardType,
    };
    return <BulkAddForm {...updatedProps} />;
  }

  render() {
    const { useBulkCreate, usePrivateRA, permittedUserIds } = this.state;

    const toggleOneByOne = () => {
      if (!useBulkCreate) {
        this.setState({
          branchId: '',
          departmentId: '',
          operationId: '',
        });
      }

      this.setState({ useBulkCreate: !useBulkCreate });
    };

    const handleSelectUsers = (ids) => {
      this.setState({ permittedUserIds: ids });
    };

    return (
      <FormContainer column gap>
        <FormContainer row gap align="center">
          <Toggle onChange={toggleOneByOne} checked={useBulkCreate} />
          <ControlLabel>
            {__('generate one-by-one assessment with selected structures')}
          </ControlLabel>
          <Toggle
            onChange={() => this.setState({ usePrivateRA: !usePrivateRA })}
            checked={usePrivateRA}
          />
          <ControlLabel>{__('Use private risk assessment')}</ControlLabel>
        </FormContainer>

        {usePrivateRA && (
          <SelectTeamMembers
            name="permittedUserIds"
            label="Choose team members"
            initialValue={permittedUserIds}
            onSelect={handleSelectUsers}
            multi={true}
          />
        )}
        {useBulkCreate
          ? this.renderBulkAssessment()
          : this.renderSingleAssessment()}
      </FormContainer>
    );
  }
}

export default Form;
