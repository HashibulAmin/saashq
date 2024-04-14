import { IModels, generateModels } from './connectionResolver';
import {
  sendCoreMessage,
  sendTagsMessage,
  sendFormsMessage,
} from './messageBroker';
import * as dayjs from 'dayjs';

const checkFilterParam = (param: any) => {
  return param && param.length;
};
const NOW = new Date();
const returnDateRange = (dateRange: string, startDate: Date, endDate: Date) => {
  const startOfToday = new Date(NOW.setHours(0, 0, 0, 0));
  const endOfToday = new Date(NOW.setHours(23, 59, 59, 999));
  const startOfYesterday = new Date(
    dayjs(NOW).add(-1, 'day').toDate().setHours(0, 0, 0, 0),
  );

  let $gte;
  let $lte;
  switch (dateRange) {
    case 'today':
      $gte = startOfToday;
      $lte = endOfToday;
      break;
    case 'yesterday':
      $gte = startOfYesterday;
      $lte = startOfToday;
    case 'thisWeek':
      $gte = dayjs(NOW).startOf('week').toDate();
      $lte = dayjs(NOW).endOf('week').toDate();
      break;

    case 'lastWeek':
      $gte = dayjs(NOW).add(-1, 'week').startOf('week').toDate();
      $lte = dayjs(NOW).add(-1, 'week').endOf('week').toDate();
      break;
    case 'lastMonth':
      $gte = dayjs(NOW).add(-1, 'month').startOf('month').toDate();
      $lte = dayjs(NOW).add(-1, 'month').endOf('month').toDate();
      break;
    case 'thisMonth':
      $gte = dayjs(NOW).startOf('month').toDate();
      $lte = dayjs(NOW).endOf('month').toDate();
      break;
    case 'thisYear':
      $gte = dayjs(NOW).startOf('year').toDate();
      $lte = dayjs(NOW).endOf('year').toDate();
      break;
    case 'lastYear':
      $gte = dayjs(NOW).add(-1, 'year').startOf('year').toDate();
      $lte = dayjs(NOW).add(-1, 'year').endOf('year').toDate();
      break;
    case 'customDate':
      $gte = startDate;
      $lte = endDate;
      break;
    // all
    default:
      break;
  }

  if ($gte && $lte) {
    return { $gte, $lte };
  }

  return {};
};

const DATE_RANGE_TYPES = [
  { label: 'Pořád', value: 'all' },
  { label: 'Dnes', value: 'today' },
  { label: 'Včera', value: 'yesterday' },
  { label: 'Tento týden', value: 'thisWeek' },
  { label: 'Minulý Týden', value: 'lastWeek' },
  { label: 'Tento Měsíc', value: 'thisMonth' },
  { label: 'Minulý Měsíc', value: 'lastMonth' },
  { label: 'Tento Rok', value: 'thisYear' },
  { label: 'Minulý Rok', value: 'lastYear' },
  { label: 'Vlastní datum', value: 'customDate' },
];

const returnStage = (resolve: string | string[]) => {
  ('');
  // Handle the case when resolve is an array
  const firstResolve = Array.isArray(resolve) ? resolve[0] : resolve;

  switch (firstResolve) {
    case '10':
      return '10%';
    case '20':
      return '30%';
    case '30':
      return '30%';
    case '40':
      return '40%';
    case '50':
      return '50%';
    case '60':
      return '60%';
    case '70':
      return '70%';
    case '80':
      return '80%';
    case '90':
      return '90%';
    case 'Won':
      return 'Won';
    case 'Lost':
      return 'Lost';
    case 'Done':
      return 'Done';
    case 'Resolved':
      return 'Resolved';
    default:
      return {};
  }
};

const PROBABILITY_DEAL = [
  { label: '10%', value: '10' },
  { label: '20%', value: '20' },
  { label: '30%', value: '30' },
  { label: '40%', value: '40' },
  { label: '50%', value: '50' },
  { label: '60%', value: '60' },
  { label: '70%', value: '70' },
  { label: '80%', value: '80' },
  { label: '90%', value: '90' },
  { label: 'Vyhrál', value: 'Won' },
  { label: 'Ztracený', value: 'Lost' },
];
const PROBABILITY_TASK = [
  { label: '10%', value: '10' },
  { label: '20%', value: '20' },
  { label: '30%', value: '30' },
  { label: '40%', value: '40' },
  { label: '50%', value: '50' },
  { label: '60%', value: '60' },
  { label: '70%', value: '70' },
  { label: '80%', value: '80' },
  { label: '90%', value: '90' },
  { label: 'Done', value: 'Done' },
];
const PROBABILITY_TICKET = [
  { label: '10%', value: '10' },
  { label: '20%', value: '20' },
  { label: '30%', value: '30' },
  { label: '40%', value: '40' },
  { label: '50%', value: '50' },
  { label: '60%', value: '60' },
  { label: '70%', value: '70' },
  { label: '80%', value: '80' },
  { label: '90%', value: '90' },
  { label: 'Vyřešeno', value: 'Resolved' },
];
const PRIORITY = [
  { label: 'Kritické', value: 'Critical' },
  { label: 'Vysoký', value: 'high' },
  { label: 'Střední', value: 'medium' },
  { label: 'Nízký', value: 'low' },
];
const PIPELINE_TYPE_TICKET = 'ticket';
const PIPELINE_TYPE_DEAL = 'deal';
const PIPELINE_TYPE_TASK = 'task';

const CUSTOM_PROPERTIES_DEAL = 'cards:deal';
const CUSTOM_PROPERTIES_TICKET = 'cards:ticket';
const CUSTOM_PROPERTIES_TASK = 'cards:task';

const reportTemplates = [
  {
    serviceType: 'deal',
    title: 'Tabulka nabídek',
    serviceName: 'cards',
    description: 'Nabídkové konverzační grafy',
    charts: [
      'DealCountTags',
      'DealCountLabel',
      'DealCustomProperties',
      'DealAverageTimeSpentInEachStage',
      'DealAmountAverageByRep',
      'DealLeaderBoardAmountClosedByRep',
      'DealsByLastModifiedDate',
      'DealsClosedLostAllTimeByRep',
      'DealsOpenByCurrentStage',
      'DealsClosedWonAllTimeByRep',
      'DealRevenueByStage',
      'DealsSales',
      'ClosedRevenueByMonthWithDealTotalAndClosedRevenueBreakdown',
    ],
    img: 'https://sciter.com/wp-content/uploads/2022/08/chart-js.png',
  },
  {
    serviceType: 'task',
    title: 'Tabulka úkolů',
    serviceName: 'cards',
    description: 'Karty konverzační grafy',
    charts: [
      'TaskAverageTimeToCloseByReps',
      'TaskAverageTimeToCloseByLabel',
      'TaskAverageTimeToCloseByTags',
      'TaskCustomProperties',
      'TaskClosedTotalsByReps',
      'TaskClosedTotalsByLabel',
      'TaskClosedTotalsByTags',
      'TasksIncompleteTotalsByReps',
      'TasksIncompleteTotalsByLabel',
      'TasksIncompleteTotalsByTags',
      'AllTasksIncompleteByDueDate',
      'TasksIncompleteAssignedToTheTeamByDueDate',
      'TasksIncompleteAssignedToMeByDueDate',
    ],
    img: 'https://cdn.mos.cms.futurecdn.net/S5bicwPe8vbP9nt3iwAwwi.jpg',
  },
  {
    serviceType: 'ticket',
    title: 'Tabulka vstupenek',
    serviceName: 'cards',
    description: 'Konverzační grafy lístků',
    charts: [
      'TicketCustomProperties',
      'TicketAverageTimeToCloseOverTime',
      'TicketClosedTotalsByRep',
      'TicketTotalsByStatus',
      'TicketTotalsByLabelPriorityTag',
      'TicketTotalsOverTime',
      'TicketAverageTimeToCloseByRep',
      'TicketAverageTimeToClose',
      'TicketTotalsBySource',
      'TicketsCardCountAssignedUser',
      'TicketsStageDateRange',
    ],
    img: 'https://sciter.com/wp-content/uploads/2022/08/chart-js.png',
  },
];

