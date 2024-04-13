import {
  Button,
  Form as CommonForm,
  ControlLabel,
  FlexContent,
  FlexItem,
  FormControl,
  FormGroup,
  ModalTrigger,
  TabTitle,
  Tabs,
  Uploader,
  extractAttachment,
} from '@saashq/ui/src';
import {
  CommonFormGroup,
  SelectWithAssetCategory,
  SelectWithAssets,
} from '../../common/utils';
import { FormColumn, ModalFooter } from '@saashq/ui/src/styles/main';
import {
  FormWrapper,
  TabContainer,
  TabContent,
  TriggerTabs,
} from '../../style';
import { IAsset, IAssetCategoryTypes } from '../../common/types';
import {
  IAttachment,
  IButtonMutateProps,
  IFormProps,
} from '@saashq/ui/src/types';

import CategoryForm from '../containers/CategoryForm';
import React from 'react';
import SelectCompanies from '@saashq/ui-contacts/src/companies/containers/SelectCompanies';
import { isEnabled } from '@saashq/ui/src/utils/core';
import { RichTextEditor } from '@saashq/ui/src/components/richTextEditor/TEditor';

type Props = {
  asset?: IAsset;
  assets: IAsset[];
  categories: IAssetCategoryTypes[];
  queryParams: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  loading: boolean;
};

