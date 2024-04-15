import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { INTEGRATION_KINDS } from '@saashq/ui/src/constants/integrations';
import { IntegrationMutationVariables } from '../../types';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import React from 'react';
import SelectBrand from '../../containers/SelectBrand';
import SelectChannels from '../../containers/SelectChannels';
import { __ } from '@saashq/ui/src/utils';
import { loadDynamicComponent } from '@saashq/ui/src/utils/core';

type CommonTypes = {
  name: string;
  brandId: string;
  channelIds: string[];
  webhookData: any;
  isSubmitted: boolean;
  details: any;
};

type Props = {
  integrationId: string;
  integrationKind: string;
  name: string;
  brandId: string;
  channelIds: string[];
  webhookData: any;
  details: any;
  onSubmit: (
    id: string,
    { name, brandId, channelIds, details }: IntegrationMutationVariables,
    callback: () => void,
  ) => void;
  closeModal: () => void;
};

class CommonFieldForm extends React.PureComponent<Props, CommonTypes> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: props.name || '',
      brandId: props.brandId || '',
      channelIds: props.channelIds || [],
      webhookData: props.webhookData || {},
      details: props.details || {},
      isSubmitted: false,
    };
  }

  renderScript = () => {
    const { integrationKind } = this.props;

    if (integrationKind !== INTEGRATION_KINDS.WEBHOOK) {
      return null;
    }

    const { webhookData } = this.state;

    const onChangeWebhookData = (e) => {
      webhookData[e.target.name] = e.target.value;
      this.setState({
        webhookData: { ...webhookData },
      });
    };

    return (
      <>
        <FormGroup>
          <ControlLabel required={false}>Žeton</ControlLabel>
          <FormControl
            name="token"
            required={false}
            autoFocus={false}
            defaultValue={webhookData.token}
            onChange={onChangeWebhookData}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel required={false}>Původ</ControlLabel>
          <FormControl
            name="origin"
            required={false}
            autoFocus={false}
            defaultValue={webhookData.origin}
            onChange={onChangeWebhookData}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel required={false}>{__('Skript')}</ControlLabel>
          <FormControl
            name="script"
            componentClass="textarea"
            required={true}
            defaultValue={webhookData.script}
            onChange={onChangeWebhookData}
          />
        </FormGroup>
      </>
    );
  };

  render() {
    const { integrationId, onSubmit, closeModal } = this.props;
    const { name, brandId, channelIds, webhookData, details } = this.state;

    const onBrandChange = (e) => {
      this.setState({ brandId: e.target.value });
    };

    const onChannelChange = (values: string[]) => {
      this.setState({ channelIds: values });
    };

    const onDetailsChange = (key: string, value: any) => {
      details[key] = value;

      this.setState({ details: { ...details } });
    };

    const onNameBlur = (e) => {
      this.setState({ name: e.target.value });
    };

    const saveIntegration = (e) => {
      e.preventDefault();

      this.setState({ isSubmitted: true });

      let data: any;

      switch (this.props.integrationKind) {
        case 'webhook': {
          data = webhookData;
          break;
        }
      }

      onSubmit(integrationId, { name, brandId, channelIds, details }, () => {
        this.setState({ isSubmitted: false });
        closeModal();
      });
    };

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>{__('Název')}</ControlLabel>
          <FormControl
            required={true}
            defaultValue={name}
            onBlur={onNameBlur}
            autoFocus={true}
          />
        </FormGroup>

        {this.renderScript()}

        {loadDynamicComponent(
          'integrationDetailsForm',
          {
            integrationKind: this.props.integrationKind,
            details: this.state.details,
            onChange: onDetailsChange,
          },
          true,
        )}

        <SelectBrand
          isRequired={true}
          defaultValue={brandId}
          onChange={onBrandChange}
          description={__('Které konkrétní značce tato integrace patří?')}
        />
        <SelectChannels
          defaultValue={channelIds}
          isRequired={true}
          onChange={onChannelChange}
        />

        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="times-circle"
          >
            Zrušení
          </Button>
          <Button
            onClick={saveIntegration}
            type="submit"
            btnStyle="success"
            icon="check-circle"
          >
            {__('Uložit')}
          </Button>
        </ModalFooter>
      </>
    );
  }
}

export default CommonFieldForm;