const chartTemplates = [
  {
    templateType: 'DealCountTags',
    name: 'Nabídky Count Tags',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType, tagIds } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      const title: string = 'Značky počtu nabídek';

      let query = await QueryFilter(filterPipelineId, matchedFilter);
      const deals = await models?.Deals.find({
        ...query,
      }).lean();
      if (deals) {
        const tagsCount = deals.map((result) => result.tagIds);
        let flattenedTagIds = tagsCount.flat();
        let tagId = tagIds ? tagIds : flattenedTagIds; // Assigns tagIds if it exists, otherwise uses flattenedTagIds
        // Use the flattenedTagIds to query tag information
        const tagInfo = await sendTagsMessage({
          subdomain,
          action: 'find',
          data: {
            _id: { $in: tagId || [] }, // Use flattenedTagIds here
          },
          isRPC: true,
          defaultValue: [],
        });

        const tagData = {};

        tagId.forEach((tagId) => {
          if (!tagData[tagId]) {
            tagData[tagId] = {
              _id: tagId,
              count: 0,
              name: '',
              type: '',
            };
          }
          tagData[tagId].count++;
        });

        for (let tag of tagInfo) {
          let tagId = tagIds ? tagIds : tag._id;

          if (tagData[tagId]) {
            tagData[tagId].name = tag.name;
            tagData[tagId].type = tag.type;
          }
        }

        const groupedTagData: { count: number; name: string }[] =
          Object.values(tagData);

        // Create an array of objects with count and label
        const dataWithLabels = groupedTagData.map((tag) => ({
          count: tag.count,
          label: tag.name,
        }));

        dataWithLabels.sort((a, b) => a.count - b.count);

        const data: number[] = dataWithLabels.map((item) => item.count);
        const labels: string[] = dataWithLabels.map((item) => item.label);

        const datasets = {
          title,
          data,
          labels,
        };
        return datasets;
      } else {
        const datasets = {
          title,
          data: [],
          labels: [],
        };
        return datasets;
      }
    },

    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_DEAL,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte prioritu fáze',
      },
      {
        fieldName: 'tagIds',
        fieldType: 'select',
        fieldQuery: 'tags',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${CUSTOM_PROPERTIES_DEAL}", "perPage": 1000}`,
        multi: true,
        fieldLabel: 'Vyberte značky',
      },
    ],
  },

  {
    templateType: 'DealCountLabel',
    name: 'Štítek Počítání Nabídky',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );

      let query = await QueryFilter(filterPipelineId, matchedFilter);
      const title = 'Štítek Počítání Nabídky';
      const deals = await models?.Deals.find({
        ...query,
      }).lean();

      if (deals) {
        const labelIds = deals.map((item) => item.labelIds).flat();

        const labels = await models?.PipelineLabels.find({
          _id: {
            $in: labelIds,
          },
        }).lean();

        if (labels) {
          const labelData: Record<
            string,
            { _id: string; count: number; name: string }
          > = {};

          // Count occurrences of labels
          deals.forEach((deal) => {
            deal.labelIds?.forEach((labelId) => {
              if (!labelData[labelId]) {
                labelData[labelId] = {
                  _id: labelId,
                  count: 0,
                  name: '',
                };
              }
              labelData[labelId].count++;
            });
          });

          // Update label names
          labels.forEach((label) => {
            const labelId = label._id;
            if (labelData[labelId]) {
              labelData[labelId].name = label.name;
            }
          });

          // Convert labelData to an array and sort based on count
          const groupedLabelData: any[] = Object.values(labelData);

          groupedLabelData.sort((a, b) => a.count - b.count);

          const counts: number[] = groupedLabelData.map((label) => label.count);
          const labelNames: string[] = groupedLabelData.map(
            (label) => label.name,
          );

          const datasets = {
            title,
            data: counts,
            labels: labelNames,
          };

          return datasets;
        }
      }
    },

    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PIPELINE_TYPE_DEAL,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte prioritu fáze',
      },
      {
        fieldName: 'pipelineLabels',
        fieldType: 'select',
        fieldQuery: 'pipelineLabels',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Syberte štítek',
      },
    ],
  },

  {
    templateType: 'DealCustomProperties',
    name: 'Vlastní Vlastnosti Nabídky',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      const customFieldsDataFilter = filter.fieldsGroups;

      const title: string = 'Vlastní Vlastnosti Nabídky';
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const deals = await models?.Deals.find({
        ...query,
      }).lean();

      if (deals) {
        const idCounts = {};
        deals.forEach((dealItem) => {
          dealItem.customFieldsData?.forEach((fieldData) => {
            if (fieldData.value && Array.isArray(fieldData.value)) {
              fieldData.value.forEach((obj) => {
                const id = Object.keys(obj)[0];
                idCounts[id] = (idCounts[id] || 0) + 1;
              });
            }
          });
        });

        const fields = Object.keys(idCounts).map((id) => ({
          _id: id,
          count: idCounts[id],
        }));
        const customProperty = fields.map((result) => result._id);

        let customField;
        if (customFieldsDataFilter) {
          customField = customFieldsDataFilter;
        } else {
          customField = customProperty;
        }

        const fieldsGroups = await sendFormsMessage({
          subdomain,
          action: 'fields.find',
          data: {
            query: {
              _id: {
                $in: customField,
              },
            },
          },
          isRPC: true,
        });

        let result = fieldsGroups.map((field) => {
          let correspondingData = fields.find((item) => item._id === field._id);
          if (correspondingData) {
            return {
              _id: correspondingData._id,
              label: field.text,
              count: correspondingData.count,
            };
          }

          return null; // Handle if no corresponding data is found
        });

        result.sort((a, b) => a.count - b.count);

        const data: number[] = result.map((item) => item.count);
        const labels: string[] = result.map((item) => item.label);

        const datasets = {
          title,
          data,
          labels,
        };
        return datasets;
      } else {
        const datasets = {
          title,
          data: [],
          labels: [],
        };
        return datasets;
      }
    },
    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        fieldLabel: 'Vyberte desku',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_DEAL,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
      {
        fieldName: 'contentType',
        fieldType: 'select',
        fieldQuery: 'fieldsGetTypes',
        fieldValueVariable: 'contentType',
        fieldLabelVariable: 'description',
        multi: false,
        fieldLabel: 'Vyberte typ vlastností ',
      },
      {
        fieldName: 'fieldsGroups',
        fieldType: 'groups',
        fieldQuery: 'fieldsGroups',
        fieldValueVariable: 'fields',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'contentType',
            logicFieldVariable: 'contentType',
          },
        ],
        multi: true,
        fieldLabel: 'Vyberte uživatelské vlastnosti',
      },
    ],
  },
  {
    templateType: 'DealRevenueByStage',
    name: 'Rozdělte Příjmy po Etapách',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageType,
        stageId,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);
      const deals = await models?.Deals.find({
        ...query,
      });

      if (deals) {
        const dealAmount = await amountProductData(deals);

        const stageIds = dealAmount.map((item) => item.stageId);

        const stageName = await models?.Stages.find({
          _id: { $in: stageIds },
        });

        const stageNames = stageName
          ?.map((result) => {
            const item = dealAmount.find((item) => item.stageId === result._id);
            if (item) {
              const totalAmount = Number(item.totalAmount);
              return {
                name: result.name,
                totalAmount: totalAmount,
              };
            }
            return null; // Handle if stage ID is not found in transformedResult
          })
          .filter(
            (item): item is { name: string; totalAmount: number } => !!item,
          );
        stageNames.sort((a, b) => a.totalAmount - b.totalAmount);
        if (stageNames) {
          const data: number[] = stageNames.map((item) => item.totalAmount); // Data is numbers now

          const labels: string[] = stageNames.map((item) => item.name); // Labels are strings

          const finalObject = {
            title: 'Průměrný čas Sstrávený v Každé Fázi Obchodu',
            data: data,
            labels: labels,
          };

          return finalObject;
        } else {
          throw new Error('namesWithAverage není definováno');
        }
      }
    },

    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_DEAL,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },
  {
    templateType: 'ClosedRevenueByMonthWithDealTotalAndClosedRevenueBreakdown',
    name: 'Uzavřené tržby podle měsíce s celkovým rozpisem obchodů a uzavřených tržeb',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const totalDeals = await models?.Deals.find(query).sort({
        closedDate: -1,
      });

      const monthNames: string[] = [];
      const monthlyDealsCount: number[] = [];
      if (totalDeals) {
        const now = new Date(); // Get the current date
        const startOfYear = new Date(now.getFullYear(), 0, 1); // Get the start of the year
        const endOfYear = new Date(now.getFullYear(), 12, 31); // Get the start of the year
        const endRange = dayjs(
          new Date(totalDeals.at(-1)?.createdAt || endOfYear),
        );

        let startRange = dayjs(startOfYear);
        while (startRange < endRange) {
          monthNames.push(startRange.format('MMMM'));

          const getStartOfNextMonth = startRange.add(1, 'month').toDate();
          const getDealsCountOfMonth = totalDeals.filter(
            (deal) =>
              new Date(deal.createdAt || '').getTime() >=
                startRange.toDate().getTime() &&
              new Date(deal.createdAt || '').getTime() <
                getStartOfNextMonth.getTime(),
          );
          monthlyDealsCount.push(getDealsCountOfMonth.length);
          startRange = startRange.add(1, 'month');
        }
      }
      const title =
        'Uzavřené tržby podle měsíce s celkovým rozpisem obchodů a uzavřených tržeb';
      const datasets = { title, data: monthlyDealsCount, labels: monthNames };

      return datasets;
    },
    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        fieldLabel: 'Vyberte desku',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_DEAL,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },

  {
    templateType: 'DealAmountAverageByRep',
    name: 'Průměrná částka obchodu podle rep',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const selectedUserIds = filter.assignedUserIds || [];
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);
      const deals = await models?.Deals.find(query);

      const dealCounts = calculateAverageDealAmountByRep(
        deals,
        selectedUserIds,
      );
      const getTotalAssignedUserIds = await Promise.all(
        dealCounts.map(async (result) => {
          return await sendCoreMessage({
            subdomain,
            action: 'users.find',
            data: {
              query: {
                _id: {
                  $in: result.userId,
                },
              },
            },
            isRPC: true,
            defaultValue: [],
          });
        }),
      );
      const assignedUsersMap: Record<
        string,
        { fullName: string; amount: string }
      > = {};

      for (let i = 0; i < getTotalAssignedUserIds.length; i++) {
        const assignedUsers = getTotalAssignedUserIds[i];
        for (const assignedUser of assignedUsers) {
          const fullName = assignedUser.details?.fullName || assignedUser.email;
          assignedUsersMap[assignedUser._id] = {
            fullName: fullName,
            amount: dealCounts[i].amount || '0',
          };
        }
      }

      // Convert assignedUsersMap to an array of key-value pairs
      const assignedUsersArray: [
        string,
        { fullName: string; amount: string },
      ][] = Object.entries(assignedUsersMap);

      // Sort the array based on the amount values
      assignedUsersArray.sort(
        (a, b) => parseFloat(a[1].amount) - parseFloat(b[1].amount),
      );

      // Reconstruct the sorted object
      const sortedAssignedUsersMap: Record<
        string,
        { fullName: string; amount: string }
      > = {};
      for (const [userId, userInfo] of assignedUsersArray) {
        sortedAssignedUsersMap[userId] = userInfo;
      }

      // Extract sorted data and labels
      const sortedData = Object.values(sortedAssignedUsersMap).map(
        (t: any) => t.amount,
      );
      const sortedLabels = Object.values(sortedAssignedUsersMap).map(
        (t: any) => t.fullName,
      );

      const title = 'Průměrná částka obchodu podle rep';
      const datasets = { title, data: sortedData, labels: sortedLabels };
      return datasets;
    },

    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        fieldLabel: 'Vyberte desku',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_DEAL,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },

  {
    templateType: 'DealLeaderBoardAmountClosedByRep',
    name: 'Nabídka žebříčku - částka uzavřená rep',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const selectedUserIds = filter.assignedUserIds || [];
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const deals = await models?.Deals.find(query);

      const dealCounts = calculateAverageDealAmountByRep(
        deals,
        selectedUserIds,
      );
      const getTotalAssignedUserIds = await Promise.all(
        dealCounts.map(async (result) => {
          return await sendCoreMessage({
            subdomain,
            action: 'users.find',
            data: {
              query: {
                _id: {
                  $in: result.userId,
                },
              },
            },
            isRPC: true,
            defaultValue: [],
          });
        }),
      );
      const assignedUsersMap: Record<
        string,
        { fullName: string; amount: string }
      > = {};

      for (let i = 0; i < getTotalAssignedUserIds.length; i++) {
        const assignedUsers = getTotalAssignedUserIds[i];
        for (const assignedUser of assignedUsers) {
          assignedUsersMap[assignedUser._id] = {
            fullName: assignedUser.details?.fullName,
            amount: dealCounts[i].amount, // Match the amount with the correct index
          };
        }
      }
      const assignedUsersArray: [
        string,
        { fullName: string; amount: string },
      ][] = Object.entries(assignedUsersMap);

      // Sort the array based on the amount values
      assignedUsersArray.sort(
        (a, b) => parseFloat(a[1].amount) - parseFloat(b[1].amount),
      );

      // Reconstruct the sorted object
      const sortedAssignedUsersMap: Record<
        string,
        { fullName: string; amount: string }
      > = {};
      for (const [userId, userInfo] of assignedUsersArray) {
        sortedAssignedUsersMap[userId] = userInfo;
      }

      // Extract sorted data and labels
      const sortedData = Object.values(sortedAssignedUsersMap).map(
        (t: any) => t.amount,
      );
      const sortedLabels = Object.values(sortedAssignedUsersMap).map(
        (t: any) => t.fullName,
      );

      const title = 'Průměrná částka obchodu podle rep';
      const datasets = { title, data: sortedData, labels: sortedLabels };
      return datasets;
    },
    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_DEAL,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },

  {
    templateType: 'DealsByLastModifiedDate',
    name: 'Akce do data poslední změny',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const totalDeals = await models?.Deals.find(query)
        .sort({
          modifiedAt: -1,
        })
        .limit(1000);
      const dealsCount = totalDeals?.map((deal) => {
        return {
          dealName: deal.name,
          dealStage: deal.stageId,
          currentStatus: deal.status,
          lastModifiedDate: deal.modifiedAt,
          stageChangedDate: deal.stageChangedDate,
        };
      });

      const sortedData = dealsCount?.sort((a, b) => {
        const dateA = new Date(a.lastModifiedDate ?? 0);
        const dateB = new Date(b.lastModifiedDate ?? 0);
        return dateB.getTime() - dateA.getTime();
      });

      const data = sortedData?.map((deal: any) => {
        const dateWithTime = new Date(deal.lastModifiedDate);
        const dateOnly = dateWithTime.toISOString().substring(0, 10); // Extract YYYY-MM-DD
        return dateOnly;
      });

      const labels = sortedData?.map((deal: any) => deal.dealName);
      const label = 'Nabídky se počítají podle upraveného měsíce';

      const datasets = {
        title: label,
        data,
        labels,
      };
      return datasets;
    },

    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_DEAL,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte prioritu Fáze',
      },
    ],
  },

  {
    templateType: 'DealsClosedLostAllTimeByRep',
    name: 'Uzavřené obchody prohrály celou dobu podle zástupce',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const selectedUserIds = filter.assignedUserIds || [];
      const matchedFilter = await filterData(filter);
      const { pipelineId, boardId, stageId, stageType } = filter;
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageType,
        stageId,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      let dealCounts = await models?.Deals.find({
        ...query,
      }).lean();

      if (dealCounts) {
        const data = await Promise.all(
          dealCounts.map(async (item) => {
            const getTotalRespondedUsers = await sendCoreMessage({
              subdomain,
              action: 'users.find',
              data: {
                query: {
                  _id:
                    selectedUserIds.length > 0
                      ? { $in: selectedUserIds }
                      : { $in: item.assignedUserIds },
                },
              },
              isRPC: true,
              defaultValue: [],
            });

            const processedUsers = await Promise.all(
              getTotalRespondedUsers.map(async (user) => {
                const fullName = user.details?.fullName || user.email;
                const counts = await models?.Deals.countDocuments({
                  status: 'active',
                  assignedUserIds: user._id,
                });
                return {
                  FullName: fullName,
                  _id: user._id,
                  count: counts || 0,
                };
              }),
            );

            // Flatten the array of arrays and remove duplicates based on _id
            const uniqueData = processedUsers.reduce((acc, val) => {
              acc[val._id] = val;
              return acc;
            }, {});

            return Object.values(uniqueData);
          }),
        );

        const filteredData = data.filter((arr) => arr.length > 0);
        const uniqueUserEntries = Array.from(
          new Set(filteredData.map((entry) => JSON.stringify(entry))),
          (str) => JSON.parse(str),
        );

        const summedResultArray =
          await sumCountsByUserIdName(uniqueUserEntries);
        const filteredResult =
          selectedUserIds.length > 0
            ? summedResultArray.filter((user) =>
                selectedUserIds.includes(user._id),
              )
            : summedResultArray;

        filteredResult.sort((a, b) => a.count - b.count);

        // Extract sorted data and labels
        const setData = filteredResult.map((item: any) => item.count);
        const setLabels = filteredResult.map((item: any) => item.fullName);

        const title = 'Uzavřené obchody prohrály celou dobu podle zástupce';
        const datasets = { title, data: setData, labels: setLabels };
        return datasets;
      } else {
        throw new Error('Nebyla nalezena žádná nabídkaCounts');
      }
    },
    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_DEAL,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },
  {
    templateType: 'DealAverageTimeSpentInEachStage',
    name: 'Průměrný čas Strávený v Každé Fázi Obchodu',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageType,
        stageId,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);
      const deals = await models?.Deals.find({
        ...query,
      });

      if (deals) {
        const totalStageTime: { [key: string]: number } = {};
        const stageCount: { [key: string]: number } = {};
        deals.forEach((deal) => {
          const createdAtTime = deal.createdAt
            ? new Date(deal.createdAt).getTime()
            : undefined;
          const stageChangedTime = deal.stageChangedDate
            ? new Date(deal.stageChangedDate).getTime()
            : undefined;

          if (createdAtTime !== undefined && stageChangedTime !== undefined) {
            const timeSpent = stageChangedTime - createdAtTime;

            if (!totalStageTime[deal.stageId]) {
              totalStageTime[deal.stageId] = 0;
              stageCount[deal.stageId] = 0;
            }

            totalStageTime[deal.stageId] += timeSpent;
            stageCount[deal.stageId]++;
          }
        });

        const averageTimeSpent: { [key: string]: number } = {};
        for (const stageId in totalStageTime) {
          if (totalStageTime.hasOwnProperty(stageId)) {
            averageTimeSpent[stageId] =
              totalStageTime[stageId] / stageCount[stageId];
          }
        }

        const transformedResult = Object.entries(averageTimeSpent).map(
          ([stageId, average]) => ({
            _id: stageId,
            average: average.toString(),
          }),
        );

        const stageIds = transformedResult.map((item) => item._id);
        const stageName = await models?.Stages.find({
          _id: { $in: stageIds },
        });

        const namesWithAverage = stageName
          ?.map((result) => {
            const item = transformedResult.find(
              (item) => item._id === result._id,
            );
            if (item) {
              const averageHours = Number(item.average) / 3600000; // Convert average from milliseconds to hours
              return {
                name: result.name,
                averageHours: averageHours,
              };
            }
            return null; // Handle if stage ID is not found in transformedResult
          })
          .filter(
            (item): item is { name: string; averageHours: number } => !!item,
          );

        if (namesWithAverage) {
          const data: number[] = namesWithAverage.map(
            (item) => item.averageHours,
          ); // No need for parseFloat
          const labels: string[] = namesWithAverage.map((item) => item.name); // Labels are strings

          const finalObject = {
            title: 'Průměrný čas Strávený v Každé Fázi Obchodu',
            data: data,
            labels: labels,
          };
          return finalObject;
        } else {
          throw new Error('namesWithAverage is undefined');
        }
      }
    },
    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_DEAL,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },
  {
    templateType: 'DealsOpenByCurrentStage',
    name: 'Nabídky otevřené podle aktuální fáze',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const {
        pipelineId,
        boardId,
        stageId,
        stageType,
        dateRange,
        startDate,
        endDate,
      } = filter;
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageType,
        stageId,
        PIPELINE_TYPE_DEAL,
        models,
      );
      const matchfilter = {};
      const title = 'Nabídky otevřené podle aktuální fáze';
      if (dateRange) {
        const dateFilter = returnDateRange(
          filter.dateRange,
          startDate,
          endDate,
        );
        if (Object.keys(dateFilter).length) {
          matchfilter['createdAt'] = dateFilter;
        }
      }
      const stageCount = await models?.Stages.find({
        ...matchfilter,
        _id: { $in: filterPipelineId },
      });
      if (stageCount) {
        const groupedData: { [key: string]: string[] } = stageCount.reduce(
          (acc, curr) => {
            if (!acc[curr.pipelineId]) {
              acc[curr.pipelineId] = [];
            }
            acc[curr.pipelineId].push(curr.name);
            return acc;
          },
          {},
        );
        const datasets = {
          title: title,
          data: Object.entries(groupedData).map(([_, value]) => value.length),
          labels: Object.entries(groupedData).map(([_, value]) =>
            value.join(', '),
          ),
        };
        return datasets;
      } else {
        const datasets = { title, data: [], labels: [] };
        return datasets;
      }
    },
    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_DEAL,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },

  {
    templateType: 'DealsClosedWonAllTimeByRep',
    name: 'Uzavřené obchody vyhrály celou dobu podle rep',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const selectedUserIds = filter.assignedUserIds || [];
      const matchedFilter = await filterData(filter);
      const { pipelineId, boardId, stageId, stageType } = filter;
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      let dealCounts = await models?.Deals.find({
        ...query,
      }).lean();

      if (dealCounts) {
        const data = await Promise.all(
          dealCounts.map(async (item) => {
            const getTotalRespondedUsers = await sendCoreMessage({
              subdomain,
              action: 'users.find',
              data: {
                query: {
                  _id:
                    selectedUserIds.length > 0
                      ? { $in: selectedUserIds }
                      : { $in: item.assignedUserIds },
                },
              },
              isRPC: true,
              defaultValue: [],
            });

            const processedUsers = await Promise.all(
              getTotalRespondedUsers.map(async (user) => {
                const fullName = user.details?.fullName || user.email;
                const counts = await models?.Deals.countDocuments({
                  status: 'active',
                  assignedUserIds: user._id,
                });
                return {
                  FullName: fullName,
                  _id: user._id,
                  count: counts || 0,
                };
              }),
            );

            // Flatten the array of arrays and remove duplicates based on _id
            const uniqueData = processedUsers.reduce((acc, val) => {
              acc[val._id] = val;
              return acc;
            }, {});

            return Object.values(uniqueData);
          }),
        );

        const filteredData = data.filter((arr) => arr.length > 0);
        const uniqueUserEntries = Array.from(
          new Set(filteredData.map((entry) => JSON.stringify(entry))),
          (str) => JSON.parse(str),
        );

        const summedResultArray =
          await sumCountsByUserIdName(uniqueUserEntries);
        const filteredResult =
          selectedUserIds.length > 0
            ? summedResultArray.filter((user) =>
                selectedUserIds.includes(user._id),
              )
            : summedResultArray;

        filteredResult.sort((a, b) => a.count - b.count);

        // Extract sorted data and labels
        const setData = filteredResult.map((item: any) => item.count);
        const setLabels = filteredResult.map((item: any) => item.fullName);

        const title = 'Uzavřené obchody vyhrály celou dobu podle rep';
        const datasets = { title, data: setData, labels: setLabels };
        return datasets;
      } else {
        throw new Error('Nebyla nalezena žádná nabídkaCounts');
      }
    },
    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_DEAL,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },
  {
    templateType: 'DealsSales',
    name: 'Nabídky prodeje',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const filerData = await filterData(filter);
      const data = await pipelineFilterData(
        filerData,
        pipelineId,
        boardId,
        stageType,
        models,
      );
      return data;
    },
    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_DEAL}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_DEAL,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },

  //Task Reports
  {
    templateType: 'TicketCustomProperties',
    name: 'Uživatelské Vlastnosti Tiketu',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      const customFieldsDataFilter = filter.fieldsGroups;

      const title: string = 'Uživatelské Vlastnosti Tiketu';
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const ticket = await models?.Tickets.find({
        ...query,
      }).lean();

      if (ticket) {
        const idCounts = {};
        ticket.forEach((ticketItem) => {
          ticketItem.customFieldsData?.forEach((fieldData) => {
            if (fieldData.value && Array.isArray(fieldData.value)) {
              fieldData.value.forEach((obj) => {
                const id = Object.keys(obj)[0];
                idCounts[id] = (idCounts[id] || 0) + 1;
              });
            }
          });
        });

        const fields = Object.keys(idCounts).map((id) => ({
          _id: id,
          count: idCounts[id],
        }));
        const customProperty = fields.map((result) => result._id);

        let customField;
        if (customFieldsDataFilter) {
          customField = customFieldsDataFilter;
        } else {
          customField = customProperty;
        }

        const fieldsGroups = await sendFormsMessage({
          subdomain,
          action: 'fields.find',
          data: {
            query: {
              _id: {
                $in: customField,
              },
            },
          },
          isRPC: true,
        });

        let result = fieldsGroups.map((field) => {
          let correspondingData = fields.find((item) => item._id === field._id);
          if (correspondingData) {
            return {
              _id: correspondingData._id,
              label: field.text,
              count: correspondingData.count,
            };
          }

          return null; // Handle if no corresponding data is found
        });

        result.sort((a, b) => a.count - b.count);

        const data: number[] = result.map((item) => item.count);
        const labels: string[] = result.map((item) => item.label);

        const datasets = {
          title,
          data,
          labels,
        };
        return datasets;
      } else {
        const datasets = {
          title,
          data: [],
          labels: [],
        };
        return datasets;
      }
    },
    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        fieldLabel: 'Vyberte desku',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TICKET,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
      {
        fieldName: 'contentType',
        fieldType: 'select',
        fieldQuery: 'fieldsGetTypes',
        fieldValueVariable: 'contentType',
        fieldLabelVariable: 'description',
        multi: false,
        fieldLabel: 'Vyberte typ vlastností ',
      },
      {
        fieldName: 'fieldsGroups',
        fieldType: 'groups',
        fieldQuery: 'fieldsGroups',
        fieldValueVariable: 'fields',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'contentType',
            logicFieldVariable: 'contentType',
          },
        ],
        multi: true,
        fieldLabel: 'Vyberte uživatelské vlastnosti',
      },
    ],
  },

  {
    templateType: 'TaskCustomProperties',
    name: 'Uživatelské Vlastnosti úlohy',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      const customFieldsDataFilter = filter.fieldsGroups;

      const title: string = 'Uživatelské Vlastnosti úlohy';
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const task = await models?.Tasks.find({
        ...query,
      }).lean();

      if (task) {
        const idCounts = {};
        task.forEach((ticketItem) => {
          ticketItem.customFieldsData?.forEach((fieldData) => {
            if (fieldData.value && Array.isArray(fieldData.value)) {
              fieldData.value.forEach((obj) => {
                const id = Object.keys(obj)[0];
                idCounts[id] = (idCounts[id] || 0) + 1;
              });
            }
          });
        });

        const fields = Object.keys(idCounts).map((id) => ({
          _id: id,
          count: idCounts[id],
        }));
        const customProperty = fields.map((result) => result._id);

        let customField;
        if (customFieldsDataFilter) {
          customField = customFieldsDataFilter;
        } else {
          customField = customProperty;
        }

        const fieldsGroups = await sendFormsMessage({
          subdomain,
          action: 'fields.find',
          data: {
            query: {
              _id: {
                $in: customField,
              },
            },
          },
          isRPC: true,
        });

        let result = fieldsGroups.map((field) => {
          let correspondingData = fields.find((item) => item._id === field._id);
          if (correspondingData) {
            return {
              _id: correspondingData._id,
              label: field.text,
              count: correspondingData.count,
            };
          }

          return null; // Handle if no corresponding data is found
        });

        result.sort((a, b) => a.count - b.count);

        const data: number[] = result.map((item) => item.count);
        const labels: string[] = result.map((item) => item.label);

        const datasets = {
          title,
          data,
          labels,
        };
        return datasets;
      } else {
        const datasets = {
          title,
          data: [],
          labels: [],
        };
        return datasets;
      }
    },
    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        fieldLabel: 'Vyberte desku',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TASK,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
      {
        fieldName: 'contentType',
        fieldType: 'select',
        fieldQuery: 'fieldsGetTypes',
        fieldValueVariable: 'contentType',
        fieldLabelVariable: 'description',
        multi: false,
        fieldLabel: 'Vyberte typ vlastností ',
      },
      {
        fieldName: 'fieldsGroups',
        fieldType: 'groups',
        fieldQuery: 'fieldsGroups',
        fieldValueVariable: 'fields',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'contentType',
            logicFieldVariable: 'contentType',
          },
        ],
        multi: true,
        fieldLabel: 'Vyberte uživatelské vlastnosti',
      },
    ],
  },
  {
    templateType: 'TaskAverageTimeToCloseByReps',
    name: 'Průměrný čas na uzavření podle opakování',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const selectedUserIds = filter.assignedUserIds || [];
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const tasks = await models?.Tasks.find({ ...query });

      const ticketData = await calculateAverageTimeToCloseUser(
        tasks,
        selectedUserIds,
      );

      const getTotalAssignedUsers = await Promise.all(
        ticketData?.map(async (result) => {
          return await sendCoreMessage({
            subdomain,
            action: 'users.find',
            data: {
              query: {
                _id: {
                  $in: result.assignedUserIds,
                },
              },
            },
            isRPC: true,
            defaultValue: [],
          });
        }) ?? [],
      );

      const result: any[] = [];

      for (const assignedUser of getTotalAssignedUsers) {
        assignedUser.map((itemsAdd) => {
          const ticket = ticketData?.find((item) =>
            item.assignedUserIds.includes(itemsAdd._id),
          );

          if (ticket) {
            result.push({
              timeDifference: ticket.timeDifference,
              assignedUserIds: ticket.assignedUserIds,
              FullName: itemsAdd.details?.fullName || '',
            });
          }
        });
      }
      // Convert timeDifference strings to numbers
      result.forEach((item) => {
        item.timeDifference = parseFloat(item.timeDifference);
      });

      // Sort the result array by the timeDifference property
      result.sort((a, b) => a.timeDifference - b.timeDifference);

      // Extract sorted data and labels
      const data = result.map((t: any) => t.timeDifference);
      const labels = result.map((t: any) => t.FullName);

      const title = 'Průměrný čas na uzavření podle opakování';

      const datasets = { title, data, labels };

      return datasets;
    },
    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        fieldLabel: 'Vyberte desku',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TASK,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },

  {
    templateType: 'TaskAverageTimeToCloseByLabel',
    name: 'Průměrná doba uzavření úkolu podle štítku',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );

      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const tasks = await models?.Tasks.find({ ...query });

      const ticketData = await taskAverageTimeToCloseByLabel(tasks);
      // const labelIds = ticketData.map((result) => result.labelIds);
      const labelIdsCount = ticketData.flatMap((result) => result.labelIds);

      const labels = await models?.PipelineLabels.find({
        _id: {
          $in: labelIdsCount,
        },
      }).lean();

      if (!labels || labels.length === 0) {
        // Handle the case where no labels are found
        return {
          title: '',
          data: [],
          labels: [],
        };
      }
      const enrichedTicketData = ticketData.map((task) => {
        // Ensure labelIds is an array (default to empty array if undefined)
        const labelIds = Array.isArray(task.labelIds) ? task.labelIds : [];

        // Check if labelIds is not empty before mapping
        if (labelIds.length > 0) {
          const labelNames = labelIds.map((labelId) => {
            const matchingLabel = labels.find(
              (label) => label && label._id === labelId,
            ); // Check for undefined label
            return matchingLabel ? matchingLabel.name : '';
          });

          // Filter out undefined and empty string labels
          const filteredLabels = labelNames.filter((label) => label !== '');

          return {
            ...task,
            labels: filteredLabels,
          };
        } else {
          // If labelIds is empty, return the task as is
          return task;
        }
      });

      enrichedTicketData.forEach((t) => {
        t.timeDifference = parseFloat(t.timeDifference);
      });

      // Sort the enrichedTicketData array by the timeDifference property
      enrichedTicketData.sort((a, b) => a.timeDifference - b.timeDifference);

      let setData: string[] = [];
      let stablesNames: string[] = [];

      enrichedTicketData
        .filter((t) => t.timeDifference && t.labels && t.labels.length > 0)
        .slice(0, 100) // Limit to the first 100 elements
        .forEach((t) => {
          setData.push(t.timeDifference.toString());

          // Flatten and join the labels array into a single string
          const flattenedLabels = t.labels.join(' ');
          stablesNames.push(flattenedLabels);
        });

      const title = 'Průměrná doba uzavření úkolu podle štítku';

      const datasets = {
        title,
        data: setData,
        labels: stablesNames,
      };

      return datasets;
    },
    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        fieldLabel: 'Vyberte desku',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TASK,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
      {
        fieldName: 'pipelineLabels',
        fieldType: 'select',
        fieldQuery: 'pipelineLabels',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte štítek',
      },
    ],
  },

  {
    templateType: 'TaskAverageTimeToCloseByTags',
    name: 'Průměrný čas na uzavření podle značek',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType, tagIds } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const tasks = await models?.Tasks.find({
        ...query,
      }).lean();
      const taskData = await taskAverageTimeToCloseByLabel(tasks);
      const tagsCount = taskData.flatMap((result) => result.tagIds);
      let tagId = tagIds ? tagIds : tagsCount;
      const tagInfo = await sendTagsMessage({
        subdomain,
        action: 'find',
        data: {
          _id: { $in: tagId || [] },
        },
        isRPC: true,
        defaultValue: [],
      });

      const tagData = {};

      // Iterate over each task and accumulate timeDifference based on tagId
      taskData.forEach((task) => {
        tagId.forEach((tagId) => {
          if (!tagData[tagId]) {
            tagData[tagId] = {
              _id: tagId,
              timeDifference: 0,
              name: '',
              type: '',
            };
          }
          tagData[tagId].timeDifference += parseFloat(task.timeDifference);
        });
      });

      // Update tagData with the name and type from tagInfo
      tagInfo.forEach((tag) => {
        const tagId = tag._id;
        if (tagData[tagId]) {
          tagData[tagId].name = tag.name;
          tagData[tagId].type = tag.type;
        }
      });

      const groupedTagData: { timeDifference: number; name: string }[] =
        Object.values(tagData);

      groupedTagData.sort((a, b) => b.timeDifference - a.timeDifference);

      const data: number[] = groupedTagData.map((t) => t.timeDifference);
      const labels: string[] = groupedTagData.map((t) => t.name);

      const title: string = 'Průměrný čas na uzavření podle značek';

      const datasets = {
        title,
        data,
        labels,
      };
      return datasets;
    },
    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TASK,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
      {
        fieldName: 'tagIds',
        fieldType: 'select',
        fieldQuery: 'tags',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${CUSTOM_PROPERTIES_TASK}", "perPage": 1000}`,
        multi: true,
        fieldLabel: 'Vyberte značky',
      },
    ],
  },
  {
    templateType: 'TaskClosedTotalsByReps',
    name: 'Úkol uzavřen součty podle opakování',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      const selectedUserIds = filter.assignedUserIds || [];

      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const tasks = await models?.Tasks.find({ ...query });

      // Calculate task counts
      const taskCounts = calculateTicketCounts(tasks, selectedUserIds);

      // Convert the counts object to an array of objects with ownerId and count
      const countsArray = Object.entries(taskCounts).map(
        // tslint:disable-next-line:no-shadowed-variable
        ([ownerId, count]) => ({
          ownerId,
          count,
        }),
      );

      // Sort the array based on task counts
      countsArray.sort((a, b) => b.count - a.count);

      // Extract unique ownerIds for user lookup
      const ownerIds = countsArray.map((item) => item.ownerId);

      // Fetch information about assigned users
      const getTotalAssignedUsers = await sendCoreMessage({
        subdomain,
        action: 'users.find',
        data: {
          query: { _id: { $in: ownerIds } },
        },
        isRPC: true,
        defaultValue: [],
      });
      // Create a map for faster user lookup
      const assignedUsersMap = getTotalAssignedUsers.reduce((acc, user) => {
        acc[user._id] = user.details; // Assuming details contains user information
        return acc;
      }, {});

      const title = 'Úkol uzavřen součty podle opakování';

      const sort = ownerIds.map((ownerId) => {
        const user = assignedUsersMap[ownerId];
        const count = taskCounts[ownerId];
        return {
          name: user.fullName,
          count: count || 0, // Set count to 0 if not found in ticketCounts
        };
      });

      sort.sort((a, b) => a.count - b.count);
      const data = Object.values(sort).map((t: any) => t.count);
      const labels = Object.values(sort).map((t: any) => t.name);

      const datasets = { title, data, labels };
      return datasets;
    },
    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TASK,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },
  {
    templateType: 'TaskClosedTotalsByLabel',
    name: 'Úkol uzavřel součty podle štítku',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );

      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const tasks = await models?.Tasks.find({
        ...query,
      }).lean();

      const taskCounts = taskClosedByRep(tasks);

      // Convert the counts object to an array of objects with ownerId and count
      const countsArray = Object.entries(taskCounts).map(
        ([ownerId, count]) => ({
          ownerId,
          count,
        }),
      );
      countsArray.sort((a, b) => b.count - a.count);

      // Extract unique ownerIds for user lookup
      const ownerIds = countsArray.map((item) => item.ownerId);

      const labels = await models?.PipelineLabels.find({
        _id: {
          $in: ownerIds,
        },
      }).lean();

      if (!labels || labels.length === 0) {
        // Handle the case where no labels are found
        return {
          title: '',
          data: [],
          labels: [],
          count: [],
        };
      }
      const enrichedTicketData = countsArray.map((item) => {
        const ownerId = item.ownerId;
        const matchingLabel = labels.find(
          (label) => label && label._id === ownerId,
        );

        // Use the spread operator (...) to include all properties of the item object
        return {
          ...item,
          labels: matchingLabel ? [matchingLabel.name] : [],
        };
      });
      enrichedTicketData.sort((a, b) => a.count - b.count);
      const data = enrichedTicketData.map((t) => t.count);

      // Flatten the label array and remove any empty arrays
      const label = enrichedTicketData
        .map((t) => t.labels)
        .flat()
        .filter((item) => item.length > 0);
      const title = 'Úkol uzavřel součty podle štítku';

      const datasets = { title, data, labels: label };

      return datasets;
    },

    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TASK,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
      {
        fieldName: 'pipelineLabels',
        fieldType: 'select',
        fieldQuery: 'pipelineLabels',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte štítek',
      },
    ],
  },

  {
    templateType: 'TaskClosedTotalsByTags',
    name: 'Úkol uzavřel součty podle značek',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );

      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const tasks = await models?.Tasks.find({
        ...query,
      }).lean();

      const taskCount = calculateTicketCounts(
        tasks,
        filter.assignedUserIds || [],
      );
      const countsArray = Object.entries(taskCount).map(
        // tslint:disable-next-line:no-shadowed-variable
        ([ownerId, count]) => ({
          ownerId,
          count,
        }),
      );
      countsArray.sort((a, b) => b.count - a.count);

      // Extract unique ownerIds for user lookup
      const ownerIds = countsArray.map((item) => item.ownerId);

      const getTotalAssignedUsers = await sendCoreMessage({
        subdomain,
        action: 'users.find',
        data: {
          query: { _id: { $in: ownerIds } },
        },
        isRPC: true,
        defaultValue: [],
      });
      const assignedUsersMap = getTotalAssignedUsers.reduce((acc, user) => {
        acc[user._id] = user.details; // Assuming details contains user information
        return acc;
      }, {});

      const sort = ownerIds.map((ownerId) => {
        const user = assignedUsersMap[ownerId];
        const count = taskCount[ownerId];

        return {
          name: user.fullName,
          count: count || 0, // Set count to 0 if not found in ticketCounts
        };
      });
      const title = 'Úkol uzavřel součty podle značek';
      sort.sort((a, b) => a.count - b.count);
      const data = Object.values(sort).map((t: any) => t.count);
      const labels = Object.values(sort).map((t: any) => t.name);
      const datasets = {
        title,
        data,
        labels,
      };
      return datasets;
    },

    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TASK,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
      {
        fieldName: 'tagIds',
        fieldType: 'select',
        fieldQuery: 'tags',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${CUSTOM_PROPERTIES_TASK}", "perPage": 1000}`,
        multi: true,
        fieldLabel: 'Vyberte značky',
      },
    ],
  },
  {
    templateType: 'TasksIncompleteTotalsByReps',
    name: 'Úkoly neúplné součty podle opakování',
    chartTypes: ['bar'],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);
      const selectedUserIds = filter.assignedUserIds || [];
      let tasks;

      if (selectedUserIds.length === 0) {
        // No selected users, so get all tasks
        tasks = await models?.Tasks.find({
          ...query,
        }).lean();
      } else {
        // Filter tasks based on selectedUserIds
        const taskCount = await models?.Tasks.find({
          ...query,
          assignedUserIds: { $in: selectedUserIds },
        }).lean();
        if (taskCount) {
          tasks = taskCount.filter((task) => {
            return task.assignedUserIds?.some((userId) =>
              selectedUserIds.includes(userId),
            );
          });
        } else {
          // Handle the case where datats is undefined
          throw new Error(
            'Na základě vybraných ID uživatelů nebyly nalezeny žádné úlohy.',
          );
        }
      }

      // Check if the returned value is not an array
      if (!Array.isArray(tasks)) {
        throw new Error('Neplatná data: úkoly nejsou pole.');
      }

      const taskCounts = calculateTicketCounts(tasks, selectedUserIds);

      const countsArray = Object.entries(taskCounts).map(
        ([ownerId, count]) => ({
          ownerId,
          count,
        }),
      );
      countsArray.sort((a, b) => b.count - a.count);

      const ownerIds = countsArray.map((item) => item.ownerId);

      const getTotalAssignedUsers = await sendCoreMessage({
        subdomain,
        action: 'users.find',
        data: {
          query: { _id: { $in: ownerIds } },
        },
        isRPC: true,
        defaultValue: [],
      });
      const assignedUsersMap = getTotalAssignedUsers.reduce((acc, user) => {
        acc[user._id] = user.details;
        return acc;
      }, {});

      const title = 'Úkoly neúplné součty podle opakování';
      const sort = ownerIds.map((ownerId) => {
        const user = assignedUsersMap[ownerId];
        const count = taskCounts[ownerId];

        if (user) {
          return {
            name: user.fullName,
            count: count || 0,
          };
        }
      });

      const filteredSort = sort.filter((entry) => entry !== undefined);

      filteredSort.sort((a, b) => {
        if (a && b) {
          return a.count - b.count;
        }
        return 0;
      });

      const data = Object.values(filteredSort).map((t: any) => t.count);
      const labels = Object.values(filteredSort).map((t: any) => t.name);

      const datasets = { title, data, labels };
      return datasets;
    },

    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TASK,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },

  {
    templateType: 'TasksIncompleteTotalsByLabel',
    name: 'Úkoly neúplné součty podle štítku',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);
      const selectedLabelIds = filter.labelIds || [];
      let tasks;

      if (selectedLabelIds.length === 0) {
        // No selected users, so get all tasks
        tasks = await models?.Tasks.find({
          ...query,
        }).lean();
      } else {
        // Filter tasks based on selectedLabelIds
        tasks = await models?.Tasks.find({
          ...query,
          labelIds: { $in: selectedLabelIds },
        }).lean();
      }

      // Check if the returned value is not an array
      if (!Array.isArray(tasks)) {
        throw new Error('Neplatná data: úkoly nejsou pole.');
      }

      const taskCounts = taskClosedByRep(tasks);

      // Convert the counts object to an array of objects with ownerId and count
      const countsArray = Object.entries(taskCounts).map(
        ([ownerId, count]) => ({
          ownerId,
          count,
        }),
      );
      countsArray.sort((a, b) => b.count - a.count);

      // Extract unique ownerIds for user lookup
      const ownerIds = countsArray.map((item) => item.ownerId);

      const labels = await models?.PipelineLabels.find({
        _id: {
          $in: ownerIds,
        },
      }).lean();

      if (!labels || labels.length === 0) {
        // Handle the case where no labels are found
        return {
          title: '',
          data: [],
          labels: [],
          count: [],
        };
      }
      const enrichedTicketData = countsArray.map((item) => {
        const ownerId = item.ownerId;
        const matchingLabel = labels.find(
          (label) => label && label._id === ownerId,
        );

        // Use the spread operator (...) to include all properties of the item object
        return {
          ...item,
          labels: matchingLabel ? [matchingLabel.name] : [],
        };
      });
      enrichedTicketData.sort((a, b) => a.count - b.count);
      const data = enrichedTicketData.map((t) => t.count);

      // Flatten the label array and remove any empty arrays
      const label = enrichedTicketData
        .map((t) => t.labels)
        .flat()
        .filter((item) => item.length > 0);
      const title = 'Úkoly neúplné součty podle štítku';

      const datasets = { title, data, labels: label };

      return datasets;
    },

    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TASK,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
      {
        fieldName: 'pipelineLabels',
        fieldType: 'select',
        fieldQuery: 'pipelineLabels',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte štítek',
      },
    ],
  },

  {
    templateType: 'TasksIncompleteTotalsByTags',
    name: 'Úkoly neúplné součty podle značek',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);
      const selectedTagIds = filter.tagIds || [];
      let tasksCount;

      if (selectedTagIds.length === 0) {
        // No selected users, so get all tasks
        tasksCount = await models?.Tasks.find({
          ...query,
        }).lean();
      } else {
        // Filter tasks based on selectedLabelIds
        tasksCount = await models?.Tasks.find({
          ...query,
          tagIds: { $in: selectedTagIds },
        }).lean();
      }

      // Check if the returned value is not an array
      if (!Array.isArray(tasksCount)) {
        throw new Error('Neplatná data: úkoly nejsou pole.');
      }

      const taskCounts = taskClosedByTagsRep(tasksCount);

      // Convert the counts object to an array of objects with ownerId and count
      const countsArray = Object.entries(taskCounts).map(
        ([ownerId, count]) => ({
          ownerId,
          count,
        }),
      );
      countsArray.sort((a, b) => b.count - a.count);

      // Extract unique ownerIds for user lookup
      const ownerIds = countsArray.map((item) => item.ownerId);

      const tagInfo = await sendTagsMessage({
        subdomain,
        action: 'find',
        data: {
          _id: { $in: ownerIds || [] },
        },
        isRPC: true,
        defaultValue: [],
      });

      if (!tagInfo || tagInfo.length === 0) {
        // Handle the case where no labels are found
        return {
          title: '',
          data: [],
          tagIds: [],
          count: [],
        };
      }
      const enrichedTicketData = countsArray.map((item) => {
        const ownerId = item.ownerId;
        const matchingLabel = tagInfo.find(
          (label) => label && label._id === ownerId,
        );

        // Use the spread operator (...) to include all properties of the item object
        return {
          ...item,
          labels: matchingLabel ? [matchingLabel.name] : [],
        };
      });
      enrichedTicketData.sort((a, b) => a.count - b.count);
      const data = enrichedTicketData.map((t) => t.count);

      // Flatten the label array and remove any empty arrays
      const label = enrichedTicketData
        .map((t) => t.labels)
        .flat()
        .filter((item) => item.length > 0);
      const title = 'Úkoly neúplné součty podle značek';

      const datasets = { title, data, labels: label };

      return datasets;
    },

    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TASK,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
      {
        fieldName: 'tagIds',
        fieldType: 'select',
        fieldQuery: 'tags',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${CUSTOM_PROPERTIES_TASK}", "perPage": 1000}`,
        multi: true,
        fieldLabel: 'Vyberte značky',
      },
    ],
  },
  {
    templateType: 'AllTasksIncompleteByDueDate',
    name: 'Všechny úkoly nedokončené k termínue',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);
      const selectedUserIds = filter.assignedUserIds || [];
      let tasks;

      if (selectedUserIds.length === 0) {
        // No selected users, so get all tasks
        tasks = await models?.Tasks.find({
          ...query,
        }).lean();
      } else {
        // Filter tasks based on selectedUserIds
        const taskCount = await models?.Tasks.find({
          ...query,
          assignedUserIds: { $in: selectedUserIds },
        }).lean();
        if (taskCount) {
          tasks = taskCount.filter((task) => {
            return task.assignedUserIds?.some((userId) =>
              selectedUserIds.includes(userId),
            );
          });
        } else {
          throw new Error(
            'Na základě vybraných ID uživatelů nebyly nalezeny žádné úlohy.',
          );
        }
      }

      if (!Array.isArray(tasks)) {
        throw new Error('Neplatná data: úkoly nejsou pole.');
      }

      const taskCounts = calculateTicketCounts(tasks, selectedUserIds);

      const countsArray = Object.entries(taskCounts).map(
        ([ownerId, count]) => ({
          ownerId,
          count,
        }),
      );

      countsArray.sort((a, b) => b.count - a.count);

      const ownerIds = countsArray.map((item) => item.ownerId);

      const getTotalAssignedUsers = await sendCoreMessage({
        subdomain,
        action: 'users.find',
        data: {
          query: { _id: { $in: ownerIds } },
        },
        isRPC: true,
        defaultValue: [],
      });

      const assignedUsersMap = getTotalAssignedUsers.reduce((acc, user) => {
        acc[user._id] = user.details;
        return acc;
      }, {});

      const sort = ownerIds.map((ownerId) => {
        const user = assignedUsersMap[ownerId];
        const count = taskCounts[ownerId];

        if (user) {
          return {
            name: user.fullName,
            count: count || 0,
          };
        }
        return null;
      });

      const filteredSort = sort.filter((entry) => entry !== null);

      filteredSort.sort((a, b) => {
        if (a && b) {
          return a.count - b.count;
        }
        return 0;
      });

      const data = filteredSort.map((t: any) => t.count);
      const labels = filteredSort.map((t: any) => t.name);

      const title = 'Všechny úkoly nejsou dokončeny v termínu';

      const datasets = { title, data, labels };
      return datasets;
    },

    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TASK,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },

  {
    templateType: 'TasksIncompleteAssignedToTheTeamByDueDate',
    name: 'Úkoly nedokončené přidělené týmu do data splatnosti',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageType,
        stageId,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);
      const tasksCount = await models?.Tasks.find({
        ...query,
      }).lean();

      const taskCounts = departmentCount(tasksCount);

      // Convert the counts object to an array of objects with ownerId and count
      const countsArray = Object.entries(taskCounts).map(
        ([ownerId, count]) => ({
          ownerId,
          count,
        }),
      );
      countsArray.sort((a, b) => b.count - a.count);

      // Extract unique ownerIds for user lookup
      const ownerIds = countsArray.map((item) => item.ownerId);

      const departmentInfo = await sendCoreMessage({
        subdomain,
        action: `departments.find`,
        data: {
          _id: { $in: ownerIds || [] },
        },
        isRPC: true,
        defaultValue: [],
      });

      if (!departmentInfo || departmentInfo.length === 0) {
        // Handle the case where no labels are found
        return {
          title: '',
          data: [],
          departmentsIds: [],
          count: [],
        };
      }
      const enrichedTicketData = countsArray.map((item) => {
        const ownerId = item.ownerId;

        const matchingLabel = departmentInfo.find(
          (label) => label && label._id === ownerId,
        );
        // Use the spread operator (...) to include all properties of the item object
        return {
          ...item,
          labels: matchingLabel ? [matchingLabel.title] : [],
        };
      });
      enrichedTicketData.sort((a, b) => a.count - b.count);
      const data = enrichedTicketData.map((t) => t.count);

      // Flatten the label array and remove any empty arrays
      const label = enrichedTicketData
        .map((t) => t.labels)
        .flat()
        .filter((item) => item.length > 0);
      const title = 'Úkoly nedokončené přidělené týmu do data splatnosti';

      const datasets = { title, data, labels: label };

      return datasets;
    },

    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        fieldLabel: 'Vyberte desku',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TASK,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },

  {
    templateType: 'TasksIncompleteAssignedToMeByDueDate',
    name: 'Nedokončené úkoly, které mi byly přiděleny do termínu',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);
      const selectedUserIds = filter.assignedUserIds || [];
      let tickets;

      tickets = await models?.Tasks.find({
        ...query,
      }).lean();

      // Calculate ticket counts
      const ticketCounts = calculateTicketCounts(tickets, selectedUserIds);
      // Convert the counts object to an array of objects with ownerId and count
      const countsArray = Object.entries(ticketCounts).map(
        // tslint:disable-next-line:no-shadowed-variable
        ([ownerId, count]) => ({
          ownerId,
          count,
        }),
      );
      // Sort the array based on ticket counts

      // Extract unique ownerIds for user lookup
      const ownerIds = countsArray.map((item) => item.ownerId);
      // Fetch information about assigned users
      const getTotalAssignedUsers = await sendCoreMessage({
        subdomain,
        action: 'users.find',
        data: {
          query: {
            _id: {
              $in: ownerIds,
            },
          },
        },
        isRPC: true,
        defaultValue: [],
      });
      // Create a map for faster user lookup
      const assignedUsersMap = getTotalAssignedUsers.reduce((acc, user) => {
        acc[user._id] = user.details; // Assuming details contains user information
        return acc;
      }, {});

      const sort = ownerIds.map((ownerId) => {
        const user = assignedUsersMap[ownerId];
        const count = ticketCounts[ownerId];

        if (user) {
          return {
            name: user.fullName,
            count: count || 0,
          };
        }

        return null;
      });

      // Filter out null entries
      const filteredSort = sort.filter((entry) => entry !== null);

      // Sort by count in ascending order
      filteredSort.sort((a, b) => {
        return (a?.count || 0) - (b?.count || 0);
      });

      // Extract data and labels
      const title = 'Nedokončené úkoly, které mi byly přiděleny do termínu';
      const data = filteredSort.map((t) => t?.count || 0);
      const labels = filteredSort.map((t) => t?.name || '');

      const datasets = {
        title,
        data,
        labels,
      };
      return datasets;
    },

    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TASK}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TASK,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },

  {
    templateType: 'TicketsStageDateRange',
    name: 'Vstupenky Fáze časové období',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const selectedUserIds = filter.assignedUserIds || [];
      const matchedFilter = await filterData(filter);
      const { pipelineId, boardId, stageId, stageType } = filter;
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageType,
        stageId,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      let ticketCounts = await models?.Tickets.find({
        ...query,
      }).lean();

      if (ticketCounts) {
        const data = await Promise.all(
          ticketCounts.map(async (item) => {
            const getTotalRespondedUsers = await sendCoreMessage({
              subdomain,
              action: 'users.find',
              data: {
                query: {
                  _id:
                    selectedUserIds.length > 0
                      ? { $in: selectedUserIds }
                      : { $in: item.assignedUserIds },
                },
              },
              isRPC: true,
              defaultValue: [],
            });

            const processedUsers = await Promise.all(
              getTotalRespondedUsers.map(async (user) => {
                const fullName = user.details?.fullName || user.email;
                const counts = await models?.Tickets.countDocuments({
                  status: 'active',
                  assignedUserIds: user._id,
                });
                return {
                  FullName: fullName,
                  _id: user._id,
                  count: counts || 0,
                };
              }),
            );

            // Flatten the array of arrays and remove duplicates based on _id
            const uniqueData = processedUsers.reduce((acc, val) => {
              acc[val._id] = val;
              return acc;
            }, {});

            return Object.values(uniqueData);
          }),
        );

        const filteredData = data.filter((arr) => arr.length > 0);
        const uniqueUserEntries = Array.from(
          new Set(filteredData.map((entry) => JSON.stringify(entry))),
          (str) => JSON.parse(str),
        );

        const summedResultArray =
          await sumCountsByUserIdName(uniqueUserEntries);
        const filteredResult =
          selectedUserIds.length > 0
            ? summedResultArray.filter((user) =>
                selectedUserIds.includes(user._id),
              )
            : summedResultArray;

        filteredResult.sort((a, b) => a.count - b.count);

        // Extract sorted data and labels
        const setData = filteredResult.map((item: any) => item.count);
        const setLabels = filteredResult.map((item: any) => item.fullName);

        const title = 'Vstupenky Fáze časové období';
        const datasets = { title, data: setData, labels: setLabels };
        return datasets;
      } else {
        throw new Error('Nebyla nalezena žádná nabídkaCounts');
      }
    },

    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,

        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TICKET,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },
  {
    templateType: 'TicketsCardCountAssignedUser',
    name: 'Počet Vstupenek a Přiřazený Uživatel',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const selectedUserIds = filter.assignedUserIds || [];
      const matchedFilter = await filterData(filter);
      const { pipelineId, boardId, stageId, stageType } = filter;
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageType,
        stageId,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      let tickedCounts = await models?.Tickets.find({
        ...query,
      }).lean();

      if (tickedCounts) {
        const data = await Promise.all(
          tickedCounts.map(async (item) => {
            const getTotalRespondedUsers = await sendCoreMessage({
              subdomain,
              action: 'users.find',
              data: {
                query: {
                  _id:
                    selectedUserIds.length > 0
                      ? { $in: selectedUserIds }
                      : { $in: item.assignedUserIds },
                },
              },
              isRPC: true,
              defaultValue: [],
            });

            const processedUsers = await Promise.all(
              getTotalRespondedUsers.map(async (user) => {
                const fullName = user.details?.fullName || user.email;
                const counts = await models?.Tickets.countDocuments({
                  status: 'active',
                  assignedUserIds: user._id,
                });
                return {
                  FullName: fullName,
                  _id: user._id,
                  count: counts || 0,
                };
              }),
            );

            // Flatten the array of arrays and remove duplicates based on _id
            const uniqueData = processedUsers.reduce((acc, val) => {
              acc[val._id] = val;
              return acc;
            }, {});

            return Object.values(uniqueData);
          }),
        );

        const filteredData = data.filter((arr) => arr.length > 0);
        const uniqueUserEntries = Array.from(
          new Set(filteredData.map((entry) => JSON.stringify(entry))),
          (str) => JSON.parse(str),
        );

        const summedResultArray =
          await sumCountsByUserIdName(uniqueUserEntries);
        const filteredResult =
          selectedUserIds.length > 0
            ? summedResultArray.filter((user) =>
                selectedUserIds.includes(user._id),
              )
            : summedResultArray;

        filteredResult.sort((a, b) => a.count - b.count);

        // Extract sorted data and labels
        const setData = filteredResult.map((item: any) => item.count);
        const setLabels = filteredResult.map((item: any) => item.fullName);

        const title = 'Počet vstupenek a přiřazený uživatel';
        const datasets = { title, data: setData, labels: setLabels };
        return datasets;
      } else {
        throw new Error('Nebyla nalezena žádná nabídkaCounts');
      }
    },

    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TICKET,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },

  {
    templateType: 'TicketAverageTimeToCloseOverTime',
    name: 'Průměrná doba uzavření lístku v průběhu času',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      filter: any,
      models: IModels,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageType,
        stageId,
        PIPELINE_TYPE_TICKET,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);
      const ticket = await models?.Tickets.find({
        ...query,
      }).lean();
      if (!ticket || ticket.length === 0) {
        throw new Error(
          'V databázi nebyl nalezen žádný tiket odpovídající zadaným kritériím.',
        );
      }

      const title =
        'Podívejte se na průměrnou dobu, kterou vašim zástupcům trvá uzavření tiketů. Podívejte se, jak se to v průběhu času sleduje.';
      const ticketData = await calculateAverageTimeToClose(ticket);

      // Create an array of objects containing both duration and label
      const dataWithLabels = ticketData.map((duration) => {
        const { hours, minutes, seconds } = convertHoursToHMS(duration);
        const label = `${hours}h ${minutes}m ${seconds}s`;
        return { duration, label };
      });

      // Sort the array based on duration
      dataWithLabels.sort((a, b) => a.duration - b.duration);

      // Extract sorted labels and durations
      const labels = dataWithLabels.map((entry) => entry.label);
      const sortedTicketData = dataWithLabels.map((entry) => entry.duration);

      const datasets = { title, ticketData: sortedTicketData, labels };

      return datasets;
    },
    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TICKET,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },

  {
    templateType: 'TicketClosedTotalsByRep',
    name: 'Celkový počet uzavřených lístků podle zástupce',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      filter: any,
      models: IModels,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageType,
        stageId,
        PIPELINE_TYPE_TICKET,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const selectedUserIds = filter.assignedUserIds || [];
      const tickets = await models?.Tickets.find({
        ...query,
      }).lean();

      // Calculate ticket counts
      const ticketCounts = calculateTicketCounts(tickets, selectedUserIds);
      // Convert the counts object to an array of objects with ownerId and count
      const countsArray = Object.entries(ticketCounts).map(
        // tslint:disable-next-line:no-shadowed-variable
        ([ownerId, count]) => ({
          ownerId,
          count,
        }),
      );

      // Sort the array based on ticket counts

      // Extract unique ownerIds for user lookup
      const ownerIds = countsArray.map((item) => item.ownerId);

      // Fetch information about assigned users
      const getTotalAssignedUsers = await sendCoreMessage({
        subdomain,
        action: 'users.find',
        data: {
          query: { _id: { $in: ownerIds } },
        },
        isRPC: true,
        defaultValue: [],
      });
      // Create a map for faster user lookup
      const assignedUsersMap = getTotalAssignedUsers.reduce((acc, user) => {
        acc[user._id] = user.details; // Assuming details contains user information
        return acc;
      }, {});

      const sort = ownerIds.map((ownerId) => {
        const user = assignedUsersMap[ownerId];
        const count = ticketCounts[ownerId];

        // Check if user exists and has a fullName property
        const name = user && user.fullName ? user.fullName : 'Unknown';

        return {
          name: name,
          count: count || 0, // Set count to 0 if not found in ticketCounts
        };
      });

      // Sort the array by count in descending order
      sort.sort((a, b) => b.count - a.count);

      const title =
        'Podívejte se na celkový počet vstupenek uzavřených jejich přiřazeným vlastníkem';

      // Reverse both data and labels arrays to achieve the desired order
      const data = sort.map((t: any) => t.count).reverse();
      const labels = sort.map((t: any) => t.name).reverse();

      const datasets = { title, data, labels };
      return datasets;
    },

    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TICKET,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },
  {
    templateType: 'TicketTotalsByStatus',
    name: 'Součty lístků podle stavu',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      filter: any,
      models: IModels,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageType,
        stageId,
        PIPELINE_TYPE_TICKET,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const tickets = await models?.Tickets.find({
        ...query,
      }).lean();
      const ticketTotalsByStatus = calculateTicketTotalsByStatus(tickets);

      const countsArray: any[] = Object.entries(ticketTotalsByStatus).map(
        ([status, count]) => ({
          status,
          count: count as number, // Ensure count is recognized as a number
        }),
      );
      countsArray.sort((a, b) => b.count - a.count);

      const title =
        'Podívejte se na celkový počet lístků v každé části vaší fronty podpory';
      countsArray.sort((a, b) => b.count - a.count);
      const labels = Object.values(countsArray).map((t: any) => t.status);
      const data = Object.values(countsArray).map((t: any) => t.count);

      const datasets = { title, data, labels };
      return datasets;
    },

    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TICKET,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },

  {
    templateType: 'TicketTotalsOverTime',
    name: 'Součty vstupenek v průběhu času',
    chartTypes: ['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea'],

    // Bar Chart Table
    getChartResult: async (
      filter: any,
      models: IModels,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageType,
        stageId,
        PIPELINE_TYPE_TICKET,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const totalTicked = await models?.Tickets.find({
        ...query,
      }).sort({
        createdAt: -1,
      });

      const monthNames: string[] = [];
      const monthlyTickedCount: number[] = [];

      if (totalTicked) {
        const now = new Date(); // Get the current date
        const startOfYear = new Date(now.getFullYear(), 0, 1); // Get the start of the year
        const endOfYear = new Date(now.getFullYear(), 12, 31); // Get the start of the year
        const endRange = dayjs(
          new Date(totalTicked.at(-1)?.createdAt || endOfYear),
        );

        let startRange = dayjs(startOfYear);

        while (startRange < endRange) {
          monthNames.push(startRange.format('MMMM'));

          const getStartOfNextMonth = startRange.add(1, 'month').toDate();
          const getTickedCountOfMonth = totalTicked.filter(
            (ticked) =>
              new Date(ticked.createdAt || '').getTime() >=
                startRange.toDate().getTime() &&
              new Date(ticked.createdAt || '').getTime() <
                getStartOfNextMonth.getTime(),
          );
          monthlyTickedCount.push(getTickedCountOfMonth.length);
          startRange = startRange.add(1, 'month');
        }
      }
      const label =
        'Zobrazení celkového počtu tiketů vytvořených za nastavenou dobu';
      const datasets = [
        { label, data: monthlyTickedCount, labels: monthNames },
      ];
      return datasets;
    },
    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TICKET,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },
  {
    templateType: 'TicketTotalsByLabelPriorityTag',
    name: 'Součty vstupenek podle štítku/priority/značky/',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],

    getChartResult: async (
      models: IModels,
      filter: any,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);

      const tickets = await models?.Tickets.find({
        ...query,
      }).lean();

      if (!Array.isArray(tickets)) {
        throw new Error('Neplatná data: lístky nejsou pole.');
      }

      // Calculate ticket totals by label, priority, and tag
      const ticketTotals = calculateTicketTotalsByLabelPriorityTag(tickets);
      let labelIds: string[] = [];
      let tagIds: string[] = [];
      let priorities: string[] = [];

      Object.entries(ticketTotals).forEach(([key, value]) => {
        if (key.startsWith('labelIds:')) {
          labelIds.push(key.replace('labelIds:', ''));
        } else if (key.startsWith('tagIds:')) {
          tagIds.push(key.replace('tagIds:', ''));
        } else if (key.startsWith('priority:')) {
          priorities.push(key.replace('priority:', ''));
        }
      });

      // Remove single quotes from both tagIds and labelIds
      tagIds = tagIds.map((tagId) => tagId.replace(/'/g, ''));
      labelIds = labelIds.map((labelId) => labelId.replace(/'/g, ''));
      priorities = priorities.map((priority) => priority.replace(/'/g, ''));

      const tagInfo = await sendTagsMessage({
        subdomain,
        action: 'find',
        data: {
          _id: { $in: tagIds || [] },
        },
        isRPC: true,
        defaultValue: [],
      });
      const tagNames = tagInfo.map((tag) => tag.name);

      const labels = await models?.PipelineLabels.find({
        _id: { $in: labelIds },
      });
      if (!labels || labels.length === 0) {
        return { title: '', data: [], labels: [] };
      }
      const labelNames = labels.map((label) => label.name);

      const allLabels = [...priorities, ...labelNames, ...tagNames];

      const simplifiedLabels = allLabels.map((label) =>
        label.replace(/(labelIds:|tagIds:|')/g, ''),
      );

      const title =
        '  Zobrazit celkový počet vstupenek podle štítku/priority/značky/ ';

      const data = Object.values(ticketTotals);

      const datasets = { title, data, labels: simplifiedLabels };

      return datasets;
    },
    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TICKET,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },
  {
    templateType: 'TicketAverageTimeToCloseByRep',
    name: 'Průměrná doba uzavření lístku podle zástupce',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Bar Chart Table
    getChartResult: async (
      filter: any,
      models: IModels,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageType, stageId } = filter;
      const selectedUserIds = filter.assignedUserIds || [];
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);
      let tickets;

      tickets = await models?.Tickets.find({
        ...query,
      });
      const ticketData = await calculateAverageTimeToCloseUser(
        tickets,
        selectedUserIds,
      );

      const getTotalAssignedUsers = await Promise.all(
        tickets.map(async (result) => {
          return await sendCoreMessage({
            subdomain,
            action: 'users.find',
            data: {
              query: {
                _id:
                  selectedUserIds.length > 0
                    ? { $in: selectedUserIds }
                    : { $in: result.assignedUserIds },
              },
            },
            isRPC: true,
            defaultValue: [],
          });
        }),
      );

      const result: any[] = [];
      const uniqueUserIds = new Set();

      for (const assignedUser of getTotalAssignedUsers) {
        assignedUser.forEach((itemsAdd) => {
          // Use forEach instead of map
          const ticket = ticketData?.find((item) =>
            item.assignedUserIds.includes(itemsAdd._id),
          );

          if (ticket && !uniqueUserIds.has(itemsAdd._id)) {
            uniqueUserIds.add(itemsAdd._id); // Add the user ID to the Set
            result.push({
              timeDifference: ticket.timeDifference,
              assignedUserIds: ticket.assignedUserIds,
              FullName: itemsAdd.details?.fullName || '',
            });
          }
        });
      }
      result.sort((a, b) => a.timeDifference - b.timeDifference);

      const data = Object.values(result).map((t: any) => t.timeDifference);
      const labels = Object.values(result).map((t: any) => t.FullName);

      const title =
        'Podívejte se na průměrnou dobu, kterou zástupce potřebuje k uzavření tiketu';

      const datasets = {
        title,
        data,
        labels,
      };

      return datasets;
    },
    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TICKET,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },
  {
    templateType: 'TicketTotalsBySource',
    name: 'Součty vstupenek podle zdroje',
    chartTypes: ['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea'],
    // Table
    getChartResult: async (
      filter: any,
      models: IModels,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);
      const ticket = await models?.Tickets.find({
        ...query,
        sourceConversationIds: { $exists: true, $ne: [] },
      }).lean();
      if (!ticket || ticket.length === 0) {
        throw new Error(
          'V databázi nebyl nalezen žádný tiket odpovídající zadaným kritériím.',
        );
      }
      const data = [ticket.length];
      const labels = ['total'];
      const title = 'Součty vstupenek podle zdroje';

      const datasets = [{ title, data, labels }];
      return datasets;
    },
    filterTypes: [
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TICKET,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },

  {
    templateType: 'TicketAverageTimeToClose',
    name: 'Průměrná doba uzavření lístku',
    chartTypes: [
      'bar',
      'line',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'table',
    ],
    // Table
    getChartResult: async (
      filter: any,
      models: IModels,
      dimension: any,
      subdomain: string,
    ) => {
      const { pipelineId, boardId, stageId, stageType } = filter;
      const matchedFilter = await filterData(filter);
      const filterPipelineId = await PipelineAndBoardFilter(
        pipelineId,
        boardId,
        stageId,
        stageType,
        PIPELINE_TYPE_DEAL,
        models,
      );
      let query = await QueryFilter(filterPipelineId, matchedFilter);
      const ticket = await models?.Tickets.find({
        ...query,
      }).lean();
      if (!ticket || ticket.length === 0) {
        throw new Error(
          'V databázi nebyl nalezen žádný tiket odpovídající zadaným kritériím.',
        );
      }
      const data = await calculateAverageTimeToClose(ticket);

      const dataWithLabels = data.map((duration) => {
        const { hours, minutes, seconds } = convertHoursToHMS(duration);
        const label = `${hours}h ${minutes}m ${seconds}s`;
        return { duration, label };
      });

      dataWithLabels.sort((a, b) => a.duration - b.duration);

      const labels = dataWithLabels.map((entry) => entry.label);
      const sortedData = dataWithLabels.map((entry) => entry.duration);

      const title =
        'Podívejte se na průměrnou dobu, kterou vaši zástupci potřebují k uzavření tiketů';

      const datasets = { title, data: sortedData, labels };

      return datasets;
    },
    filterTypes: [
      {
        fieldName: 'assignedUserIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'users',
        fieldLabel: 'Vyberte přiřazené uživatele',
      },
      {
        fieldName: 'dateRange',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'date',
        fieldOptions: DATE_RANGE_TYPES,
        fieldLabel: 'Vyberte časové období',
      },
      {
        fieldName: 'branchIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'branches',
        fieldLabel: 'Vyberte pobočky',
      },
      {
        fieldName: 'departmentIds',
        fieldType: 'select',
        multi: true,
        fieldQuery: 'departments',
        fieldLabel: 'Vyberte oddělení',
      },
      {
        fieldName: 'boardId',
        fieldType: 'select',
        fieldQuery: 'boards',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        fieldLabel: 'Vyberte desky',
      },
      {
        fieldName: 'pipelineId',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'pipelines',
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        fieldQueryVariables: `{"type": "${PIPELINE_TYPE_TICKET}"}`,
        logics: [
          {
            logicFieldName: 'boardId',
            logicFieldVariable: 'boardId',
          },
        ],
        fieldLabel: 'Vyberte potrubí',
      },
      {
        fieldName: 'stageId',
        fieldType: 'select',
        fieldQuery: 'stages',
        multi: false,
        fieldValueVariable: '_id',
        fieldLabelVariable: 'name',
        logics: [
          {
            logicFieldName: 'pipelineId',
            logicFieldVariable: 'pipelineId',
          },
        ],
        fieldLabel: 'Vyberte fázi',
      },
      {
        fieldName: 'stageType',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PROBABILITY_TICKET,
        fieldLabel: 'Vyberte Pravděpodobnost',
      },
      {
        fieldName: 'priority',
        fieldType: 'select',
        multi: false,
        fieldQuery: 'stages',
        fieldOptions: PRIORITY,
        fieldLabel: 'Vyberte Prioritu Fáze',
      },
    ],
  },
];

const getChartResult = async ({ subdomain, data }) => {
  const models = await generateModels(subdomain);
  const { templateType, filter, dimension } = data;

  const template =
    chartTemplates.find((t) => t.templateType === templateType) || ({} as any);

  return template.getChartResult(models, filter, dimension, subdomain);
};

export default {
  chartTemplates,
  reportTemplates,
  getChartResult,
};

function taskClosedByRep(tickets: any) {
  // tslint:disable-next-line:no-shadowed-variable
  const ticketCounts: Record<string, number> = {};

  // Check if tickets is an array
  if (!Array.isArray(tickets)) {
  }

  tickets.forEach((ticket) => {
    const labelIds = (ticket.labelIds as string[]) || [];

    if (labelIds.length === 0) {
      return;
    }
    labelIds.forEach((ownerId) => {
      ticketCounts[ownerId] = (ticketCounts[ownerId] || 0) + 1;
    });
  });

  return ticketCounts;
}

function taskClosedByTagsRep(tasks: any) {
  // tslint:disable-next-line:no-shadowed-variable
  const ticketCounts: Record<string, number> = {};

  // Check if tickets is an array
  if (!Array.isArray(tasks)) {
    throw new Error('Neplatný vstup: úkoly by měly být pole.');
  }

  tasks.forEach((ticket) => {
    const tagIds = (ticket.tagIds as string[]) || [];

    if (tagIds.length === 0) {
      return;
    }
    tagIds.forEach((ownerId) => {
      ticketCounts[ownerId] = (ticketCounts[ownerId] || 0) + 1;
    });
  });

  return ticketCounts;
}

function departmentCount(tasks: any) {
  // tslint:disable-next-line:no-shadowed-variable
  const taskCounts: Record<string, number> = {};

  // Check if tasks is an array
  if (!Array.isArray(tasks)) {
    throw new Error('Neplatný vstup: úkoly by měly být pole.');
  }

  tasks.forEach((task) => {
    const tagIds = (task.departmentIds as string[]) || [];

    if (tagIds.length === 0) {
      return;
    }
    tagIds.forEach((ownerId) => {
      taskCounts[ownerId] = (taskCounts[ownerId] || 0) + 1;
    });
  });

  return taskCounts;
}

function calculateTicketCounts(tickets: any, selectedUserIds: any) {
  // tslint:disable-next-line:no-shadowed-variable
  const ticketCounts: Record<string, number> = {};

  // Check if tickets is an array
  if (!Array.isArray(tickets)) {
    throw new Error('Neplatný vstup: lístky by měly být pole.');
  }
  if (selectedUserIds.length > 0) {
    selectedUserIds.forEach((userId) => {
      ticketCounts[userId] = 0;
    });
  }

  tickets.forEach((ticket) => {
    const assignedUserIds = (ticket.assignedUserIds as string[]) || [];

    if (assignedUserIds.length === 0) {
      return;
    }
    if (selectedUserIds.length > 0) {
      assignedUserIds.forEach((ownerId) => {
        if (selectedUserIds.includes(ownerId)) {
          ticketCounts[ownerId] = (ticketCounts[ownerId] || 0) + 1;
        }
      });
    } else {
      assignedUserIds.forEach((ownerId) => {
        ticketCounts[ownerId] = (ticketCounts[ownerId] || 0) + 1;
      });
    }
  });

  return ticketCounts;
}

function amountProductData(deals: any[]): Promise<any[]> {
  return new Promise((resolve) => {
    const repAmounts: Record<string, any> = {};

    deals.forEach((deal) => {
      if (deal.productsData) {
        const productsData = deal.productsData;
        productsData.forEach((product) => {
          if (product.amount) {
            if (!repAmounts[deal.stageId]) {
              repAmounts[deal.stageId] = {
                totalAmount: 0,
                stageId: deal.stageId,
              };
            }

            repAmounts[deal.stageId].totalAmount += product.amount;
          }
        });
      }
    });

    // Convert the repAmounts object into an array
    const resultArray = Object.values(repAmounts);

    resolve(resultArray);
  });
}

// Function to calculate the average deal amounts by rep
function calculateAverageDealAmountByRep(deals: any, selectedUserIds: any) {
  const repAmounts = {};
  const dealCounts: Record<string, number> = {};

  if (selectedUserIds.length > 0) {
    selectedUserIds.forEach((userId) => {
      repAmounts[userId] = { totalAmount: 0, count: 0 };
      dealCounts[userId] = 0;
    });
  }
  deals.forEach((deal) => {
    if (deal.productsData && deal.status === 'active') {
      const productsData = deal.productsData;

      productsData.forEach((product) => {
        if (product.amount) {
          const assignedUserIds = deal.assignedUserIds;
          if (selectedUserIds.length > 0) {
            assignedUserIds.forEach((userId) => {
              if (selectedUserIds.includes(userId)) {
                repAmounts[userId] = repAmounts[userId] || {
                  totalAmount: 0,
                  count: 0,
                };
                repAmounts[userId].totalAmount += product.amount;
                repAmounts[userId].count += 1;

                // If you want counts for each user, increment the deal count
                dealCounts[userId] = (dealCounts[userId] || 0) + 1;
              }
            });
          } else {
            assignedUserIds.forEach((userId) => {
              repAmounts[userId] = repAmounts[userId] || {
                totalAmount: 0,
                count: 0,
              };
              repAmounts[userId].totalAmount += product.amount;
              repAmounts[userId].count += 1;
            });
          }
        }
      });
    }
  });

  const result: Array<{ userId: string; amount: string }> = [];

  // tslint:disable-next-line:forin
  for (const userId in repAmounts) {
    const totalAmount = repAmounts[userId].totalAmount;
    const count = repAmounts[userId].count;
    const averageAmount = count > 0 ? totalAmount / count : 0;

    result.push({ userId, amount: averageAmount.toFixed(3) });
  }

  return result;
}

function calculateTicketTotalsByStatus(tickets: any) {
  const ticketTotals = {};

  // Loop through tickets
  tickets.forEach((ticket) => {
    const status = ticket.status;

    // Check if status exists
    if (status !== undefined && status !== null) {
      // Initialize or increment status count
      ticketTotals[status] = (ticketTotals[status] || 0) + 1;
    }
  });

  // Return the result
  return ticketTotals;
}

function calculateTicketTotalsByLabelPriorityTag(tickets: any) {
  return tickets.reduce((ticketTotals: Record<string, number>, ticket) => {
    const labels = ticket.labelIds || [];
    const priority = ticket.priority || 'Default'; // Replace 'Default' with the default priority if not available
    const tags = ticket.tagIds || [];
    // Increment counts for each label
    labels.forEach((label) => {
      const labelKey = `labelIds:'${label}'`;
      ticketTotals[labelKey] = (ticketTotals[labelKey] || 0) + 1;
    });
    // Increment counts for each priority
    const priorityKey = `priority:'${priority}'`;
    ticketTotals[priorityKey] = (ticketTotals[priorityKey] || 0) + 1;

    // Increment counts for each tag
    tags.forEach((tag) => {
      const tagKey = `tagIds:'${tag}'`;
      ticketTotals[tagKey] = (ticketTotals[tagKey] || 0) + 1;
    });

    return ticketTotals;
  }, {});
}

const calculateAverageTimeToClose = (tickets) => {
  // Filter out tickets without close dates
  const closedTickets = tickets.filter(
    (ticketItem) => ticketItem.modifiedAt && ticketItem.createdAt,
  );

  if (closedTickets.length === 0) {
    throw new Error('Nebyly nalezeny žádné uzavřené vstupenky.');
  }

  // Calculate time to close for each ticket in milliseconds
  const timeToCloseArray = closedTickets.map((ticketItem) => {
    const createdAt = new Date(ticketItem.createdAt).getTime();
    const modifiedAt = new Date(ticketItem.modifiedAt).getTime();

    // Check if both dates are valid
    if (!isNaN(createdAt) && !isNaN(modifiedAt)) {
      return modifiedAt - createdAt;
    }
  });

  // Filter out invalid date differences
  const validTimeToCloseArray = timeToCloseArray.filter(
    (time) => time !== null,
  );

  if (validTimeToCloseArray.length === 0) {
    throw new Error('Nebyly nalezeny žádné platné časové rozdíly.');
  }

  const timeToCloseInHoursArray = validTimeToCloseArray.map((time) =>
    (time / (1000 * 60 * 60)).toFixed(3),
  );

  return timeToCloseInHoursArray;
};
function convertHoursToHMS(durationInHours) {
  const hours = Math.floor(durationInHours);
  const minutes = Math.floor((durationInHours - hours) * 60);
  const seconds = Math.floor(((durationInHours - hours) * 60 - minutes) * 60);

  return { hours, minutes, seconds };
}
const taskAverageTimeToCloseByLabel = async (tasks) => {
  const closedTasks = tasks.filter(
    (ticketItem) => ticketItem.modifiedAt && ticketItem.createdAt,
  );

  if (closedTasks.length === 0) {
    throw new Error('Nebyly nalezeny žádné uzavřené úkoly.');
  }

  // Calculate time to close for each ticket in milliseconds
  const timeToCloseArray = closedTasks.map((ticketItem) => {
    const createdAt = new Date(ticketItem.createdAt).getTime();
    const modifiedAt = new Date(ticketItem.modifiedAt).getTime();

    // Check if both dates are valid
    if (!isNaN(createdAt) && !isNaN(modifiedAt)) {
      return {
        timeDifference: modifiedAt - createdAt,
        stageId: ticketItem.stageId, // Include assignedUserIds
        labelIds: ticketItem.labelIds,
        tagIds: ticketItem.tagIds,
      };
    }
  });

  // Filter out invalid date differences
  const validTimeToCloseArray = timeToCloseArray.filter(
    (time) => time !== null,
  );

  if (validTimeToCloseArray.length === 0) {
    throw new Error('Nebyly nalezeny žádné platné časové rozdíly.');
  }

  const timeToCloseInHoursArray = validTimeToCloseArray.map((time) => ({
    timeDifference: (time.timeDifference / (1000 * 60 * 60)).toFixed(3),
    stageId: time.stageId, // Include assignedUserIds
    labelIds: time.labelIds,
    tagIds: time.tagIds,
  }));

  return timeToCloseInHoursArray;
};

const calculateAverageTimeToCloseUser = (
  tickets: any,
  selectedUserIds: any,
) => {
  // Filter out tickets without close dates
  const closedTickets = tickets.filter(
    (ticketItem) => ticketItem.modifiedAt && ticketItem.createdAt,
  );

  if (closedTickets.length === 0) {
    throw new Error('Nebyly nalezeny žádné uzavřené vstupenky.');
  }
  if (selectedUserIds.length > 0) {
    selectedUserIds.forEach((userId) => {
      closedTickets[userId] = 0;
    });
  }
  // Calculate time to close for each ticket in milliseconds
  const timeToCloseArray = closedTickets.map((ticketItem) => {
    const createdAt = new Date(ticketItem.createdAt).getTime();
    const modifiedAt = new Date(ticketItem.modifiedAt).getTime();
    const user_id = ticketItem.assignedUserIds;

    if (!isNaN(createdAt) && !isNaN(modifiedAt)) {
      if (selectedUserIds.length > 0) {
        const matchingUserIds = user_id.filter((result) =>
          selectedUserIds.includes(result),
        );
        return {
          timeDifference: modifiedAt - createdAt,
          assignedUserIds: matchingUserIds, // Include assignedUserIds
        };
      } else {
        return {
          timeDifference: modifiedAt - createdAt,
          assignedUserIds: user_id, // Include assignedUserIds
        };
      }
    }
  });

  // Filter out invalid date differences
  const validTimeToCloseArray = timeToCloseArray.filter(
    (time) => time !== null,
  );

  if (validTimeToCloseArray.length === 0) {
    throw new Error('Nebyly nalezeny žádné platné časové rozdíly.');
  }

  // Calculate the sum of timeDifference for each unique user
  const userTotals = {};

  validTimeToCloseArray.forEach((entry) => {
    if (entry !== null) {
      entry.assignedUserIds.forEach((userId) => {
        userTotals[userId] = (userTotals[userId] || 0) + entry.timeDifference;
      });
    }
  });

  const resultArray = Object.entries(userTotals).map(
    (
      value: [string, unknown],
      index: number,
      array: Array<[string, unknown]>,
    ) => {
      const [userId, timeDifferenceSum] = value;
      return {
        timeDifference: (timeDifferenceSum as number).toFixed(3),
        assignedUserIds: [userId],
      };
    },
  );
  return resultArray;
};

function sumCountsByUserIdName(inputArray: any[]) {
  const resultMap = new Map<
    string,
    { count: number; fullName: string; _id: string }
  >();
  inputArray.forEach((userEntries) => {
    userEntries.forEach((entry) => {
      const userId = entry._id;
      const count = entry.count;

      if (resultMap.has(userId)) {
        resultMap.get(userId)!.count += count;
      } else {
        resultMap.set(userId, {
          count,
          fullName: entry.FullName,
          _id: entry._id,
        });
      }
    });
  });

  return Array.from(resultMap.values());
}

function stageChangedDate(ticked: any[]) {
  const resultMap = new Map<
    string,
    { date: string; name: string; _id: string }
  >(
    Array.from(ticked, (t) => [
      t._id,
      {
        _id: t._id,
        name: t.name,
        date: new Date(t.stageChangedDate).toLocaleString(),
      },
    ]),
  );

  return Array.from(resultMap.values());
}
function filterData(filter: any) {
  const {
    dateRange,
    startDate,
    endDate,
    assignedUserIds,
    branchIds,
    departmentIds,
    stageId,
    tagIds,
    pipelineLabels,
    fieldsGroups,
    priority,
  } = filter;
  const matchfilter = {};

  if (assignedUserIds) {
    matchfilter['assignedUserIds'] = { $in: assignedUserIds };
  }
  if (dateRange) {
    const dateFilter = returnDateRange(filter.dateRange, startDate, endDate);

    if (Object.keys(dateFilter).length) {
      matchfilter['createdAt'] = dateFilter;
    }
  }
  if (branchIds) {
    matchfilter['branchIds'] = { $in: branchIds };
  }
  if (departmentIds) {
    matchfilter['departmentIds'] = { $in: departmentIds };
  }

  if (stageId) {
    matchfilter['stageId'] = { $in: stageId };
  }
  if (tagIds) {
    matchfilter['tagIds'] = { $in: tagIds };
  }
  if (pipelineLabels) {
    matchfilter['labelIds'] = { $in: pipelineLabels };
  }
  if (priority) {
    matchfilter['priority'] = { $in: priority };
  }

  return matchfilter;
}
async function pipelineFilterData(
  filter: any,
  models: IModels,
  pipelineId: any,
  boardId: any,
  stageType: any,
) {
  let pipelineIds: string[] = [];
  let stageFilters = {};
  if (stageType) {
    const stageFilter = returnStage(stageType);
    // Check if stageFilter is not empty
    if (Object.keys(stageFilter).length) {
      stageFilters['probability'] = stageFilter;
    }
  }
  if (checkFilterParam(pipelineId)) {
    const findPipeline = await models?.Pipelines.find({
      _id: {
        $in: pipelineId,
      },
      type: 'deal',
      status: 'active',
    });
    if (findPipeline) {
      pipelineIds.push(...findPipeline.map((item) => item._id));
    }
  }
  if (checkFilterParam(boardId)) {
    const findBoard = await models?.Boards.find({
      _id: {
        $in: boardId,
      },
      type: 'deal',
    });
    if (findBoard) {
      const boardId = findBoard?.map((item) => item._id);
      const pipeline = await models?.Pipelines.find({
        boardId: {
          $in: boardId,
        },
        type: 'deal',
        status: 'active',
      });
      if (pipeline) {
        pipelineIds.push(...pipeline.map((item: any) => item._id));
      }
    }
  }

  const stages = await models?.Stages.find({
    ...stageFilters,
    pipelineId: {
      $in: pipelineIds,
    },
    type: 'deal',
  });
  const pipeline = stages?.map((item) => item._id);

  const deals = await models?.Deals.find({
    ...filter,
    stageId: {
      $in: pipeline,
    },
  }).lean();

  if (deals) {
    const dealAmount = await amountProductData(deals);

    const dealAmountMap = {};
    dealAmount.forEach((item) => {
      dealAmountMap[item.stageId] = item.totalAmount;
    });

    // Assign totalAmount to each deal
    const groupStage = deals.map((deal) => ({
      ...deal,
      productCount: deal.productsData?.length,
      totalAmount: dealAmountMap[deal.stageId],
    }));
    const title = 'Nabídky prodeje a průměr';

    const filteredGroupStage = groupStage.filter(
      (item: any) => typeof item.totalAmount === 'number',
    );

    // Sort the filtered array by totalAmount
    filteredGroupStage.sort((a, b) => a.totalAmount - b.totalAmount);

    // Extract sorted data and labels
    const data = filteredGroupStage.map((item: any) => item.totalAmount);
    const labels = filteredGroupStage.map(
      (item: any) =>
        `Název: ${item.name}, Počet Produktů: ${item.productCount}`,
    );

    const datasets = { title, data, labels };
    return datasets;
  } else {
    throw new Error('Nebyly nalezeny žádné nabídky');
  }
}

async function PipelineAndBoardFilter(
  pipelineId: string,
  boardId: string,
  stageType: string,
  stageId: string,
  type: string,
  models: IModels,
) {
  let pipelineIds: string[] = [];

  let stageFilters = {};
  if (stageType) {
    const stageFilter = returnStage(stageType);
    // Check if stageFilter is not empty
    if (Object.keys(stageFilter).length) {
      stageFilters['probability'] = stageFilter;
    }
  }

  if (checkFilterParam(boardId)) {
    const findPipeline = await models?.Pipelines.find({
      boardId: {
        $in: boardId,
      },
      type: type,
      status: 'active',
    });
    if (findPipeline) {
      pipelineIds.push(...findPipeline.map((item) => item._id));
    }
  }
  if (checkFilterParam(pipelineId)) {
    const findPipeline = await models?.Pipelines.find({
      _id: {
        $in: pipelineId,
      },
      type: type,
      status: 'active',
    });
    if (findPipeline) {
      pipelineIds.push(...findPipeline.map((item) => item._id));
    }
  }
  if (checkFilterParam(stageId)) {
    const findStages = await models?.Stages.find({
      ...stageFilters,
      _id: {
        $in: stageId,
      },
      type: type,
    });
    if (findStages) {
      const stage_ids = findStages?.map((item) => item._id);
      return stage_ids;
    }
  }
  let uniquePipelineIdsSet = new Set(pipelineIds);
  let uniquePipelineIds = Array.from(uniquePipelineIdsSet);
  const stages = await models?.Stages.find({
    ...stageFilters,
    pipelineId: {
      $in: uniquePipelineIds,
    },
    type: type,
  });
  const stage_ids = stages?.map((item) => item._id);
  return stage_ids;
}

function QueryFilter(filterPipelineId: any, matchedFilter: any) {
  let constructedQuery: any = {};

  if (filterPipelineId && Object.keys(filterPipelineId).length > 0) {
    constructedQuery.stageId = { $in: filterPipelineId };
  }

  if (
    matchedFilter &&
    typeof matchedFilter === 'object' &&
    Object.keys(matchedFilter).length > 0
  ) {
    constructedQuery = {
      ...constructedQuery,
      ...matchedFilter,
    };
  }

  return constructedQuery;
}
