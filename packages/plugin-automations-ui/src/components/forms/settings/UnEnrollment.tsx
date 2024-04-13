import React from 'react';
import Select from 'react-select-plus';
import { __ } from '@saashq/ui/src/utils/core';
import FormGroup from '@saashq/ui/src/components/form/Group';
import FormControl from '@saashq/ui/src/components/form/Control';
import { UnEnroll } from '../../../styles';

type Props = {};

class UnEnrollment extends React.Component<Props> {
  render() {
    return (
      <UnEnroll>
        <h3>{__('Zrušení registrace a potlačení')}</h3>
        <div>
          <p>{'Když se kontakty zaregistrují do tohoto pracovního postupu'}</p>
          <FormGroup>
            <FormControl componentClass="radio" value="any" inline={true}>
              {__('Neodstraňujte je z jiných pracovních postupů')}
            </FormControl>

            <FormControl componentClass="radio" value="specific" inline={true}>
              {__('Odstraňte je ze všech ostatních pracovních postupů')}
            </FormControl>
            <FormControl componentClass="radio" value="specific" inline={true}>
              {__('Odeberte je z konkrétního pracovního postupu')}
            </FormControl>
          </FormGroup>
        </div>

        <div>
          <p>
            {
              'Když kontakt již nesplňuje podmínky registrace, odeberte jej z tohoto pracovního postupu'
            }
          </p>
          <FormGroup>
            <FormControl componentClass="radio" value="any" inline={true}>
              {__('Ano, odeberte je z tohoto pracovního postupu')}
            </FormControl>

            <FormControl componentClass="radio" value="specific" inline={true}>
              {__('Ne, ponechat je v tomto pracovním postupu')}
            </FormControl>
          </FormGroup>
        </div>

        <div>
          <p>
            {
              'Když jsou dva kontakty sloučeny, měl by se nově vytvořený kontakt zapsat do tohoto pracovního postupu, pokud splňují spouštěcí kritéria'
            }
            ?
          </p>
          <FormGroup>
            <FormControl componentClass="radio" value="any" inline={true}>
              {__('Ano')}
            </FormControl>

            <FormControl componentClass="radio" value="specific" inline={true}>
              {__('Ne')}
            </FormControl>
          </FormGroup>
        </div>

        <div>
          <b>Seznamy potlačení pro tento pracovní postup</b>
          <p>
            {
              'Kontakty na těchto seznamech budou odstraněny z pracovního postupu. Můžete přidat až 20 seznamů potlačení'
            }
          </p>
          <Select
            isRequired={true}
            value={''}
            options={[]}
            placeholder={__('Vybrat')}
          />
        </div>
      </UnEnroll>
    );
  }
}

export default UnEnrollment;
