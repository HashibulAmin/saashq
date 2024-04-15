import ConvertTrigger from '../../boards/components/portable/ConvertTrigger';
import { __ } from '@saashq/ui/src/utils';
import React from 'react';
import options from '../../tasks/options';

type Props = {
  relType: string;
  relTypeIds?: string[];
  assignedUserIds?: string[];
  sourceConversationId?: string;
  url?: string;
  subject?: string;
  refetch: () => void;
  description?: string;
  attachments?: any[];
};

export default (props: Props) => {
  const title = props.url ? __('Přejít na úkol') : __('Převést na úkol');

  const extendedProps = {
    ...props,
    options,
    title,
    autoOpenKey: 'showTaskConvertModal',
  };

  return <ConvertTrigger {...extendedProps} />;
};
