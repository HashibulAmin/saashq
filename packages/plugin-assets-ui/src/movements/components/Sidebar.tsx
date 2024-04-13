import {
  Box,
  Button,
  ControlLabel,
  DateControl,
  FormGroup as CommonFormGroup,
  Icon,
  router,
  SelectTeamMembers,
  Sidebar as CommonSideBar,
  Tip,
  Wrapper,
  __,
} from '@saashq/ui/src';
import { DateContainer } from '@saashq/ui/src/styles/main';
import moment from 'moment';
import React from 'react';
import {
  ContainerBox,
  CustomRangeContainer,
  EndDateContainer,
} from '../../style';

type Props = {
  history: any;
  queryParams: any;
};

type State = {
  movedAtFrom?: string;
  movedAtTo?: string;
  modifiedAtFrom?: string;
  modifiedAtTo?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  userId?: string;
};

const { Section } = Wrapper.Sidebar;
export class SideBar extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      ...props.queryParams,
    };

    this.handleValue = this.handleValue.bind(this);
  }

  handleDate(field, value) {
    value = moment(value).format('YYYY/MM/DD hh:mm');
    this.setState({ [field]: value });
    router.setParams(this.props.history, { [field]: value });
    router.setParams(this.props.history, { page: 1 });
  }

  handleValue(value, name) {
    this.setState({ [name]: value });
    if (value === '') {
      return router.removeParams(this.props.history, 'userId');
    }
    router.setParams(this.props.history, { userId: value });
  }

  render() {
    const {
      createdAtFrom,
      createdAtTo,
      movedAtFrom,
      movedAtTo,
      modifiedAtFrom,
      modifiedAtTo,
    } = this.state;
    const { queryParams, history } = this.props;

    const clearParams = (field) => {
      if (Array.isArray(field)) {
        field.forEach((name) => {
          this.setState({ [name]: undefined });
          return router.removeParams(history, name);
        });
      }
      this.setState({ [field]: undefined });
      router.removeParams(history, field);
    };

    const FormGroup = ({
      label,
      field,
      clearable,
      children,
    }: {
      label: string;
      clearable?: boolean;
      field: string | string[];
      children: React.ReactNode;
    }) => (
      <CommonFormGroup>
        <ContainerBox row spaceBetween>
          <ControlLabel>{label}</ControlLabel>
          {clearable && (
            <Button btnStyle="link" onClick={() => clearParams(field)}>
              <Tip placement="bottom" text="Průhledná">
                <Icon icon="cancel-1" />
              </Tip>
            </Button>
          )}
        </ContainerBox>
        {children}
      </CommonFormGroup>
    );

    const fields = [
      'userId',
      'createdAtFrom',
      'createdAtTo',
      'movedAtFrom',
      'movedAtTo',
      'modifiedAtFrom',
      'modifiedAtTo',
    ];

    const extraButton = (
      <Button btnStyle="link" onClick={() => clearParams(fields)}>
        <Tip text="Vymazat filtry" placement="bottom">
          <Icon icon="cancel-1" />
        </Tip>
      </Button>
    );

    return (
      <CommonSideBar>
        <Section.Title>
          {__('Sčítací Filtry')}
          <Section.QuickButtons>
            {fields.some((field) => queryParams[field]) && extraButton}
          </Section.QuickButtons>
        </Section.Title>
        <ContainerBox vertical column gap={5}>
          <FormGroup
            field="userId"
            label="Přesunutý uživatel"
            clearable={queryParams.userId}
          >
            <SelectTeamMembers
              label="Zvolte Přesunutý uživatel"
              name="userId"
              multi={false}
              onSelect={this.handleValue}
              initialValue={queryParams.userId}
              customOption={{ value: '', label: 'Zvolte Přesunutý uživatel' }}
            />
          </FormGroup>
          <FormGroup
            label="Vytvořené časové období"
            field={['createdAtFrom', 'createdAtTo']}
            clearable={queryParams?.createdAtFrom || queryParams?.createdAtTo}
          >
            <CustomRangeContainer>
              <DateContainer>
                <DateControl
                  name="createdAtFrom"
                  placeholder="Vyberte datum zahájení"
                  value={createdAtFrom}
                  onChange={(e) => this.handleDate('createdAtFrom', e)}
                />
              </DateContainer>
              <EndDateContainer>
                <DateContainer>
                  <DateControl
                    name="createdAtTo"
                    placeholder="Vyberte datum ukončení"
                    value={createdAtTo}
                    onChange={(e) => this.handleDate('createdAtTo', e)}
                  />
                </DateContainer>
              </EndDateContainer>
            </CustomRangeContainer>
          </FormGroup>
          <FormGroup
            label="Přesunuté časové období"
            field={['movedAtFrom', 'movedAtTo']}
            clearable={queryParams?.movedAtFrom || queryParams?.movedAtTo}
          >
            <CustomRangeContainer>
              <DateContainer>
                <DateControl
                  name="movedAtFrom"
                  placeholder="Vyberte datum zahájení"
                  value={movedAtFrom}
                  onChange={(e) => this.handleDate('movedAtFrom', e)}
                />
              </DateContainer>
              <EndDateContainer>
                <DateContainer>
                  <DateControl
                    name="movedAtTo"
                    placeholder="Vyberte datum ukončení"
                    value={movedAtTo}
                    onChange={(e) => this.handleDate('movedAtTo', e)}
                  />
                </DateContainer>
              </EndDateContainer>
            </CustomRangeContainer>
          </FormGroup>
          <FormGroup
            label="Upravené časové období"
            field={['modifiedAtFrom', 'modifiedAtTo']}
            clearable={queryParams?.modifiedAtFrom || queryParams?.modifiedAtTo}
          >
            <CustomRangeContainer>
              <DateContainer>
                <DateControl
                  name="modifiedAtFrom"
                  placeholder="Vyberte datum zahájení"
                  value={modifiedAtFrom}
                  onChange={(e) => this.handleDate('modifiedAtFrom', e)}
                />
              </DateContainer>
              <EndDateContainer>
                <DateContainer>
                  <DateControl
                    name="modifiedAtTo"
                    placeholder="Vyberte datum ukončení"
                    value={modifiedAtTo}
                    onChange={(e) => this.handleDate('modifiedAtTo', e)}
                  />
                </DateContainer>
              </EndDateContainer>
            </CustomRangeContainer>
          </FormGroup>
        </ContainerBox>
      </CommonSideBar>
    );
  }
}
