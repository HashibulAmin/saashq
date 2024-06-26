import * as dotenv from 'dotenv';

dotenv.config();

import { Collection, Db, MongoClient } from 'mongodb';

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  throw new Error(`Proměnná prostředí MONGO_URL není nastavena.`);
}

const client = new MongoClient(MONGO_URL);

let db: Db;

let FieldGroups: Collection<any>;

const command = async () => {
  await client.connect();
  db = client.db() as Db;

  FieldGroups = db.collection('fields_groups');

  const groups = await FieldGroups.find({}).toArray();

  for (const group of groups) {
    await FieldGroups.updateOne(
      { _id: group._id },
      {
        $set: {
          config: {
            boardsPipelines: group.boardsPipelines,
            pipelineIds: group.pipelineIds,
            boardIds: group.boardIds,
          },
        },
      },
    );
  }

  console.log(`Proces ukončen v: ${new Date()}`);

  process.exit();
};

command();
