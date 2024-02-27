import { IContext } from '../../../connectionResolver';
import { sendContactsMessage, sendFormsMessage } from '../../../messageBroker';

const blockQueries = {
  async getBalance(_root, { saashqCustomerId }, { models }: IContext) {
    const block = await models.Blocks.findOne({ saashqCustomerId });

    let balance = 0;

    if (block) {
      balance = block.balance;
    }

    return balance;
  },

  async totalInvestment(_root, _arg, { models }: IContext) {
    const total =
      (await models.Investments.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: '$amount',
            },
          },
        },
      ])) || [];

    const amount = total[0] ? total[0].total || 0 : 0;

    return amount;
  },

  async totalInvestmentCount(_root, _arg, { models }: IContext) {
    const total = await models.Investments.find({}).countDocuments();

    return total;
  },

  async investments(_root, { saashqCustomerId }, { models }: IContext) {
    return models.Investments.find({ saashqCustomerId }).sort({
      createdAt: -1,
    });
  },

  async isVerified(_root, { saashqCustomerId }, { models }: IContext) {
    let isVerified = 'false';

    const block = await models.Blocks.findOne({ saashqCustomerId });

    if (block) {
      isVerified = block.isVerified;
    }

    return isVerified;
  },
};

export default blockQueries;
