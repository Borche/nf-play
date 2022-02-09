import styles from "./Layout.module.css";
import Link from "next/link";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}

function Footer() {
  return <footer className={styles.footer}>2022 &copy; Nf-Play</footer>;
}
