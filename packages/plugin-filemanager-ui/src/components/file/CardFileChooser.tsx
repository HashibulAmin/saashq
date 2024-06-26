import { IFolder, IRelatedFiles } from '../../types';

import Box from '@saashq/ui/src/components/Box';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import FileChooser from '../../containers/file/FileChooser';
import Icon from '@saashq/ui/src/components/Icon';
import { Link } from 'react-router-dom';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import { SectionBodyItem } from '@saashq/ui/src/layout/styles';

type Props = {
  folderId: string;
  folders: IFolder[];
  relatedFiles: IRelatedFiles[];
  mainType: string;
  mainTypeId: string;
};

type State = {
  folderId: string;
};

class CardFileChooser extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      folderId: props.folderId || '',
    };
  }

  onChangeFolder = (folderId) => {
    this.setState({ folderId });
  };

  renderExtraButtons = () => {
    const { folders, mainType, mainTypeId, relatedFiles } = this.props;

    const renderFileChooser = (props) => {
      return (
        <FileChooser
          {...props}
          folderId={this.state.folderId}
          folders={folders}
          contentType={mainType}
          contentTypeId={mainTypeId}
          currentId={this.state.folderId}
          onChangeFolder={this.onChangeFolder}
          chosenFiles={relatedFiles || []}
        />
      );
    };

    return (
      <ModalTrigger
        title="Správa souborů"
        trigger={
          <button>
            <Icon icon="plus-circle" />
          </button>
        }
        size="xl"
        content={renderFileChooser}
      />
    );
  };

  renderFiles() {
    const { relatedFiles } = this.props;

    if (relatedFiles && ((relatedFiles[0] || {}).fileIds || []).length === 0) {
      return <EmptyState icon="file-alt" text="Žádné soubory" />;
    }

    return ((relatedFiles[0] || {}).files || []).map((file) => (
      <SectionBodyItem key={file._id}>
        <Link to={`/filemanager/details/${file.folderId}/${file._id}`}>
          {file.name || 'Unknown'}
        </Link>
      </SectionBodyItem>
    ));
  }

  render() {
    return (
      <Box
        title="Správce souborů"
        name="showFiles"
        extraButtons={this.renderExtraButtons()}
      >
        {this.renderFiles()}
      </Box>
    );
  }
}

export default CardFileChooser;
