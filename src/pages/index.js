import { Inter } from "@next/font/google";
import Feed from "@/components/feed/feed";
import Layout from "@/components/Layout/layout";
import Meta from "@/components/MetaTag/MetaTag";

const inter = Inter({ subsets: ["latin"] });

export default function Home({newsResults}) {

  return (
    <>
      <Meta title="Twitter Clone" description="Welcome to the twiiter clone" />
      <Layout newsResults={newsResults} >
        <Feed />
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  const newsResults = await fetch(
    "https://saurav.tech/NewsAPI/top-headlines/category/business/us.json"
  ).then((res) => res.json());

  return {
    props: {
      newsResults,
    },
  };
}