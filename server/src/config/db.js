import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDb(uri = env.mongoUri) {
  await mongoose.connect(uri);
  return mongoose.connection;
}

export async function disconnectDb() {
  await mongoose.disconnect();
}
