import { db, auth, googleAuthProvider, signInWithPopup, facebookAuthProvider } from '@lib/firebase';
import { UserContext } from '@lib/context';
import { useContext, useState, useCallback, useEffect } from 'react';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import debounce from 'lodash.debounce';

export default function EnterPage() {
  const { user, username, admin, userLoading } = useContext(UserContext);

  return (
    <>
      <h1>Sign in</h1>
      <div>
        {userLoading ? (
          'Loading userage...'
        ) : (
          <>
            <SignInPanel
              user={user}
              username={username}
              admin={admin}
              userLoading={userLoading}
            ></SignInPanel>
          </>
        )}
      </div>
    </>
  );
}

function SignInPanel({ user, username, admin, userLoading }) {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      console.log('Result', result);
    } catch (err) {
      console.error('Error signing in with Google', err);
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookAuthProvider);
      console.log('Result', result);
    } catch (err) {
      console.error('Error signing in with Google', err);
    }
  };

  let panel;
  if (userLoading) {
    panel = <h3>Loading userage...</h3>;
  } else if (user && username && admin) {
    panel = <h2>Logged in as Admin</h2>;
  } else if (user && username) {
    panel = <h2>Logged in as Premium User</h2>;
  } else if (user) {
    panel = <UsernameForm />;
  } else {
    panel = (
      <>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
        <button onClick={signInWithFacebook}>Sign in with Facebook</button>
      </>
    );
  }

  return panel;
}

// Username form
function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async e => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = doc(db, `users/${user.uid}`);
    const usernameDoc = doc(db, `usernames/${formValue}`);

    // Commit both docs together as a batch write.
    const batch = writeBatch(db);
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = e => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async username => {
      if (username.length >= 3) {
        const ref = doc(db, `usernames/${username}`);
        const usernameDoc = await getDoc(ref);
        console.log('Firestore read executed!');
        setIsValid(!usernameDoc.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="myname"
            value={formValue}
            onChange={onChange}
            autoComplete="off"
          />
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
