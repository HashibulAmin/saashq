import { Button, FormControl, Uploader, __ } from '@saashq/ui/src';
import { CommonFormGroup, SelectWithAssetCategory } from '../../common/utils';
import {
  FormColumn,
  FormWrapper,
  ModalFooter,
} from '@saashq/ui/src/styles/main';
import { IAssetCategory, IAssetCategoryTypes } from '../../common/types';
import {
  IAttachment,
  IButtonMutateProps,
  IFormProps,
} from '@saashq/ui/src/types';

import { ASSET_CATEGORY_STATUSES } from '../../common/constant';
import CommonForm from '@saashq/ui/src/components/form/Form';
import React from 'react';
import Select from 'react-select-plus';
import { extractAttachment } from '@saashq/ui/src/utils/core';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  category: IAssetCategoryTypes;
  categories: IAssetCategoryTypes[];
};

function CategoryForm({
  renderButton,
  closeModal,
  category,
  categories,
}: Props) {
  const [attachment, setAttachment] = React.useState<IAttachment | undefined>(
    undefined,
  );
  const [status, setStatus] = React.useState<string>('');
  const [parentId, setParentId] = React.useState<string>('');

  React.useEffect(() => {
    if (category) {
      setStatus(category.status || '');
      setParentId(category.parentId || '');
    }
  }, []);

  const generateDocs = (values) => {
    const finalValues = values;

    if (category) {
      finalValues._id = category._id;
    }

    return { ...finalValues, attachment, status, parentId };
  };

  const onChangeAttachment = (files: IAttachment[]) => {
    const file = files ? files[0] : undefined;
    setAttachment(file);
  };

  const renderForm = (formProps: IFormProps) => {
    const { isSubmitted, values } = formProps;

    const object = category || ({} as IAssetCategory);

    const attachments =
      (object.attachment && extractAttachment([object.attachment])) || [];

    return (
      <>
        <CommonFormGroup required={true} label="Název">
          <FormControl
            name="name"
            {...formProps}
            type="text"
            defaultValue={object.name}
            required={true}
          />
        </CommonFormGroup>
        <CommonFormGroup required={true} label="Kód">
          <FormControl
            name="code"
            {...formProps}
            type="text"
            defaultValue={object.code}
            required={true}
          />
        </CommonFormGroup>
        <CommonFormGroup label="Popis">
          <FormControl
            name="description"
            {...formProps}
            componentClass="textarea"
            defaultValue={object.description}
          />
        </CommonFormGroup>

        <FormWrapper>
          <FormColumn>
            <CommonFormGroup label="Postavení">
              <Select
                placeholder={__('Vyberte stav')}
                value={status}
                options={ASSET_CATEGORY_STATUSES}
                onChange={(option) => setStatus(option.value)}
                {...formProps}
              />
            </CommonFormGroup>
          </FormColumn>
          <FormColumn>
            <CommonFormGroup label="Rodičovská Kategorie">
              <SelectWithAssetCategory
                label="Vyberte Kategorii Majetku"
                name="categoryId"
                multi={false}
                initialValue={object.parentId}
                onSelect={(value) => setParentId(value as string)}
                customOption={{ value: '', label: 'Vyberte Kategorii Majetku' }}
                {...formProps}
              />
            </CommonFormGroup>
          </FormColumn>
        </FormWrapper>

        <CommonFormGroup label="Obraz">
          <Uploader
            onChange={onChangeAttachment}
            defaultFileList={attachments}
            multiple={false}
            single={false}
          />
        </CommonFormGroup>

        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal}>
            Zrušení
          </Button>

          {renderButton({
            text: 'Kategorie aktiv',
            values: generateDocs(values),
            isSubmitted,
            callback: closeModal,
            object: category,
          })}
        </ModalFooter>
      </>
    );
  };

  return <CommonForm renderContent={renderForm} />;
}

export default CategoryForm;
