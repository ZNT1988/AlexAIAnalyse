import express from 'express';
import { authApiKey } from '../middleware/authApiKey.js';
import { rateLimiter, quotaChecker } from '../middleware/metering.js';
import { usageLogger } from '../middleware/usageLogger.js';

export const router = express.Router();

router.post('/v1/analyze', authApiKey, rateLimiter, quotaChecker, usageLogger, async (req, res) => {
  // Appel Alex core ici
  const result = { ok: true, echo: req.body?.text ?? null };
  res.json(result);
});
