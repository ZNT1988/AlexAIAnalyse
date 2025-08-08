import express from 'express';
import cors from 'cors';
import { router as api } from './routes/api.js';
import { router as billing } from './routes/billing.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/billing/webhook', billing); // raw body handled inside
app.use('/billing', billing);
app.use('/api', api);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(process.env.PORT || 8080, () => console.log('HF API up'));
