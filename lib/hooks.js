import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(async () => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      console.log("user", user);

      unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
        console.log("Current data", doc.data());
        setUsername(doc.data()?.username);
        setAdmin(doc.data()?.admin);
        setUserLoading(false);
      });

      // const usersCol = collection(db, "users", user.uid); // .doc(user.uid);
      // const userSnapshot = await getDoc(usersCol);
      // unsubscribe = ref.onSnapshot((doc) => {
      //   setUsername(doc.data()?.username);
      //   setAdmin(doc.data()?.admin);
      // });
    } else {
      setUsername(null);
      setAdmin(false);
    }

    return unsubscribe;
  }, [user]);

  return { user, username, admin, userLoading };
}
