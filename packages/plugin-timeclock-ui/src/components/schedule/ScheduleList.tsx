import Button from '@saashq/ui/src/components/Button';
import { __ } from '@saashq/ui/src/utils';
import React, { useState, useEffect } from 'react';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import Tip from '@saashq/ui/src/components/Tip';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import {
  FilterItem,
  FlexRow,
  FlexRowLeft,
  SchedulesTableWrapper,
  ToggleButton,
} from '../../styles';

import { IBranch, IDepartment } from '@saashq/ui/src/team/types';
import ScheduleForm from '../../containers/schedule/ScheduleForm';
import { ISchedule, IScheduleConfig, IShift } from '../../types';
import dayjs from 'dayjs';
import {
  dateFormat,
  dateOfTheMonthFormat,
  dayOfTheWeekFormat,
  timeFormat,
} from '../../constants';
import Pagination from '@saashq/ui/src/components/pagination/Pagination';
import { isEnabled, router } from '@saashq/ui/src/utils/core';
import Table from '@saashq/ui/src/components/table';
import { IUser } from '@saashq/ui/src/auth/types';
import Icon from '@saashq/ui/src/components/Icon';
import Select from 'react-select-plus';
import { Title } from '@saashq/ui-settings/src/styles';
import { ControlLabel, FormGroup } from '@saashq/ui/src/components/form';
import { confirm } from '@saashq/ui/src/utils';

type Props = {
  currentUser: IUser;
  isCurrentUserAdmin: boolean;
  isCurrentUserSupervisor?: boolean;

  queryParams: any;
  history: any;

  departments: IDepartment[];
  branches: IBranch[];

  scheduleOfMembers: ISchedule[];
  scheduleConfigs?: IScheduleConfig[];
  totalCount: number;

  solveSchedule: (scheduleId: string, status: string) => void;
  solveShift: (shiftId: string, status: string) => void;
  submitRequest: (
    userId: any,
    filledShifts: any,
    totalBreakInMins?: number | string,
    selectedScheduleConfigId?: string,
  ) => void;
  submitSchedule: (
    branchIds: any,
    departmentIds: any,
    userIds: any,
    filledShifts: any,
    totalBreakInMins?: number | string,
    selectedScheduleConfigId?: string,
  ) => void;
  removeScheduleShifts: (_id: string, type: string) => void;

  checkDuplicateScheduleShifts: (values: any) => any;

  getActionBar: (actionBar: any) => void;
  showSideBar: (sideBar: boolean) => void;
  getPagination: (pagination: any) => void;
};

