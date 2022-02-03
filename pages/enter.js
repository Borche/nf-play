import { auth, googleAuthProvider, signInWithPopup } from "@lib/firebase";
import { UserContext } from "@lib/context";
import { useContext } from "react";
import { signOut } from "firebase/auth";

export default function EnterPage() {
  const { user, username, admin, userLoading } = useContext(UserContext);

  return (
    <>
      <h1>Sign in</h1>
      <div>
        {userLoading ? "Loading userage..." : <SignInPanel user={user} username={username} admin={admin}></SignInPanel>}
      </div>
    </>
  );
}

function SignInPanel({ user, username, admin }) {
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleAuthProvider);
  };

  let panel;
  if (user && username && admin) {
    panel = <h2>Logged in as Admin</h2>;
  } else if (user && username) {
    panel = <h2>Logged in as Premium User</h2>;
  } else if (user) {
    panel = <h2>Logged in as Free User, no username</h2>;
  } else {
    panel = <button onClick={signInWithGoogle}>Sign in with Google</button>;
  }

  return panel;
}
