import React from 'react';
import Select from 'react-select-plus';
import Datetime from '@nateradebaugh/react-datetime';
import dayjs from 'dayjs';

import Button from 'modules/common/components/Button';
import { ModalFooter } from 'modules/common/styles/main';
import FormControl from 'modules/common/components/form/Control';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import { __, Alert } from 'modules/common/utils';
import { IApp, IAppParams } from '../types';

type Props = {
  userGroups: any[];
  app?: IApp;
  closeModal: () => void;
  addApp: (doc: IAppParams) => void;
  editApp: (_id: string, doc: IAppParams) => void;
};

type State = {
  userGroupId: string;
  name: string;
  expireDate?: Date;
  noExpire: boolean;
  allowAllPermission: boolean;
};

export default class AppForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const {
      app = {
        userGroupId: '',
        name: '',
        expireDate: dayjs().add(30, 'day').toDate(),
      },
    } = props;

    this.state = {
      userGroupId: app.userGroupId,
      name: app.name,
      expireDate: app.expireDate,
      noExpire: false,
      allowAllPermission: false,
    };
  }

  render() {
    const { app, userGroups = [], closeModal, addApp, editApp } = this.props;
    const { userGroupId, expireDate, allowAllPermission, noExpire } =
      this.state;

    const onGroupChange = (option) => {
      const value = option ? option.value : '';

      this.setState({ userGroupId: value });
    };

    const onDateChange = (val) => {
      this.setState({ expireDate: val });
    };

    const options = userGroups.map((g) => ({ value: g._id, label: g.name }));

    const onSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const el = document.getElementById('app-name') as HTMLInputElement;

      if (!(el && el.value)) {
        return Alert.warning(__('Název aplikace nesmí být prázdný'));
      }
      if (!userGroupId && !allowAllPermission) {
        return Alert.warning(
          __('Musí být vybrána uživatelská skupina nebo povolení všech'),
        );
      }

      const doc = {
        name: el.value,
        userGroupId,
        expireDate,
        allowAllPermission,
        noExpire,
      };

      if (app) {
        editApp(app._id, doc);
      }

      addApp(doc);

      return closeModal();
    };

    return (
      <form onSubmit={onSubmit}>
        <FormGroup>
          <ControlLabel required={true}>{__('Název')}</ControlLabel>
          <FormControl defaultValue={app && app.name} id="app-name" />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Uživatelská skupina')}</ControlLabel>
          <Select
            placeholder={__('Vyberte skupinu uživatelů')}
            options={options}
            value={this.state.userGroupId}
            onChange={(opt) => onGroupChange(opt)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Datum spotřeby')}</ControlLabel>
          <Datetime
            inputProps={{ placeholder: __('Kliknutím vyberte datum') }}
            dateFormat="YYYY/MM/DD"
            timeFormat={false}
            value={expireDate}
            closeOnSelect={true}
            utc={true}
            input={false}
            onChange={onDateChange}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Žádné vypršení platnosti')}</ControlLabel>
          <FormControl
            checked={this.state.noExpire}
            componentClass="checkbox"
            onChange={() => this.setState({ noExpire: !this.state.noExpire })}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Povolit všechna oprávnění')}</ControlLabel>
          <FormControl
            checked={this.state.allowAllPermission}
            componentClass="checkbox"
            onChange={() =>
              this.setState({
                allowAllPermission: !this.state.allowAllPermission,
              })
            }
          />
        </FormGroup>
        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="cancel-1"
          >
            {__('Zrušení')}
          </Button>
          <Button btnStyle="success" type="submit" icon="checked-1">
            {__(app ? 'Upravit' : 'Přidat')}
          </Button>
        </ModalFooter>
      </form>
    );
  } // end render()
}
