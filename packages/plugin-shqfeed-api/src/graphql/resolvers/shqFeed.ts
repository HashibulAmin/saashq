import { sendReactionsMessage } from '../../messageBroker';

const ShqFeeds = {
  createdUser(shqFeed) {
    return (
      shqFeed.createdBy && {
        __typename: 'User',
        _id: shqFeed.createdBy
      }
    );
  },

  updatedUser(shqFeed) {
    return (
      shqFeed.updatedBy && {
        __typename: 'User',
        _id: shqFeed.updatedBy
      }
    );
  },

  recipients(shqFeed) {
    return (shqFeed.recipientIds || []).map(_id => ({
      __typename: 'User',
      _id
    }));
  },

  eventGoingUsers(shqFeed) {
    const { eventData = {} } = shqFeed;
    const { goingUserIds } = eventData;

    return (goingUserIds || []).map(_id => ({
      __typename: 'User',
      _id
    }));
  },

  eventInterestedUsers(shqFeed) {
    const { eventData = {} } = shqFeed;
    const { interestedUserIds } = eventData;

    return (interestedUserIds || []).map(_id => ({
      __typename: 'User',
      _id
    }));
  },

  async commentCount(shqFeed) {
    try {
      return await sendReactionsMessage({
        subdomain: 'os',
        action: 'comments.count',
        data: {
          contentId: shqFeed._id,
          contentType: 'shqFeed'
        },
        isRPC: true,
        defaultValue: 0
      });
    } catch (e) {
      return 0;
    }
  },

  async likeCount(shqFeed) {
    try {
      return await sendReactionsMessage({
        subdomain: 'os',
        action: 'emojies.likeCount',
        data: {
          contentId: shqFeed._id,
          contentType: 'shqFeed',
          type: 'like'
        },
        isRPC: true,
        defaultValue: 0
      });
    } catch (e) {
      return 0;
    }
  },

  async heartCount(shqFeed) {
    try {
      return await sendReactionsMessage({
        subdomain: 'os',
        action: 'emojies.heartCount',
        data: {
          contentId: shqFeed._id,
          contentType: 'shqFeed',
          type: 'heart'
        },
        isRPC: true,
        defaultValue: 0
      });
    } catch (e) {
      return 0;
    }
  },

  async isHearted(shqFeed, {}, { user }) {
    try {
      return await sendReactionsMessage({
        subdomain: 'os',
        action: 'emojies.isHearted',
        data: {
          contentId: shqFeed._id,
          contentType: 'shqFeed',
          type: 'heart',
          userId: user._id
        },
        isRPC: true,
        defaultValue: false
      });
    } catch (e) {
      return 0;
    }
  },

  async isLiked(shqFeed, {}, { user }) {
    try {
      return await sendReactionsMessage({
        subdomain: 'os',
        action: 'emojies.isLiked',
        data: {
          contentId: shqFeed._id,
          contentType: 'shqFeed',
          type: 'like',
          userId: user._id
        },
        isRPC: true,
        defaultValue: false
      });
    } catch (e) {
      return 0;
    }
  }
};

export default ShqFeeds;
