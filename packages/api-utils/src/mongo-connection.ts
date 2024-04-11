import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { debugInfo, debugError } from './debuggers';

dotenv.config();

const { MONGO_URL } = process.env;

export const connectionOptions: mongoose.ConnectOptions = {
  family: 4,
};

mongoose.connection
  .on('connected', () => {
    console.log(`Připojeno k databázi: ${MONGO_URL}`);
  })
  .on('disconnected', () => {
    console.log(`Odpojeno od databáze: ${MONGO_URL}`);

    process.exit(1);
  })
  .on('error', (error) => {
    console.error(`Chyba připojení k databázi: ${MONGO_URL} ${error}`);

    process.exit(1);
  });

export async function connect(): Promise<mongoose.Connection> {
  if (!MONGO_URL) {
    throw new Error('MONGO_URL není definováno');
  }
  await mongoose.connect(MONGO_URL, connectionOptions);
  return mongoose.connection;
}

export async function disconnect(): Promise<void> {
  return mongoose.connection.close();
}
