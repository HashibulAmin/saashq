import * as dotenv from 'dotenv';

dotenv.config();

import { Collection, Db, MongoClient } from 'mongodb';

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  throw new Error(`Proměnná prostředí MONGO_URL není nastavena.`);
}

const client = new MongoClient(MONGO_URL);

let db: Db;

let Fields: Collection<any>;

const command = async () => {
  await client.connect();
  db = client.db() as Db;

  Fields = db.collection('fields');

  await Fields.rename('form_fields');

  console.log(`Proces ukončen v: ${new Date()}`);

  process.exit();
};

command();
