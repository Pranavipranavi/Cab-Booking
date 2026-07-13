import './dotenv-init.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import connectDB from './database/connection.js';
import logger from './utils/logger.js';
import { notFoundHandler, errorHandler } from './middlewares/errorMiddleware.js';
import apiRouter from './routes/index.js';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8000;

// Connect to Database
connectDB();

// 1. Security Middlewares
app.use(helmet());

// CORS configuration using environment variables
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 2. Request parsing and optimization
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());

// 3. Logger Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 4. Rate Limiter (configured for future use/specific routes, not applied globally yet)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

// 5. Health Check Endpoints
const healthResponse = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'UCab API is running',
    version: '1.0.0',
  });
};

app.get('/', healthResponse);
app.get('/api/health', healthResponse);

// Mount All Module Routes
app.use('/api', apiRouter);

// 6. 404 Route Not Found Handler
app.use(notFoundHandler);

// 7. Global Error Handler Middleware
app.use(errorHandler);

import { createServer } from 'http';
import { initSocket } from './config/socket.js';

// Start server listening
const httpServer = createServer(app);
initSocket(httpServer);

const server = httpServer.listen(PORT, () => {
  logger.info(
    `UCab Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});

/**
 * Graceful Shutdown Handler
 */
const gracefulShutdown = (signal) => {
  logger.info(`Received signal: ${signal}. Commencing graceful shutdown...`);

  // Close the server listener
  server.close(async () => {
    logger.info('HTTP server closed.');

    try {
      // Close Mongoose connection
      await import('mongoose').then((mongoose) => mongoose.default.connection.close());
      logger.info('Database connection closed.');
      process.exit(0);
    } catch (err) {
      logger.error('Error during database connection close:', err);
      process.exit(1);
    }
  });

  // Force close after 10 seconds if graceful shutdown takes too long
  setTimeout(() => {
    logger.error('Forced shutdown: graceful shutdown timeout exceeded.');
    process.exit(1);
  }, 10000);
};

// Handle process termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
