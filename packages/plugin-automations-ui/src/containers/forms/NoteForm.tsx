import React from 'react';
import * as compose from 'lodash.flowright';
import { mutations, queries } from '../../graphql';
import { graphql } from '@apollo/client/react/hoc';
import { gql } from '@apollo/client';
import NoteForm from '../../components/forms/NoteForm';
import { IFormProps, MutationVariables } from '@saashq/ui/src/types';
import { withProps, Alert, confirm } from '@saashq/ui/src/utils';
import {
  AddNoteMutationResponse,
  IAutomationNote,
  RemoveNoteMutationResponse,
  EditNoteMutationResponse,
  IAutomationNoteDoc,
} from '../../types';

type Props = {
  formProps: IFormProps;
  automationId: string;
  itemId: string;
  isEdit?: boolean;
  notes?: IAutomationNote[];
  closeModal: () => void;
};

type FinalProps = {} & Props &
  AddNoteMutationResponse &
  EditNoteMutationResponse &
  RemoveNoteMutationResponse;

const NoteFormContainer = (props: FinalProps) => {
  const { automationsRemoveNote, automationsEditNote, automationsAddNote } =
    props;

  const remove = (_id: string) => {
    confirm('Jsi si jistá? To nelze vrátit zpět.').then(() => {
      automationsRemoveNote({
        variables: { _id },
      })
        .then(() => {
          Alert.success('Úspěšně jste smazali poznámku.');
        })
        .catch((error) => {
          Alert.error(error.message);
        });
    });
  };

  const save = (variables) => {
    automationsAddNote({
      variables,
    })
      .then(() => {
        Alert.success(`Úspěšně jste vytvořili poznámku`);

        props.closeModal();
      })

      .catch((error) => {
        Alert.error(error.message);
      });
  };

  const edit = (variables) => {
    automationsEditNote({
      variables,
    })
      .then(() => {
        Alert.success(
          `Úspěšně jste aktualizovali a ${variables.name || 'poznámka'}`,
        );
        props.closeModal();
      })

      .catch((error) => {
        Alert.error(error.message);
      });
  };

  const extendedProps = {
    ...props,
    save,
    edit,
    remove,
  };

  return <NoteForm {...extendedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, RemoveNoteMutationResponse, MutationVariables>(
      gql(mutations.automationsRemoveNote),
      {
        name: 'automationsRemoveNote',
        options: {
          refetchQueries: ['automationNotes'],
        },
      },
    ),
    graphql<Props, AddNoteMutationResponse, IAutomationNoteDoc>(
      gql(mutations.automationsAddNote),
      {
        name: 'automationsAddNote',
        options: ({ automationId }) => ({
          refetchQueries: [
            {
              query: gql(queries.automationNotes),
              variables: {
                automationId,
              },
            },
          ],
        }),
      },
    ),
    graphql<Props, EditNoteMutationResponse, IAutomationNoteDoc>(
      gql(mutations.automationsEditNote),
      {
        name: 'automationsEditNote',
        options: () => ({
          refetchQueries: ['automationNotes'],
        }),
      },
    ),
  )(NoteFormContainer),
);
