import { stripe } from '../billing/stripeClient.js';
import { setAccountActive, linkStripe } from '../models/accountRepo.js';

export async function ensureCustomer(email) {
  const list = await stripe.customers.list({ email, limit: 1 });
  return list.data[0] || await stripe.customers.create({ email });
}

export async function upsertPriceCatalog() {
  // map local plans to Stripe prices (create if missing)
}

export async function attachSubscription(event) {
  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.created': {
      const sub = event.data.object;
      await linkStripe(sub.customer, sub.id);
      await setAccountActive(sub.status === 'active');
      break;
    }
    case 'customer.subscription.deleted':
      await setAccountActive(false);
      break;
  }
}
