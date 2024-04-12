const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');
const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  throw new Error(`Proměnná prostředí MONGO_URL není nastavena.`);
}

const client = new MongoClient(MONGO_URL);

let db;
let Tickets;
let Tasks;

const command = async () => {
  console.log(`starting ... ${MONGO_URL}`);

  await client.connect();
  console.log('db connected ...');

  db = client.db();

  Tickets = db.collection('tickets');
  Tasks = db.collection('tasks');

  const modelsMap = [
    {
      type: 'tickets',
      collection: Tickets,
    },
    {
      type: 'tasks',
      collection: Tasks,
    },
  ];

  for (const models of modelsMap) {
    console.log(`${models.type} starting...`);

    const items = await models.collection.find({
      'customFieldsData.extraValue': 'riskAssessmentVisitors',
      'customFieldData.stringValue': { $exists: false },
    });

    console.log(`${items.length} ${models.type} found from db...`);

    let bulkOps: any = [];

    for (const item of items) {
      for (const customFieldData of item?.customFieldsData) {
        if (
          Array.isArray(customFieldData?.value || []) &&
          customFieldData?.extraValue === 'riskAssessmentVisitors'
        ) {
          const stringValue = customFieldData.value.join(',');
          bulkOps.push({
            updateOne: {
              filter: {
                _id: item._id,
                'customFieldsData.field': customFieldData.field,
              },
              update: {
                $set: { 'customFieldsData.$.stringValue': stringValue },
              },
            },
          });
        }
      }
    }

    console.log(`${bulkOps?.length || 0} item will be updated`);

    if (bulkOps?.length > 0) {
      try {
        await models.collection.bulkWrite(bulkOps);
        console.log(`${bulkOps?.length || 0} items updated successfully`);
      } catch (e) {
        console.log('Vyskytla se chyba:', e.message);
      }
    }
    console.log(`${models.type} done.......`);
  }

  try {
  } catch (error) {
    console.log('Vyskytla se chyba:', error.message);
  }

  console.log(`Proces ukončen v: ${new Date()}`);

  process.exit();
};
command();
