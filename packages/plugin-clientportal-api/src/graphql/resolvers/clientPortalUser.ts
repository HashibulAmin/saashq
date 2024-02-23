import { IContext } from '../../connectionResolver';
import { sendContactsMessage } from '../../messageBroker';
import { IUser } from '../../models/definitions/clientPortalUser';
import { customFieldsDataByFieldCode } from '../../utils';

const ClientPortalUser = {
  __resolveReference: ({ _id }, { models }: IContext) => {
    return models.ClientPortalUsers.findOne({ _id });
  },
  clientPortal(user, _args, { models: { ClientPortals } }: IContext) {
    return (
      user.clientPortalId &&
      ClientPortals.findOne({
        _id: user.clientPortalId
      })
    );
  },

  customer(user) {
    return (
      user.saashqCustomerId && {
        __typename: 'Customer',
        _id: user.saashqCustomerId
      }
    );
  },

  company(user) {
    return (
      user.saashqCompanyId && {
        __typename: 'Company',
        _id: user.saashqCompanyId
      }
    );
  },

  customFieldsDataByFieldCode(company: IUser, _, { subdomain }: IContext) {
    return customFieldsDataByFieldCode(company, subdomain);
  },

  async companyName(user, _args, { subdomain }: IContext) {
    if (user.saashqCompanyId) {
      const company = await sendContactsMessage({
        subdomain,
        action: 'companies.findOne',
        data: {
          _id: user.saashqCompanyId
        },
        isRPC: true,
        defaultValue: null
      });

      if (!company) {
        return user.companyName;
      }

      return company.primaryName;
    }
  }
};

export { ClientPortalUser };
