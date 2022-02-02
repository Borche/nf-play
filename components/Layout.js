import styles from "./Layout.module.css";
import Link from "next/link";

export default function ({ children }) {
  return (
    <div className={styles.container}>
      <h1>
        <Link href="/">
          <a>Navbar</a>
        </Link>
      </h1>
      <hr />
      <main>{children}</main>
      <hr />
      <h2>
        <Link href="/">
          <a>Footer</a>
        </Link>
      </h2>
    </div>
  );
}
