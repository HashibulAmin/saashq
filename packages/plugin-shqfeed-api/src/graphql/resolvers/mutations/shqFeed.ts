// import { sendMobileNotification } from "../../../utils";
import { checkPermission } from '@saashq/api-utils/src';
import { sendCoreMessage, sendNotification } from '../../../messageBroker';

export const gatherDescriptions = async () => {
  const extraDesc = [];
  const description = 'description';

  return { extraDesc, description };
};

const shqFeedMutations = {
  shqFeedAdd: async (_root, doc, { user, docModifier, models, subdomain }) => {
    const shqFeed = await models.ShqFeed.createShqFeed(docModifier(doc), user);

    // await putCreateLog(
    //   messageBroker,
    //   gatherDescriptions,
    //   {
    //     type: 'shqFeed',
    //     newData: doc,
    //     object: shqFeed,
    //     extraParams: { models }
    //   },
    //   user
    // );

    const unit = await sendCoreMessage({
      subdomain,
      action: 'units.findOne',
      data: {
        _id: doc.unitId
      },
      isRPC: true,
      defaultValue: []
    });

    let receivers = await sendCoreMessage({
      subdomain,
      action: 'users.find',
      data: {
        query: {
          $or: [
            { departmentIds: { $in: doc?.departmentIds || [] } },
            { branchIds: { $in: doc?.branchIds || [] } },
            { _id: { $in: unit?.userIds || [] } },
            { _id: { $in: doc?.recipientIds || [] } }
          ]
        }
      },
      isRPC: true,
      defaultValue: []
    });

    if (doc && doc.contentType === 'publicHoliday') {
      receivers = await sendCoreMessage({
        subdomain,
        action: 'users.find',
        data: {
          query: {
            _id: { $ne: user._id }
          }
        },
        isRPC: true,
        defaultValue: []
      });
    }

    const receiversEmail = receivers.map(r => r.email);

    receivers = receivers.map(r => r._id);

    if (doc.contentType === 'bravo') {
      receivers = doc.recipientIds;
    }

    sendNotification(subdomain, {
      createdUser: user,
      title: doc.title,
      contentType: 'shqFeed',
      contentTypeId: shqFeed._id,
      notifType: 'plugin',
      action: `${doc.contentType} created`,
      content: doc.description,
      link: `/saashq-plugin-shq-feed/list=${shqFeed._id}`,
      receivers
    });

    sendCoreMessage({
      subdomain,
      action: 'sendMobileNotification',
      data: {
        title: doc.title,
        body: doc.description,
        receivers
      }
    });

    sendCoreMessage({
      subdomain,
      action: 'sendEmail',
      data: {
        toEmails: [receiversEmail],
        title: `New post - ${doc.title}`,
        template: {
          data: {
            content: doc.description
          }
        }
      }
    });

    if (doc.type === 'bravo' && models.Shqs) {
      for (const userId of doc.recipientIds || []) {
        await models.Shqs.useScoring(userId, 'shqBravoAdd');
      }
    }

    return shqFeed;
  },

  shqFeedEdit: async (
    _root,
    { _id, ...doc },
    { user, docModifier, models }
  ) => {
    const updated = await models.ShqFeed.updateShqFeed(
      _id,
      docModifier(doc),
      user
    );

    // await putUpdateLog(
    //   messageBroker,
    //   gatherDescriptions,
    //   {
    //     type: 'shqFeed',
    //     object: shqFeed,
    //     newData: { ...doc },
    //     updatedDocument: updated,
    //     extraParams: { models }
    //   },
    //   user
    // );

    return updated;
  },

  shqFeedRemove: async (_root, { _id }, { models, user, messageBroker }) => {
    const shqFeed = await models.ShqFeed.removeShqFeed(_id);

    // await putDeleteLog(
    //   messageBroker,
    //   gatherDescriptions,
    //   {
    //     type: 'shqFeed',
    //     object: shqFeed,
    //     extraParams: { models }
    //   },
    //   user
    // );

    return shqFeed;
  },

  shqFeedToggleIsPinned: async (_root, { _id }, { models }) => {
    const shqFeed = await models.ShqFeed.getShqFeed(_id);

    await models.ShqFeed.updateOne(
      { _id },
      { $set: { isPinned: !shqFeed.isPinned } }
    );

    return !shqFeed.isPinned;
  },

  shqFeedEventGoingOrInterested: async (
    _root,
    { _id, goingOrInterested },
    { models, user }
  ) => {
    const shqFeed = await models.ShqFeed.getShqFeed(_id);

    const updateModifier: { $push?: any; $pull?: any } = {};
    const eventData = shqFeed.eventData || {};

    if (goingOrInterested === 'neither') {
      updateModifier.$pull = {
        'eventData.goingUserIds': user._id,
        'eventData.interestedUserIds': user._id
      };
    } else if (goingOrInterested === 'interested') {
      if ((eventData.interestedUserIds || []).includes(user._id)) {
        return shqFeed;
      }

      updateModifier.$pull = { 'eventData.goingUserIds': user._id };
      updateModifier.$push = { 'eventData.interestedUserIds': user._id };
    } else if (goingOrInterested === 'going') {
      if ((eventData.goingUserIds || []).includes(user._id)) {
        return shqFeed;
      }

      updateModifier.$push = { 'eventData.goingUserIds': user._id };
      updateModifier.$pull = { 'eventData.interestedUserIds': user._id };
    }

    await models.ShqFeed.updateOne({ _id }, updateModifier);

    return models.ShqFeed.getShqFeed(_id);
  }
};

checkPermission(shqFeedMutations, 'shqFeedAdd', 'manageShqActivityFeed');
checkPermission(shqFeedMutations, 'shqFeedEdit', 'manageShqActivityFeed');
checkPermission(shqFeedMutations, 'shqFeedRemove', 'manageShqActivityFeed');
checkPermission(
  shqFeedMutations,
  'shqFeedToggleIsPinned',
  'manageShqActivityFeed'
);
checkPermission(
  shqFeedMutations,
  'shqFeedEventGoingOrInterested',
  'manageShqActivityFeed'
);

export default shqFeedMutations;
