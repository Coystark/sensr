import React, { ReactElement, ReactNode, useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { appRoutes } from "routes";
import { CssBaseline } from "@mui/material";
import { useUserStore } from "stores/user";
import { RestClientProvider } from "react-query-restful";
import { ToastProvider } from "use-toast-mui";
import { mdTheme } from "../theme";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!router.isReady) return;

    setLoading(false);
  }, [router.isReady]);

  if (loading) {
    return null;
  }

  if (pageProps.authenticate && !isAuthenticated) {
    router.push(appRoutes.signIn.path);
    return null;
  }

  if (!pageProps.authenticate && isAuthenticated) {
    router.push(appRoutes.createCustomer.path);
    return null;
  }

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <RestClientProvider
      baseUrl={process.env.NEXT_PUBLIC_API_URL as string}
      axiosConfig={{
        withCredentials: true,
      }}
    >
      <ThemeProvider theme={mdTheme}>
        <ToastProvider>
          <CssBaseline />
          {getLayout(<Component {...pageProps} />)}
        </ToastProvider>
      </ThemeProvider>
    </RestClientProvider>
  );
}
