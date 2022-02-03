import Link from "next/link";
import Image from "next/image";

import { UserContext } from "@lib/context";
import { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@lib/firebase";

import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, username, admin, userLoading } = useContext(UserContext);

  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <a>
          <Image src="/logo.svg" alt="logo" height={60} width={144} />
        </a>
      </Link>
      <Link href="/lessons">
        <a>Lessons</a>
      </Link>
      <Link href="/dictionary">
        <a>Dictionary</a>
      </Link>
      {admin ? (
        <Link href="/admin">
          <a>Admin</a>
        </Link>
      ) : null}
      {username ? (
        <SignoutButton />
      ) : (
        <Link href="/enter">
          <a>Login</a>
        </Link>
      )}
    </nav>
  );
}

function SignoutButton() {
  const signOutNow = () => {
    signOut(auth)
      .then(() => console.log("Signed out"))
      .catch(console.error);
  };

  return (
    <a href="" onClick={signOutNow}>
      Sign out
    </a>
  );
}
