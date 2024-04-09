import * as React from 'react';

import {
  Actions,
  IframePreview,
  Template,
  TemplateBox,
  TemplateBoxInfo,
  TemplateInfo,
  Templates,
} from '@saashq/ui-emailtemplates/src/styles';
import { FlexItem, FlexRow, InputBar } from '@saashq/ui-settings/src/styles';
import { IButtonMutateProps, IRouterProps } from '@saashq/ui/src/types';
import { __, router } from 'coreui/utils';

import { FilterContainer } from '@saashq/ui-settings/src/styles';
import Form from '@saashq/ui-inbox/src/settings/responseTemplates/components/Form';
import { FormControl } from '@saashq/ui/src/components/form';
import HeaderDescription from '@saashq/ui/src/components/HeaderDescription';
import { ICommonListProps } from '@saashq/ui-settings/src/common/types';
import Icon from '@saashq/ui/src/components/Icon';
import List from '@saashq/ui-settings/src/common/components/List';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import SelectBrands from '@saashq/ui/src/brands/containers/SelectBrands';
import { withRouter } from 'react-router-dom';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  queryParams: any;
  history: any;
} & ICommonListProps;

type States = {
  searchValue: string;
};

type FinalProps = Props & IRouterProps;

class ResponseTemplateList extends React.Component<FinalProps, States> {
  constructor(props) {
    super(props);

    const { queryParams } = props;

    const searchValue =
      queryParams && queryParams.searchValue ? queryParams.searchValue : '';

    this.state = {
      searchValue,
    };
  }

  onChange = (e: React.FormEvent) => {
    const { value } = e.currentTarget as HTMLInputElement;

    this.setState({ searchValue: value });
  };

  renderForm = (props) => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };

  renderEditAction = (object) => {
    const { save } = this.props;

    const content = (props) => {
      return this.renderForm({ ...props, object, save });
    };

    return (
      <ModalTrigger
        enforceFocus={false}
        title="Edit"
        size="lg"
        trigger={
          <div>
            <Icon icon="edit" /> Edit
          </div>
        }
        content={content}
      />
    );
  };

  handleKeyDown = (e: React.KeyboardEvent<Element>) => {
    if (e.key === 'Enter') {
      const { value, name } = e.currentTarget as HTMLInputElement;

      router.setParams(this.props.history, { [name]: value });
    }
  };

  onSelect = (values: string[] | string, name: string) => {
    router.setParams(this.props.history, { [name]: values });
  };

  renderFilters = () => {
    const brandId =
      this.props.queryParams && this.props.queryParams.brandId
        ? this.props.queryParams
        : '';

    return (
      <FilterContainer marginRight={true}>
        <FlexRow>
          <InputBar type="searchBar">
            <Icon icon="search-1" size={20} />
            <FlexItem>
              <FormControl
                placeholder={__('Type to search')}
                name="searchValue"
                onChange={this.onChange}
                value={this.state.searchValue}
                onKeyPress={this.handleKeyDown}
                onKeyDown={this.handleKeyDown}
                autoFocus={true}
              />
            </FlexItem>
          </InputBar>
          <InputBar type="selectBar">
            <FlexItem>
              <SelectBrands
                label="Filter by brand"
                initialValue={brandId}
                onSelect={this.onSelect}
                name="brandId"
                multi={false}
              />
            </FlexItem>
          </InputBar>
        </FlexRow>
      </FilterContainer>
    );
  };

  renderContent = () => {
    const { remove, objects } = this.props;

    return (
      <Templates>
        {objects.map((object, index) => (
          <Template
            key={index}
            isLongName={object.name > 45}
            position="flex-start"
          >
            <TemplateBox hasPadding={true}>
              <Actions>
                {this.renderEditAction(object)}
                <div onClick={() => remove(object._id)}>
                  <Icon icon="cancel-1" /> Delete
                </div>
              </Actions>
              <IframePreview>
                <iframe title="response-iframe" srcDoc={object.content} />
              </IframePreview>
            </TemplateBox>
            <TemplateBoxInfo>
              <h5>{object.name}</h5>
              <TemplateInfo>
                <p>Brand</p>
                <p>{object.brand.name}</p>
              </TemplateInfo>
            </TemplateBoxInfo>
          </Template>
        ))}
      </Templates>
    );
  };

  render() {
    return (
      <List
        formTitle="New response template"
        breadcrumb={[
          { title: __('Settings'), link: '/settings' },
          { title: __('Response templates') },
        ]}
        title={__('Response templates')}
        leftActionBar={
          <HeaderDescription
            icon="/images/actions/24.svg"
            title="Response templates"
            description={`${__(
              'Make things easy for your team members and add in ready made response templates',
            )}.${__(
              'Manage and edit your response templates according to each situation and respond in a timely manner and without the hassle',
            )}`}
          />
        }
        additionalButton={this.renderFilters()}
        renderForm={this.renderForm}
        renderContent={this.renderContent}
        size="lg"
        {...this.props}
      />
    );
  }
}

export default withRouter<FinalProps, any>(ResponseTemplateList);
