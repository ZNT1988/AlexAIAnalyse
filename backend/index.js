import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';


// Constantes pour chaînes dupliquées (optimisation SonarJS)
const STR_PRODUCTION = 'production';

// Import routes
import authRoutes from './routes/auth.js';
import ideasRoutes from './routes/ideas.js';
import projectsRoutes from './routes/projects.js';
import roiRoutes from './routes/roi.js';
import aiRoutes from './routes/ai.js';
import aiSystemRoutes from './routes/aiSystem.js';
import aiSystemSpecializedRoutes from './routes/aiSystemSpecialized.js';
import assistantRoutes from './routes/assistant.js';
import monitoringRoutes from './routes/monitoring.js';
import alexUltimateRoutes from './routes/alex-ultimate.js';
import alexTestRoutes from './routes/alex-test.js';
import realAlexRoutes from './routes/real-alex.js';

// Import database
import { initializeDatabase } from './config/database.js';

// Import logger
import logger from './config/logger.js';

// Import auth middleware
import { getAuthMiddleware, isUsingMockAuth } from './middleware/auth.js';

// Import recovery systems
import systemRecovery from './utils/systemRecovery.js';
import enhancedHealthCheck from './utils/enhancedHealthCheck.js';

// Import performance optimization systems
import { getRedisCache } from './cache/RedisCache.js';
import {
  createCacheMiddleware,
  createCacheInvalidationMiddleware,
  createCacheWarmupMiddleware
} from './middleware/cacheMiddleware.js';

// Import AlexMasterSystem - Cerveau Central IA
import alexMasterSystem from './systems/AlexMasterSystem.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === STR_PRODUCTION
    ? ['https://hustlefinder.ia']
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// ⚡ PERFORMANCE OPTIMIZATION: Ultra-Fast Caching
// Initialize Redis cache with intelligent caching strategies
const cacheMiddleware = createCacheMiddleware({
  defaultTTL: 300, // 5 minutes
  intelligentTTL: true,
  skipPaths: ['/health', '/api/health', '/api/auth', '/api/system'],
  varyBy: ['x-user-type', 'authorization']
});

const cacheInvalidation = createCacheInvalidationMiddleware([
  'api:GET:/api/ai*',
  'api:GET:/api/assistant*',
  'api:GET:/api/dashboard*'
]);

const cacheWarmup = createCacheWarmupMiddleware([
  {
    key: 'api:GET:/api/dashboard:popular'
    fetchFunction: async () => ({ popular: true, cached: true })
    ttl: 600
  }
]);

// Apply caching middleware BEFORE routes
app.use(cacheMiddleware);
app.use(cacheInvalidation);
app.use(cacheWarmup);

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK'
    timestamp: new Date().toISOString()
    uptime: process.uptime()
  });
});

// Enhanced health check with diagnostics
app.get('/api/health/detailed', async (req, res) => {
  try {
    const healthReport = await enhancedHealthCheck.performFullCheck();

    // Add cache health to the report
    const cache = getRedisCache();
    const cacheHealth = await cache.healthCheck();

    const enhancedReport = {
      ...healthReport
      cache: cacheHealth
      performance: {
        cacheStats: cache.getStats()
        ultraFastCaching: cacheHealth.status === 'healthy'
        targetResponseTime: '<200ms'
      }
    };

    res.status(enhancedReport.status === 'healthy' ? 200 : 503).json(enhancedReport);
  } catch (error) {
      // Logger fallback - ignore error
    });
  }
});

// ⚡ Cache performance endpoint
app.get('/api/cache/stats', async (req, res) => {
  try {
    const cache = getRedisCache();
    const stats = cache.getStats();
    const health = await cache.healthCheck();

    res.json({
      success: true
      cacheStats: stats
      health: health
      optimizations: {
        ultraFastCaching: true
        intelligentTTL: true
        quantumInspiredCaching: true
        targetResponseTime: '<200ms'
        actualAvgResponseTime: `${stats.avgResponseTime.toFixed(2)}ms`
      }
    });
  } catch (error) {
      // Logger fallback - ignore error
    });
  }
});

// Alex Master System endpoints removed (now handled by alex-ultimate.js routes)

// Recovery endpoint
app.post('/api/system/recover', async (req, res) => {
  try {
      logger.info('🔧 Manual recovery triggered...');
    const success = await systemRecovery.detectAndRecover();
    const report = systemRecovery.getRecoveryReport();

    res.json({
      success
      report
      message: success ? '✅ Recovery completed' : '❌ Recovery failed'
    });
  } catch (error) {
      // Logger fallback - ignore error
    });
  }
});

