import React from 'react';

import { gql, useQuery, useMutation } from '@apollo/client';

import ButtonMutate from '@saashq/ui/src/components/ButtonMutate';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils/index';
import { router } from '@saashq/ui/src/utils';

import Form from '../../components/goal/Form';
import { queries, mutations } from '../../graphql';

type Props = {
  queryParams: any;
  history: any;

  goalId?: string;

  closeDrawer: () => void;
  getAssociatedGoalType?: (insuranceTypeId: string) => void;
};

const FormContainer = (props: Props) => {
  const { goalId, history, closeDrawer, getAssociatedGoalType } = props;

  const goalQuery = useQuery(gql(queries.goalTypesDetail), {
    skip: !goalId,
    variables: {
      id: goalId,
    },
  });

  const branchListQuery = useQuery(gql(queries.branchesMain), {
    variables: { withoutUserFilter: true },
  });
  const unitListQuery = useQuery(gql(queries.unitsMain), {
    variables: { withoutUserFilter: true },
  });
  const departmentListQuery = useQuery(gql(queries.departmentsMain), {
    variables: { withoutUserFilter: true },
  });

  const renderButton = ({
    name,
    values,
    isSubmitted,
    object,
  }: IButtonMutateProps) => {
    const afterSave = (data, actionType) => {
      closeDrawer();
      const goalId = data[actionType]._id;

      if (goalId) {
        history.push(`/insight?goalId=${goalId}`);
      }

      if (getAssociatedGoalType) {
        getAssociatedGoalType(data[actionType]);
      }
    };

    const mutation = object ? mutations.goalTypesEdit : mutations.goalTypesAdd;
    const actionType = object ? 'goalsEdit' : 'goalsAdd';
    const successMessage = `You successfully ${
      object ? 'updated' : 'added'
    } a ${name}`;

    return (
      <ButtonMutate
        mutation={mutation}
        variables={values}
        callback={(data) => afterSave(data, actionType)}
        refetchQueries={[
          {
            query: gql(queries.goalTypesMain),
          },
          {
            query: gql(queries.goalTypesDetail),
            skip: !props.goalId,
            variables: {
              id: props.goalId,
            },
          },
        ]}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={successMessage}
      >
        {__('Uložit')}
      </ButtonMutate>
    );
  };

  const goal = goalQuery?.data?.goalDetail;
  const loading = goalQuery.loading;

  const updatedProps = {
    ...props,
    goal,
    loading,
    renderButton,
  };

  return <Form {...updatedProps} />;
};

export default FormContainer;
