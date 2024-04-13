import { Alert, __ } from 'coreui/utils';
import {
  BookingFlow,
  CustomFields,
  Event,
  OpeningHours,
  PageStyles,
} from './steps';
import {
  Content,
  LeftContent,
} from '@saashq/ui-inbox/src/settings/integrations/styles';
import {
  ControlWrapper,
  Indicator,
  StepWrapper,
} from '@saashq/ui/src/components/step/styles';
import { FlexItem, LeftItem } from '@saashq/ui/src/components/step/styles';
import {
  IPage,
  SchedulePageMutationVariables,
  additionalField,
  openingHour,
} from '../../types';
import { Step, Steps } from '@saashq/ui/src/components/step';

import { AppConsumer } from '@saashq/ui/src/appContext';
import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { ICalendar as IAccountCalendar } from '../../../calendar/types';
import { IUser } from '@saashq/ui/src/auth/types';
import { Link } from 'react-router-dom';
import React from 'react';
import Select from 'react-select-plus';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';

type Props = {
  page?: IPage;
  accountId: string;
  calendars: IAccountCalendar[];
  save: (doc: SchedulePageMutationVariables) => void;
};

type FinalProps = {
  currentUser?: IUser;
} & Props;

type State = {
  title: string;
  location: string;
  duration: number;
  cancellationPolicy: string;

  calendarId: string;
  confirmationMethod: string;

  timezone: string;

  additionalFields?: additionalField[];
  openingHours?: openingHour[];

  companyName: string;
  slug?: string;
  color: string;
  submitText: string;
  thankYouText: string;
};

class CreateSchedulePage extends React.Component<FinalProps, State> {
  constructor(props: FinalProps) {
    super(props);
    const calendar = props.calendars[0] || ({} as IAccountCalendar);

    const page = props.page || ({} as IPage);
    const config = page.config || ({} as any);

    const event = config.event || {};
    const appearance = config.appearance || {};
    const booking = config.booking || {};

    this.state = {
      slug: page.slug,

      title: event.title || '',
      location: event.location || '',
      duration: event.duration || 45,

      calendarId: calendar._id,
      timezone: config.timezone || 'Europe/Prague',

      confirmationMethod: booking.confirmationMethod || 'automatic',
      cancellationPolicy: booking.cancellationPolicy || '',

      color: appearance.color || '#9900ef',
      companyName: appearance.companyName || '',
      submitText: appearance.submitText || '',
      thankYouText: appearance.thankYouText || '',
    };
  }

  save = (e) => {
    e.preventDefault();

    const {
      title,
      timezone,
      calendarId,
      location,
      duration,
      color,
      companyName,
      submitText,
      thankYouText,
      cancellationPolicy,
      confirmationMethod,
      additionalFields,
      openingHours,
    } = this.state;

    let slug = this.state.slug;

    if (!title) {
      return Alert.error('Napište název');
    }

    if (!location) {
      return Alert.error('Napište umístění');
    }

    if (!slug) {
      slug = this.generateSlug();
    }

    this.props.save({
      name: title,
      slug,
      timezone,
      calendarIds: [calendarId],
      event: {
        title,
        location,
        duration,
      },
      appearance: {
        color,
        companyName,
        submitText,
        thankYouText,
      },
      booking: {
        cancellationPolicy,
        confirmationMethod,
        additionalFields,
        openingHours,
      },
    });
  };

  generateSlug = () => {
    const { title, duration } = this.state;
    const user = this.props.currentUser;
    const text = user
      ? (user.details && user.details.fullName) || title
      : title;

    return `${text.toLocaleLowerCase().replace(/ /g, '-')}-${duration}`;
  };

  onChange = <T extends keyof State>(key: T, value: State[T]) => {
    this.setState({ [key]: value } as unknown as Pick<State, keyof State>);
  };

  renderButtons() {
    const cancelButton = (
      <Link to={`/settings/schedule`}>
        <Button btnStyle="simple" icon="times-circle">
          Cancel
        </Button>
      </Link>
    );

    return (
      <Button.Group>
        {cancelButton}
        <Button btnStyle="success" onClick={this.save} icon="check-circle">
          Save
        </Button>
      </Button.Group>
    );
  }

  renderOptions = (array) => {
    return array.map((obj) => ({
      value: obj._id,
      label: obj.name,
    }));
  };

  render() {
    const { calendars } = this.props;

    const {
      duration,
      location,
      title,
      cancellationPolicy,

      calendarId,

      timezone,

      confirmationMethod,

      additionalFields,

      companyName,
      slug,
      color,
      submitText,
      thankYouText,
    } = this.state;

    const breadcrumb = [
      { title: __('Nastavení'), link: '/settings' },
      { title: __('Kalendář'), link: '/settings/calendars' },
      { title: __('Plán'), link: `/settings/schedule` },
    ];

    const onChangeCalendar = (item) =>
      this.setState({ calendarId: item.value });

    return (
      <StepWrapper>
        <Wrapper.Header title={__('Plán')} breadcrumb={breadcrumb} />
        <Content>
          <LeftContent>
            <Steps>
              <Step
                img="/images/icons/saashq-07.svg"
                title="Informace o Události"
              >
                <Event
                  onChange={this.onChange}
                  title={title}
                  duration={duration}
                  location={location}
                  cancellationPolicy={cancellationPolicy}
                />
              </Step>
              <Step img="/images/icons/saashq-21.svg" title="Calendars">
                <FlexItem>
                  <LeftItem>
                    <FormGroup>
                      <ControlLabel>
                        Který kalendář by měl být použit pro dostupnost a
                        rezervace?
                      </ControlLabel>

                      <Select
                        placeholder={__('Vyberte kalendář')}
                        value={calendarId}
                        options={this.renderOptions(calendars)}
                        onChange={onChangeCalendar}
                        clearable={false}
                      />
                    </FormGroup>
                  </LeftItem>
                </FlexItem>
              </Step>

              <Step img="/images/icons/saashq-20.svg" title="Otevírací Doba">
                <OpeningHours onChange={this.onChange} timezone={timezone} />
              </Step>

              <Step img="/images/icons/saashq-16.svg" title="Rezervační Tok">
                <BookingFlow
                  onChange={this.onChange}
                  confirmationMethod={confirmationMethod}
                />
              </Step>

              <Step img="/images/icons/saashq-18.svg" title="Vlastní pole">
                <CustomFields
                  onChange={this.onChange}
                  additionalFields={additionalFields}
                />
              </Step>

              <Step img="/images/icons/saashq-12.svg" title="Styly Stránek">
                <PageStyles
                  onChange={this.onChange}
                  companyName={companyName}
                  slug={slug}
                  color={color}
                  submitText={submitText}
                  thankYouText={thankYouText}
                />
              </Step>
            </Steps>
            <ControlWrapper>
              <Indicator>
                {__('Ty jsi')} {this.props.page ? 'editace' : 'vytváření'}{' '}
                <strong /> {__('strana')}
              </Indicator>
              {this.renderButtons()}
            </ControlWrapper>
          </LeftContent>
        </Content>
      </StepWrapper>
    );
  }
}

export default (props: Props) => (
  <AppConsumer>
    {({ currentUser }) => (
      <CreateSchedulePage {...props} currentUser={currentUser} />
    )}
  </AppConsumer>
);
