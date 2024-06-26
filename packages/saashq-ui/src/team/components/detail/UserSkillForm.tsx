import { Alert, __ } from '@saashq/ui/src/utils';
import React, { useState } from 'react';

import Button from '@saashq/ui/src/components/Button';
import ButtonMutate from '@saashq/ui/src/components/ButtonMutate';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { IUser } from '@saashq/ui/src/auth/types';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import Select from 'react-select-plus';
import mutations from '../../graphql/mutations';

type Props = {
  refetchSkills: (memberId: string) => void;
  closeModal: () => void;
  handleSkillTypeSelect: (typeId: string, userId: string) => void;
  user: IUser;
  loading: boolean;
  skillTypes: any[]; //check - ISkillTypesDocument
  skills: any[]; //check - ISkillDocument
};

function UserSkillForm({
  skillTypes,
  skills,
  loading,
  handleSkillTypeSelect,
  refetchSkills,
  closeModal,
  user,
}: Props) {
  const [isSubmitted, setSubmitted] = useState<boolean>(false);
  const [type, setType] = useState(null);
  const [skillIds, setSkillIds] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (skillIds.length === 0) {
      return Alert.error('Vyberte prosím dovednost');
    }

    setSubmitted(true);
  };

  function renderContent() {
    const handleTypeSelect = (option) => {
      setType(option);

      handleSkillTypeSelect(option.value, user._id);
    };

    const handleSkillsChange = (
      options: [{ label: string; value: string }],
    ) => {
      setSkillIds(options.map((option) => option.value));
    };

    const handleRefetch = () => {
      return refetchSkills(user._id);
    };

    const getVariables = () => {
      if (!type) {
        return;
      }

      return {
        memberId: user._id,
        skillIds,
      };
    };

    const generateOptions = (options) => {
      return options.map((item) => ({ label: item.name, value: item._id }));
    };

    return (
      <>
        <FormGroup>
          <ControlLabel>Typ dovednosti</ControlLabel>
          <Select
            placeholder={__('Vyberte typ dovednosti')}
            value={type}
            options={generateOptions(skillTypes)}
            onChange={handleTypeSelect}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Dovednosti</ControlLabel>
          <Select
            placeholder={__('Nejprve si vyberte typ dovednosti')}
            value={skillIds}
            isLoading={loading}
            options={generateOptions(skills)}
            onChange={handleSkillsChange}
            multi={true}
          />
        </FormGroup>
        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="cancel-1"
          >
            Zrušení
          </Button>
          <ButtonMutate
            mutation={mutations.userAddSkill}
            variables={getVariables()}
            callback={closeModal}
            refetchQueries={handleRefetch}
            isSubmitted={isSubmitted}
            successMessage="Úspěšně jste přidali dovednost"
            type="submit"
          />
        </ModalFooter>
      </>
    );
  }

  return <form onSubmit={handleSubmit}>{renderContent()}</form>;
}

export default UserSkillForm;
