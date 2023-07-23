import Layout from "@/components/layout";
import Store from "@/store/store";
import "@/styles/globals.css";
import 'md-editor-rt/lib/preview.css';
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={Store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
