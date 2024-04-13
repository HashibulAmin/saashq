import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { FlexItem, LeftItem } from '@saashq/ui/src/components/step/styles';
import React from 'react';

type Props = {
  onChange: (name: 'confirmationMethod', value: string) => void;
  confirmationMethod?: string;
};

class BookingFlow extends React.Component<Props> {
  onChangeFunction = (name, value) => {
    this.setState({ [name]: value });
    this.props.onChange(name, value);
  };

  render() {
    const onChange = (e) =>
      this.onChangeFunction(
        'confirmationMethod',
        (e.currentTarget as HTMLInputElement).value,
      );

    return (
      <FlexItem>
        <LeftItem>
          <FormGroup>
            <ControlLabel>
              Jak by se mělo nakládat s novými rezervacemi?
            </ControlLabel>

            <br />
            <br />
            <FormControl
              value="automatic"
              componentClass="radio"
              checked={this.props.confirmationMethod === 'automatic'}
              onChange={onChange}
            >
              Automatický
              <br />
              Rezervace jsou automaticky potvrzeny při odeslání (okamžitě
              rezervace)
            </FormControl>

            <br />
            <br />
            <FormControl
              value="manual"
              componentClass="radio"
              checked={this.props.confirmationMethod === 'manual'}
              onChange={onChange}
            >
              Manuál
              <br />
              Budete upozorněni a můžete ručně potvrdit nebo odmítnout rezervace
            </FormControl>
          </FormGroup>
        </LeftItem>
      </FlexItem>
    );
  }
}

export default BookingFlow;
