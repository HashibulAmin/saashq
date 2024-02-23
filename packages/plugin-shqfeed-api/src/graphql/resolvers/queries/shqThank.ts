import { checkPermission } from '@saashq/api-utils/src';

const shqThankQueries = {
  shqThanks: async (_root, { limit, skip, type }, { models, user }) => {
    const doc: { createdBy?: string; recipientIds?: any } = {};

    if (type === 'recipient') {
      doc.recipientIds = { $in: [user._id] };
    } else if (type === 'createdByMe') {
      doc.createdBy = user._id;
    }

    return {
      list: await models.ShqThanks.find(doc)
        .sort({ createdAt: -1 })
        .skip(skip || 0)
        .limit(limit || 20),
      totalCount: await models.ShqThanks.find(doc).countDocuments()
    };
  }
};

checkPermission(shqThankQueries, 'shqThanks', 'showShqActivityFeed');

export default shqThankQueries;
