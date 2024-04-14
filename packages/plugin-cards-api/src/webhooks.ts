import { generateModels } from './connectionResolver';
import { getBoardItemLink } from './models/utils';

export default {
  actions: [
    {
      label: 'Dohoda vytvořena',
      action: 'create',
      type: 'cards:deal',
    },
    {
      label: 'Nabídka aktualizována',
      action: 'update',
      type: 'cards:deal',
    },
    {
      label: 'Dohoda smazána',
      action: 'delete',
      type: 'cards:deal',
    },
    {
      label: 'Dohoda posunuta',
      action: 'createBoardItemMovementLog',
      type: 'cards:deal',
    },
    {
      label: 'Nákup vytvořen',
      action: 'create',
      type: 'cards:purchase',
    },
    {
      label: 'Nákup aktualizován',
      action: 'update',
      type: 'cards:purchase',
    },
    {
      label: 'Nákup smazán',
      action: 'delete',
      type: 'cards:purchase',
    },
    {
      label: 'Nákup se přesunul',
      action: 'createBoardItemMovementLog',
      type: 'cards:purchase',
    },
    {
      label: 'Úkol vytvořen',
      action: 'create',
      type: 'cards:task',
    },
    {
      label: 'Úkol aktualizován',
      action: 'update',
      type: 'cards:task',
    },
    {
      label: 'Úkol smazán',
      action: 'delete',
      type: 'cards:task',
    },
    {
      label: 'Úkol přesunut',
      action: 'createBoardItemMovementLog',
      type: 'cards:task',
    },
    {
      label: 'Lístek vytvořen',
      action: 'create',
      type: 'cards:ticket',
    },
    {
      label: 'Ticket updated',
      action: 'update',
      type: 'cards:ticket',
    },
    {
      label: 'Lístek smazán',
      action: 'delete',
      type: 'cards:ticket',
    },
    {
      label: 'Lístek posunut',
      action: 'createBoardItemMovementLog',
      type: 'cards:ticket',
    },
  ],
  getInfo: async ({
    subdomain,
    data: { data, contentType, actionText, action },
  }) => {
    const models = await generateModels(subdomain);

    if (action === 'createBoardItemMovementLog') {
      return {
        content: `${contentType} se jménem ${
          data.data.item.name || ''
        } se přestěhoval z ${data.data.activityLogContent.text}`,
        url: data.data.link,
      };
    }

    if (!['create', 'update'].includes(action)) {
      return {
        content: `${contentType} ${actionText}`,
        url: '',
      };
    }

    const { object } = data;

    return {
      url: await getBoardItemLink(models, object.stageId, object._id),
      content: `${contentType} ${actionText}`,
    };
  },
};
