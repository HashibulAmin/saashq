import React from 'react';
import { Tabs, TabTitle } from '@saashq/ui/src/components/tabs';
import { __, confirm } from 'coreui/utils';
import {
  TypeBox,
  Description,
  TriggerTabs,
  TypeBoxContainer,
} from '../../../styles';
import { ScrolledContent } from '@saashq/ui-automations/src/styles';
import { ITrigger } from '../../../types';
import { gql } from '@apollo/client';
import { mutations, queries } from '../../../graphql';
import Icon from '@saashq/ui/src/components/Icon';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import client from '@saashq/ui/src/apolloClient';

type Props = {
  onClickTrigger: (trigger: ITrigger) => void;
  templates: any[];
  triggersConst: ITrigger[];
};

type State = {
  currentTab: string;
  currentType: string;
};

class TriggerForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'new',
      currentType: 'customer',
    };
  }

  tabOnClick = (currentTab: string) => {
    this.setState({ currentTab });
  };

  onClickType = (trigger: ITrigger) => {
    const { onClickTrigger } = this.props;

    this.setState({ currentType: trigger.type }, () => {
      onClickTrigger(trigger);
    });
  };

  onClickTemplate = (template: any) => {
    client
      .mutate({
        mutation: gql(mutations.automationsCreateFromTemplate),
        variables: {
          _id: template._id,
        },
      })
      .then(({ data }) => {
        window.location.href = `/automations/details/${data.automationsCreateFromTemplate._id}`;
      });
  };

  onRemoveTemplate = (templateId: string) => {
    confirm().then(() => {
      client.mutate({
        mutation: gql(mutations.automationsRemove),
        variables: {
          automationIds: [templateId],
        },
        refetchQueries: [
          {
            query: gql(queries.automations),
            variables: {
              status: 'template',
            },
          },
        ],
      });
    });
  };

  renderTriggerItem(trigger: any, index: number) {
    return (
      <TypeBox key={index} onClick={this.onClickType.bind(this, trigger)}>
        <img src={`/images/actions/${trigger.img}`} alt={trigger.label} />
        <FormGroup>
          <ControlLabel>
            {__(trigger.label)} {__('na základě')}
          </ControlLabel>
          <p>{__(trigger.description)}</p>
        </FormGroup>
      </TypeBox>
    );
  }

  renderTemplateItem(template: any, index: number) {
    return (
      <TypeBoxContainer key={index}>
        <TypeBox onClick={this.onClickTemplate.bind(this, template)}>
          <FormGroup>
            <ControlLabel>{__(template.name)}</ControlLabel>
          </FormGroup>
        </TypeBox>
        <div className="ctrl">
          <Icon
            icon="trash"
            color="#EA475D"
            size={16}
            onClick={this.onRemoveTemplate.bind(this, template._id)}
          />
        </div>
      </TypeBoxContainer>
    );
  }

  renderTabContent() {
    if (this.state.currentTab === 'library') {
      return this.props.templates.map((t, index) =>
        this.renderTemplateItem(t, index),
      );
    }

    const { triggersConst } = this.props;

    return triggersConst.map((trigger, index) =>
      this.renderTriggerItem(trigger, index),
    );
  }

  render() {
    const { currentTab } = this.state;

    return (
      <>
        <Description>
          <h4>{__('Vyberte typ spouštění')}</h4>
          <p>
            {__('Začněte s typem automatizace, který se zaregistruje a spustí')}
          </p>
        </Description>
        <TriggerTabs>
          <Tabs full={true}>
            <TabTitle
              className={currentTab === 'new' ? 'active' : ''}
              onClick={this.tabOnClick.bind(this, 'new')}
            >
              {__('Začít od začátku')}
            </TabTitle>
            <TabTitle
              className={currentTab === 'library' ? 'active' : ''}
              onClick={this.tabOnClick.bind(this, 'library')}
            >
              {__('Knihovna')}
            </TabTitle>
          </Tabs>
        </TriggerTabs>
        <ScrolledContent>{this.renderTabContent()}</ScrolledContent>
      </>
    );
  }
}

export default TriggerForm;
