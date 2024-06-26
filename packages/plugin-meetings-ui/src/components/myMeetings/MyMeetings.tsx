import { __, router } from '@saashq/ui/src/utils';
import React, { useState } from 'react';

import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';

import SideBarContainer from '../myMeetings/SideBar';
import { IUser } from '@saashq/ui/src/auth/types';
import { FormControl } from '@saashq/ui/src/components';
import { MeetingsQueryResponse } from '../../types';
import MyMeetingListContainer from '../../containers/myMeetings/List';
import { menuMeeting } from '../../contants';

type Props = {
  meetings: any;
  loading: boolean;
  queryParams: any;
  route?: string;
  history: string;
  refetchQueries?: any;
  currentUser: IUser;
  meetingQuery?: MeetingsQueryResponse;
};

function MyMeetings(props: Props) {
  const { loading, queryParams, history, currentUser } = props;
  const { searchValue } = queryParams;
  const [searchText, setSearchValue] = useState(searchValue);

  const searchHandler = (e) => {
    const searchingValue = e.target.value;

    setSearchValue(searchingValue);

    setTimeout(() => {
      router.removeParams(history, 'page');
      router.setParams(history, { searchValue });
    }, 500);
  };

  const leftSideBar = (
    <SideBarContainer
      history={history}
      queryParams={queryParams}
      currentUser={currentUser}
    />
  );

  const actionBarRight = (
    <FormControl
      type="text"
      placeholder={__('Zadejte a vyhledejte')}
      defaultValue={searchText}
      onChange={searchHandler}
      autoFocus={true}
    />
  );

  const actionBar = (
    <Wrapper.ActionBar right={actionBarRight} wideSpacing={true} />
  );
  return (
    <Wrapper
      header={
        <Wrapper.Header title={__('My Meetings')} submenu={menuMeeting()} />
      }
      actionBar={actionBar}
      content={
        <DataWithLoader
          data={
            <MyMeetingListContainer
              history={history}
              queryParams={queryParams}
            />
          }
          loading={loading}
          count={1}
          emptyText={__('Theres no meetings')}
          emptyImage="/images/actions/8.svg"
        />
      }
      leftSidebar={leftSideBar}
      transparent={true}
      hasBorder={true}
    />
  );
}

export default MyMeetings;
