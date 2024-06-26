import React from 'react';
import { SidebarCounter } from '@saashq/ui/src/layout/styles';
import { IStructure } from '@saashq/ui/src/team/types';
import { IUser } from '@saashq/ui/src/auth/types';
import { __, readFile } from 'modules/common/utils';
import Icon from '@saashq/ui/src/components/Icon';
import { StructureList, StructureEditButton } from '../../styles';
import { Title } from '@saashq/ui-settings/src/styles';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import _ from 'lodash';

type Props = {
  structure: IStructure;
  showEdit: () => void;
};

export default function View({ structure, showEdit }: Props) {
  const edit = (
    <StructureEditButton>
      <Icon icon="edit" onClick={showEdit} size={14} />
    </StructureEditButton>
  );

  const renderRow = (name: string, value: any, nowrap?: boolean) => {
    return (
      <li>
        <div>{__(name)}</div>
        <SidebarCounter nowrap={nowrap}>{value || '-'}</SidebarCounter>
      </li>
    );
  };

  const { title, description, code, phoneNumber, email, image } = structure;
  const supervisor = structure.supervisor || ({} as IUser);
  const links = structure.links || {};
  const coordinate = structure.coordinate || {};

  const supervisorName = supervisor.details
    ? supervisor.details.fullName || supervisor.email
    : supervisor.email;

  return (
    <>
      <Wrapper.ActionBar
        background="bgWhite"
        left={<Title capitalize={true}>{__('Struktura')}</Title>}
        right={edit}
        wideSpacing={true}
      />
      <StructureList className="no-link">
        {renderRow('Název', title)}
        {renderRow('Popis', description, true)}
        {renderRow('Dozorce', supervisorName)}
        {renderRow('Kód', code)}
        {renderRow('Telefonní číslo', phoneNumber)}
        {renderRow('E-mailem', email)}
        {renderRow('Zeměpisná délka', coordinate.longitude)}
        {renderRow('Zeměpisná šířka', coordinate.latitude)}
        {renderRow('Webová stránka', links.website)}
        {renderRow('Facebook', links.facebook)}
        {renderRow('Twitter', links.twitter)}
        {renderRow('Youtube', links.youtube)}
        {image && (
          <li>
            <img src={readFile(image.url)} alt={image.name} width="100%" />
          </li>
        )}
      </StructureList>
    </>
  );
}
