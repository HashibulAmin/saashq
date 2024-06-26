import { IAttachment, IFormProps } from '@saashq/ui/src/types';

import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import Form from '@saashq/ui/src/components/form/Form';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { IFile } from '../../types';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import React from 'react';
import Select from 'react-select-plus';
import SelectTeamMembers from '@saashq/ui/src/team/containers/SelectTeamMembers';
import Uploader from '@saashq/ui/src/components/Uploader';
import { __ } from 'coreui/utils';

type Props = {
  file?: IFile;
  documents: any;
  queryParams: any;
  saveFile: (attr: any) => void;
  closeModal: () => void;
};

type State = {
  userId: string;
  selectedDocument: any;
  attachments: any;
};

class DynamicForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      userId: '',
      selectedDocument: {} as any,
      attachments: [],
    };
  }

  onChangeAttachments = (attachments: IAttachment[]) =>
    this.setState({ attachments });

  usersOnChange = (userId) => {
    this.setState({ userId });
  };

  onSave = (values) => {
    const { userId, selectedDocument, attachments } = this.state;
    const { queryParams } = this.props;
    const attachment = attachments[0] || ({} as any);

    this.props.saveFile({
      name: values.name,
      type: 'dynamic',
      url: attachment.url,
      contentType: 'teamMember',
      contentTypeId: userId,
      documentId: selectedDocument.value,
      folderId: queryParams && queryParams._id ? queryParams._id : '',
      info: attachment,
    });
  };

  generateParams = (options) => {
    return options.map((option) => ({
      value: option._id,
      label: option.name,
    }));
  };

  renderContent = (formProps: IFormProps) => {
    const { file } = this.props;
    const object = file || ({} as IFile);

    const onChange = (selectedDocument) => {
      this.setState({ selectedDocument });
    };

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>{__('Název')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.name}
            required={true}
            autoFocus={true}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>{__('Team member')}</ControlLabel>
          <SelectTeamMembers
            label={__('Choose team member')}
            name="userId"
            onSelect={this.usersOnChange}
            multi={false}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>{__('Document')}</ControlLabel>
          <Select
            placeholder={__('Choose document')}
            value={this.state.selectedDocument}
            options={this.generateParams(this.props.documents)}
            onChange={onChange}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>{__('Attachment')}</ControlLabel>
          <Uploader
            defaultFileList={[]}
            onChange={this.onChangeAttachments}
            single={true}
          />
        </FormGroup>

        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={this.props.closeModal}
            icon="times-circle"
          >
            {__('Zrušení')}
          </Button>

          <Button type="submit" btnStyle="success" icon="check-circle">
            {__('Uložit')}
          </Button>
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} onSubmit={this.onSave} />;
  }
}

export default DynamicForm;
