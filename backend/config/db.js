const { MongoClient } = require('mongodb');

let db = null;
let client = null;

async function connectDB() {
  if (db) return db;

  client = new MongoClient(process.env.MONGO_URI);
  await client.connect();

  // Database name comes from the URI path, or default to 'forkshare'
  db = client.db('forkshare');

  console.log('Connected to MongoDB (forkshare database)');
  return db;
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return db;
}

module.exports = { connectDB, getDB };