import "@styles/base.css";
import "@styles/typography.css";
import "@styles/input.css";
import "@styles/utils.css";
import Layout from "@components/Layout";
import { UserContext } from "@lib/context";
import { useUserData } from "@lib/hooks";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Toaster position="bottom-center" />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  );
}

export default MyApp;
