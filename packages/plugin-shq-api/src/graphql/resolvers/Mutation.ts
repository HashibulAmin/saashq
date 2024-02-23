import { checkPermission } from '@saashq/api-utils/src/permissions';
import { IContext } from '../../connectionResolver';
import { sendCoreMessage } from '../../messageBroker';

const shqMutations = {
  /**
   * Create new message
   */
  async shqsAdd(_root, doc: any, { user, models }: IContext) {
    const shq = await models.Shqs.createShq(doc, user);

    return shq;
  },

  async shqsEdit(_root, { _id, ...doc }: any, { models }: IContext) {
    const updated = await models.Shqs.updateShq(_id, doc);

    return updated;
  },

  async shqsRemove(_root, { _id }: any, { models }: IContext) {
    const updated = await models.Shqs.removeShq(_id);

    return updated;
  },

  async userRegistrationCreate(_root, doc, { subdomain }: IContext) {
    const { email } = doc;

    const mail = email.toLowerCase().trim();

    const userCount = await sendCoreMessage({
      subdomain,
      action: 'users.getCount',
      data: {
        query: {
          email: mail
        }
      },
      isRPC: true
    });

    if (userCount > 0) {
      throw new Error('You have already registered');
    }

    try {
      return sendCoreMessage({
        subdomain,
        action: 'users.create',
        data: {
          isActive: false,
          email: mail,
          password: doc.password
        },
        isRPC: true
      });
    } catch (e) {
      throw e;
    }
  }
};

checkPermission(shqMutations, 'shqsAdd', 'shqsAdd');
checkPermission(shqMutations, 'updateShq', 'updateShq');
checkPermission(shqMutations, 'removeShq', 'removeShq');

export default shqMutations;
