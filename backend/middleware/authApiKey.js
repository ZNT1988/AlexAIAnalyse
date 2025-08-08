// Simple API key auth + account lookup
import { getAccountByApiKey } from '../models/accountRepo.js';

export async function authApiKey(req, res, next) {
  const key = req.header('x-api-key');
  if (!key) return res.status(401).json({ error: 'Missing x-api-key' });
  const acct = await getAccountByApiKey(key);
  if (!acct || !acct.active) return res.status(403).json({ error: 'Invalid or inactive API key' });
  req.account = acct;
  next();
}
