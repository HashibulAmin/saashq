import client from '@saashq/ui/src/apolloClient';
import { gql } from '@apollo/client';
import React from 'react';
import { queries } from '../../graphql';
import { getEnv, __ } from '@saashq/ui/src/utils';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import { Button, Alert } from '@saashq/ui/src';
import { IStage } from '../../types';
import FormControl from '@saashq/ui/src/components/form/Control';
import { ControlLabel, FormGroup, Table } from '@saashq/ui/src/components';
import { FormColumn, FormWrapper } from '@saashq/ui/src/styles/main';
import SelectBrands from '@saashq/ui/src/brands/containers/SelectBrands';

type Props = {
  item: any;
  toggleModal: () => void;
  stage: IStage;
};

type State = {
  documents: any[];
  loading: boolean;
  selectedDocumentId: string;
  selectedDocumentName: string;
  copies: number;
  width: number;
  brandId: string;
  item: any;
  checked: boolean;
  renderModal: boolean;
  toggleModal: () => void;
};

export default class StageModal extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      renderModal: false,
      documents: [],
      loading: false,
      checked: false,
      item: [],
      selectedDocumentId: '',
      selectedDocumentName: '',
      copies: Number(
        localStorage.getItem('saashq_stages_documents_copies') || 1,
      ),
      width: Number(
        localStorage.getItem('saashq_stages_documents_width') || 300,
      ),
      brandId: localStorage.getItem('saashq_stages_documents_brandIds') || '',
      toggleModal: () => {},
    };
  }

  onChangeCheckbox = (id: string, isChecked: boolean) => {
    const { item } = this.props;
    const changeItems = [...item];
    changeItems.map((item) => {
      if (item._id === id) {
        item.checked = isChecked;
      }
    });

    this.setState({ item: changeItems });
  };

  onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value } as any, () => {
      localStorage.setItem(`saashq_stages_documents_${name}`, value);
    });
  };

  onChangeBrand = (brandId) => {
    this.setState({ brandId }, () => {
      localStorage.setItem(`saashq_stages_documents_brandIds`, brandId);
    });
  };

  loadDocuments = () => {
    this.setState({ loading: true });

    client
      .mutate({
        mutation: gql(queries.documents),
        variables: { contentType: 'cards', subType: 'stageDeal' },
      })
      .then(({ data }) => {
        this.setState({
          documents: data.documents,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };
  print = () => {
    const { item, selectedDocumentId, copies, width, brandId } = this.state;

    const apiUrl = getEnv().REACT_APP_API_URL; // Replace this with your API URL
    if (!selectedDocumentId) return Alert.error('Vyberte prosím dokument !!!');
    try {
      const checkedItemIds = item
        .filter((item) => item.checked) // Filter only checked items
        .map((item) => item._id); // Map to an array of _id values

      if (checkedItemIds.length === 0) {
        return Alert.error('Vyberte položku !!!');
      }

      const url = `${apiUrl}/pl:documents/print?_id=${selectedDocumentId}&itemIds=${checkedItemIds}&stageId=${this.props.stage._id}&copies=${copies}&width=${width}&brandId=${brandId}&contentype=cards:stage`;

      // Open the URL in a new browser window
      window.open(url);
    } catch (error) {
      return Alert.error('An error occurred', error);
    }
  };
  onchangeDocument = (itemId, itemName) => {
    // Update the selectedDocumentId in the state
    this.setState({
      selectedDocumentId: itemId,
      selectedDocumentName: itemName,
    });

    // Perform additional actions as needed based on the selected item
  };

  renderDropdown() {
    const { loading } = this.state;

    const { selectedDocumentId, documents } = this.state;

    return (
      <Dropdown onClick={this.loadDocuments}>
        {loading ? 'loading' : ''}
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selectedDocumentId
            ? documents.find((item) => item._id === selectedDocumentId)?.name ||
              'Vyberte Dokument'
            : 'Vyberte Dokument'}
          {}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {documents.map((item) => (
            <Dropdown.Item
              key={item._id}
              onSelect={() => this.onchangeDocument(item._id, item.name)}
            >
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  render() {
    const { item, toggleModal } = this.props;

    return (
      <Modal
        centered
        show={true}
        onHide={toggleModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{__('Tisk dokumentu')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormWrapper>
            <FormColumn>
              <FormGroup>
                <ControlLabel required={true}>Kopie</ControlLabel>
                <FormControl
                  type="number"
                  name="copies"
                  required={true}
                  autoFocus={true}
                  onChange={this.onChange}
                  value={this.state.copies}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel required={true}>Width</ControlLabel>
                <FormControl
                  type="number"
                  name="width"
                  required={true}
                  autoFocus={true}
                  value={this.state.width}
                  onChange={this.onChange}
                />
              </FormGroup>
            </FormColumn>
            <FormColumn>
              <FormGroup>
                <ControlLabel>Značka</ControlLabel>
                <SelectBrands
                  label={__('Vyberte si značky')}
                  initialValue={this.state.brandId}
                  name="brandId"
                  customOption={{
                    label: 'Žádná značka (noBrand)',
                    value: 'noBrand',
                  }}
                  onSelect={(brandId) => this.onChangeBrand(brandId)}
                  multi={false}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel required={true}>Vyberte dokument</ControlLabel>
                {this.renderDropdown()}
              </FormGroup>
            </FormColumn>
          </FormWrapper>
          <Table>
            <thead>
              <tr>
                <th>{__('Číslo')}</th>
                <th>{__('Název')}</th>
                <th>{__('Akce')}</th>
              </tr>
            </thead>
            <tbody>
              {item.map((item) => (
                <tr key={item._id}>
                  <td>{item.number}</td>
                  <td>{item.name}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(event) =>
                        this.onChangeCheckbox(item._id, event.target.checked)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <Modal.Footer>
              <Button onClick={this.print} icon="print">
                Tisk
              </Button>
            </Modal.Footer>
          </Table>
        </Modal.Body>
      </Modal>
    );
  }
}
