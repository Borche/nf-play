import "@styles/base.css";
import "@styles/typography.css";
import Layout from "@components/Layout";
import { UserContext } from "@lib/context";
import { useUserData } from "@lib/hooks";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  );
}

export default MyApp;
