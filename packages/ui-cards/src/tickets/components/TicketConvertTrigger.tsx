import ConvertTrigger from '../../boards/components/portable/ConvertTrigger';
import { __ } from '@saashq/ui/src/utils';
import React from 'react';
import options from '../options';

type Props = {
  relType: string;
  relTypeIds?: string[];
  assignedUserIds?: string[];
  sourceConversationId?: string;
  url?: string;
  subject?: string;
  refetch: () => void;
  type?: string;
  description?: string;
  attachments?: any[];
};

export default function TicketConvertTrigger(props: Props) {
  const title = props.url ? __('Přejít na lístek') : __('Převést na lístek');

  const extendedProps = {
    ...props,
    options,
    title,
    autoOpenKey: 'showTicketConvertModal',
  };

  return <ConvertTrigger {...extendedProps} />;
}
