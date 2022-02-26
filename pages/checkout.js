import { auth, googleAuthProvider, signInWithPopup } from "@lib/firebase";
import { UserContext } from "@lib/context";
import { useContext } from "react";
import { fetchFromAPI } from "@lib/helpers";

export default function Checkout() {
  const { user, username, admin, userLoading } = useContext(UserContext);

  const sendRequest = async (endpoint) => {
    const data = await fetchFromAPI(`/api/${endpoint}`);
    console.log(data);
  };

  return (
    <>
      <h1>Checkout</h1>
      <button onClick={() => sendRequest("/hello")}>Hello</button>
      <button onClick={() => sendRequest("/hello2")}>Hello2</button>
    </>
  );
}
