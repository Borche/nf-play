import Link from "next/link";
import { auth, googleAuthProvider, signInWithPopup } from "@lib/firebase";
import { UserContext } from "@lib/context";
import { useContext } from "react";
import { signOut } from "firebase/auth";

export default function Home() {
  const { user, username, admin, userLoading } = useContext(UserContext);

  return (
    <>
      <h1>Home</h1>
    </>
  );
}
