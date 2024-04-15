import ConvertTrigger from '../../boards/components/portable/ConvertTrigger';
import { __ } from '@saashq/ui/src/utils';
import React from 'react';
import options from '../options';

type Props = {
  relType: string;
  relTypeIds?: string[];
  assignedUserIds?: string[];
  sourceConversationId?: string;
  subject?: string;
  url?: string;
  refetch: () => void;
  description?: string;
  attachments?: any[];
  bookingProductId?: string;
};

export default (props: Props) => {
  const title = props.url ? __('Přejít na dohodu') : __('Převést na dohodu');

  const extendedProps = {
    ...props,
    options,
    title,
    autoOpenKey: 'showDealConvertModal',
  };

  return <ConvertTrigger {...extendedProps} />;
};
