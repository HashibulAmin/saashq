import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import { Alert, withProps } from 'modules/common/utils';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import Form from '../components/Form';
import { mutations } from '../graphql';

type Props = {
  contentType: string;
};

type State = {};

type FinalProps = {
  importHistoriesCreate: any;
} & Props;

class FormContainer extends React.Component<FinalProps, State> {
  render() {
    const { importHistoriesCreate } = this.props;

    const addImportHistory = (doc, columnAllSelected) => {
      const { contentTypes } = doc;

      if (!columnAllSelected) {
        Alert.error('Musíte vybrat všechny sloupce');
      }

      if (columnAllSelected) {
        importHistoriesCreate({
          variables: doc,
        }).then(() => {
          window.location.href = `/settings/importHistories?type=${contentTypes[0].contentType}`;
        });
      }
    };

    return (
      <Form
        contentType={this.props.contentType}
        addImportHistory={addImportHistory}
      />
    );
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(mutations.importHistoriesCreate), {
      name: 'importHistoriesCreate',
    }),
  )(FormContainer),
);
