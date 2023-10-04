"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidbar";
import "./globals.css";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import LoadingIndicator from "@/components/loadingIndicator";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ActiveStatus from "@/components/ActiveStatus";
import useAuthSession from "@/components/hooks/useAuthSession";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [hasSessionID, setHasSessionID] = useState(false);
  const pathname = usePathname();
  const shouldRenderSidebar = !["/login", "/register"].includes(pathname);
  useAuthSession();

  const pageTitleMap: any = {
    "/": "Home",
    "/users": "Users",
    "/conversations": "Conversations",
    "/login": "Login",
    "/register": "Register",
  };

  const pageTitle = pageTitleMap[pathname] || "Chat app";

  useEffect(() => {
    const checkSessionID = () => {
      const sessionIDFromCookie = Cookies.get("sessionID");
      setHasSessionID(!!sessionIDFromCookie);
      setLoading(false);
    };

    checkSessionID();
  }, []);

  useEffect(() => {
    document.title = pageTitle;
  }, [pathname, pageTitle]);

  return (
    <html lang="en">
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          {loading ? (
            <LoadingIndicator />
          ) : shouldRenderSidebar && hasSessionID ? (
            <Sidebar>
              <ActiveStatus />
              {children}
              <ToastContainer />
            </Sidebar>
          ) : (
            <>
              <ActiveStatus />
              {children}
            </>
          )}
        </QueryClientProvider>
      </body>
    </html>
  );
}
