import Button from 'modules/common/components/Button';
import { FormControl, FormGroup } from 'modules/common/components/form';
import Icon from 'modules/common/components/Icon';
import { __, Alert } from 'modules/common/utils';
import { PasswordWithEye } from 'modules/layout/styles';
import React from 'react';
import { useState } from 'react';
import { AuthBox } from '../styles';
import { IOwner } from '../types';

type Props = {
  createOwner: (arg: IOwner) => void;
};

export const OwnerDescription = () => {
  return (
    <>
      <h1>{__('Vítejte v SaasHQ')}</h1>
      <h2>
        {__(
          'SaasHQ je partnerem, který vaše webové stránky potřebují k úspěchu',
        )}
      </h2>
      <p>
        {__(
          'Na této stránce provedete konfiguraci několika nastavení. Tato nastavení budete moci změnit na záložce nastavení saashq. Budete vytvářet profil účtu správce nejvyšší úrovně. Vyplňte prosím všechna data v krocích počáteční konfigurace.',
        )}
      </p>
    </>
  );
};

const OwnerSetup = (props: Props) => {
  const { createOwner } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [purpose, setPurpose] = useState('řídit osobní projekt');
  const [lastName, setLastName] = useState('');
  const [subscribeEmail, setSubscribeEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!firstName) {
      return Alert.error(
        'Rádi bychom vaše skutečné křestní jméno, ale můžete si vybrat jakékoli jméno, které chcete, aby se vám říkalo.',
      );
    }

    if (!email) {
      return Alert.error(
        'Je vyžadována vaše nejlepší e-mailová adresa. Tato upozornění budete chtít dostávat.',
      );
    }

    if (!password) {
      return Alert.error('Je vyžadováno vaše heslo.');
    }

    createOwner({
      email,
      password,
      firstName,
      lastName,
      purpose,
      subscribeEmail,
    });
  };

  const handleFirstName = (e) => {
    e.preventDefault();

    setFirstName(e.target.value);
  };

  const handleLastName = (e) => {
    e.preventDefault();

    setLastName(e.target.value);
  };

  const handlePurpose = (e) => {
    e.preventDefault();

    setPurpose(e.target.value);
  };

  const handleEmail = (e) => {
    e.preventDefault();

    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    e.preventDefault();

    setPassword(e.target.value);
  };

  const toggleSubscribeEmail = (e) => {
    setSubscribeEmail(e.target.checked);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthBox>
      <h2>{__('Kroky počáteční konfigurace')}</h2>
      <p>
        {__('Pro dokončení instalace vyplňte prosím následující formulář')}.
      </p>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormControl
            placeholder="Jméno"
            type="text"
            name="firstName"
            onChange={handleFirstName}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            placeholder="Příjmení"
            type="text"
            name="lastName"
            onChange={handleLastName}
          />
        </FormGroup>
        <br />
        <p>
          {__(
            'Zadejte prosím nejlepší e-mailovou adresu, kterou budete používat jako přihlašovací údaje a pro příjem e-mailů z vaší instalace, jako jsou upozornění, upozornění a další zprávy',
          )}
          .
        </p>

        <FormGroup>
          <FormControl
            placeholder="E-mailem"
            type="text"
            name="email"
            onChange={handleEmail}
          />
        </FormGroup>

        <FormGroup>
          <PasswordWithEye>
            <FormControl
              placeholder="Heslo"
              type={showPassword ? 'text' : 'password'}
              name="password"
              onChange={handlePassword}
            />

            <Icon
              onClick={toggleShowPassword}
              size={16}
              icon={showPassword ? 'eye-slash' : 'eye'}
            />
          </PasswordWithEye>
        </FormGroup>

        <FormGroup>
          <p>{__('Plánuji používat SaasHQ')}</p>

          <FormControl
            componentClass="select"
            value={purpose}
            options={[
              {
                value: 'manage a personal project',
                label: 'Řídit osobní projekt',
              },
              {
                value: 'manage an internal company use case',
                label: 'Správa případu použití v rámci společnosti',
              },
              {
                value: 'attract new businesses',
                label: 'Přilákejte nové podniky',
              },
            ]}
            onChange={handlePurpose}
          />
        </FormGroup>

        <br />
        <p>
          {__(
            'Chcete-li dostávat informace o upgradech a pokynech k upgradu, nových výukových programech, příležitostných žádostech o zpětnou vazbu a měsíčním zpravodaji, musíte zkontrolovat níže',
          )}
          .
        </p>

        <FormGroup>
          <FormControl
            className="toggle-message"
            componentClass="checkbox"
            checked={subscribeEmail}
            onChange={toggleSubscribeEmail}
          >
            {__(
              'Ano, chci se přihlásit. Vím, že se mohu kdykoli snadno odhlásit',
            )}
            .
          </FormControl>
        </FormGroup>
        <Button
          btnStyle="success"
          type="submit"
          block={true}
          disabled={!subscribeEmail}
        >
          Uložte a pokračujte v přihlášení
        </Button>
      </form>
    </AuthBox>
  );
};

export default OwnerSetup;
