import express from 'express';
import { stripe } from '../billing/stripeClient.js';
import { ensureCustomer, attachSubscription, upsertPriceCatalog } from '../services/billingService.js';

export const router = express.Router();

router.post('/create-portal-session', async (req, res) => {
  const { customerId } = req.body;
  const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: process.env.BILLING_RETURN_URL });
  res.json(session);
});

router.post('/checkout', async (req, res) => {
  const { email, priceId } = req.body;
  const customer = await ensureCustomer(email);
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customer.id,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: process.env.CHECKOUT_SUCCESS_URL,
    cancel_url: process.env.CHECKOUT_CANCEL_URL,
  });
  res.json({ url: session.url });
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.header('stripe-signature');
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return res.status(400).send(`Webhook error: ${e.message}`);
  }
  await attachSubscription(event);
  res.json({ received: true });
});
