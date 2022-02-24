const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  console.log("Request received");
  const customer = await stripe.customers.create({
    description: "My First Test Customer (Andreas)",
  });
  res.status(200).json({ andreas: "sure", customer });
}
