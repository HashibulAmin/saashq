import { Alert } from "../../utils";
import EditForm from "../components/EditForm";
import { IShq } from "../../types";
import React from "react";
import gql from "graphql-tag";
import { mutations } from "../graphql";
import { useMutation } from "@apollo/client";

type Props = {
  shq: IShq;
};

function EditFormContainer(props: Props) {
  const [editMutation] = useMutation(gql(mutations.shqsEdit));

  const edit = (variables: IShq) => {
    editMutation({ variables })
      .then(() => {
        Alert.success("Successfully edited");
      })
      .catch((e) => {
        Alert.error(e.message);
      });
  };

  return <EditForm edit={edit} shq={props.shq} />;
}

export default EditFormContainer;
