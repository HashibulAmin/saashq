import { IModels } from './connectionResolver';
import { sendInboxMessage } from './messageBroker';
import { ICustomer } from './models/definitions/customers';

export const getOrCreateCustomer = async (
  models: IModels,
  subdomain: string,
  callAccount: ICustomer & { recipientId?: String },
) => {
  const { inboxIntegrationId, primaryPhone } = callAccount;
  let customer = await models.Customers.findOne({
    primaryPhone,
  });

  if (!customer) {
    try {
      customer = await models.Customers.create({
        inboxIntegrationId,
        saashqApiId: null,
        primaryPhone: primaryPhone,
      });
    } catch (e) {
      throw new Error(
        e.message.includes('duplicate')
          ? 'Souběžný požadavek: duplikace zákazníka'
          : e,
      );
    }
    try {
      const apiCustomerResponse = await sendInboxMessage({
        subdomain,
        action: 'integrations.receive',
        data: {
          action: 'get-create-update-customer',
          payload: JSON.stringify({
            integrationId: inboxIntegrationId,
            primaryPhone: primaryPhone,
            isUser: true,
            phone: [primaryPhone],
          }),
        },
        isRPC: true,
      });
      customer.saashqApiId = apiCustomerResponse._id;
      await customer.save();
    } catch (e) {
      await models.Customers.deleteOne({ _id: customer._id });
      throw new Error(e);
    }
  }

  return customer;
};
