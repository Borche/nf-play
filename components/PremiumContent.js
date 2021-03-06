import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

// Component's children only shown to logged-in users
export default function PremiumContent(props) {
  const { username, userLoading } = useContext(UserContext);

  return userLoading
    ? "Loading premium userage... "
    : username
    ? props.children
    : props.fallback || <Link href="/">You must be a Premium Member to view this.</Link>;
}
