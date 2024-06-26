import {
  coreModelExperiences,
  coreModelOrganizations,
} from '@saashq/api-utils/src/saas/saas';
import { IContext } from '../../../connectionResolver';

const organizationsQueries = {
  async getOnboardingSteps(_root, _params, { subdomain }: IContext) {
    const organization = await coreModelOrganizations.findOne({ subdomain });
    let experience = {} as any;

    if (!organization) {
      throw new Error('Organizace nenalezena');
    }

    if (organization.experienceId) {
      experience = await coreModelExperiences.findOne({
        _id: organization.experienceId,
      });
    }

    return experience.onboardingSteps || [];
  },
};

export default organizationsQueries;
