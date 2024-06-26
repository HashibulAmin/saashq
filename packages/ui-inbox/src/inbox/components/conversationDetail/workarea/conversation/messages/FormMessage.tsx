import {
  BodyContent,
  PreviewBody,
  PreviewTitle,
  PrintButton,
} from '@saashq/ui/src/components/step/preview/styles';
import {
  CellWrapper,
  FieldWrapper,
  FormMessageInput,
  FormTable,
  ProductItem,
} from '../styles';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';

import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import ErrorBoundary from '@saashq/ui/src/components/ErrorBoundary';
import { FieldItem } from '@saashq/ui-forms/src/forms/styles';
import FilePreview from '@saashq/ui/src/components/FilePreview';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { IMessage } from '../../../../../types';
import React from 'react';
import Select from 'react-select-plus';
import { SidebarList } from '@saashq/ui/src/layout/styles';
import { Table } from '@saashq/ui/src/components';
import Tip from '@saashq/ui/src/components/Tip';
import { __ } from '@saashq/ui/src/utils';
import dayjs from 'dayjs';
import { readFile } from '@saashq/ui/src/utils/core';

type Props = {
  message: IMessage;
};

export default class FormMessage extends React.Component<Props, {}> {
  private componentRef;

  displayValue(data) {
    if (data.type === 'parentField') {
      const subFields = data.value;
      if (subFields.length === 0) {
        return null;
      }

      return subFields.map((e) => {
        return e.map((e2) => {
          return this.renderField(e2);
        });
      });
    }

    if (typeof data.value === 'object' && 'value' in data.value) {
      data.value = data.value.value;
    }

    if (data.validation === 'date') {
      return dayjs(data.value).format('YYYY/MM/DD');
    }

    if (data.validation === 'datetime') {
      return dayjs(data.value).format('YYYY/MM/DD HH:mm');
    }

    if (data.type === 'html') {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: data.value,
          }}
        />
      );
    }

    if (data.type === 'objectList') {
      // invalid data
      if (!data.value.map) {
        return null;
      }

      return data.value.map((obj) => {
        return (
          <>
            {Object.entries(obj).map((e, index) => {
              const key = e[0];
              const value: any = e[1] || '';

              return (
                <React.Fragment key={index}>
                  {key}: {value} <br />
                </React.Fragment>
              );
            })}
            <span>------------------------</span>
            <br />
          </>
        );
      });
    }

    if (data.type === 'map') {
      const description = data.value.description || '';
      return `Latitude: ${data.value.lat}, Longitude: ${data.value.lng} - ${description}`;
    }

    if (['file', 'avatar', 'company_avatar'].includes(data.type)) {
      let fileUrl = data.value || '';

      if (Array.isArray(data.value) && data.value.length > 0) {
        fileUrl = data.value[0].url;
      }

      return (
        <CellWrapper>
          <FilePreview fileUrl={fileUrl} />
        </CellWrapper>
      );
    }

    return data.value || '-';
  }

  renderMultiSelect(value: string) {
    const selectValues = value.split(',');

    return (
      <Select
        value={value}
        options={selectValues.map((e) => ({ value: e, label: e }))}
        multi={true}
      />
    );
  }

  renderProductData = (field) => {
    if (!field.value.hasOwnProperty('product')) {
      return <FormMessageInput>{this.displayValue(field)}</FormMessageInput>;
    }

    const { product, quantity } = field.value;

    const imageUrl = product.attachment ? product.attachment.url : '';

    return (
      <ProductItem>
        {imageUrl && <img src={readFile(imageUrl)} />}
        <SidebarList className="no-link flex">
          <Table>
            <thead>
              <tr>
                <th style={{ width: '40%' }}>{__('Jméno výrobku')}</th>
                <th style={{ width: '20%' }}>{__('Jednotková cena')}</th>
                <th style={{ width: '20%' }}>{__('Množství')}</th>
                <th style={{ width: '20%' }}>{__('Mezisoučet')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{product.name}</td>
                <td align="right">{product.unitPrice}</td>
                <td align="right">{quantity}</td>
                <td>{product.unitPrice * quantity}</td>
              </tr>
            </tbody>
          </Table>
        </SidebarList>
      </ProductItem>
    );
  };

  renderField(field) {
    return (
      <ErrorBoundary key={field._id}>
        <FieldWrapper column={field.column}>
          <FieldItem>
            <FormGroup>
              <ControlLabel ignoreTrans={true} required={field.isRequired}>
                {field.text}
              </ControlLabel>
              {field.type === 'multiSelect' ? (
                this.renderMultiSelect(field.value)
              ) : field.type === 'productCategory' ? (
                this.renderProductData(field)
              ) : (
                <FormMessageInput>{this.displayValue(field)}</FormMessageInput>
              )}
            </FormGroup>
          </FieldItem>
        </FieldWrapper>
      </ErrorBoundary>
    );
  }

  renderPrintBtn() {
    return (
      <PrintButton>
        <ReactToPrint content={() => this.componentRef}>
          <PrintContextConsumer>
            {({ handlePrint }) => (
              <Tip text={__('Tisk odpovědí')} placement="top">
                <Button btnStyle="link" onClick={handlePrint} icon="print" />
              </Tip>
            )}
          </PrintContextConsumer>
        </ReactToPrint>
      </PrintButton>
    );
  }

  render() {
    const { formWidgetData, content } = this.props.message;

    return (
      <FormTable ref={(el) => (this.componentRef = el)}>
        <PreviewTitle style={{ backgroundColor: '#6569DF' }}>
          <div>{content}</div>
        </PreviewTitle>
        <PreviewBody embedded="embedded">
          <BodyContent>
            {formWidgetData.map((field) => this.renderField(field))}
          </BodyContent>
        </PreviewBody>
        {this.renderPrintBtn()}
      </FormTable>
    );
  }
}
