import {
  ActivityDate,
  ActivityIcon,
  ActivityRow,
  FlexCenterContent,
} from '@saashq/ui-log/src/activityLogs/styles';
import {
  formatText,
  getIconAndColor,
} from '@saashq/ui-log/src/activityLogs/utils';
import Icon from '@saashq/ui/src/components/Icon';
import Tip from '@saashq/ui/src/components/Tip';
import { Label } from '@saashq/ui/src';
import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

type Props = {
  contentType: string;
  activity: any;
  currentUser: any;
};

class ActivityItem extends React.Component<Props> {
  renderDetail(contentType: string, children: React.ReactNode, iconType) {
    const type = contentType.split(':')[1];

    const iconAndColor = getIconAndColor(iconType) || {};

    return (
      <ActivityRow key={Math.random()}>
        <Tip
          text={`${formatText(type || contentType)} Založená automatizace`}
          placement="top"
        >
          <ActivityIcon color={iconAndColor.color}>
            <Icon icon={iconAndColor.icon} />
          </ActivityIcon>
        </Tip>
        {children}
      </ActivityRow>
    );
  }

  renderSendEmail(doc: any, createdAt) {
    const { automationId, result } = doc;

    const getLabelColor = (item) => {
      if (item?.error) {
        return 'danger';
      }

      if (item?.messageId) {
        return 'success';
      }

      return '';
    };

    return (
      <FlexCenterContent>
        <span>
          <Link to={`/automations/details/${automationId}`}>
            <a>{'tento '}</a>
          </Link>
          {`automatizace odeslaná e-mailem na `}
          {(result || []).map((item) => (
            <Label lblStyle={getLabelColor(item)}>{item?.toEmail || ''}</Label>
          ))}
        </span>
        <Tip text={dayjs(createdAt).format('llll')}>
          <ActivityDate>
            {dayjs(createdAt).format('MMM D, h:mm A')}
          </ActivityDate>
        </Tip>
      </FlexCenterContent>
    );
  }

  render() {
    const { activity } = this.props;

    const { contentType, action, contentDetail, createdAt } = activity;

    const type = contentType.split(':')[1];

    switch ((action && action) || type) {
      case 'sendEmail':
        return this.renderDetail(
          'task',
          this.renderSendEmail(contentDetail, createdAt),
          'email',
        );

      default:
        return <div />;
    }
  }
}

export default ActivityItem;
