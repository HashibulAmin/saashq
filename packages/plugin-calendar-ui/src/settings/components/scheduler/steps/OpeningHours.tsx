import { FlexItem, LeftItem } from '@saashq/ui/src/components/step/styles';

import ControlLabel from '@saashq/ui/src/components/form/Label';
import Datetime from '@nateradebaugh/react-datetime';
import { FlexRow } from '@saashq/ui-inbox/src/settings/integrations/styles';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import React from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import timezones from '@saashq/ui/src/constants/timezones';

const WeekContainers = styled.div`
  display: inline-block;
  button {
    background-color: #fff;
    border: 1px solid #eee;
    cursor: pointer;
    margin: 0;

    &.checked {
      background-color: #9900ef;
      color: #fff;
    }
  }
`;

type Props = {
  onChange: (name: 'timezone' | 'openingHours', value: any) => void;
  timezone?: string;
};

type State = {
  timezone?: string;
  days: string[];
  startDate: Date;
  endDate: Date;
};

class OpeningHours extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const defaultTime = (time: number) => {
      return new Date(
        dayjs().startOf('day').add(time, 'hour').format('YYYY-MM-DD HH:mm'),
      );
    };
    this.state = {
      days: ['M', 'T', 'W', 'R', 'F'],
      startDate: defaultTime(9),
      endDate: defaultTime(17),
    };
  }

  onChangeInput = (name: 'timezone', e: React.FormEvent) => {
    const { value } = e.target as HTMLInputElement;

    this.setState({ [name]: value }, () => this.props.onChange(name, value));
  };

  generateOpeningHours = () => {
    const { days, startDate, endDate } = this.state;

    return [
      {
        days,
        start: dayjs(startDate).format('HH:mm'),
        end: dayjs(endDate).format('HH:mm'),
      },
    ];
  };

  updateOpeningHours = () => {
    this.props.onChange('openingHours', this.generateOpeningHours());
  };

  onChangeDays = (value: string) => {
    const { days } = this.state;

    if (days.includes(value)) {
      const index = days.indexOf(value);

      days.splice(index, 1);
    } else {
      days.push(value);
    }

    this.setState({ days }, () => this.updateOpeningHours());
  };

  onChangeStartDate = (time) => {
    this.setState({ startDate: time }, () => this.updateOpeningHours());
  };

  onChangeEndDate = (time) => {
    this.setState({ endDate: time }, () => this.updateOpeningHours());
  };

  render() {
    const { timezone } = this.props;

    const weeks = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const weekValues = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];

    return (
      <FlexItem>
        <LeftItem>
          <FormGroup>
            <ControlLabel>Jaké je časové pásmo události?</ControlLabel>
            Časové pásmo pro otevírací dobu a nové události. Vaši pozvaní uvidí
            vaši dostupnost v jejich místním časovém pásmu.
            <br />
            <FormControl
              componentClass="select"
              defaultValue={timezone}
              name="timezone"
              options={timezones}
              onChange={this.onChangeInput.bind(null, 'timezone')}
            />
          </FormGroup>

          <FlexRow>
            <div className="flex-item">
              <WeekContainers>
                {weeks.map((k, index) => {
                  const value = weekValues[index];
                  const isChecked = this.state.days.includes(value);

                  return (
                    <button
                      key={index}
                      value={weekValues[index]}
                      className={isChecked ? 'checked' : ''}
                      onClick={this.onChangeDays.bind(this, value)}
                    >
                      {k}
                    </button>
                  );
                })}
              </WeekContainers>
            </div>
            <div className="flex-item">
              <ControlLabel>Start Time</ControlLabel>

              <Datetime
                dateFormat={false}
                timeFormat="HH:mm"
                closeOnSelect={true}
                utc={true}
                input={false}
                value={this.state.startDate}
                onChange={this.onChangeStartDate}
              />
            </div>

            <div className="flex-item">
              <ControlLabel>End Time</ControlLabel>

              <Datetime
                dateFormat={false}
                timeFormat="HH:mm"
                closeOnSelect={true}
                utc={true}
                input={false}
                value={this.state.endDate}
                onChange={this.onChangeEndDate}
              />
            </div>
          </FlexRow>
        </LeftItem>
      </FlexItem>
    );
  }
}

export default OpeningHours;
