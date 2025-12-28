// apps/ai-gateway/src/server.ts

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { chatRoutes } from './routes/chat';
import { portfolioAnalysisRoutes } from './routes/portfolio-analysis';
import insightsRoutes from './routes/insights';
import timelineRoutes from './routes/timeline';
import { zerionRoutes } from './routes/zerionRoutes';

import { errorHandler } from './middleware/errorHandler';
import {
  zerionRateLimiter,
  aiRateLimiter,
  generalRateLimiter,
} from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';
import { logger } from './utils/logger';
import { swaggerDefinition } from './swagger/config';

// -----------------------------------------------------------------------------
// Swagger configuration
// -----------------------------------------------------------------------------
const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// -----------------------------------------------------------------------------
// Server initialization
// -----------------------------------------------------------------------------
export const server = express();

// -----------------------------------------------------------------------------
// CORS configuration
// -----------------------------------------------------------------------------
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : [];

    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

server.use(cors(corsOptions));
server.use(express.json());

// -----------------------------------------------------------------------------
// Middlewares
// -----------------------------------------------------------------------------
server.use(requestLogger);
server.use(generalRateLimiter);

// -----------------------------------------------------------------------------
// Swagger UI
// -----------------------------------------------------------------------------
server.use('/', swaggerUi.serve);
server.get(
  '/',
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: { persistAuthorization: true },
  })
);

// -----------------------------------------------------------------------------
// API Routes
// -----------------------------------------------------------------------------

// AI routes
server.use('/api/chat', aiRateLimiter, chatRoutes);
server.use(
  '/api/portfolio-analysis',
  aiRateLimiter,
  portfolioAnalysisRoutes
);
server.use('/api/insights', aiRateLimiter, insightsRoutes);
server.use('/api/timeline', aiRateLimiter, timelineRoutes);

// Zerion proxy routes
server.use('/api/zerion', zerionRateLimiter, zerionRoutes);

// -----------------------------------------------------------------------------
// Health check
// -----------------------------------------------------------------------------
server.get('/health', (_req, res) => {
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used:
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total:
        Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
    },
  };

  logger.debug('Health check requested', healthData);
  res.json(healthData);
});

// -----------------------------------------------------------------------------
// Error handling (last)
// -----------------------------------------------------------------------------
server.use(errorHandler);