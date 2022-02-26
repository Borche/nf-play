import { stripe } from "./stripe";
import { db } from "./firebaseAdmin";
import Stripe from "stripe";

/**
 * Gets the exsiting Stripe customer or creates a new record
 */
export async function getOrCreateCustomer(userId, params) {
  const userSnapshot = await db.collection("users").doc(userId).get();

  const { stripeCustomerId, email, displayName } = userSnapshot.data();

  // If missing customerID, create it
  if (!stripeCustomerId) {
    // CREATE new customer
    const customer = await stripe.customers.create({
      name: displayName,
      email,
      metadata: {
        firebaseUID: userId,
      },
      ...params,
    });
    await userSnapshot.ref.update({ stripeCustomerId: customer.id });
    return customer;
  } else {
    return await stripe.customers.retrieve(stripeCustomerId);
  }
}
