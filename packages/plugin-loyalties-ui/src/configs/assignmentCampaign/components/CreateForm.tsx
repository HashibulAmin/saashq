import React from 'react';
import {
  Button,
  ControlLabel,
  Form as CommonForm,
  FormControl,
  FormGroup,
  DateControl,
  Uploader,
  DataWithLoader,
} from '@saashq/ui/src/components';
import { RichTextEditor } from '@saashq/ui/src/components/richTextEditor/TEditor';
import {
  MainStyleFormColumn as FormColumn,
  MainStyleFormWrapper as FormWrapper,
  MainStyleDateContainer as DateContainer,
} from '@saashq/ui/src/styles/eindex';
import {
  IAttachment,
  IButtonMutateProps,
  IFormProps,
} from '@saashq/ui/src/types';
import { IAssignmentCampaign } from '../types';
import { extractAttachment, __ } from '@saashq/ui/src/utils';
import { isEnabled } from '@saashq/ui/src/utils/core';
import Select from 'react-select-plus';
import { IVoucherCampaign } from '../../voucherCampaign/types';
import { Wrapper } from '@saashq/ui/src/layout';
import { Title } from '@saashq/ui-settings/src/styles';
import Sidebar from '../../general/components/Sidebar';
import { FormFooter, SettingsContent } from '../../../styles';
import { Link } from 'react-router-dom';
import SelectSegments from '@saashq/ui-segments/src/containers/SelectSegments';

