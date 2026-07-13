import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

let retryCount = 0;

let mongoServer = null;

/**
 * Connect to MongoDB with retry strategy and in-memory fallback
 */
export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ucab';
  const options = {
    autoIndex: true, // Build indexes in development
  };

  try {
    logger.info('Attempting to connect to MongoDB...', {
      uri: MONGO_URI.replace(/:([^:@]+)@/, ':****@'),
    });
    await mongoose.connect(MONGO_URI, options);
    logger.info('MongoDB database connection established successfully.');
    retryCount = 0; // Reset retries on success
  } catch (error) {
    logger.warn(`MongoDB connection failed: ${error.message}. Checking fallback options...`);

    // Fallback to MongoMemoryServer in development/test environments
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Initializing self-contained MongoMemoryServer as fallback...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
        const memoryUri = mongoServer.getUri();
        logger.info(`In-Memory MongoDB started successfully: ${memoryUri}`);

        await mongoose.connect(memoryUri, options);
        logger.info('MongoDB database connection established successfully using in-memory database.');
        return;
      } catch (memError) {
        logger.error('Failed to initialize in-memory database fallback:', memError);
      }
    }

    retryCount++;
    if (retryCount < MAX_RETRIES) {
      logger.info(`Retrying MongoDB connection in ${RETRY_INTERVAL_MS / 1000}s...`);
      setTimeout(connectDB, RETRY_INTERVAL_MS);
    } else {
      logger.error('CRITICAL: Max MongoDB reconnection retries reached. Server will continue running without database connectivity.');
    }
  }
};

// Monitor mongoose events
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB error occurred:', err);
});

export default connectDB;
