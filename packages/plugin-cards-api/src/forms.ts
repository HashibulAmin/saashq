import { generateFields } from './fieldUtils';
import { generateSystemFields, getBoardsAndPipelines } from './utils';

const relations = (type) => {
  return [
    {
      name: 'companyIds',
      label: 'Společnosti',
      relationType: 'contacts:company',
    },
    {
      name: 'customerIds',
      label: 'Zákazníci',
      relationType: 'contacts:customer',
    },
    {
      name: 'ticketIds',
      label: 'Vstupenky',
      relationType: 'cards:ticket',
    },
    {
      name: 'taskIds',
      label: 'Úkoly',
      relationType: 'cards:task',
    },
    {
      name: 'purchaseIds',
      label: 'Nákupy',
      relationType: 'cards:purchase',
    },
    {
      name: 'dealIds',
      label: 'Nabídky',
      relationType: 'cards:deal',
    },
  ].filter((r) => r.relationType !== type);
};

export default {
  types: [
    {
      description: 'Vstupenky',
      type: 'ticket',
      relations: relations('cards:ticket'),
    },
    {
      description: 'Úkoly',
      type: 'task',
      relations: relations('cards:task'),
    },
    {
      description: 'Nákupy',
      type: 'purchase',
      relations: [
        ...relations('cards:purchase'),
        { name: 'carIds', label: 'Cars', relationType: 'cars:car' },
      ],
    },
    {
      description: 'Prodejní potrubí',
      type: 'deal',
      relations: [
        ...relations('cards:deal'),
        { name: 'carIds', label: 'Cars', relationType: 'cars:car' },
      ],
    },
  ],
  fields: generateFields,
  groupsFilter: async ({ data: { config, contentType } }) => {
    const { boardId, pipelineId } = config || {};

    if (!boardId || !pipelineId) {
      return {};
    }

    return {
      contentType,

      $and: [
        {
          $or: [
            {
              'config.boardIds': boardId,
            },
            {
              'config.boardIds': {
                $size: 0,
              },
            },
          ],
        },
        {
          $or: [
            {
              'config.pipelineIds': pipelineId,
            },
            {
              'config.pipelineIds': {
                $size: 0,
              },
            },
          ],
        },
      ],
    };
  },
  fieldsGroupsHook: ({ data }) => getBoardsAndPipelines(data),
  systemFields: generateSystemFields,
};
