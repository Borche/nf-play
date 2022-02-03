import styles from "./Layout.module.css";
import Link from "next/link";
import Navbar from "./Navbar";

export default function Layout({ children }) {
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
