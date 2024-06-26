import Datetime from '@nateradebaugh/react-datetime';
import React from 'react';
import { Column } from '@saashq/ui/src/styles/main';

type Props = {
  onChange?: (e: React.FormEvent<HTMLElement>) => void;
  defaultValue?: any;
  value?: any;
  placeholder?: string;
  name?: string;
  errors?: any;
  dateFormat?: string;
  required?: boolean;
  timeFormat?: boolean | string;
  registerChild?: (child: any) => void;
};

class DateControl extends React.Component<Props> {
  static defaultProps = {
    dateFormat: 'MMM,DD YYYY',
  };

  componentDidMount() {
    const { registerChild } = this.props;

    if (registerChild) {
      registerChild(this);
    }
  }

  render() {
    const {
      errors,
      value,
      name,
      placeholder,
      dateFormat,
      timeFormat,
      required,
    } = this.props;
    const errorMessage = errors && errors[name || ''];

    // cancel custom browser default form validation error
    const onChange = (e) => {
      if (this.props.onChange) {
        this.props.onChange(e);
      }
    };

    const inputProps = {
      name,
      placeholder: placeholder || '',
      required: required || false,
      autoComplete: 'off',
    };

    const attributes = {
      inputProps,
      dateFormat,
      timeFormat: timeFormat || false,
      value,
      closeOnSelect: true,
      onChange,
      utc: true,
    };

    return (
      <Column>
        <Datetime {...attributes} />
        {errorMessage}
      </Column>
    );
  }
}

export default DateControl;
