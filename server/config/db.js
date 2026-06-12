import mongoose from 'mongoose';
import { env } from './env.js';

/**
 * Establishes the MongoDB connection. Mongoose buffers commands until
 * connected, but we await the initial connection so the server only
 * begins listening once the database is reachable.
 */
export async function connectDB() {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    // eslint-disable-next-line no-console
    console.log('✅ MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('❌ MongoDB error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    // eslint-disable-next-line no-console
    console.warn('⚠️  MongoDB disconnected');
  });

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}

export default connectDB;
