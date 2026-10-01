import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeAll, afterAll, afterEach } from 'vitest';

let mongo;

beforeAll(async () => {
  process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/taskhub_test';
  process.env.JWT_SECRET = 'test-secret';
  process.env.CLIENT_URL = 'http://localhost:5173';
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const collection of Object.values(collections)) await collection.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});
