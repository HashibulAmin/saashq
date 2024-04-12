import {
  FileUploadBox,
  FullContent,
  ImportHeader,
  UploadText,
} from '../../styles';
import { FlexItem, FlexPad } from 'modules/common/components/step/styles';
import { __, loadDynamicComponent } from 'modules/common/utils';
import { renderText } from '../../utils';

import { IAttachment } from 'modules/common/types';
import { IImportHistoryContentType } from '../../types';
import React from 'react';
import Uploader from '@saashq/ui/src/components/Uploader';

type Props = {
  onChangeAttachment: (files: IAttachment[], contentType: string) => void;
  contentTypes: IImportHistoryContentType[];
  type: string;
};

class FileUpload extends React.Component<Props, {}> {
  rendertContent = () => {
    const { contentTypes, onChangeAttachment } = this.props;

    return contentTypes.map((contentType) => {
      const onChange = (attachmentsAtt) =>
        onChangeAttachment(attachmentsAtt, contentType.contentType);

      return (
        <FileUploadBox key={contentType.contentType}>
          <UploadText>
            <p>{renderText(contentType.contentType)}</p>
            {loadDynamicComponent('importExportUploadForm', {
              contentType: contentType.contentType,
            })}
          </UploadText>

          <Uploader
            text={`Vyberte soubor, který chcete nahrát ${renderText(
              contentType.contentType,
            )}.`}
            warningText={'Podporován je pouze soubor .csv.'}
            icon={contentType.icon || 'users-alt'}
            accept=".csv"
            single={true}
            defaultFileList={[]}
            onChange={onChange}
          />
        </FileUploadBox>
      );
    });
  };

  render() {
    return (
      <FlexItem>
        <FlexPad direction="column" overflow="auto">
          <ImportHeader>{__(`Nahrajte svůj soubor`)}</ImportHeader>
          <ImportHeader fontSize="small">
            {__(
              'Před nahráním souborů níže se ujistěte, že je soubor připraven k importu.',
            )}
          </ImportHeader>
          <FullContent center={true}>
            <div style={{ marginBottom: '30px' }}>{this.rendertContent()}</div>
          </FullContent>
        </FlexPad>
      </FlexItem>
    );
  }
}

export default FileUpload;
