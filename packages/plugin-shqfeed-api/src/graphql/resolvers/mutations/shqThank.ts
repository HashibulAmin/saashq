import { checkPermission, requireLogin } from '@saashq/api-utils/src';
import { sendCoreMessage } from '../../../messageBroker';
import { TShqThank } from '../../../models/definitions/shq';

export const gatherDescriptions = async () => {
  let extraDesc = [];
  let description = 'description';

  return { extraDesc, description };
};

type TShqThankEdit = {
  _id: string;
} & TShqThank;

const shqThankMutations = {
  shqThankAdd: async (_root, doc: TShqThank, { user, docModifier, models }) => {
    const shqThank = models.ShqThanks.createThank(docModifier(doc), user);

    sendCoreMessage({
      subdomain: 'os',
      action: 'sendMobileNotification',
      data: {
        title: `${user.details.fullName} sent thank you to you`,
        body: doc.description,
        receivers: doc.recipientIds
      }
    });

    if (models.Shqs) {
      await models.Shqs.useScoring(user._id, 'shqThankAdd');

      for (const userId of doc.recipientIds || []) {
        await models.Shqs.useScoring(userId, 'shqThankAdd');
      }
    }

    return shqThank;
  },

  shqThankEdit: async (
    _root,
    { _id, ...doc }: TShqThankEdit,
    { user, docModifier, models }
  ) => {
    const updated = await models.ShqThanks.updateThank(
      _id,
      docModifier(doc),
      user
    );

    return updated;
  },

  shqThankRemove: async (_root, { _id }: { _id: string }, { models }) => {
    const shqThank = models.ShqThanks.removeThank(_id);

    return shqThank;
  }
};

checkPermission(shqThankMutations, 'shqThankAdd', 'manageShqActivityFeed');
checkPermission(shqThankMutations, 'shqThankEdit', 'manageShqActivityFeed');
checkPermission(shqThankMutations, 'shqThankRemove', 'manageShqActivityFeed');

export default shqThankMutations;
