const externalId = '_id: String! @external';
const keyFields = '@key(fields: "_id")';

export const types = () => {
  return `
    extend type User ${keyFields} {
      ${externalId}
    }

    input AttachmentInput {
      url: String!
      name: String!
      type: String
      size: Float
      duration: Float
    }

    type ShqAppearance {
      primaryColor: String
      secondaryColor: String
      bodyColor: String
      headerColor: String
      footerColor: String
    }

    type ShqFeature {
      _id: String
      icon: String
      name: String
      description: String
      contentType: String
      contentId: String
      subContentId: String
    }

    type Shq {
      _id: String
      name: String
      webName: String
      webDescription: String
      description: String
      logo: JSON
      url: String
      favicon: JSON
      features: [ShqFeature]
      appearance: ShqAppearance
      vision: String
      structure: String
      knowledgeBaseLabel: String
      knowledgeBaseTopicId: String
      ticketLabel: String
      ticketPipelineId: String
      ticketBoardId: String
      createdAt: Date
      createdBy: String
    }

    type ShqList {
      list: [Shq]
      totalCount: Int
    }

    input ShqAppearanceInput {
      primaryColor: String
      secondaryColor: String
      bodyColor: String
      headerColor: String
      footerColor: String
    }

    input ShqFeatureInput {
      _id: String
      icon: String
      name: String
      description: String
      contentType: String
      contentId: String
      subContentId: String
    }
  `;
};

export const queries = `
  shqs(name: String, page: Int, perPage: Int): ShqList
  shqGet: Shq
`;

const commonParams = `
  name: String
  description: String
  webName: String
  webDescription: String
  url: String
  features: [ShqFeatureInput]
  logo: AttachmentInput
  favicon: AttachmentInput
  appearance: ShqAppearanceInput
  vision: String
  structure: String
  knowledgeBaseLabel: String
  knowledgeBaseTopicId: String
  ticketLabel: String
  ticketPipelineId: String
  ticketBoardId: String
`;

export const mutations = `
  shqsAdd(${commonParams}): Shq
  shqsEdit(_id: String, ${commonParams}): Shq
  shqsRemove(_id: String!): JSON
  userRegistrationCreate(email:String, password:String): User
`;
