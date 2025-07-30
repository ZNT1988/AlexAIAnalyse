
// Constantes pour chaînes dupliquées (optimisation SonarJS)
const STR_JSON_CONTENT = 'application/json';

// Advanced Security Middleware for HustleFinderIA
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import logger from '../config/logger.js';

// Advanced Rate Limiting with IP tracking

// Constantes pour chaînes dupliquées (optimisation SonarJS)
const STR_USER_AGENT = 'User-Agent';

export const createAdvancedRateLimit = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req) => {
      // Different limits based on user type
      if (req.auth?
      .userId) {
        return 200; // Authenticated users get higher limits
      }
      return 50; // Anonymous users
    }
    message :
       {
      error: 'Too many requests'
      retryAfter: '15 minutes'
      documentation: 'https://docs.hustlefinder.ia/rate-limits'
    }
    standardHeaders: true
    legacyHeaders: false
    skip: (req) => {
      // Skip for health checks and internal services
      return req.path === '/health' || req.ip === '127.0.0.1';
    }
    onLimitReached: (req, res, options) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
        ip: req.ip
        userAgent: req.get(STR_USER_AGENT)
        path: req.path
        timestamp: new Date().toISOString()
      });
    }
  });
};

// Speed limiting for suspicious patterns
export const createSpeedLimit = () => {
  return slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 100, // Allow 100 requests per windowMs without delay
    delayMs: 500, // Add 500ms delay per request after delayAfter
    maxDelayMs: 20000, // Max delay of 20 seconds
    skipFailedRequests: false
    skipSuccessfulRequests: false
  });
};

// Request validation and sanitization
export const validateRequest = (req, res, next) => {
  // Check request size
  if (req.get('content-length') > 10 * 1024 * 1024) { // 10MB limit
    return res.status(413).json({
      error: 'Request too large'
      maxSize: '10MB'
    });
  }

  // Validate Content-Type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('content-type');
    if (!contentType || !contentType.includes(STR_JSON_CONTENT)) {
      return res.status(400).json({
        error: 'Invalid Content-Type'
        expected: STR_JSON_CONTENT
      });
    }
  }

  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
};

// API Key validation for external integrations
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      error: 'API key required'
      header: 'X-API-Key'
    });
  }

  // In production, validate against database
  // For now, check against environment variable
  const validApiKeys = (process.env.VALID_API_KEYS || '').split(',');

  if (!validApiKeys.includes(apiKey)) {
    logger.warn(`Invalid API key attempt: ${apiKey.substring(0, 8)}...`, {
      ip: req.ip
      userAgent: req.get(STR_USER_AGENT)
    });

    return res.status(401).json({
      error: 'Invalid API key'
    });
  }

  next();
};

// Request signature validation for webhooks
export const validateSignature = (secret) => {
  return (req, res, next) => {
    const signature = req.headers['x-signature'];
    const payload = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (!signature || signature !== `sha256=${expectedSignature}`) {
      return res.status(401).json({
        error: 'Invalid signature'
      });
    }

    next();
  };
};

// IP whitelist for admin endpoints
export const createIPWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;

    if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
      logger.warn(`Unauthorized IP access attempt: ${clientIP}`, {
        path: req.path
        userAgent: req.get(STR_USER_AGENT)
      });

      return res.status(403).json({
        error: 'Access denied'
        reason: 'IP not whitelisted'
      });
    }

    next();
  };
};

// Request logging for security monitoring
export const securityLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log suspicious patterns
  const suspiciousPatterns = [
    /union.*select/i
    /script.*alert/i
    /<script/i
    /javascript:/i
    /\.\.\/\.\.\//
    /\/etc\/passwd/
    /\/proc\/self\/environ/
  ];

  const url = req.originalUrl || req.url;
  const body = JSON.stringify(req.body);

  const isSuspicious = suspiciousPatterns.some(pattern =>
    pattern.test(url) || pattern.test(body)
  );

  if (isSuspicious) {
    logger.warn('Suspicious request detected', {
      ip: req.ip
      method: req.method
      url: url
      userAgent: req.get(STR_USER_AGENT)
      body: body.substring(0, 500) // Log first 500 chars
    });
  }

  // Log all requests for security audit
  res.on('finish', () => {
    const duration = Date.now() - startTime;

    logger.info('Request completed', {
      ip: req.ip
      method: req.method
      url: url
      statusCode: res.statusCode
      duration: `${duration}ms`
      userAgent: req.get(STR_USER_AGENT)
      userId: req.auth?.userId || 'anonymous'
    });
  });

  next();
};

export default {
  createAdvancedRateLimit
  createSpeedLimit
  validateRequest
  validateApiKey
  validateSignature
  createIPWhitelist
  securityLogger
};