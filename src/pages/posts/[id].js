import { ArrowLeftIcon } from "@heroicons/react/outline";
import Head from "next/head";
import Sidebar from "@/components/sidebar/sidebar";
import Widgets from "@/components/widgets/widgets";
import Post from "@/components/feed/post";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../../firebase";
import Comment from "@/components/comment/comment";
import { AnimatePresence, motion } from "framer-motion";
import CommentModal from "@/components/comment/commentModal";
import Layout from "@/components/Layout/layout";

export default function PostPage({ newsResults, randomUsersResults }) {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);

  const [theme, setTheme] = useState('light'); 
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  // get the post data

  useEffect(
    () => onSnapshot(doc(db, "posts", id), (snapshot) => setPost(snapshot)),
    [db, id]
  );

  // get comments of the post

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [db, id]);

  return (
    <div>
      <Layout>
      <div className="post">
          <div className="post-home">
            <div className="hoverEffect" onClick={() => router.push("/")}>
              <ArrowLeftIcon className="h-5 " />
            </div>
            <h2 className="text-lg sm:text-xl font-bold cursor-pointer">
              Tweet
            </h2>
          </div>

          <Post id={id} post={post} />
          {comments.length > 0 && (
            <div className="">
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <Comment
                      key={comment.id}
                      commentId={comment.id}
                      originalPostId={id}
                      comment={comment.data()}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
}

export async function getServerSideProps() {
  const newsResults = await fetch(
    "https://saurav.tech/NewsAPI/top-headlines/category/business/us.json"
  ).then((res) => res.json());

  // Who to follow section

  let randomUsersResults = [];

  try {
    const res = await fetch(
      "https://randomuser.me/api/?results=30&inc=name,login,picture"
    );

    randomUsersResults = await res.json();
  } catch (e) {
    randomUsersResults = [];
  }

  return {
    props: {
      newsResults,
      randomUsersResults,
    },
  };
}