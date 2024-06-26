import {
  IIntegration,
  IntegrationMutationVariables,
} from '@saashq/ui-inbox/src/settings/integrations/types';

import { Count } from '@saashq/ui/src/styles/main';
import { EMPTY_CONTENT_MESSENGER } from '@saashq/ui-settings/src/constants';
import EmptyContent from '@saashq/ui/src/components/empty/EmptyContent';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import { INTEGRATION_KINDS } from '@saashq/ui/src/constants/integrations';
import IntegrationListItem from './IntegrationListItem';
import React from 'react';
import Table from '@saashq/ui/src/components/table';
import { __ } from '@saashq/ui/src/utils';

type Props = {
  integrations: IIntegration[];
  removeIntegration: (integration: IIntegration, callback?: any) => void;
  archive: (id: string, status: boolean) => void;
  repair: (id: string, kind: string) => void;
  kind?: string | null;
  editIntegration: (
    id: string,
    { name, brandId, channelIds }: IntegrationMutationVariables,
  ) => void;
  queryParams: any;
  disableAction?: boolean;
  integrationsCount: number;
};

type State = {
  showExternalInfo: boolean;
};

class IntegrationList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { showExternalInfo: false };
  }

  renderRows() {
    const {
      integrations,
      removeIntegration,
      archive,
      editIntegration,
      queryParams: { _id },
      disableAction,
      repair,
    } = this.props;

    const showExternalInfoColumn = () => {
      this.setState({ showExternalInfo: true });
    };

    return integrations.map((i) => (
      <IntegrationListItem
        key={i._id}
        _id={_id}
        integration={i}
        removeIntegration={removeIntegration}
        archive={archive}
        repair={repair}
        disableAction={disableAction}
        editIntegration={editIntegration}
        showExternalInfoColumn={showExternalInfoColumn}
        showExternalInfo={this.state.showExternalInfo}
      />
    ));
  }

  render() {
    const { integrations, kind, integrationsCount } = this.props;

    if (!integrations || integrations.length < 1) {
      if (kind === INTEGRATION_KINDS.MESSENGER) {
        return <EmptyContent content={EMPTY_CONTENT_MESSENGER} />;
      }

      return (
        <EmptyState
          text="Začněte přidávat integrace hned teď!"
          image="/images/actions/2.svg"
        />
      );
    }

    return (
      <>
        <Count>
          {integrationsCount} {kind} integrace{integrationsCount > 1 && 's'}
        </Count>
        <Table>
          <thead>
            <tr>
              <th>{__('Název')}</th>
              <th>{__('Druh')}</th>
              <th>{__('Značka')}</th>
              <th>{__('Postavení')}</th>
              <th>{__('Zdravotní stav')}</th>
              {this.state.showExternalInfo ? (
                <th>{__('Externí informace')}</th>
              ) : null}
              <th style={{ width: 130 }}>{__('Akce')}</th>
            </tr>
          </thead>
          <tbody>{this.renderRows()}</tbody>
        </Table>
      </>
    );
  }
}

export default IntegrationList;
