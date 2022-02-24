import Link from "next/link";
import { auth, googleAuthProvider, signInWithPopup } from "@lib/firebase";
import { UserContext } from "@lib/context";
import { useContext } from "react";
import { signOut } from "firebase/auth";

export default function Checkout() {
  const { user, username, admin, userLoading } = useContext(UserContext);

  const sendRequest = async () => {
    const data = await fetch("/api/hello");
    console.log(data.json());
  };

  return (
    <>
      <h1>Checkout</h1>
      <button onClick={sendRequest}>Buy subscription</button>
    </>
  );
}
