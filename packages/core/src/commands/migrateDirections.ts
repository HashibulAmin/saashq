import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

import { Collection, Db, MongoClient } from 'mongodb';

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  throw new Error(`Proměnná prostředí MONGO_URL není nastavena.`);
}

const client = new MongoClient(MONGO_URL);

let db: Db;

let Directions: Collection<any>;
let Places: Collection<any>;

const command = async () => {
  await client.connect();
  db = client.db() as Db;

  const apiKey = process.argv.slice(2)[0];

  Directions = db.collection('directions');
  Places = db.collection('places');

  const directions = await Directions.find({
    $or: [
      {
        googleMapPath: {
          $exists: false,
        },
      },
      {
        googleMapPath: null,
      },
      {
        googleMapPath: {
          $size: 0,
        },
      },
    ],
  }).toArray();

  const getPath = async (placeA: any, placeB: any) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?key=${apiKey}&origin=${placeA.center.lat},${placeA.center.lng}&destination=${placeB.center.lat},${placeB.center.lng}&mode=driving`;

    try {
      const response = await fetch(url);
      const body = await response.json();

      if (!response.ok || body.routes.length === 0) {
        console.log(
          `${placeA.name} - ${placeB.name} cesta nenalezena: ${response.status}`,
        );
        return null;
      }

      console.log(`Cesta nalezena pro ${placeA.name} - ${placeB.name}`);
      return body.routes[0].overview_polyline.points;
    } catch {
      console.log(`Chyba při získávání cesty z google api`);
      return null;
    }
  };

  for (const direction of directions) {
    const placeA = await Places.findOne({ _id: direction.placeIds[0] });
    const placeB = await Places.findOne({ _id: direction.placeIds[1] });

    const path = await getPath(placeA, placeB);

    try {
      await Directions.updateOne(
        { _id: direction._id },
        { $set: { googleMapPath: path } },
      );
    } catch (e) {
      console.log(e);
      continue;
    }
  }

  console.log(`Proces ukončen v: ${new Date()}`);

  process.exit();
};

command();