type Props = {
  assignmentCampaign?: IAssignmentCampaign;
  voucherCampaigns: IVoucherCampaign[];
  queryParams: any;
  history: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

type State = {
  assignmentCampaign: IAssignmentCampaign;
};

class CreateForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      assignmentCampaign: this.props.assignmentCampaign || {},
    };
  }

  generateDoc = (values: {
    _id?: string;
    attachment?: IAttachment;
    description: string;
  }) => {
    const finalValues = values;
    const { assignmentCampaign } = this.state;

    if (assignmentCampaign._id) {
      finalValues._id = assignmentCampaign._id;
    }

    return {
      ...finalValues,
      ...assignmentCampaign,
    };
  };

  onChangeDescription = (content: string) => {
    this.setState({
      assignmentCampaign: {
        ...this.state.assignmentCampaign,
        description: content,
      },
    });
  };

  onChangeAttachment = (files: IAttachment[]) => {
    this.setState({
      assignmentCampaign: {
        ...this.state.assignmentCampaign,
        attachment: files.length ? files[0] : undefined,
      },
    });
  };

  onDateInputChange = (type: string, date) => {
    this.setState({
      assignmentCampaign: { ...this.state.assignmentCampaign, [type]: date },
    });
  };

  onInputChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.name;

    this.setState({
      assignmentCampaign: { ...this.state.assignmentCampaign, [name]: value },
    });
  };

  renderContent = (formProps: IFormProps) => {
    const { renderButton } = this.props;
    const { values, isSubmitted } = formProps;

    const onChangeVoucherCampaign = (selected) => {
      const value = (selected || {}).value;

      this.setState({
        assignmentCampaign: {
          ...this.state.assignmentCampaign,
          voucherCampaignId: value,
        },
      });
    };

    const onChangeSegments = (segmentIds) => {
      this.setState({
        assignmentCampaign: {
          ...this.state.assignmentCampaign,
          segmentIds,
        },
      });
    };

    const { assignmentCampaign } = this.state;

    const attachments =
      (assignmentCampaign.attachment &&
        extractAttachment([assignmentCampaign.attachment])) ||
      [];

    const onSave = () => {
      const { history } = this.props;
      history.push(`/saashq-plugin-loyalty/settings/assignment`);
    };

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>title</ControlLabel>
          <FormControl
            {...formProps}
            name="title"
            defaultValue={assignmentCampaign.title}
            autoFocus={true}
            required={true}
            onChange={this.onInputChange}
          />
        </FormGroup>

        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel required={true}>Start Date</ControlLabel>
              <DateContainer>
                <DateControl
                  {...formProps}
                  required={true}
                  name="startDate"
                  placeholder={__('Start date')}
                  value={assignmentCampaign.startDate}
                  onChange={this.onDateInputChange.bind(this, 'startDate')}
                />
              </DateContainer>
            </FormGroup>
          </FormColumn>

          <FormColumn>
            <FormGroup>
              <ControlLabel required={true}>End Date</ControlLabel>
              <DateContainer>
                <DateControl
                  {...formProps}
                  required={true}
                  name="endDate"
                  placeholder={__('End date')}
                  value={assignmentCampaign.endDate}
                  onChange={this.onDateInputChange.bind(this, 'endDate')}
                />
              </DateContainer>
            </FormGroup>
          </FormColumn>

          <FormColumn>
            <FormGroup>
              <ControlLabel required={true}>Finish Date of Use</ControlLabel>
              <DateContainer>
                <DateControl
                  {...formProps}
                  required={true}
                  name="finishDateOfUse"
                  placeholder={__('Finish date of use')}
                  value={assignmentCampaign.finishDateOfUse}
                  onChange={this.onDateInputChange.bind(
                    this,
                    'finishDateOfUse',
                  )}
                />
              </DateContainer>
            </FormGroup>
          </FormColumn>
        </FormWrapper>
        {isEnabled('segments') && isEnabled('contacts') && (
          <>
            <FormGroup>
              <ControlLabel>Segments</ControlLabel>
              <SelectSegments
                name="segmentIds"
                label="Choose segments"
                contentTypes={['contacts:customer', 'contacts:lead']}
                initialValue={this.state.assignmentCampaign.segmentIds}
                multi={true}
                onSelect={onChangeSegments}
              />
            </FormGroup>
          </>
        )}
        <FormGroup>
          <ControlLabel>Voucher Campaign</ControlLabel>
          <Select
            placeholder={__('Choose voucher campaign')}
            value={this.state.assignmentCampaign.voucherCampaignId}
            options={this.props.voucherCampaigns.map((voucher) => ({
              label: `${voucher.title}`,
              value: voucher._id,
            }))}
            name="voucherCampaignId"
            onChange={onChangeVoucherCampaign}
            loadingPlaceholder={__('Loading...')}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <RichTextEditor
            content={assignmentCampaign.description || ''}
            onChange={this.onChangeDescription}
            height={150}
            isSubmitted={formProps.isSaved}
            name={`assignmentCampaign_description_${assignmentCampaign.description}`}
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
        </FormGroup>

        <FormGroup>
          <ControlLabel>Featured image</ControlLabel>

          <Uploader
            defaultFileList={attachments}
            onChange={this.onChangeAttachment}
            multiple={false}
            single={true}
          />
        </FormGroup>
        <FormFooter>
          <Link to={`/saashq-plugin-loyalty/settings/assignment`}>
            <Button
              btnStyle="simple"
              onClick={() => {}}
              icon="times-circle"
              uppercase={false}
            >
              Close
            </Button>
          </Link>
          {renderButton({
            name: 'Assignment Campaign',
            values: this.generateDoc(values),
            isSubmitted,
            object: assignmentCampaign,
            callback: onSave,
          })}
        </FormFooter>
      </>
    );
  };

  render() {
    const breadcrumb = [
      { title: __('Settings'), link: '/settings' },
      { title: __('Assignment Campaign') },
    ];

    const content = (
      <SettingsContent>
        <CommonForm renderContent={this.renderContent} />
      </SettingsContent>
    );
    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('Create Assignment Campaign')}
            breadcrumb={breadcrumb}
          />
        }
        actionBar={
          <Wrapper.ActionBar
            left={<Title>{__('Create Assignment Campaign')}</Title>}
          />
        }
        content={
          <DataWithLoader
            data={content}
            loading={false}
            emptyText="Nejsou žádná data"
            emptyImage="/images/actions/5.svg"
          />
        }
        leftSidebar={<Sidebar />}
        transparent={true}
        hasBorder
      />
    );
  }
}

export default CreateForm;
