import Widget from '@saashq/ui-inbox/src/inbox/components/EmailWidget';
import { isEnabled } from '@saashq/ui/src/utils/core';
import React from 'react';

export default function EmailWidget() {
  return isEnabled('engages') || isEnabled('imap') ? <Widget /> : null;
}
