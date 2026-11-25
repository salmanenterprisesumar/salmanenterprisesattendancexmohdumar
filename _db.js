import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable in Vercel.');
  }

  const client = new MongoClient(uri);
  await client.connect();

  const dbName = process.env.MONGODB_DB || 'salman_enterprises_erp';
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
