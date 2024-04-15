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
  const title = props.url ? __('Přejít na nákup') : __('Převést na nákup');

  const extendedProps = {
    ...props,
    options,
    title,
    autoOpenKey: 'showPurchaseConvertModal',
  };

  return <ConvertTrigger {...extendedProps} />;
};
