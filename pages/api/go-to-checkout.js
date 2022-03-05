import { withAuth } from "@lib/be/firebaseAdmin";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function handler(req, res) {
  console.log("Go-to-checkout request received");

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "price_1KSxdBHqRkzNTgYy9LkbAYgP",
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: "http://localhost:3000/enter?success=true&session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000/enter?canceled=true",
  });

  console.log(session);

  return res.status(200).json({ sessionId: session.id, url: session.url });
}

export default withAuth(handler);
