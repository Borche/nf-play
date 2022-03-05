import { withAuth, db } from "@lib/be/firebaseAdmin";
import { getOrCreateCustomer } from "@belib/customers";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function handler(req, res) {
  const { currentUser } = req;

  const firebaseUser = await db.collection("users").doc(currentUser.uid).get();

  if (!firebaseUser.exists) {
    return res.status(404).json({});
  }

  const customer = await getOrCreateCustomer(currentUser.uid);
  console.log(customer);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "price_1KSxdBHqRkzNTgYy9LkbAYgP",
        quantity: 1,
      },
    ],
    customer: customer.id,
    mode: "subscription",
    success_url: "http://localhost:3000/enter?success=true&session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000/enter?canceled=true",
  });

  return res.status(200).json({ sessionId: session.id, url: session.url });
}

export default withAuth(handler);
