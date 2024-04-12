import * as dotenv from 'dotenv';

dotenv.config();

import { Collection, Db, MongoClient } from 'mongodb';

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  throw new Error(`Proměnná prostředí MONGO_URL není nastavena.`);
}

const client = new MongoClient(MONGO_URL);

let db: Db;

let Apps: Collection<any>;
let Users: Collection<any>;

const command = async () => {
  await client.connect();
  db = client.db() as Db;

  Apps = db.collection('apps');
  Users = db.collection('users');

  await Users.updateMany(
    { role: { $exists: false } },
    { $set: { role: 'user' } },
  );

  const apps = await Apps.find({}).toArray();

  for (const app of apps) {
    const user = await Users.findOne({ appId: app._id });

    if (!user) {
      await Users.insertOne({
        role: 'system',
        appId: app._id,
        username: app.name,
        groupIds: [app.userGroupId],
        email: `${app.name}@domain.com`,
      });
    }
  }

  console.log(`Proces ukončen v: ${new Date()}`);

  process.exit();
};

command();
