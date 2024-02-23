import SideBar from '../../components/sidebar/SideBar';
import React from 'react';
import { IBranch, IDepartment } from '@saashq/ui/src/team/types';
import { IUser } from '@saashq/ui/src/auth/types';

type Props = {
  isCurrentUserAdmin: boolean;

  history: any;
  currentUser: IUser;
  branches: IBranch[];
  departments: IDepartment[];

  queryParams: any;
};

const TypesListContainer = (props: Props) => {
  const updatedProps = {
    ...props
  };

  return <SideBar {...updatedProps} />;
};

export default TypesListContainer;
