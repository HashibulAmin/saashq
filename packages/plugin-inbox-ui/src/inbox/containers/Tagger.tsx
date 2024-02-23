import { InboxManagementActionConsumer } from './InboxCore';
import React from 'react';
import { TAG_TYPES } from '@saashq/ui-tags/src/constants';
import TaggerPopover from '@saashq/ui-tags/src/components/TaggerPopover';
import { isEnabled } from '@saashq/ui/src/utils/core';
import { refetchSidebarConversationsOptions } from '@saashq/ui-inbox/src/inbox/utils';

const Tagger = (props) => {
  const { refetchQueries } = refetchSidebarConversationsOptions();

  return (
    <InboxManagementActionConsumer>
      {({ notifyConsumersOfManagementAction }) =>
        isEnabled('tags') && (
          <TaggerPopover
            {...props}
            perPage={400}
            type={TAG_TYPES.CONVERSATION}
            refetchQueries={refetchQueries}
            successCallback={notifyConsumersOfManagementAction}
          />
        )
      }
    </InboxManagementActionConsumer>
  );
};

export default Tagger;
