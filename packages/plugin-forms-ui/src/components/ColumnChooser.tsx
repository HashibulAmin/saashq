import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import { __ } from '@saashq/ui/src/utils';
import asyncComponent from '@saashq/ui/src/components/AsyncComponent';
import { isEnabled } from '@saashq/ui/src/utils/core';

const ManageColumns = asyncComponent(() =>
  import(
    /* webpackChunkName: "ManageColumns" */ '@saashq/ui-forms/src/settings/properties/containers/ManageColumns'
  )
);

type Props = {
  contentType: string;
};

class ColumnChooser extends React.Component<Props> {
  render() {
    if (!isEnabled('forms')) {
      return null;
    }

    const manageColumns = props => {
      return (
        <ManageColumns
          {...props}
          contentType={this.props.contentType}
          type={'import'}
          isImport={true}
        />
      );
    };

    const editColumns = <span>{__(`Download template`)}</span>;

    return (
      <ModalTrigger
        title="Select Columns"
        trigger={editColumns}
        content={manageColumns}
        autoOpenKey="showManageColumnsModal"
      />
    );
  }
}

export default ColumnChooser;
