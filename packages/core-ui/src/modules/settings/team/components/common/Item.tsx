import React from 'react';

import { withRouter } from 'react-router-dom';
import Icon from '@saashq/ui/src/components/Icon';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import { ActionButtons } from '@saashq/ui-settings/src/styles';
import Tip from '@saashq/ui/src/components/Tip';
import Button from '@saashq/ui/src/components/Button';
import { __ } from 'modules/common/utils';
import { SideList } from '../../styles';
import * as routerUtils from '@saashq/ui/src/utils/router';
import { IRouterProps } from '@saashq/ui/src/types';
import queryString from 'query-string';

type Props = {
  item: any;
  deleteItem: (_id: string, callback: () => void) => void;
  refetch: () => void;
  title: string;
  renderForm: ({ closeModal }: { closeModal: () => void }) => React.ReactNode;
  icon?: string;
  level?: number;
  queryParamName: string;
};

type FinalProps = Props & IRouterProps;

function BlockItem({
  item,
  title,
  icon,
  queryParamName,
  refetch,
  deleteItem,
  renderForm,
  level,
  history,
  location,
}: FinalProps) {
  const trigger = (
    <Button btnStyle="link">
      <Tip text={__('Edit')} placement="bottom">
        <Icon icon="edit" />
      </Tip>
    </Button>
  );

  const editButton = (
    <ModalTrigger
      content={({ closeModal }) => renderForm({ closeModal })}
      title={`Upravit a ${title}`}
      trigger={trigger}
    />
  );

  const onClick = (_id) => {
    routerUtils.removeParams(history, 'page');

    routerUtils.setParams(history, { [queryParamName]: _id });
  };

  const queryParams = queryString.parse(location.search);

  return (
    <SideList
      isActive={queryParams[queryParamName] === item._id}
      key={item._id}
      level={level}
    >
      <span onClick={() => onClick(item._id)}>
        {icon && <Icon icon={icon} />}
        {item.code} - {item.title} ({item.users.length})
      </span>
      <ActionButtons>
        {editButton}
        <Tip text="Vymazat" placement="bottom">
          <Button
            btnStyle="link"
            onClick={() => deleteItem(item._id, refetch)}
            icon="cancel-1"
          />
        </Tip>
      </ActionButtons>
    </SideList>
  );
}

export default withRouter<FinalProps, any>(BlockItem);
