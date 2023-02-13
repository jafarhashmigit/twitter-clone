import { db } from "../../../firebase";
import { SparklesIcon } from "@heroicons/react/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import InputPost from "./inputPost";
import Post from "./post";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export default function Feed() {
    // const posts = [
    //     {
    //         id: "1",
    //         name: "Jane Doe",
    //         username: "jdoe",
    //         image: "https://www.freecodecamp.org/news/content/images/size/w2000/2022/09/jonatan-pie-3l3RwQdHRHg-unsplash.jpg",
    //         text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    //         timestamp: "2 days ago",
    //     },
    //     {
    //         id: "2",
    //         name: "Sarah Doe",
    //         username: "sarahdoe",
    //         image: "https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg",
    //         text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    //         timestamp: "1 days ago",
    //     },
    // ];
    const [posts, setPosts] = useState([]);
    useEffect(
      () =>
        onSnapshot(
          query(collection(db, "posts"), orderBy("timestamp", "desc")),
          (snapshot) => {
            setPosts(snapshot.docs);
          }
        ),
      []
    );
    return (
        <div className="post">
            <div className="post-home">
                <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
                <div className=" flex items-center justify-center px-0 ml-auto w-9 h-9">
                    <SparklesIcon className="h-5" />
                </div>
            </div>
            <InputPost />
    
            <AnimatePresence>

                {posts.map((post) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Post key={post.id} id={post.id} post={post} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
