const commonParamsDef = `
  $name: String,
  $description: String,
  $features: [ShqFeatureInput],
  $logo: AttachmentInput,
  $appearance: ShqAppearanceInput,
  $welcomeContent: [ShqWelcomeContentInput],
`;

const commonParams = `
  name: $name,
  description: $description,
  features: $features,
  logo: $logo,
  appearance: $appearance,
  welcomeContent: $welcomeContent,
`;

const shqsAdd = `
	mutation shqsAdd(${commonParamsDef}) {
		shqsAdd(${commonParams}) {
			_id
		}
	}
`;

const shqsEdit = `
	mutation shqsEdit($_id: String!, ${commonParamsDef} ) {
		shqsEdit(_id: $_id, ${commonParams}) {
			_id
		}
	}
`;

export default {
  shqsAdd,
  shqsEdit
};
