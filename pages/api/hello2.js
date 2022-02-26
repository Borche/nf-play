const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { withAuth, db } from "@belib/firebaseAdmin";

async function handler(req, res) {
  console.log("req.currentUser: ", req.currentUser);
  const user = await db.collection("users").doc("QPsRoUW1TQfKjYqlXXoFXwOceF02").get();

  if (!user.exists) {
    return res.status(404).json({});
  }

  return res.status(200).json({ id: user.id, ...user.data() });
}

export default withAuth(handler);
