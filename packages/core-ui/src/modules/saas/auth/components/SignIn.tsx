import { __, readFile } from 'modules/common/utils';
import React from 'react';
import Form from 'modules/common/components/form/Form';
import FormControl from 'modules/common/components/form/Control';
import FormGroup from 'modules/common/components/form/Group';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { Link } from 'react-router-dom';
import { AuthBox, AuthButton, Seperator } from '../styles';
import _ from 'lodash';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  currentOrganization: any;
};

class SignIn extends React.Component<Props> {
  renderContent = (formProps) => {
    const { values, isSubmitted } = formProps;
    const url = window.location.href;
    const demoUrl = url.includes('shq.saashq.org');

    return (
      <>
        <FormGroup>
          <FormControl
            {...formProps}
            name="email"
            placeholder={
              demoUrl ? 'guest@saashq.org' : __('Vložte svůj e-mail')
            }
            required={true}
          />
        </FormGroup>

        <FormGroup>
          <FormControl
            {...formProps}
            name="password"
            type="password"
            placeholder={demoUrl ? 'Demo@123' : __('Vložte svůj e-mail')}
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
        <img src={readFile(logo) || '/images/logo-dark.png'} alt="saashq" />
        <h2>{__('Vítejte!')}</h2>
        <p>{__('Chcete-li pokračovat, přihlaste se ke svému účtu')}</p>

        <AuthButton className="google">
          <Link to="/sign-in-with-email">
            {__('Přihlaste se bez hesla pomocí magického odkazu')}
          </Link>
        </AuthButton>
        <Seperator>or</Seperator>
        <Form renderContent={this.renderContent} />
        <Link to="/forgot-password">{__('Zapomenuté heslo?')}</Link>
      </AuthBox>
    );
  }
}

export default SignIn;
