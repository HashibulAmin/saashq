import {
  ActivityDate,
  FlexBody,
  FlexCenterContent,
} from '@saashq/ui-log/src/activityLogs/styles';

import { IActivityLogItemProps } from '@saashq/ui-log/src/activityLogs/types';
import React from 'react';
import Tip from '@saashq/ui/src/components/Tip';
import dayjs from 'dayjs';
import { renderUserFullName } from '@saashq/ui/src/utils';

class CustomerCreateLog extends React.Component<IActivityLogItemProps> {
  renderContent = () => {
    const { activity } = this.props;
    const { createdByDetail } = activity;

    if (createdByDetail && createdByDetail.type === 'user') {
      const { content } = createdByDetail;

      let userName = 'Unknown';

      if (content && content.details) {
        userName = renderUserFullName(createdByDetail.content || '');
      }

      return (
        <span>
          <strong>{userName}</strong> vytvořené&nbsp; tohoto zákazníka
        </span>
      );
    }

    if (createdByDetail && createdByDetail.type === 'brand') {
      const { content } = createdByDetail;

      return (
        <span>
          Tento zákazník se zaregistroval do SaasHQ od
          {content ? ` ${content.name}'s integrations` : ''}
        </span>
      );
    }

    if (createdByDetail && createdByDetail.type === 'clientPortal') {
      const { content } = createdByDetail;

      return (
        <span>
          Tento zákazník se zaregistroval do SaasHQ od
          {content ? ` ${content.name} klientský portál` : ''}
        </span>
      );
    }

    return (
      <span>
        Tento zákazník se <b>zaregistroval</b> do SaasHQ
      </span>
    );
  };

  render() {
    const { activity } = this.props;
    const { createdAt } = activity;

    return (
      <FlexCenterContent>
        <FlexBody>{this.renderContent()}</FlexBody>
        <Tip text={dayjs(createdAt).format('llll')}>
          <ActivityDate>
            {dayjs(createdAt).format('MMM D, h:mm A')}
          </ActivityDate>
        </Tip>
      </FlexCenterContent>
    );
  }
}

export default CustomerCreateLog;
