import Head from "next/head";
import { Inter } from "@next/font/google";
import Sidebar from "@/components/sidebar/sidebar";
import Feed from "@/components/feed/feed";
import Widgets from "@/components/widgets/widgets";
import { useEffect, useState } from "react";
import CommentModal from "@/components/comment/commentModal";
import Onboarding from "@/components/onboarding/onboarding";
export default function Layout({newsResults, randomUsersResults, children }) {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  return (
    <>
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="https://www.freepnglogos.com/uploads/twitter-logo-png/twitter-logo-vector-png-clipart-1.png"
        />
      </Head>
      <main className={`${theme} flex min-h-screen mx-auto`}>
        {/* Sidebar */}
        <Sidebar setTheme={setTheme} theme={theme} />
        {/* Feeds */}
        {/* <Feed /> */}
        {children}
        {/* Widgets */}
        <Widgets newsResults={newsResults} randomUsersResults={randomUsersResults}  />
        {/* Modal */}
        <CommentModal theme={theme} />
        <Onboarding theme={theme} />
      </main>
    </>
  );
}
