import { Stripe, loadStripe } from '@stripe/stripe-js';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' });
}
