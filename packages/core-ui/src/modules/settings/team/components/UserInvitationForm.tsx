import { Alert, __, generateTree } from 'modules/common/utils';
import { FormTable, InviteOption, RemoveRow } from '../styles';
import {
  IBranch,
  IDepartment,
  IInvitationEntry,
  IUnit,
} from '@saashq/ui/src/team/types';
import { IButtonMutateProps, IFormProps, IOption } from '@saashq/ui/src/types';
import { LinkButton, ModalFooter } from '@saashq/ui/src/styles/main';

import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { Description } from '@saashq/ui-settings/src/styles';
import Form from '@saashq/ui/src/components/form/Form';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { ICommonFormProps } from '@saashq/ui-settings/src/common/types';
import { IUserGroup } from '@saashq/ui-settings/src/permissions/types';
import Icon from '@saashq/ui/src/components/Icon';
import Info from '@saashq/ui/src/components/Info';
import React from 'react';
import Select from 'react-select-plus';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  usersGroups: IUserGroup[];
  channels: any[]; // check - IChannel
  units: IUnit[];
  departments: IDepartment[];
  branches: IBranch[];
} & ICommonFormProps;

type State = {
  entries: IInvitationEntry[];
  addMany: boolean;
  isSubmitted: boolean;
};

const generateEmptyEntry = (email?: string) => ({
  email: email ? email : '',
  password: '',
  groupId: '',
  channelIds: [],
  departmentId: '',
  unitId: '',
  branchId: '',
});

const generetaOption = (array: IBranch[] = []): IOption[] => {
  const generateList = () => {
    let list: any[] = array.map((item) => {
      if (!array.find((dep) => dep._id === item.parentId)) {
        return { ...item, parentId: null };
      }
      return item;
    });

    return list;
  };

  return generateTree(generateList(), null, (node, level) => ({
    value: node._id,
    label: `${'--- '.repeat(level)} ${node.title}`,
  }));
};

class UserInvitationForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      entries: Array(3).fill(generateEmptyEntry()),
      addMany: false,
      isSubmitted: false,
    };
  }

  generateDoc = () => {
    const { entries } = this.state;

    const validEntries: IInvitationEntry[] = [];

    for (const entry of entries) {
      if (entry.email && entry.groupId) {
        validEntries.push(entry);
      }
    }

    return { entries: validEntries };
  };

  onChange = (
    i: number,
    type:
      | 'email'
      | 'password'
      | 'groupId'
      | 'channelIds'
      | 'departmentId'
      | 'unitId'
      | 'branchId',
    e,
  ) => {
    let value: string | string[] = '';

    if (type === 'channelIds') {
      const selectedValues: string[] = [];

      for (const option of e) {
        selectedValues.push(option.value);
      }

      value = selectedValues;
    } else if (
      type === 'departmentId' ||
      type === 'unitId' ||
      type === 'branchId'
    ) {
      value = e ? e.value : '';
    } else {
      const elm = e.target as HTMLInputElement;

      value = elm && elm.value;
    }

    const entries = [...this.state.entries];

    entries[i] = { ...entries[i], [type]: value };

    this.setState({ entries });
  };

  onAddMoreInput = () => {
    this.setState({
      entries: [...this.state.entries, generateEmptyEntry()],
    });
  };

  onAddManyEmail = () => {
    this.setState({ addMany: true });
  };

  addInvitees = () => {
    const { entries } = this.state;

    const values = (
      document.getElementById('multipleEmailValue') as HTMLInputElement
    ).value;

    if (!values) {
      return Alert.warning('Nebyla nalezena žádná e-mailová adresa!');
    }

    const emails = values.split(',');

    emails.map((e) => entries.splice(0, 0, generateEmptyEntry(e)));

    this.setState({ addMany: false });
  };

  handleRemoveEntry = (i: number) => {
    const { entries } = this.state;

    this.setState({ entries: entries.filter((item, index) => index !== i) });
  };

  beforeSubmit = () => {
    const { entries } = this.state;

    for (const entry of entries) {
      if (!entry.email || !entry.groupId) {
        return Alert.warning('Vyplňte prosím všechna povinná pole');
      }
    }
  };

  renderRemoveInput = (i: number) => {
    const { entries } = this.state;

    if (entries.length <= 1) {
      return null;
    }

    return (
      <RemoveRow onClick={this.handleRemoveEntry.bind(this, i)}>
        <Icon icon="times" />
      </RemoveRow>
    );
  };

  renderMultipleEmail() {
    const onCancel = () => this.setState({ addMany: false });

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>
            Zadejte více e-mailových adres
          </ControlLabel>
          <Description>
            {__('Oddělte prosím každou e-mailovou adresu čárkou.')}
          </Description>
          <FormControl
            id="multipleEmailValue"
            componentClass="textarea"
            rows={5}
            required={true}
          />
        </FormGroup>
        <ModalFooter>
          <Button btnStyle="simple" onClick={onCancel} icon="times-circle">
            Zrušení
          </Button>

          <Button
            btnStyle="success"
            icon="check-circle"
            onClick={this.addInvitees}
          >
            Přidat Pozvánky
          </Button>
        </ModalFooter>
      </>
    );
  }

  generateChannelOptions(
    array: Array<{ _id: string; name?: string; title?: string }>,
  ): IOption[] {
    return array.map((item) => {
      return {
        value: item._id,
        label: item.name || item.title || '',
      };
    });
  }

  generateGroupsChoices = () => {
    return this.props.usersGroups.map((group) => ({
      value: group._id,
      label: group.name,
    }));
  };

  renderContent = (formProps: IFormProps) => {
    const { addMany, entries } = this.state;
    const { closeModal, renderButton } = this.props;
    const { isSubmitted } = formProps;

    if (addMany) {
      return this.renderMultipleEmail();
    }

    return (
      <>
        <FormTable>
          <thead>
            <tr>
              <th>
                <ControlLabel required={true}>Emailová adresa</ControlLabel>
              </th>
              <th>
                <ControlLabel required={true}>Heslo</ControlLabel>
              </th>
              <th>
                <ControlLabel required={true}>Povolení</ControlLabel>
              </th>
              <th>
                <ControlLabel>Kanály</ControlLabel>
              </th>
              <th>
                <ControlLabel>Jednotka</ControlLabel>
              </th>
              <th>
                <ControlLabel>Oddělení</ControlLabel>
              </th>
              <th>
                <ControlLabel>Větev</ControlLabel>
              </th>
              <th />
            </tr>
          </thead>

          <tbody>
            {entries.map((input, i) => (
              <tr key={i}>
                <td>
                  <FormControl
                    {...formProps}
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={input.email}
                    autoFocus={i === 0}
                    onChange={this.onChange.bind(this, i, 'email')}
                    required={true}
                    autoComplete="off"
                  />
                </td>

                <td>
                  <FormControl
                    {...formProps}
                    name="password"
                    type="password"
                    placeholder="Heslo"
                    value={input.password}
                    onChange={this.onChange.bind(this, i, 'password')}
                    required={true}
                    autoComplete="new-password"
                  />
                </td>

                <td>
                  <FormControl
                    {...formProps}
                    name="groupId"
                    componentClass="select"
                    options={[
                      { value: '', label: 'Vyberte skupinu ...' },
                      ...this.generateGroupsChoices(),
                    ]}
                    onChange={this.onChange.bind(this, i, 'groupId')}
                    required={true}
                  />
                </td>

                <td>
                  <Select
                    value={entries[i].channelIds}
                    options={this.generateChannelOptions(this.props.channels)}
                    onChange={this.onChange.bind(this, i, 'channelIds')}
                    placeholder={__('Vyberte kanály ...')}
                    multi={true}
                  />
                </td>

                <td>
                  <Select
                    value={entries[i].unitId}
                    options={this.generateChannelOptions(this.props.units)}
                    onChange={this.onChange.bind(this, i, 'unitId')}
                    placeholder={__('Vyberte jednotku ...')}
                  />
                </td>

                <td>
                  <Select
                    value={entries[i].departmentId}
                    options={generateTree(
                      this.props.departments,
                      null,
                      (node, level) => ({
                        value: node._id,
                        label: `${'---'.repeat(level)} ${node.title}`,
                      }),
                    )}
                    onChange={this.onChange.bind(this, i, 'departmentId')}
                    placeholder={__('Vyberte oddělení ...')}
                  />
                </td>

                <td>
                  <Select
                    value={entries[i].branchId}
                    options={generetaOption(this.props.branches)}
                    onChange={this.onChange.bind(this, i, 'branchId')}
                    placeholder={__('Vyberte pobočku ...')}
                  />
                </td>

                <td>{this.renderRemoveInput(i)}</td>
              </tr>
            ))}
          </tbody>
        </FormTable>

        <InviteOption>
          <LinkButton onClick={this.onAddMoreInput}>
            <Icon icon="add" /> {__('Přidej další')}
          </LinkButton>{' '}
          {__('nebo')}{' '}
          <LinkButton onClick={this.onAddManyEmail}>
            {__('přidat mnoho najednou')}{' '}
          </LinkButton>
        </InviteOption>

        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal} icon="times-circle">
            Cancel
          </Button>

          {renderButton({
            name: 'pozvánka člena týmu',
            values: this.generateDoc(),
            isSubmitted,
            beforeSubmit: this.beforeSubmit,
            callback: closeModal,
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return (
      <>
        <Info>{__('Pošlete e-mail a upozorněte členy, že byli pozváni!')}</Info>

        <Form autoComplete="off" renderContent={this.renderContent} />
      </>
    );
  }
}

export default UserInvitationForm;
