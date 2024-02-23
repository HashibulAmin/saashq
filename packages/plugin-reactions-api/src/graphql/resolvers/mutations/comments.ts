import { requireLogin } from '@saashq/api-utils/src/permissions';

const commentMutations = {
  commentAdd: async (_root, doc, { user, docModifier, models }) => {
    const comment = await models.Comments.createComment(docModifier(doc), user);

    // if (models.Shqs) {
    //   await models.Shqs.useScoring(models, user._id, 'commentAdd');
    // }

    return comment;
  },

  commentEdit: async (
    _root,
    { _id, ...doc },
    { user, docModifier, models }
  ) => {
    const comment = await models.Comments.findOne({ _id });

    if (comment.createdBy !== user._id) {
      throw new Error('You can only edit your comment');
    }

    const updated = await models.Comments.updateComment(
      _id,
      docModifier(doc),
      user
    );

    return updated;
  },

  commentRemove: async (_root, { _id }, { models, user }) => {
    const comment = await models.Comments.findOne({ _id });

    if (comment.createdBy !== user._id) {
      throw new Error('You can only delete your comment');
    }

    // if (models.Shqs) {
    //   await models.Shqs.useScoring(models, user, 'commentRemove');
    // }

    return models.Comments.removeComment(_id);
  }
};

requireLogin(commentMutations, 'commentAdd');
requireLogin(commentMutations, 'commentEdit');
requireLogin(commentMutations, 'commentRemove');

export default commentMutations;
