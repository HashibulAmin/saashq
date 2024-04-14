import { generateFieldsFromSchema } from '@saashq/api-utils/src/fieldUtils';
import { generateModels, IModels } from './connectionResolver';
import {
  BOARD_ITEM_EXPORT_EXTENDED_FIELDS,
  BOARD_ITEM_EXTENDED_FIELDS,
} from './constants';
import {
  sendContactsMessage,
  sendCoreMessage,
  sendProductsMessage,
  sendSegmentsMessage,
} from './messageBroker';

const generateProductsOptions = async (
  subdomain: string,
  name: string,
  label: string,
  type: string,
) => {
  const products = await sendProductsMessage({
    subdomain,
    action: 'find',
    data: {
      query: {},
    },
    isRPC: true,
    defaultValue: [],
  });

  const options: Array<{ label: string; value: any }> = products.map(
    (product) => ({
      value: product._id,
      label: `${product.code} - ${product.name}`,
    }),
  );

  return {
    _id: Math.random(),
    name,
    label,
    type,
    selectOptions: options,
  };
};

const generateProductsCategoriesOptions = async (
  subdomain: string,
  name: string,
  label: string,
  type: string,
) => {
  const productCategories = await sendProductsMessage({
    subdomain,
    action: 'categories.find',
    data: {
      query: {},
    },
    isRPC: true,
    defaultValue: [],
  });

  const options: Array<{ label: string; value: any }> = productCategories.map(
    (productCategory) => ({
      value: productCategory._id,
      label: `${productCategory.code} - ${productCategory.name}`,
    }),
  );

  return {
    _id: Math.random(),
    name,
    label,
    type,
    selectOptions: options,
  };
};

const generateContactsOptions = async (
  subdomain: string,
  name: string,
  label: string,
  type: string,
  params?: any,
) => {
  const contacts = await sendContactsMessage({
    subdomain,
    action: `${name}.find`,
    data: { ...params, status: { $ne: 'deleted' } },
    isRPC: true,
    defaultValue: [],
  });

  const options: Array<{ label: string; value: any }> = contacts.map(
    (contact) => ({
      value: contact._id,
      label: `${contact?.primaryEmail || contact?.primaryName || ''}`,
    }),
  );

  return {
    _id: Math.random(),
    name,
    label,
    type,
    selectOptions: options,
  };
};

const generateUsersOptions = async (
  subdomain: string,
  name: string,
  label: string,
  type: string,
) => {
  const users = await sendCoreMessage({
    subdomain,
    action: 'users.find',
    data: {
      query: {},
    },
    isRPC: true,
    defaultValue: [],
  });

  const options: Array<{ label: string; value: any }> = users.map((user) => ({
    value: user._id,
    label: user.username || user.email || '',
  }));

  return {
    _id: Math.random(),
    name,
    label,
    type,
    selectOptions: options,
  };
};

const generateStructuresOptions = async (
  subdomain: string,
  name: string,
  label: string,
  type: string,
  filter?: any,
) => {
  return {
    _id: Math.random(),
    name,
    label,
    type,
  };
};

const getStageOptions = async (models: IModels, pipelineId) => {
  const stages = await models.Stages.find({ pipelineId });
  const options: Array<{ label: string; value: any }> = [];

  for (const stage of stages) {
    options.push({
      value: stage._id,
      label: stage.name || '',
    });
  }

  return {
    _id: Math.random(),
    name: 'stageId',
    label: 'Etapa',
    type: 'stage',
    selectOptions: options,
  };
};

const getPipelineLabelOptions = async (models: IModels, pipelineId) => {
  const labels = await models.PipelineLabels.find({ pipelineId });
  const options: Array<{ label: string; value: any }> = [];

  for (const label of labels) {
    options.push({
      value: label._id,
      label: label.name,
    });
  }

  return {
    _id: Math.random(),
    name: 'labelIds',
    label: 'Štítky',
    type: 'label',
    selectOptions: options,
  };
};

