import EmptyState from '@saashq/ui/src/components/EmptyState';
import Label from '@saashq/ui/src/components/Label';
import { __ } from 'coreui/utils';
import dayjs from 'dayjs';
import React from 'react';
import { IAutomationHistory, IAutomationHistoryAction } from '../../types';
import { renderDynamicComponent } from '../../utils';
import SendEmail from './components/SendEmail';

type Props = {
  history: IAutomationHistory;
  actionsByType: any;
  triggersByType: any;
};

type State = {
  isShowDetail: boolean;
};

class HistoryRow extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isShowDetail: false,
    };
  }

  generateName = () => {
    const { triggerType, target } = this.props.history;

    const Component = renderDynamicComponent(
      {
        target,
        triggerType,
        componentType: 'historyName',
      },
      triggerType,
    );

    if (Component) {
      return Component;
    }

    return '';
  };

  generateActionResult = (action: IAutomationHistoryAction) => {
    if (!action.result) {
      return 'Výsledek zatím nebyl zaznamenán';
    }

    const { result } = action;

    if (result.error) {
      return result.error;
    }

    if (action.actionType === 'setProperty') {
      return `Aktualizace pro ${(result.result || []).length} ${
        result.module
      }: ${result.fields || ''}, (${result.result.map(
        (r) => (r.error && r.error) || '',
      )})`;
    }

    if (action.actionType === 'if') {
      return `Stav: ${result.condition}`;
    }

    if (action.actionType === 'sendEmail') {
      return <SendEmail result={result} action={action} />;
    }

    const Component = renderDynamicComponent(
      {
        action,
        result: action.result,
        componentType: 'historyActionResult',
      },
      action.actionType,
    );

    if (Component) {
      return Component;
    }

    return JSON.stringify(result);
  };

  renderDetail = () => {
    const { isShowDetail } = this.state;

    if (!isShowDetail) {
      return null;
    }

    const { history, actionsByType } = this.props;
    const { actions = [] } = history;

    if (!actions || actions.length === 0) {
      return (
        <tr key={Math.random()}>
          <td colSpan={5}>
            <EmptyState icon="book" text="Položka ještě nebyla vytvořena" />
          </td>
        </tr>
      );
    }

    return (
      <>
        <tr key={Math.random()} style={{ backgroundColor: '#ececec' }}>
          <td>{}</td>
          <td>{__('Dílčí čas')}</td>
          <td>{__('Typ Akce')}</td>
          <td colSpan={2}>{__('Výsledek')}</td>
        </tr>

        {actions.map((action) => (
          <tr key={action.actionId}>
            <td>{}</td>
            <td>{dayjs(action.createdAt).format('lll')}</td>
            <td>{__(actionsByType[action.actionType])}</td>
            <td colSpan={2}>{this.generateActionResult(action)}</td>
          </tr>
        ))}
      </>
    );
  };

  render() {
    const { triggersByType, history } = this.props;
    const { _id, createdAt, triggerType, status, description } = history;

    const trClick = () => {
      const { isShowDetail } = this.state;
      this.setState({ isShowDetail: !isShowDetail });
    };

    const isActive = status === 'active' ? true : false;
    const labelStyle = isActive ? 'success' : 'warning';

    return (
      <>
        <tr id={_id} key={_id} onClick={trClick}>
          <td>{this.generateName()}</td>
          <td>{description}</td>
          <td>{triggersByType[triggerType]}</td>
          <td>
            <Label lblStyle={labelStyle}>{status}</Label>
          </td>
          <td>{dayjs(createdAt).format('lll')}</td>
        </tr>
        {this.renderDetail()}
      </>
    );
  }
}

export default HistoryRow;
