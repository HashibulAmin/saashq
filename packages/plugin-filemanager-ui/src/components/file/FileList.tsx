import { IFile, IFolder } from '../../types';

import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import FileRow from './FileRow';
import FormControl from '@saashq/ui/src/components/form/Control';
import { ItemName } from '../../styles';
import React from 'react';
import SortHandler from '@saashq/ui/src/components/SortHandler';
import Table from '@saashq/ui/src/components/table';
import { __ } from '@saashq/ui/src/utils';
import withTableWrapper from '@saashq/ui/src/components/table/withTableWrapper';

type Props = {
  files: IFile[];
  folders: IFolder[];
  queryParams: any;
  remove: (fileId: string) => void;
  loading: boolean;
};

class FileList extends React.Component<Props> {
  onChange = () => {
    // const { toggleAll, customers } = this.props;
    // toggleAll(customers, 'customers');
  };

  renderFiles() {
    const { files, folders, queryParams, remove } = this.props;

    return (
      <withTableWrapper.Wrapper>
        <Table
          whiteSpace="nowrap"
          hover={true}
          bordered={true}
          responsive={true}
          wideHeader={true}
        >
          <thead>
            <tr>
              <th>
                <FormControl
                  checked={false}
                  componentClass="checkbox"
                  onChange={this.onChange}
                />
              </th>
              <th style={{ paddingLeft: '0' }}>
                <SortHandler sortField={'name'} label={__('Name')} />
              </th>
              <th>
                <SortHandler
                  sortField={'createdAt'}
                  label={__('Created Date')}
                />
              </th>
              <th>
                <SortHandler sortField={'size'} label={__('Size')} />
              </th>
              <th>{__('Actions')}</th>
            </tr>
          </thead>
          <tbody id="fileManagerfiles">
            <>
              {folders.map((folder: IFolder) => (
                <FileRow
                  key={folder._id}
                  item={folder}
                  queryParams={queryParams}
                  isFolder={true}
                />
              ))}
              {files.map((file) => (
                <FileRow
                  key={file._id}
                  item={file}
                  queryParams={queryParams}
                  remove={remove}
                />
              ))}
            </>
          </tbody>
        </Table>
      </withTableWrapper.Wrapper>
    );
  }

  render() {
    const { files, loading } = this.props;

    return (
      <DataWithLoader
        loading={loading}
        count={files.length}
        emptyContent={
          <EmptyState
            image="/images/actions/24.svg"
            text="Momentálně žádné soubory!"
          />
        }
        data={this.renderFiles()}
      />
    );
  }
}

export default FileList;
