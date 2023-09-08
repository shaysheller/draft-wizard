import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { draftReducer } from "../reducers";
import { DraftContext, initialState } from "../context";
import { Toaster } from "react-hot-toast";
import { useReducer } from "react";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [state, dispatch] = useReducer(draftReducer, initialState);

  return (
    <>
      <Head>
        <title>Draft Wizard</title>
        <meta name="description" content="All your drafting needs" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <DraftContext.Provider value={{ state, dispatch }}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2000,
          }}
        />
        <Component {...pageProps} />
      </DraftContext.Provider>
    </>
  );
};

export default api.withTRPC(MyApp);
