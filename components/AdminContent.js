import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

// Component's children only shown to logged-in users
export default function AdminContent(props) {
  const { username, admin } = useContext(UserContext);

  return username && admin
    ? props.children
    : props.fallback || <Link href="/">You must be an Admin to view this.</Link>;
}
