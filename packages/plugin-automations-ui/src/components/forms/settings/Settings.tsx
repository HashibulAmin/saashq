import React from 'react';
import {
  LeftSidebar,
  SettingsContent,
  SettingsLayout,
  SpecificTimeContainer,
  DateControlWrapper,
} from '../../../styles';
import FormGroup from '@saashq/ui/src/components/form/Group';
import FormControl from '@saashq/ui/src/components/form/Control';
import { __ } from '@saashq/ui/src/utils/core';
import OnlineHours from '../../OnlineHours';
import DateControl from '@saashq/ui/src/components/form/DateControl';
import Button from '@saashq/ui/src/components/Button';
import Icon from '@saashq/ui/src/components/Icon';
import dayjs from 'dayjs';
import UnEnrollment from '../../../containers/forms/settings/UnEnrollment';

type Props = {
  hours: any[];
};

type State = {
  currentTab: string;
  time: string;
  selectedOption: any;
  hours: any[];
  date: any;
  dates: any[];
  isAnnulay: boolean;
};

class Settings extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'general',
      time: 'any',
      hours: (props.hours || []).map((hour) => ({ ...hour })),
      selectedOption: {},
      date: dayjs(new Date()).format('YYYY-MM-DD'),
      dates: [],
      isAnnulay: false,
    };
  }

  onClickTab = (currentTab: string) => {
    this.setState({ currentTab });
  };

  onChangeTimeType = (e) => {
    this.setState({ time: e.target.value });
  };

  onChangeAnnually = (e) => {
    this.setState({ isAnnulay: e.target.checked });
  };

  onChangeHours = (hours) => {
    this.setState({ hours });
  };

  onDateChange = (date) => {
    this.setState({ date });
  };

  add = () => {
    const { dates } = this.state;

    dates.push({
      _id: Math.random().toString(),
      name: '',
    });

    this.setState({ dates });
  };

  onRemove = (dateId) => {
    let dates = this.state.dates;

    dates = dates.filter((date) => date._id !== dateId);

    this.setState({ dates });
  };

  renderSpecificTime() {
    const { time } = this.state;

    if (time !== 'specific') {
      return null;
    }

    return (
      <SpecificTimeContainer>
        <OnlineHours
          prevOptions={this.props.hours || []}
          onChange={this.onChangeHours}
        />
      </SpecificTimeContainer>
    );
  }

  renderDate(item) {
    const remove = () => {
      this.onRemove(item._id);
    };

    return (
      <div className="date-row">
        <DateControl
          value={this.state.date}
          required={false}
          name="date"
          onChange={(date) => this.onDateChange(date)}
          placeholder={'Datum zahájení'}
          dateFormat={'YYYY-MM-DD'}
        />

        <FormControl
          componentClass="checkbox"
          value={this.state.isAnnulay}
          onChange={this.onChangeAnnually}
        >
          {__('Každoročně')}
        </FormControl>

        <Button size="small" btnStyle="danger" onClick={remove}>
          <Icon icon="cancel-1" />
        </Button>
      </div>
    );
  }

  renderContent() {
    const { currentTab } = this.state;

    if (currentTab === 'general') {
      return (
        <div>
          <h3>{currentTab}</h3>
          <div>
            <p>{'V kolika časech chcete akce provést'}?</p>
            <FormGroup>
              <FormControl
                componentClass="checkbox"
                value="any"
                onChange={this.onChangeTimeType}
                inline={true}
              >
                {__('Kdykoli')}
              </FormControl>

              <FormControl
                componentClass="checkbox"
                value="specific"
                onChange={this.onChangeTimeType}
                inline={true}
              >
                {__('Konkrétní časy')}
              </FormControl>
            </FormGroup>
            {this.renderSpecificTime()}
          </div>

          <div>
            <p>
              {'Která nadcházející data chcete pozastavit provádění akcí?'}?
            </p>
            <DateControlWrapper>
              {this.state.dates.map((date, index) => (
                <React.Fragment key={index}>
                  {this.renderDate(date)}
                </React.Fragment>
              ))}
              <Button
                btnStyle="success"
                size="small"
                onClick={this.add}
                icon="add"
              >
                Přidejte další datum
              </Button>
            </DateControlWrapper>
          </div>
        </div>
      );
    }

    return <UnEnrollment />;
  }

  render() {
    const { currentTab } = this.state;

    return (
      <SettingsLayout>
        <LeftSidebar>
          <li
            className={currentTab === 'general' ? 'active' : ''}
            onClick={this.onClickTab.bind(this, 'general')}
          >
            Všeobecné
          </li>
          <li
            className={currentTab === 'suppression' ? 'active' : ''}
            onClick={this.onClickTab.bind(this, 'suppression')}
          >
            Zrušení registrace a Potlačení
          </li>
        </LeftSidebar>
        <SettingsContent>{this.renderContent()}</SettingsContent>
      </SettingsLayout>
    );
  }
}

export default Settings;