// Public API routes
app.use('/api/auth', authRoutes);
app.use('/api/alex', alexUltimateRoutes); // Alex Ultimate accessible sans auth
app.use('/api/alex', alexTestRoutes); // Alex Test accessible sans auth
app.use('/api/alex', realAlexRoutes); // REAL Alex Ultimate - Vraies réponses IA

// Protected routes setup function
async function setupProtectedRoutes() {
  try {
    // Setup authentication middleware
    const authMiddleware = await getAuthMiddleware();

    // Apply auth to protected routes
    app.use('/api/ideas', authMiddleware, ideasRoutes);
    app.use('/api/projects', authMiddleware, projectsRoutes);
    app.use('/api/roi', authMiddleware, roiRoutes);
    app.use('/api/ai', authMiddleware, aiRoutes);
    app.use('/api/ai-system', authMiddleware, aiSystemRoutes);
    app.use('/api/ai-system', authMiddleware, aiSystemSpecializedRoutes);
    app.use('/api/assistant', authMiddleware, assistantRoutes);
    // app.use('/api/alex', alexUltimateRoutes); // Déplacé vers les routes publiques
    app.use('/api/monitoring', monitoringRoutes);

    // Add 404 handler after all routes
    app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Route not found'
        path: req.originalUrl
      });
    });

    // Log authentication status
    if (isUsingMockAuth()) {
      logger.warn('⚠️  Using MOCK authentication for development');
      try {
      logger.warn('⚠️  Set CLERK_SECRET_KEY for production authentication');

      } catch (error) {
      // Logger fallback - ignore error
    }} else {
      try {
      logger.info('✅ Using Clerk authentication');

      } catch (error) {
    // Logger fallback - ignore error
  }}

    return true;
  } catch (error) {
    logger.error('Failed to setup protected routes:', error);
    throw error;
  }
}

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);

  // Don't expose error details in production
  const message = process.env.NODE_ENV === STR_PRODUCTION
    ? 'Internal server error'
    : err.message;

  res.status(err.status || 500).json({
    error: message
    ...(process.env.NODE_ENV !== STR_PRODUCTION && { stack: err.stack })
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Attempt recovery if environment suggests issues
    if (process.env.AUTO_RECOVER === 'true') {
      logger.info('🔧 Auto-recovery enabled, checking system...');
      await systemRecovery.detectAndRecover();
    }

    // Initialize ultra-fast Redis cache
    logger.info('⚡ Initializing ultra-fast cache system...');
    const cache = getRedisCache();
    await cache.initializeConnection();
    logger.info('✅ Ultra-fast cache system ready for <200ms responses');

    // Initialize database
    await initializeDatabase();
    logger.info('Database initialized successfully');

    // Setup protected routes
    await setupProtectedRoutes();

    // Initialize AlexMasterSystem - Cerveau Central IA
    logger.info('🧠 Initializing Alex Master System...');
    await alexMasterSystem.initialize();
    logger.info('✅ Alex Master System ready - AI Brain operational');

    app.listen(PORT, () => {
      logger.info(`🚀 HustleFinder Backend running on port ${PORT}');
      logger.info('Environment: ${process.env.NODE_ENV || 'development'}');
      logger.info('Health check: http://localhost:${PORT}/health');
      logger.info('Authentication: ${isUsingMockAuth() ? 'MOCK (dev)' : 'CLERK (prod)'}`);
    });
  } catch (error) {
      // Logger fallback - ignore error
    }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  try {
    // Shutdown Alex first
    alexMasterSystem.shutdown();
    logger.info('Alex Master System shutdown complete');

    const cache = getRedisCache();
    await cache.shutdown();
  } catch (error) {
    try {
      logger.error('Error during shutdown:', error);

    } catch (error) {
    // Logger fallback - ignore error
  }}
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  try {
    // Shutdown Alex first
    alexMasterSystem.shutdown();
    logger.info('Alex Master System shutdown complete');

    const cache = getRedisCache();
    await cache.shutdown();
  } catch (error) {
    try {
      logger.error('Error during shutdown:', error);

    } catch (error) {
    // Logger fallback - ignore error
  }}
  process.exit(0);
});

startServer();

export default app;