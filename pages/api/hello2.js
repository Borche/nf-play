import { withAuth, db } from "@belib/firebaseAdmin";
import { getOrCreateCustomer } from "@belib/customers";

async function handler(req, res) {
  const { currentUser } = req;

  const firebaseUser = await db.collection("users").doc(currentUser.uid).get();

  if (!firebaseUser.exists) {
    return res.status(404).json({});
  }

  const customer = getOrCreateCustomer(currentUser.uid);

  return res.status(200).json({
    firebaseUser: { ...firebaseUser.data() },
    customer: { ...customer },
    currentUser: { ...currentUser },
  });
}

export default withAuth(handler);
