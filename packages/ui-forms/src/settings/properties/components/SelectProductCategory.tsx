import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { IOption } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils';
import { ICategory } from '@saashq/ui/src/utils/categories';
import React from 'react';
import Select from 'react-select-plus';

type Props = {
  categories: ICategory[];
  onChange?: (values: string[]) => any;
  defaultValue?: string[];
  isRequired?: boolean;
  description?: string;
};

class SelectCategories extends React.Component<Props, {}> {
  generateUserOptions(array: ICategory[] = []): IOption[] {
    return array.map((item) => {
      const category = item || ({} as ICategory);

      return {
        value: category._id,
        label: category.name,
      };
    });
  }

  onChangeCategory = (values) => {
    if (this.props.onChange) {
      this.props.onChange(values.map((item) => item.value) || []);
    }
  };

  render() {
    const { categories, defaultValue } = this.props;

    return (
      <FormGroup>
        <ControlLabel>{'Kategorie'}</ControlLabel>
        <p>
          {__('Do kterých kategorií chcete přidat tuto skupinu vlastností?')}
        </p>
        <Select
          placeholder={__('Vyberte kategorii')}
          value={defaultValue}
          onChange={this.onChangeCategory}
          options={this.generateUserOptions(categories)}
          multi={true}
        />
      </FormGroup>
    );
  }
}

export default SelectCategories;
