import { IContentType, IEntryDoc } from '../../types';
import React, { useEffect, useState } from 'react';

import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import Button from '@saashq/ui/src/components/Button';
import EntryForm from '../../containers/entries/EntryForm';
import Icon from '@saashq/ui/src/components/Icon';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import Tip from '@saashq/ui/src/components/Tip';
import { __ } from '@saashq/ui/src/utils/core';

type Props = {
  entry: IEntryDoc;
  remove: (_id: string) => void;
  contentType: IContentType;
};

function Row(props: Props) {
  const { entry, contentType, remove } = props;
  const { fields = [] } = contentType;
  const { values = [] } = entry;

  const [data, setData] = useState({});

  useEffect(() => {
    values.forEach((val) => {
      setData((dat) => ({ ...dat, [val.fieldCode]: val.value }));
    });
  }, [values]);

  const renderEditAction = () => {
    const trigger = (
      <Button btnStyle="link">
        <Tip text={__('Manage')} placement="top">
          <Icon icon="edit-3" />
        </Tip>
      </Button>
    );

    const content = ({ closeModal }) => (
      <EntryForm
        contentTypeId={contentType._id}
        _id={entry._id}
        closeModal={closeModal}
      />
    );

    return (
      <ModalTrigger
        title="Edit entry"
        size="lg"
        trigger={trigger}
        content={content}
      />
    );
  };

  const renderRemoveAction = (item: any) => {
    const onClick = () => remove(item._id);

    return (
      <Tip text={__('Vymazat')} placement="top">
        <Button btnStyle="link" onClick={onClick} icon="times-circle" />
      </Tip>
    );
  };

  return (
    <tr>
      {fields.map((val) => {
        if (!val.show) {
          return;
        }

        return <td key={val.code}>{data[val.code] || ''}</td>;
      })}
      <td>
        <ActionButtons>
          {renderEditAction()}
          {renderRemoveAction(entry)}
        </ActionButtons>
      </td>
    </tr>
  );
}

export default Row;
