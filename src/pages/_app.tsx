import { persistor, store } from "@/redux/store";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import SEO from "../../next-seo.config";
import Layout from "../components/Layout";
import "../styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <StoreProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Layout>
            <Toaster position="top-center" reverseOrder={false} />
            <DefaultSeo {...SEO} />
            <Component {...pageProps} />
          </Layout>
        </PersistGate>
      </StoreProvider>
    </SessionProvider>
  );
}
