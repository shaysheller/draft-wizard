import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { draftReducer } from "../reducers";
import { DraftContext, initialState } from "../context";
import { Toaster } from "react-hot-toast";
import { useReducer, useState, useEffect } from "react";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [state, dispatch] = useReducer(draftReducer, initialState);

  const [screenSize, setScreenSize] = useState("");

  useEffect(() => {
    // Define the Tailwind CSS screen size breakpoints
    const breakpoints = {
      sm: 640, // Small screens
      md: 768, // Medium screens
      lg: 1024, // Large screens
      xl: 1280, // Extra-large screens
    };

    // Function to update the screen size state based on the window's width
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < breakpoints.sm) {
        setScreenSize("sm");
      } else if (width < breakpoints.md) {
        setScreenSize("md");
      } else if (width < breakpoints.lg) {
        setScreenSize("lg");
      } else {
        setScreenSize("xl");
      }
    };

    // Call the update function initially and add a resize event listener
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Draft Wizard</title>
        <meta name="description" content="All your drafting needs" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <DraftContext.Provider value={{ state, dispatch }}>
        <Toaster position={screenSize === "sm" ? "top-left" : "bottom-right"} />
        <Component {...pageProps} />
      </DraftContext.Provider>
    </>
  );
};

export default api.withTRPC(MyApp);
