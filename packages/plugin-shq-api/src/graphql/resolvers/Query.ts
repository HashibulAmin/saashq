import { checkPermission } from '@saashq/api-utils/src/permissions';

import { IContext } from '../../connectionResolver';

const shqQueries = {
  /**
   * Group engage messages counts by kind, status, tag
   */
  async shqs(_root, args: any, { models }: IContext) {
    return {
      list: await models.Shqs.find(args).sort({ createdAt: -1 }),
      totalCount: await models.Shqs.countDocuments()
    };
  },

  async shqGet(_root, _args, { models }) {
    return models.Shqs.findOne().sort({ createdAt: -1 });
  }
};

checkPermission(shqQueries, 'shqs', 'showShqs', []);
checkPermission(shqQueries, 'shqGet', 'showShqs', []);

export default shqQueries;
