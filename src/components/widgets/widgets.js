import { SearchIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import News from "./news";
import { userState } from "atom/userAtom";
import { useRecoilState } from 'recoil';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, doc, getDoc, limitToLast, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { db } from '../../../firebase';

export default function Widgets({ newsResults }) {

  const [articleNum, setArticleNum] = useState(3);
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [latestUsers, setLatestUsers] = useState([]);

  const router = useRouter();
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const user = auth.currentUser.providerData[0];
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          username: user.displayName.split(" ").join("").toLocaleLowerCase(),
          userImg: user.photoURL,
          uid: user.uid,
          timestamp: serverTimestamp(),
        });
      }
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "users"),limitToLast(10), orderBy("timestamp", "desc")),
        (snapshot) => {
          setLatestUsers(snapshot.docs)
        }
      ),
    []
  );
  return (
    <div className="xl:w-[600px] hidden lg:inline ml-8 space-y-5">
      {currentUser ? <><div className="w-[90%] xl:w-[75%] sticky top-0 bg-color py-1.5 z-50">
        <div className="flex items-center p-3 rounded-full  relative">
          <SearchIcon className="h-5 z-50 text-gray-500" />
          <input
            className="absolute inset-0 rounded-full pl-11 secondary-bg-color "
            type="text"
            placeholder="Search Twitter"
          />
        </div>
      </div>

        <div className=" box">
          <h4 className="font-bold text-xl px-4">Whats happening</h4>
          <AnimatePresence>
            {newsResults?.articles?.slice(0, articleNum).map((article) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <News key={article.title} article={article} />
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            onClick={() => setArticleNum(articleNum + 3)}
            className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
          >
            Show more
          </button>
        </div>
        <div className="box">
          <h4 className="font-bold text-xl px-4">Who to follow</h4>
          <AnimatePresence>
            {latestUsers.map((randomUser) => (
              <motion.div
                key={randomUser.data().uid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <div
                  key={randomUser.data().username} 
                  className="flex items-center px-4 py-2  cursor-pointer hover:bg-gray-200 transition duration-500 ease-out"
                >
                  <img
                    className="rounded-full"
                    width="40"
                    src={randomUser.data().userImg}
                    alt=""
                  />
                  <div className="truncate ml-4 leading-5">
                    <h4 className="font-bold hover:underline text-[14px] truncate">
                    {randomUser.data().username} 
                    </h4>
                    <h5 className="text-[13px truncate">
                    {randomUser.data().name}
                    </h5>
                  </div>
                  <button className="ml-auto bg-black  text-white   rounded-full text-sm px-3.5 py-1.5 font-bold">
                    Follow
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {/* <button
            onClick={() => setRandomUserNum(randomUserNum + 3)}
            className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
          >
            Show more
          </button> */}
        </div>
      </> : <>
        <div className="box p-3">
          <h2 className="font-bold text-xl">New to Twitter?</h2>
          <div>
            <small>Sign up now to get your own personalized timeline!</small>
          </div>
          <button className="widget-login-btn mt-3" onClick={()=>onGoogleClick()}>
            <img
              src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
              width={24}
              height={24}
            />
            Sign up with Google
          </button>
          <button className="widget-login-btn mt-2">
            Create Account
          </button>
          <small>By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.</small>
        </div>
        <div className="w-4/5 px-3">
        <small >Terms of Service
          Privacy Policy
          Cookie Policy
          Accessibility
          Ads info
          More
          © 2023 Twitter, Inc.</small>
        </div>
      </>}
    </div>
  )
}