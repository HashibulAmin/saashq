import { MainStyleTitle as Title } from '@saashq/ui/src/styles/eindex';
import { __ } from '@saashq/ui/src/utils';
import { Button } from '@saashq/ui/src/components';
import { Wrapper } from '@saashq/ui/src/layout';
import React from 'react';

import { ContentBox } from '../styles';
import { IConfigsMap } from '../types';
import Header from './Header';
import PerSettings from './GeneralPerSettings';
import Sidebar from './Sidebar';

type Props = {
  save: (configsMap: IConfigsMap) => void;
  configsMap: IConfigsMap;
};

type State = {
  configsMap: IConfigsMap;
};

class GeneralSettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      configsMap: props.configsMap,
    };
  }

  add = (e) => {
    e.preventDefault();
    const { configsMap } = this.state;

    if (!configsMap.erkhetConfig) {
      configsMap.erkhetConfig = {};
    }

    // must save prev item saved then new item
    configsMap.erkhetConfig.newBrandId = {
      title: 'New Erkhet Config',
      brandId: '',
      apiKey: '',
      apiSecret: '',
      apiToken: '',
      costAccount: '',
      saleAccount: '',
      productCategoryCode: '',
      consumeDescription: '',
      customerDefaultName: '',
      customerCategoryCode: '',
      companyCategoryCode: '',
      debtAccounts: '',
      userEmail: '',
      defaultCustomer: '',
    };

    this.setState({ configsMap });
  };

  delete = (currentConfigKey: string) => {
    const { configsMap } = this.state;
    delete configsMap.erkhetConfig[currentConfigKey];
    delete configsMap.erkhetConfig['newBrandId'];

    this.setState({ configsMap });

    this.props.save(configsMap);
  };

  renderConfigs(configs) {
    return Object.keys(configs).map((key) => {
      return (
        <PerSettings
          key={key}
          configsMap={this.state.configsMap}
          config={configs[key]}
          currentConfigKey={key}
          save={this.props.save}
          delete={this.delete}
        />
      );
    });
  }

  renderContent() {
    const { configsMap } = this.state;
    const configs = configsMap.erkhetConfig || {};

    return (
      <ContentBox id={'GeneralSettingsMenu'}>
        {this.renderConfigs(configs)}
      </ContentBox>
    );
  }

  render() {
    const breadcrumb = [
      { title: __('Nastavení'), link: '/settings' },
      { title: __('Erkhet config') },
    ];

    const actionButtons = (
      <Button
        btnStyle="primary"
        onClick={this.add}
        icon="plus"
        uppercase={false}
      >
        New config
      </Button>
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header title={__('Erkhet config')} breadcrumb={breadcrumb} />
        }
        mainHead={<Header />}
        actionBar={
          <Wrapper.ActionBar
            left={<Title>{__('Erkhet configs')}</Title>}
            right={actionButtons}
          />
        }
        leftSidebar={<Sidebar />}
        content={this.renderContent()}
        hasBorder={true}
        transparent={true}
      />
    );
  }
}

export default GeneralSettings;
