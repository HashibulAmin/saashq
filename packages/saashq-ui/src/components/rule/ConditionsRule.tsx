import Button from '../Button';
import FormControl from '../form/Control';
import FormGroup from '../form/Group';
import ControlLabel from '../form/Label';
import { FlexPad, InlineForm } from '../step/styles';
import {
  RULE_CONDITIONS,
  VISITOR_AUDIENCE_RULES,
} from '../../constants/engage';
import React from 'react';
import styled from 'styled-components';
import { IConditionsRule } from '../../types';
import ModalTrigger from '../ModalTrigger';
import RuleForm from './RuleForm';

const RuleDescription = styled.p`
  text-transform: initial;
`;

type Props = {
  rules: IConditionsRule[];
  onChange: (name: 'rules', rules: IConditionsRule[]) => void;
  description?: string;
};

type State = {
  rules: IConditionsRule[];
};

class ConditionsRule extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      rules: props.rules || [],
    };
  }

  addRule = (e) => {
    const rules = this.state.rules;
    const selectedOption = e.target.options[e.target.selectedIndex];

    if (selectedOption.value) {
      rules.push({
        _id: Math.random().toString(),
        kind: selectedOption.value,
        text: selectedOption.text,
        condition: '',
        value: '',
      });

      this.setState({ rules });
    }
  };

  renderDescription(rule) {
    let description;

    switch (rule.kind) {
      case 'browserLanguage':
        description =
          'Rozpozná, jaký jazyk je nastaven pro prohlížeč návštěvníka. Do pole hodnoty vložte pouze kódy jazyků, jak je stanoveno v ISO-639, tj. "en" pro angličtinu, "fr" pro francouzštinu, "de" pro němčinu atd.';
        break;
      case 'currentPageUrl':
        description =
          'Napište požadovanou adresu URL stránky, kromě názvu domény. Například: Pokud chcete umístit svou angažovanost na https://office.saashq.org/pricing – napište /pricing';
        break;
      case 'country':
        description =
          'Vyhledá fyzickou polohu návštěvníka v rozlišení země. Do pole hodnoty vložte pouze kódy zemí podle normy ISO-3166, tj. "gb" pro Velkou Británii, "fr" pro francouzštinu, "de" pro němčinu, "jp" pro japonštinu atd.';
        break;
      case 'city':
        description =
          'Vyhledá fyzickou polohu návštěvníka v rozlišení města. Do pole hodnoty napište název města. Pokud není země nastavena, kritéria splní každé město se stejným názvem.';
        break;
      default:
        description = 'Počítá návštěvnost jednotlivých návštěvníků.';
        break;
    }

    return description;
  }

  renderRule(rule) {
    const remove = () => {
      let rules = this.state.rules;

      rules = rules.filter((r) => r._id !== rule._id);

      this.setState({ rules });
      this.props.onChange('rules', rules);
    };

    const changeProp = (name, value) => {
      const rules = this.state.rules;

      // find current editing one
      const currentRule = rules.find((r) => r._id === rule._id);

      // set new value
      if (currentRule) {
        currentRule[name] = value;
      }

      this.setState({ rules });
      this.props.onChange('rules', rules);
    };

    const onChangeValue = (e) => {
      changeProp('value', e.target.value);
    };

    const onChangeCondition = (e) => {
      changeProp('condition', e.target.value);
    };

    return (
      <FormGroup key={rule._id}>
        <ControlLabel>
          {rule.text}
          <RuleDescription>{this.renderDescription(rule)}</RuleDescription>
        </ControlLabel>
        <InlineForm>
          <FormControl
            componentClass="select"
            defaultValue={rule.condition}
            onChange={onChangeCondition}
          >
            {RULE_CONDITIONS[rule.kind].map((cond, index) => (
              <option key={index} value={cond.value}>
                {cond.text}
              </option>
            ))}
          </FormControl>

          <FormControl
            type="text"
            value={rule.value}
            onChange={onChangeValue}
          />
          <Button
            size="small"
            onClick={remove}
            btnStyle="danger"
            icon="times"
          />
        </InlineForm>
      </FormGroup>
    );
  }

  renderAddRule = () => {
    const trigger = (
      <Button btnStyle="primary" uppercase={false} icon="plus-circle">
        Add another rule
      </Button>
    );

    const content = (props) => <RuleForm {...props} onChange={this.addRule} />;

    return (
      <ModalTrigger
        title="Přidat pravidlo"
        trigger={trigger}
        content={content}
      />
    );
  };

  render() {
    const { description } = this.props;

    return (
      <FlexPad overflow="auto" direction="column">
        <FormGroup>
          <ControlLabel>Přidejte pravidla</ControlLabel>
          <RuleDescription>
            {description ||
              'Pravidla se používají, když chcete cílit na publikum formuláře podle vlastních pravidel. Formulář můžete například zobrazit pouze v případě, že návštěvník zobrazí webovou stránku více než 5krát.'}
          </RuleDescription>
          <FormControl componentClass="select" onChange={this.addRule}>
            {VISITOR_AUDIENCE_RULES.map((rule, index) => (
              <option key={index} value={rule.value}>
                {rule.text}
              </option>
            ))}
          </FormControl>
        </FormGroup>

        <FormGroup>
          {this.state.rules.map((rule) => this.renderRule(rule))}
        </FormGroup>

        <FormGroup>{this.renderAddRule()}</FormGroup>
      </FlexPad>
    );
  }
}

export default ConditionsRule;