function AssetForm({
  asset,
  categories,
  queryParams,
  renderButton,
  closeModal,
}: Props) {
  const [assetCount, setAssetCount] = React.useState<number>(0);
  const [minimiumCount, setMinimiumCount] = React.useState<number>(0);
  const [attachment, setAttachment] = React.useState<IAttachment | undefined>(
    undefined,
  );
  const [attachmentMore, setAttachmentMore] = React.useState<
    IAttachment[] | undefined
  >(undefined);
  const [vendorId, setVendorId] = React.useState<string>('');
  const [parentId, setParentId] = React.useState<string>('');
  const [categoryId, setCategoryId] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [currentTab, setCurrentTab] = React.useState<string>('Kategorie');

  React.useEffect(() => {
    if (asset) {
      setAssetCount(asset ? asset.assetCount : 0);
      setMinimiumCount(asset ? asset.minimiumCount : 0);
      setAttachment(asset ? asset.attachment : undefined);
      setAttachmentMore(asset ? asset.attachmentMore : undefined);
      setVendorId(asset ? asset.vendorId! : '');
      setParentId(asset ? asset.parentId : '');
      setCategoryId(asset ? asset.categoryId : '');
      setDescription(asset ? asset.description : '');
      setCurrentTab(asset ? (asset.parentId ? 'Rodič' : 'Kategorie') : '');
    }
  }, []);

  const generateDoc = (values: {
    _id?: string;
    assetCount: number;
    minimiumCount: number;
    vendorId: string;
    description: string;
  }) => {
    const finalValues = values;

    if (asset) {
      finalValues._id = asset._id;
    }

    return {
      ...finalValues,
      attachment,
      attachmentMore,
      assetCount,
      minimiumCount,
      vendorId,
      description,
      parentId,
      categoryId,
    };
  };

  const renderFormTrigger = (trigger: React.ReactNode) => {
    const content = (props) => (
      <CategoryForm {...props} categories={categories} />
    );

    return (
      <ModalTrigger
        title="Přidat Kategorii Aktiv"
        trigger={trigger}
        content={content}
      />
    );
  };

  const onChangeDescription = (content: string) => {
    setDescription(content);
  };

  const onComboEvent = (variable: string, e) => {
    setVendorId(e);
  };

  const onChangeAttachment = (files: IAttachment[]) => {
    setAttachment(files.length ? files[0] : undefined);
  };

  const onChangeAttachmentMore = (files: IAttachment[]) => {
    setAttachmentMore(files ? files : undefined);
  };

  const onChangeCurrentTab = (selecteTab) => {
    switch (selecteTab) {
      case 'Rodič':
        setCategoryId('');
        setCurrentTab(selecteTab);
        break;
      case 'Kategorie':
        setParentId('');
        setCurrentTab(selecteTab);
        break;
    }
  };

  const renderContent = (formProps: IFormProps) => {
    const { values, isSubmitted } = formProps;

    const object = asset || ({} as IAsset);

    const attachments =
      (object.attachment && extractAttachment([object.attachment])) || [];

    const attachmentsMore =
      (object.attachmentMore && extractAttachment(object.attachmentMore)) || [];

    const addCategoryTrigger = (
      <Button btnStyle="primary" uppercase={false} icon="plus-circle">
        Add category
      </Button>
    );

    const currentTabItem = () => {
      const handleSelect = (value, name) => {
        switch (name) {
          case 'parentId':
            setParentId(value);
            break;
          case 'categoryId':
            setCategoryId(value);
            break;
        }
      };

      if (currentTab === 'Rodič') {
        return (
          <FormGroup>
            <ControlLabel required={true}>Rodič</ControlLabel>
            <SelectWithAssets
              label="Vyberte Aktivum"
              name="parentId"
              multi={false}
              initialValue={object.parentId}
              onSelect={handleSelect}
              customOption={{ value: '', label: 'Vyberte Aktivum' }}
            />
          </FormGroup>
        );
      }

      const categoryDefaultValue = () => {
        if (object?.categoryId) {
          return object.categoryId;
        }
        if (queryParams?.categoryId) {
          return queryParams.categoryId;
        }
        return undefined;
      };

      return (
        <FormGroup>
          <ControlLabel required={true}>Kategorie</ControlLabel>
          <FormWrapper>
            <SelectWithAssetCategory
              label="Vyberte Kategorii Majetku"
              name="categoryId"
              multi={false}
              initialValue={categoryDefaultValue()}
              onSelect={handleSelect}
              customOption={{ value: '', label: 'Vyberte Kategorii Majetku' }}
            />
            {renderFormTrigger(addCategoryTrigger)}
          </FormWrapper>
        </FormGroup>
      );
    };

    return (
      <>
        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel required={true}>Název</ControlLabel>
              <FormControl
                {...formProps}
                name="name"
                defaultValue={object.name}
                autoFocus={true}
                required={true}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel required={true}>Kód</ControlLabel>
              <p>
                V závislosti na typu vaší firmy můžete zadat čárový kód nebo
                jakýkoli jiný kód UPC (Universal Asset Code). Pokud nepoužíváte
                UPC, zadejte v libovolné číselné hodnotě, abyste odlišili svá
                aktiva.
              </p>
              <FormControl
                {...formProps}
                name="code"
                defaultValue={object.code}
                required={true}
              />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Prodejce</ControlLabel>
              <SelectCompanies
                label="Vyberte prodejce"
                name="vendorId"
                customOption={{
                  value: '',
                  label: 'Nebyl vybrán žádný prodejce',
                }}
                initialValue={object.vendorId}
                onSelect={onComboEvent.bind(this, 'vendorId')}
                multi={false}
              />
            </FormGroup>

            <FormGroup>
              <div>
                <ControlLabel required={true}>Jednotková cena</ControlLabel>
                <p>
                  Ujistěte se prosím, že jste nastavili výchozí měnu v{' '}
                  <a href="/settings/general"> {'Obecné Nastavení'}</a> z
                  Konfigurace Systému.
                </p>
              </div>
              <FormControl
                {...formProps}
                type="number"
                name="unitPrice"
                defaultValue={object.unitPrice}
                required={true}
                min={0}
              />
            </FormGroup>
          </FormColumn>
        </FormWrapper>

        <TabContainer>
          <TriggerTabs>
            <Tabs full={true}>
              {['Kategorie', 'Rodič'].map((item) => (
                <TabTitle
                  className={currentTab === item ? 'active' : ''}
                  key={item}
                  onClick={onChangeCurrentTab.bind(this, item)}
                >
                  {item}
                </TabTitle>
              ))}
            </Tabs>
          </TriggerTabs>
          <TabContent>{currentTabItem()}</TabContent>
        </TabContainer>

        <FormGroup>
          <ControlLabel>Popis</ControlLabel>
          <FlexItem>
            <RichTextEditor
              content={description}
              onChange={onChangeDescription}
              height={150}
              isSubmitted={formProps.isSaved}
              name={`asset_description_${description}`}
              toolbar={[
                'bold',
                'italic',
                'orderedList',
                'bulletList',
                'link',
                'unlink',
                '|',
                'image',
              ]}
            />
          </FlexItem>
        </FormGroup>

        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Doporučený obrázek</ControlLabel>

              <Uploader
                defaultFileList={attachments}
                onChange={onChangeAttachment}
                multiple={false}
                single={true}
              />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Sekundární Obrázky</ControlLabel>

              <Uploader
                defaultFileList={attachmentsMore}
                onChange={onChangeAttachmentMore}
                multiple={true}
                single={false}
              />
            </FormGroup>
          </FormColumn>
        </FormWrapper>

        <ModalFooter>
          <Button
            btnStyle="simple"
            onClick={closeModal}
            icon="times-circle"
            uppercase={false}
          >
            Zavřít
          </Button>

          {renderButton({
            text: 'aktiva a pohyby',
            values: generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object: asset,
          })}
        </ModalFooter>
      </>
    );
  };

  return <CommonForm renderContent={renderContent} />;
}

export default AssetForm;
