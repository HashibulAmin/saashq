const ShqThanks = {
  async createdUser(shqThank) {
    return (
      shqThank.createdBy && {
        __typename: 'User',
        _id: shqThank.createdBy
      }
    );
  },

  async recipients({ recipientIds }) {
    return (recipientIds || []).map(_id => ({
      __typename: 'User',
      _id
    }));
  }
};

export default ShqThanks;
