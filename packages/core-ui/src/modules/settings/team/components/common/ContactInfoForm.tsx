import React from 'react';
import Uploader from '@saashq/ui/src/components/Uploader';
import { FormControl, FormGroup } from '@saashq/ui/src/components/form';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { __ } from 'modules/common/utils';
import { IAttachment } from '@saashq/ui/src/types';

type Props = {
  object: any;
  formProps: any;
  setLinks: (links: any) => void;
  links: any;
  setCoordinate: (coordinate: any) => void;
  coordinate: any;
  setImage: (image: IAttachment | null) => void;
  image: IAttachment | null;
};

export default function ContactInfoForm(props: Props) {
  const {
    object,
    formProps,
    setLinks,
    links,
    setCoordinate,
    coordinate,
    setImage,
    image,
  } = props;

  const onChangeLink = (e) => {
    const { name, value } = e.target;

    setLinks({ ...links, [name]: value });
  };

  const onChangeCoordinate = (e) => {
    const { name, value } = e.target;

    setCoordinate({ ...coordinate, [name]: value });
  };

  const onChangeImage = (images) => {
    if (images && images.length > 0) {
      setImage(images[0]);
    } else {
      setImage(null);
    }
  };

  return (
    <>
      <FormGroup>
        <ControlLabel>{__('Telefonní číslo')}</ControlLabel>
        <FormControl
          {...formProps}
          name="phoneNumber"
          defaultValue={object.phoneNumber}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>{__('E-mailem')}</ControlLabel>
        <FormControl {...formProps} name="email" defaultValue={object.email} />
      </FormGroup>
      <FormGroup>
        <ControlLabel>{__('Zeměpisná délka')}</ControlLabel>
        <FormControl
          name="longitude"
          onChange={onChangeCoordinate}
          defaultValue={coordinate.longitude}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>{__('Zeměpisná šířka')}</ControlLabel>
        <FormControl
          name="latitude"
          onChange={onChangeCoordinate}
          defaultValue={coordinate.latitude}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>{__('Webová stránka')}</ControlLabel>
        <FormControl
          name="website"
          placeholder="https://example.com"
          defaultValue={links.website}
          onChange={onChangeLink}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>{__('Facebook')}</ControlLabel>
        <FormControl
          name="facebook"
          placeholder="https://facebook.com"
          defaultValue={links.facebook}
          onChange={onChangeLink}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>{__('Twitter')}</ControlLabel>
        <FormControl
          name="twitter"
          defaultValue={links.twitter}
          placeholder="https://twitter.com"
          onChange={onChangeLink}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>{__('Youtube')}</ControlLabel>
        <FormControl
          name="youtube"
          defaultValue={links.youtube}
          placeholder="https://youtube.com"
          onChange={onChangeLink}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>{__('Obraz')}</ControlLabel>
        <Uploader
          defaultFileList={image ? [image] : []}
          onChange={onChangeImage}
          single={true}
        />
      </FormGroup>
    </>
  );
}