export const generateFields = async ({ subdomain, data }) => {
  const models = await generateModels(subdomain);
  const { type, config = {}, segmentId, usageType } = data;

  const { pipelineId } = config;

  let schema: any;
  let fields: Array<{
    _id: number;
    name: string;
    group?: string;
    label?: string;
    type?: string;
    validation?: string;
    options?: string[];
    selectOptions?: Array<{ label: string; value: string }>;
  }> = [];

  switch (type) {
    case 'deal':
      schema = models.Deals.schema;
      break;
    case 'purchase':
      schema = models.Purchases.schema;
      break;
    case 'task':
      schema = models.Tasks.schema;
      break;

    case 'ticket':
      schema = models.Tickets.schema;
      break;
  }

  if (usageType && usageType === 'import') {
    fields = BOARD_ITEM_EXTENDED_FIELDS;
  }

  if (usageType && usageType === 'export') {
    fields = BOARD_ITEM_EXPORT_EXTENDED_FIELDS;
  }

  if (schema) {
    // generate list using customer or company schema
    fields = [...(await generateFieldsFromSchema(schema, '')), ...fields];

    for (const name of Object.keys(schema.paths)) {
      const path = schema.paths[name];

      // extend fields list using sub schema fields
      if (path.schema) {
        fields = [
          ...fields,
          ...(await generateFieldsFromSchema(path.schema, `${name}.`)),
        ];
      }
    }
  }

  const createdByOptions = await generateUsersOptions(
    subdomain,
    'userId',
    'Created by',
    'user',
  );

  const modifiedByOptions = await generateUsersOptions(
    subdomain,
    'modifiedBy',
    'Modified by',
    'user',
  );

  const assignedUserOptions = await generateUsersOptions(
    subdomain,
    'assignedUserIds',
    'Assigned to',
    'user',
  );

  const watchedUserOptions = await generateUsersOptions(
    subdomain,
    'watchedUserIds',
    'Watched users',
    'user',
  );

  const customersOptions = await generateContactsOptions(
    subdomain,
    'customers',
    'Customers',
    'contact',
    { state: 'customer' },
  );

  const companiesOptions = await generateContactsOptions(
    subdomain,
    'companies',
    'Companies',
    'contact',
  );

  const branchesOptions = await generateStructuresOptions(
    subdomain,
    'branchIds',
    'Branches',
    'structure',
  );

  const departmentsOptions = await generateStructuresOptions(
    subdomain,
    'departmentIds',
    'Departments',
    'structure',
  );

  fields = [
    ...fields,
    ...[
      createdByOptions,
      modifiedByOptions,
      assignedUserOptions,
      watchedUserOptions,
      customersOptions,
      companiesOptions,
      branchesOptions,
      departmentsOptions,
    ],
  ];

  if (type === 'deal' || (type === 'purchase' && usageType !== 'export')) {
    const productOptions = await generateProductsOptions(
      subdomain,
      'productsData.productId',
      'Product',
      'product',
    );

    const productsCategoriesOptions = await generateProductsCategoriesOptions(
      subdomain,
      'productsData.categoryId',
      'Product Categories',
      'select',
    );

    fields = [
      ...fields,
      ...[productOptions, productsCategoriesOptions, assignedUserOptions],
    ];
  }

  if (type === 'deal' || (type === 'purchase' && usageType === 'export')) {
    const extendFieldsExport = [
      { _id: Math.random(), name: 'productsData.name', label: 'Jméno Výrobku' },
      { _id: Math.random(), name: 'productsData.code', label: 'Kód produktu' },
      { _id: Math.random(), name: 'productsData.branch', label: 'Větev' },
      {
        _id: Math.random(),
        name: 'productsData.department',
        label: 'Oddělení',
      },
    ];

    fields = [...fields, ...extendFieldsExport];
  }

  if (usageType === 'export') {
    const extendExport = [
      { _id: Math.random(), name: 'boardId', label: 'Deska' },
      { _id: Math.random(), name: 'pipelineId', label: 'Potrubí' },
      { _id: Math.random(), name: 'labelIds', label: 'Označení' },
      { _id: Math.random(), name: 'branchIds', label: 'Větev' },
      { _id: Math.random(), name: 'departmentIds', label: 'Oddělení' },
    ];

    fields = [...fields, ...extendExport];
  }

  if (segmentId || pipelineId) {
    const segment = segmentId
      ? await sendSegmentsMessage({
          subdomain,
          action: 'findOne',
          data: { _id: segmentId },
          isRPC: true,
        })
      : null;

    const labelOptions = await getPipelineLabelOptions(
      models,
      pipelineId || (segment ? segment.pipelineId : null),
    );

    const stageOptions = await getStageOptions(
      models,
      pipelineId || (segment ? segment.pipelineId : null),
    );

    fields = [...fields, stageOptions, labelOptions];
  } else {
    const stageOptions = {
      _id: Math.random(),
      name: 'stageId',
      label: 'Etapa',
      type: 'stage',
    };

    fields = [...fields, stageOptions];
  }

  return fields;
};
