import React from 'react';
import { Link } from 'react-router-dom';

import { IButtonMutateProps } from '@saashq/ui/src/types';
import FormControl from 'modules/common/components/form/Control';
import Form from 'modules/common/components/form/Form';
import FormGroup from 'modules/common/components/form/Group';
import { __ } from 'modules/common/utils';
import { AuthBox, AuthButton, Seperator } from '../styles';
import { readFile } from 'modules/common/utils';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  loginViaGoogle: () => void;
  currentOrganization: any;
};

class SignInWithEmail extends React.Component<Props> {
  renderContent = (formProps) => {
    const { values, isSubmitted } = formProps;

    return (
      <>
        <FormGroup>
          <FormControl
            {...formProps}
            name="email"
            placeholder={__('Zadejte svůj pracovní e-mail')}
            required={true}
          />
        </FormGroup>

        {this.props.renderButton({
          values,
          isSubmitted,
        })}
      </>
    );
  };

  render() {
    const { logo, backgroundColor } = this.props.currentOrganization;

    return (
      <AuthBox backgroundColor={backgroundColor}>
        <img src={readFile(logo) || '/images/logo-dark.png'} alt="SaasHQ" />
        <h2>{__('Vítejte!')}</h2>
        <p>{__('Chcete-li pokračovat, přihlaste se ke svému účtu')}</p>
        <AuthButton
          onClick={() => this.props.loginViaGoogle()}
          className="google"
        >
          <img src="/images/google.svg" alt="google" />
          Přihlaste se pomocí Google
        </AuthButton>
        <br />
        <AuthButton className="google">
          <Link to="/sign-in">{__('Přihlaste se pomocí e-mailu a hesla')}</Link>
        </AuthButton>
        <Seperator>nebo</Seperator>
        <span>
          Používáme magický odkaz, takže si nemusíte pamatovat nebo zadávat
          další dlouhé heslo
        </span>
        <Form renderContent={this.renderContent} />
      </AuthBox>
    );
  }
}

export default SignInWithEmail;
