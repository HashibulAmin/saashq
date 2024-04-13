import { IUser } from 'modules/auth/types';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import WithPermission from '@saashq/ui/src/components/WithPermission';
import { FullContent, MiddleContent } from '@saashq/ui/src/styles/main';
import { __ } from '@saashq/ui/src/utils';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import React from 'react';
import OrganizationProfile from '../containers/OrganizationProfile';
import PromoCodeForm from '../containers/PromoCodeForm';
import { IOrganization } from '../types';
import Overview from './Overview';
import { StatusBox, StatusTitle, CenterFlexRow } from '../styles';
import Button from '@saashq/ui/src/components/Button';

type Props = {
  currentUser: IUser;
  currentOrganization: IOrganization;
  usersTotalCount: number;
};

class Plans extends React.Component<Props> {
  renderHeader() {
    const breadcrumb = [
      { title: __('Nastavení'), link: '/settings' },
      { title: __('Organization settings') },
    ];

    return (
      <Wrapper.Header
        breadcrumb={breadcrumb}
        title={__('Organization settings')}
      />
    );
  }

  renderDPA() {
    return (
      <StatusBox largePadding={true}>
        <StatusTitle>{__('Data Processing Agreement')}</StatusTitle>
        <CenterFlexRow>
          <p>
            Kliknutím na tlačítko <i>Stáhnout</i> zobrazíte a stáhnete DPA jako
            pdf
          </p>
          <Button btnStyle="primary" icon="download-1" href="/dpa">
            Stažení
          </Button>
        </CenterFlexRow>
      </StatusBox>
    );
  }

  render() {
    const { currentOrganization, currentUser, usersTotalCount } = this.props;

    const fallbackComponent = (
      <EmptyState text="Přístup odepřen" image="/images/actions/21.svg" />
    );

    const content = (
      <WithPermission
        action="editOrganizationInfo"
        fallbackComponent={fallbackComponent}
      >
        <FullContent center={true}>
          <MiddleContent transparent={true}>
            <OrganizationProfile currentOrganization={currentOrganization} />
            <PromoCodeForm />
            <Overview
              currentUser={currentUser}
              currentOrganization={currentOrganization}
              usersTotalCount={usersTotalCount}
            />
            {this.renderDPA()}
          </MiddleContent>
        </FullContent>
      </WithPermission>
    );

    return (
      <Wrapper
        header={this.renderHeader()}
        content={content}
        transparent={true}
      />
    );
  }
}

export default Plans;
