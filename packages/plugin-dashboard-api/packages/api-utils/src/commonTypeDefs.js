"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentInput = exports.attachmentType = void 0;
exports.attachmentType = `
  type Attachment {
    url: String!
    name: String
    type: String
    size: Float
    duration: Float
  }
`;
exports.attachmentInput = `
  input AttachmentInput {
    url: String!
    name: String!
    type: String
    size: Float
    duration: Float
  }
`;
