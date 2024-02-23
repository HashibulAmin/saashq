import {
  ActivityDate,
  FlexBody,
  FlexCenterContent
} from '@saashq/ui-log/src/activityLogs/styles';

import { IActivityLogItemProps } from '@saashq/ui-log/src/activityLogs/types';
import React from 'react';
import Tip from '@saashq/ui/src/components/Tip';
import dayjs from 'dayjs';
import { renderUserFullName } from '@saashq/ui/src/utils';

class CustomerCreate extends React.Component<IActivityLogItemProps> {
  renderContent = () => {
    const { activity } = this.props;
    const { createdByDetail } = activity;

    if (createdByDetail && createdByDetail.type === 'user') {
      const userName = renderUserFullName(createdByDetail.content);

      return (
        <span>
          <strong>{userName}</strong> created&nbsp; this customer
        </span>
      );
    }

    if (createdByDetail && createdByDetail.type === 'brand') {
      const { content } = createdByDetail;

      return (
        <span>
          This customer registered to saashq by
          {content ? ` ${content.name}'s integrations` : ''}
        </span>
      );
    }

    return (
      <span>
        This customer <b>registered</b> to saashq
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

export default CustomerCreate;
