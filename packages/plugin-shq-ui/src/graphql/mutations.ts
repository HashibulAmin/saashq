const commonParamsDef = `
  $name: String,
  $description: String,
  $features: [ShqFeatureInput],
  $logo: AttachmentInput,
  $appearance: ShqAppearanceInput,
  $url: String
  $favicon: AttachmentInput
  $webName: String
  $webDescription: String
  $vision: String
  $structure: String
  $knowledgeBaseLabel: String
  $knowledgeBaseTopicId: String
  $ticketLabel: String
  $ticketPipelineId: String
  $ticketBoardId: String
`;

const commonParams = `
  name: $name,
  description: $description,
  features: $features,
  logo: $logo,
  appearance: $appearance,
  url: $url
  favicon: $favicon
  webName: $webName
  webDescription: $webDescription
  vision: $vision
  structure: $structure
  knowledgeBaseLabel: $knowledgeBaseLabel
  knowledgeBaseTopicId: $knowledgeBaseTopicId
  ticketLabel: $ticketLabel
  ticketPipelineId: $ticketPipelineId
  ticketBoardId: $ticketBoardId
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
