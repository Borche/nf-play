import * as admin from "firebase-admin";
import handler from "pages/api/hello2";
// import { getFirestore } from 'firebase-admin/firestore'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();

export function withAuth(handler) {
  return async (req, res) => {
    if (req.headers?.authorization?.startsWith("Bearer ")) {
      const idToken = req.headers.authorization.split("Bearer ")[1];

      try {
        const decodedToken = await auth.verifyIdToken(idToken);
        if (!decodedToken || !decodedToken.uid) {
          return _401();
        }
        req["currentUser"] = decodedToken;
      } catch (err) {
        console.error(err);
        if (err?.errorInfo?.code === "auth/internal-error") {
          return _500();
        }
        return _401();
      }
    } else {
      console.log("No auth token");
      return _401();
    }
    return handler(req, res);
  };
}

function _401() {
  return res.status(401).json({ status: "Unauthenticated" });
}

function _500() {
  return res.status(500).json({ status: "Internal error" });
}
