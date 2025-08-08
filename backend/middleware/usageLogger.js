// Log usage per request (swap to DB/Redis + job to Stripe usage if needed)
import { incrementUsage } from '../models/usageRepo.js';

export async function usageLogger(req, _res, next) {
  try { await incrementUsage(req.account.id, 1); } catch {}
  next();
}
