const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');
const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  throw new Error(`Proměnná prostředí MONGO_URL není nastavena.`);
}

const client = new MongoClient(MONGO_URL);

let db;
let Assets;
let Tickets;
let Tasks;
let Deals;

const command = async () => {
  console.log(`začínající ... ${MONGO_URL}`);

  await client.connect();
  console.log('db připojeno ...');

  db = client.db();

  Assets = db.collection('assets');
  Tickets = db.collection('tickets');
  Tasks = db.collection('tasks');
  Deals = db.collection('deals');

  const modelsMap = [
    {
      type: 'ticket',
      collection: Tickets
    },
    {
      type: 'task',
      collection: Tasks
    },
    {
      type: 'deal',
      collection: Deals
    }
  ];
  try {
    console.log('počáteční načítání ID aktiv');

    const assets = await Assets.find().toArray();
    const assetIds = assets.map(asset => asset._id);

    console.log(`fetched ${assetIds?.length || 0} assets`);

    for (let models of modelsMap) {
      console.log(`${models.type} začínající...`);

      let itemsWithAssets = await models.collection
        .find({ 'customFieldsData.value': { $in: assetIds } })
        .toArray();

      console.log(`Nalezeno ${itemsWithAssets?.length || 0} položky`);

      let bulkOps = itemsWithAssets.map(item => {
        const field = (item?.customFieldsData || []).find(customFieldData =>
          assetIds.includes(customFieldData.value)
        );

        const asset = assets.find(asset => asset._id === field.value);

        return {
          updateOne: {
            filter: { _id: item._id, 'customFieldsData.field': field.field },
            update: { $set: { 'customFieldsData.$.extraValue': asset?.name } }
          }
        };
      });

      console.log(`${bulkOps?.length || 0} položky budou aktualizovány`);

      if (bulkOps?.length > 0) {
        try {
          await models.collection.bulkWrite(bulkOps);
          console.log(`${bulkOps?.length || 0} položky byly úspěšně aktualizovány`);
        } catch (e) {
          console.log('Vyskytla se chyba:', e.message);
        }
      }

      console.log(`${models.type} hotovo.......`);
    }
  } catch (error) {
    console.log('Vyskytla se chyba:', error.message);
  }

  console.log(`Proces ukončen v: ${new Date()}`);

  process.exit();
};
command();
