import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function useUserData() {
  const [user, loading, error] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  console.log('[Hooks auth]: ', user);
  console.log('[Hooks loading]: ', loading);
  console.log('[Hooks error]: ', error);

  useEffect(async () => {
    // turn off realtime subscription
    let unsubscribe;
    console.log('[Hooks auth]: ', user);
    console.log('[Hooks loading]: ', loading);
    console.log('[Hooks error]: ', error);

    if (user) {
      unsubscribe = onSnapshot(doc(db, 'users', user.uid), doc => {
        console.log('[Hooks] user:', doc.data());
        setUsername(doc.data()?.username);
        setAdmin(doc.data()?.admin);
        setUserLoading(false);
      });
    } else if (!loading) {
      setUsername(null);
      setAdmin(false);
      setUserLoading(false);
    }

    return unsubscribe;
  }, [user, loading, error]);

  return { user, username, admin, userLoading };
}
