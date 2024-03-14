import { IModels } from './connectionResolver';

export const removeCustomers = async (models: IModels, params) => {
  const { customerIds } = params;
  const selector = { saashqApiId: { $in: customerIds } };

  await models.Customers.deleteMany(selector);
};