function ScheduleList(props: Props) {
  const {
    history,
    scheduleOfMembers,
    totalCount,
    queryParams,
    solveSchedule,
    removeScheduleShifts,
    getActionBar,
    showSideBar,
    getPagination,
    isCurrentUserSupervisor,
    checkDuplicateScheduleShifts,
    scheduleConfigs,
  } = props;

  const [scheduleConfigsWrappedById, setScheduleConfigsWrappedById] = useState(
    {},
  );

  const [selectedScheduleStatus, setScheduleStatus] = useState(
    router.getParam(history, 'scheduleStatus') || '',
  );
  const [showButtons, setShowButtons] = useState(false);

  const [isSideBarOpen, setIsOpen] = useState(
    localStorage.getItem('isSideBarOpen') === 'true' ? true : false,
  );

  const onToggleSidebar = () => {
    const toggleIsOpen = !isSideBarOpen;
    setIsOpen(toggleIsOpen);
    localStorage.setItem('isSideBarOpen', toggleIsOpen.toString());
  };

  const { startDate, endDate } = queryParams;
  let lastColumnIdx = 1;

  type Column = {
    columnNo: number;
    dateField: string;
    text: string;
    backgroundColor: string;
    date?: Date;
  };

  const daysAndDatesHeaders: Column[] = [];

  useEffect(() => {
    const scheduleConfigsWrapped = {};
    if (scheduleConfigs) {
      for (const scheduleConfig of scheduleConfigs) {
        scheduleConfigsWrapped[scheduleConfig._id] = scheduleConfig;
      }
    }

    setScheduleConfigsWrappedById(scheduleConfigsWrapped);
  }, [scheduleConfigs]);

  const prepareTableHeaders = () => {
    let startRange = dayjs(startDate);
    const endRange = dayjs(endDate);

    let columnNo = 1;

    while (startRange <= endRange) {
      const backgroundColor =
        startRange.toDate().getDay() === 0 || startRange.toDate().getDay() === 6
          ? '#f4c1bc'
          : 'white';

      daysAndDatesHeaders.push({
        columnNo,
        dateField: startRange.format(dateOfTheMonthFormat),
        text: startRange.format(dateOfTheMonthFormat),
        backgroundColor,
        date: startRange.toDate(),
      });

      columnNo += 1;
      startRange = startRange.add(1, 'day');
    }

    lastColumnIdx = columnNo;
  };

  const trigger = (
    <Button btnStyle="success" icon="plus-circle">
      Create Schedule Request - Employee
    </Button>
  );

  const adminConfigTrigger = (
    <Button btnStyle="primary" icon="plus-circle">
      Create Schedule - Admin
    </Button>
  );

  const modalContent = (closeModal, scheduleOfMember?: ISchedule) => (
    <ScheduleForm
      modalContentType={''}
      closeModal={closeModal}
      {...props}
      scheduleOfMember={scheduleOfMember}
    />
  );

  const adminConfigContent = (closeModal, scheduleOfMember?: ISchedule) => {
    let sortedSchedule: any = scheduleOfMember;

    sortedSchedule = {
      ...scheduleOfMember,
      shifts: scheduleOfMember?.shifts.sort(
        (a, b) =>
          new Date(a.shiftStart).getTime() - new Date(b.shiftStart).getTime(),
      ),
    };

    return (
      <ScheduleForm
        modalContentType={'adminConfig'}
        scheduleOfMember={sortedSchedule}
        closeModal={closeModal}
        {...props}
      />
    );
  };

  const filterSchedules = (schedules: ISchedule[]) => {
    switch (selectedScheduleStatus) {
      case 'Rejected':
        return schedules.filter(
          (schedule) =>
            schedule.solved &&
            schedule.status?.toLocaleLowerCase() === 'rejected',
        );
      case 'Pending':
        return schedules.filter((schedule) => !schedule.solved);
      default:
        return schedules.filter(
          (schedule) =>
            schedule.solved &&
            schedule.status?.toLocaleLowerCase() === 'approved',
        );
    }
  };

  const onSelectScheduleStatus = (e) => {
    setScheduleStatus(e.value);
    router.setParams(history, { scheduleStatus: e.value });
  };

  const checkAndApproveSchedule = async (
    scheduleOfMember: ISchedule,
  ): Promise<void> => {
    const checkDuplicateShifts = await checkDuplicateScheduleShifts({
      userIds: [scheduleOfMember.user._id],
      shifts: scheduleOfMember.shifts.map((shift) => ({
        shiftStart: shift.shiftStart,
        shiftEnd: shift.shiftEnd,
        scheduleConfigId: shift.scheduleConfigId,
        lunchBreakInMins: shift.lunchBreakInMins,
      })),
      userType: 'admin',
      checkOnly: true,
      status: 'Approved',
    });

    if (!checkDuplicateShifts.length) {
      solveSchedule(scheduleOfMember._id, 'Approved');
    }
  };

  const actionBarLeft = (
    <FlexRowLeft>
      <ToggleButton
        id="btn-inbox-channel-visible"
        isActive={isSideBarOpen}
        onClick={onToggleSidebar}
      >
        <Icon icon="subject" />
      </ToggleButton>

      <Title
        style={{ marginRight: '10px' }}
      >{` Total: ${scheduleOfMembers.length}`}</Title>
    </FlexRowLeft>
  );

  const actionBarRight = (
    <FlexRow>
      <FilterItem>
        <FormGroup>
          <ControlLabel>Select type</ControlLabel>
          <Select
            value={selectedScheduleStatus}
            onChange={onSelectScheduleStatus}
            placeholder="Select Schedule"
            multi={false}
            options={['Approved', 'Rejected', 'Pending'].map((el) => ({
              value: el,
              label: el,
            }))}
          />
        </FormGroup>
      </FilterItem>
      <ModalTrigger
        title={__('Send schedule request')}
        size="lg"
        trigger={trigger}
        content={({ closeModal }) => modalContent(closeModal)}
      />

      {isCurrentUserSupervisor && (
        <ModalTrigger
          size="lg"
          title={__('Schedule config - Admin')}
          trigger={adminConfigTrigger}
          content={({ closeModal }) => adminConfigContent(closeModal)}
        />
      )}
    </FlexRow>
  );

  const actionBar = (
    <Wrapper.ActionBar
      left={actionBarLeft}
      right={actionBarRight}
      hasFlex={true}
      wideSpacing={true}
    />
  );

  const removeSchedule = (_id: string, type: string) => {
    removeScheduleShifts(_id, type);
  };

  const renderTableHeaders = () => {
    prepareTableHeaders();
    return (
      <thead>
        <tr>
          <th
            rowSpan={2}
            onMouseOver={() => setShowButtons(true)}
            onMouseLeave={() => setShowButtons(false)}
          >
            {''}
          </th>
          {selectedScheduleStatus === 'Pending' && (
            <th rowSpan={2} style={{ textAlign: 'center' }}>
              {__('Akce')}
            </th>
          )}
          <th rowSpan={2} className="fixed-column">
            {__('Team members')}
          </th>

          <th rowSpan={2}>{__('Employee Id')}</th>
          <th rowSpan={2}>{__('Total days')}</th>
          <th rowSpan={2}>{__('Total hours')}</th>
          <th rowSpan={2}>{__('Total Break')}</th>
          {!isEnabled('bichil') && <th rowSpan={2}>{__('Member checked')}</th>}
          {daysAndDatesHeaders.map((column) => {
            return (
              <th
                key={column.dateField}
                style={{
                  backgroundColor: column.backgroundColor,
                  border: '1px solid #EEE',
                }}
              >
                {dayjs(column.date).format(dayOfTheWeekFormat)}
              </th>
            );
          })}
        </tr>
        <tr>
          {daysAndDatesHeaders.map((column) => {
            return (
              <th
                key={column.dateField}
                style={{
                  backgroundColor: column.backgroundColor,
                  border: '1px solid #EEE',
                }}
              >
                {column.text}
              </th>
            );
          })}
        </tr>
      </thead>
    );
  };

  const renderScheduleShifts = (shiftsOfMember: IShift[], userId: string) => {
    type ShiftString = {
      shiftStart: string;
      shiftEnd: string;
      backgroundColor: string;
      scheduleConfigId: string;
    };

    const listShiftsOnCorrectColumn: { [columnNo: number]: ShiftString[] } = [];

    for (const shift of shiftsOfMember) {
      const findColumn = daysAndDatesHeaders.find(
        (date) =>
          date.dateField ===
          dayjs(shift.shiftStart).format(dateOfTheMonthFormat),
      );

      const scheduleConfigId = shift.scheduleConfigId;
      if (findColumn) {
        const columnNumber = findColumn.columnNo;
        const backgroundColor = findColumn.backgroundColor;

        const shiftStart = dayjs(shift.shiftStart).format(timeFormat);
        const shiftEnd = dayjs(shift.shiftEnd).format(timeFormat);

        // if multiple shifts on a single date
        if (columnNumber in listShiftsOnCorrectColumn) {
          const prevShifts = listShiftsOnCorrectColumn[columnNumber];
          listShiftsOnCorrectColumn[columnNumber] = [
            {
              shiftStart,
              shiftEnd,
              backgroundColor,
              scheduleConfigId,
            },
            ...prevShifts,
          ];
          continue;
        }

        listShiftsOnCorrectColumn[columnNumber] = [
          { shiftStart, shiftEnd, backgroundColor, scheduleConfigId },
        ];
        continue;
      }
    }

    const listRowOnColumnOrder: any = [];

    for (let i = 1; i < lastColumnIdx; i++) {
      if (i in listShiftsOnCorrectColumn) {
        const shiftsOfDay = listShiftsOnCorrectColumn[i].map((shift, index) => {
          const getScheduleConfigName = scheduleConfigsWrappedById[
            shift.scheduleConfigId
          ]
            ? scheduleConfigsWrappedById[shift.scheduleConfigId].scheduleName
            : 'insert';

          return (
            <Tip key={index} text={getScheduleConfigName}>
              <td
                style={{
                  cursor: 'default',
                  backgroundColor: shift.backgroundColor,
                  border: '1px solid #EEE',
                }}
              >
                <div>{shift.shiftStart}</div>
                <div>{shift.shiftEnd}</div>
              </td>
            </Tip>
          );
        });
        listRowOnColumnOrder.push(...shiftsOfDay);
        continue;
      }

      const findBackgroundColor = daysAndDatesHeaders.find(
        (date) => date.columnNo === i,
      )?.backgroundColor;

      listRowOnColumnOrder.push(
        <td
          style={{
            backgroundColor: '#dddddd',
            border: '1px solid #EEE',
          }}
        />,
      );
    }

    return <>{listRowOnColumnOrder}</>;
  };

  const renderScheduleRow = (scheduleOfMember: ISchedule, user: IUser) => {
    const { details, email } = user;

    const name = user && details && details.fullName ? details.fullName : email;

    const employeeId = user && user.employeeId ? user.employeeId : '';

    const scheduleChecked =
      scheduleOfMember.scheduleChecked || !scheduleOfMember.submittedByAdmin
        ? 'Танилцсан'
        : 'Танилцаагүй';

    const totalDaysScheduled = new Set(
      scheduleOfMember.shifts.map((shift) =>
        dayjs(shift.shiftStart).format(dateFormat),
      ),
    ).size;

    let totalHoursScheduled = 0;
    let totalBreakInMins = 0;

    scheduleOfMember.shifts.map((shift) => {
      totalHoursScheduled +=
        (new Date(shift.shiftEnd).getTime() -
          new Date(shift.shiftStart).getTime()) /
        (1000 * 3600);

      totalBreakInMins += shift.lunchBreakInMins || 0;
    });

    const totalBreakInHours = totalBreakInMins / 60;

    if (totalHoursScheduled) {
      totalHoursScheduled -= totalBreakInHours;
    }

    const editScheduleTrigger = (
      <Button size="small" icon="edit" btnStyle="link" />
    );

    return (
      <tr style={{ textAlign: 'left' }}>
        <td
          onMouseOver={() => setShowButtons(true)}
          onMouseLeave={() => setShowButtons(false)}
          style={{ textAlign: 'center' }}
        >
          {showButtons && (
            <FlexRow>
              {isCurrentUserSupervisor &&
                selectedScheduleStatus === 'Approved' && (
                  <ModalTrigger
                    size="lg"
                    title={__('Edit schedule - Admin')}
                    trigger={editScheduleTrigger}
                    content={({ closeModal }) =>
                      adminConfigContent(closeModal, scheduleOfMember)
                    }
                  />
                )}

              {selectedScheduleStatus !== 'Approved' && (
                <ModalTrigger
                  size="lg"
                  title={__('Edit schedule request')}
                  trigger={editScheduleTrigger}
                  content={({ closeModal }) =>
                    modalContent(closeModal, scheduleOfMember)
                  }
                />
              )}
              {isCurrentUserSupervisor && (
                <Tip text={'Remove Schedule'} placement="top">
                  <Button
                    size="small"
                    icon="times-circle"
                    btnStyle="link"
                    onClick={() =>
                      removeSchedule(scheduleOfMember._id, 'schedule')
                    }
                  />
                </Tip>
              )}
              {selectedScheduleStatus === 'Rejected' &&
                isCurrentUserSupervisor && (
                  <Tip text={'Approve Schedule'} placement="top">
                    <Button
                      size="small"
                      icon="checked"
                      btnStyle="link"
                      onClick={() => {
                        confirm(
                          'Are you sure to Approve according schedule ?',
                        ).then(() => checkAndApproveSchedule(scheduleOfMember));
                      }}
                    />
                  </Tip>
                )}
            </FlexRow>
          )}
        </td>

        {selectedScheduleStatus === 'Pending' && (
          <td>
            <FlexRow>
              <Button
                disabled={scheduleOfMember.solved}
                size="small"
                btnStyle="success"
                onClick={() => checkAndApproveSchedule(scheduleOfMember)}
              >
                Approve
              </Button>
              <Button
                disabled={scheduleOfMember.solved}
                size="small"
                btnStyle="danger"
                onClick={() => solveSchedule(scheduleOfMember._id, 'Rejected')}
              >
                Reject
              </Button>
            </FlexRow>
          </td>
        )}
        <td className="fixed-column">{name}</td>
        <td>{employeeId}</td>
        <td>{totalDaysScheduled}</td>
        <td>{totalHoursScheduled.toFixed(1)}</td>
        <td>{totalBreakInHours.toFixed(1)}</td>
        {!isEnabled('bichil') && <td>{scheduleChecked}</td>}
        {renderScheduleShifts(scheduleOfMember.shifts, user._id)}
      </tr>
    );
  };

  getActionBar(actionBar);
  showSideBar(isSideBarOpen);
  getPagination(<Pagination count={totalCount} />);

  const content = () => {
    const getFilteredSchedules = filterSchedules(scheduleOfMembers);

    return (
      <SchedulesTableWrapper>
        <Table bordered={true} condensed={true} responsive={true}>
          {renderTableHeaders()}
          {getFilteredSchedules.map((schedule) => {
            return renderScheduleRow(schedule, schedule.user);
          })}
          <tbody>{}</tbody>
        </Table>
      </SchedulesTableWrapper>
    );
  };
  return content();
}

export default ScheduleList;
