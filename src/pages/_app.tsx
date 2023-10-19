import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { PageLayout } from "~/components/layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Draft Wizard</title>
        <meta name="description" content="All your drafting needs" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
        }}
      />
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </>
  );
};

export default api.withTRPC(MyApp);
