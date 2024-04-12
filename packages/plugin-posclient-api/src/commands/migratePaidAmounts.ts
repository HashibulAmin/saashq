import * as dotenv from 'dotenv';

dotenv.config();

import { Collection, Db, MongoClient } from 'mongodb';
const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  throw new Error(`Proměnná prostředí MONGO_URL není nastavena.`);
}

const client = new MongoClient(MONGO_URL);

let db: Db;

let PosclientOrders: Collection<any>;

const command = async () => {
  console.log(`start.... ${MONGO_URL}`);

  await client.connect();

  console.log('connected...');
  db = client.db() as Db;

  PosclientOrders = db.collection('posclient_orders');
  let bulkUpdateOps: any[] = [];
  let counter = 0;
  let bulkCounter = 0;

  try {
    const orders = await PosclientOrders.find().toArray();

    for (const order of orders) {
      if (order.paidAmounts && order.paidAmounts.length) {
        continue;
      }

      const paidAmounts: any[] = [];
      if (order.receivableAmount) {
        paidAmounts.push({
          _id: Math.random().toString(),
          type: 'receivable',
          amount: order.receivableAmount,
        });
      }

      if (order.cardPayments && order.cardPayments.length) {
        for (const payInfo of order.cardPayments) {
          paidAmounts.push({
            _id: Math.random().toString(),
            type: 'card',
            amount: payInfo.amount,
            info: payInfo,
          });
        }
      }

      counter = counter + 1;

      if (counter > 1000) {
        bulkCounter = bulkCounter + 1;
        console.log(`updated ${bulkCounter * 1000}...`);
        await PosclientOrders.bulkWrite(bulkUpdateOps);
        counter = 0;
      }
    }

    if (bulkUpdateOps.length) {
      console.log(`updated ${bulkCounter * 1000 + bulkUpdateOps.length}...`);
      await PosclientOrders.bulkWrite(bulkUpdateOps);
    }
  } catch (e) {
    console.log(`Vyskytla se chyba: ${e.message}`);
  }

  console.log(`Proces ukončen v: ${new Date()}`);

  process.exit();
};
command();
