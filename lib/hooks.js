import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function useUserData() {
  const [user, loading, error] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(async () => {
    // turn off realtime subscription
    let unsubscribe;
    console.log('[Hooks user]: ', user);
    console.log('[Hooks loading]: ', loading);
    console.log('[Hooks error]: ', error);

    if (user) {
      console.log('[hooks] Auth:', user);

      unsubscribe = onSnapshot(doc(db, 'users', user.uid), doc => {
        console.log('[hooks] User:', doc.data());
        setUsername(doc.data()?.username);
        setAdmin(doc.data()?.admin);
        setUserLoading(false);
      });
    } else {
      setUsername(null);
      setAdmin(false);
      setUserLoading(false);
    }

    return unsubscribe;
  }, [user, loading, error]);

  return { user, username, admin, userLoading };
}
