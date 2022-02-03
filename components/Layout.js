import styles from "./Layout.module.css";
import Link from "next/link";
import Image from "next/image";

export default function ({ children }) {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <hr />
      <h2>
        <Link href="/">
          <a>Footer</a>
        </Link>
      </h2>
    </div>
  );
}

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <a>
          <Image src="/logo.svg" alt="logo" height={60} width={144} />
        </a>
      </Link>
      <Link href="/lessons">
        <a>
          <span>Lessons</span>
        </a>
      </Link>
      <Link href="/dictionary">
        <a>
          <span>Dictionary</span>
        </a>
      </Link>
      <Link href="/dictionary">
        <a>
          <span>Login</span>
        </a>
      </Link>
    </nav>
  );
}
