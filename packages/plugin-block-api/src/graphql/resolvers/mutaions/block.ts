import { putActivityLog } from '@saashq/api-utils/src/logUtils';
import { IContext } from '../../../connectionResolver';
import { sendContactsMessage } from '../../../messageBroker';
import { numberWithCommas, sendSms } from '../../../utils';

const blockMutations = {
  /**
   * Creates a new package
   */
  async invest(
    _root,
    doc: { saashqCustomerId: string; packageId: string; amount: number },
    { subdomain, models }: IContext,
  ) {
    const { packageId, saashqCustomerId, amount } = doc;

    const block = await models.Blocks.findOne({ saashqCustomerId });
    const balance = block?.balance || 0;

    const packageDetail = await models.Packages.findOne({ _id: packageId });

    if (!packageDetail) {
      throw new Error('Balíček nenalezen');
    }

    if (amount > balance) {
      throw new Error('Nedostatečná rovnováha');
    }

    const newBalance = balance - amount;

    await models.Blocks.updateOne(
      { saashqCustomerId },
      { balance: newBalance },
    );

    await putActivityLog(subdomain, {
      action: 'add',
      data: {
        action: 'invest',
        contentType: 'block:invest',
        createdBy: 'service',
        contentId: saashqCustomerId,
        content: { packageId, amount },
      },
    });

    const customer = await sendContactsMessage({
      subdomain,
      action: 'customers.findOne',
      data: {
        _id: saashqCustomerId,
      },
      isRPC: true,
    });

    const numberAmount = numberWithCommas(amount);

    const body = `UB GROUP: Odesláno ${numberAmount} testovací zprávy. Odesílání testovacích SMS zpráv na 72228888`;

    await sendSms(subdomain, customer.primaryPhone, body);

    const investment = await models.Investments.createInvestment(doc);

    return investment;
  },

  async addBalance(
    _root,
    doc: { saashqCustomerId: string; amount: number },
    { subdomain, models }: IContext,
  ) {
    const { saashqCustomerId, amount } = doc;
    const block = await models.Blocks.findOne({ saashqCustomerId });
    const customer = await sendContactsMessage({
      subdomain,
      action: 'customers.findOne',
      data: {
        _id: saashqCustomerId,
      },
      isRPC: true,
    });

    if (block) {
      const currentBalance = block.balance || 0;

      const updatedBalance = currentBalance + amount;

      await models.Blocks.updateOne(
        { saashqCustomerId },
        { balance: updatedBalance },
      );
    } else {
      await models.Blocks.create({ saashqCustomerId, balance: amount });
    }

    const numberAmount = numberWithCommas(amount);

    const body = `UB GROUP: Odesláno ${numberAmount} testovací zprávy. Odesílání testovacích SMS zpráv na 72228888`;

    await sendSms(subdomain, customer.primaryPhone, body);

    return block;
  },

  async updateVerify(
    _root,
    doc: { saashqCustomerId: string; isVerified: string },
    { subdomain, models }: IContext,
  ) {
    const { saashqCustomerId, isVerified } = doc;
    const block = await models.Blocks.findOne({ saashqCustomerId });

    if (block) {
      await models.Blocks.updateOne({ saashqCustomerId }, { isVerified });
    } else {
      await models.Blocks.create({ saashqCustomerId, isVerified });
    }

    if (isVerified === 'true') {
      const customer = await sendContactsMessage({
        subdomain,
        action: 'customers.findOne',
        data: {
          _id: saashqCustomerId,
        },
        isRPC: true,
      });

      const body = `UB GROUP: Odesláno testovací zprávy. Odesílání testovacích SMS zpráv na 72228888`;

      await sendSms(subdomain, customer.primaryPhone, body);
    }

    return block;
  },
};

export default blockMutations;
