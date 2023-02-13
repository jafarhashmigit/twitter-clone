import { ChartBarIcon, ChatIcon, DotsHorizontalIcon, HeartIcon, ShareIcon, TrashIcon } from '@heroicons/react/outline';
import { modalState, onBaordState, postIdState } from 'atom/modalAtom';
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import { userState } from 'atom/userAtom';
import { db, storage } from '../../../firebase';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Moment from "react-moment";
import { useRecoilState } from 'recoil';

export default function Post({ post, id }) {
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [currentUser] = useRecoilState(userState);
  const router = useRouter();
  const [onBoardMoal, setOnBoardMoal] = useRecoilState(onBaordState);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "comments"),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [db]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes, currentUser]);

  async function likePost() {
    if (currentUser) {
      if (hasLiked) {
        await deleteDoc(doc(db, "posts", id, "likes", currentUser?.uid));
      } else {
        await setDoc(doc(db, "posts", id, "likes", currentUser?.uid), {
          username: currentUser?.username,
        });
      }
    } else {
      // signIn();
      // router.push("/auth/signin");
      setOnBoardMoal(true)
    }
  }

  async function deletePost() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteDoc(doc(db, "posts", id));
      if (post.data().image) {
        deleteObject(ref(storage, `posts/${id}/image`));
      }
      router.push("/");
    }
  }

  return (
    <div className="flex p-3 cursor-pointer border-b border-color single-post">
      {/* user image */}
      <img
        className="h-11 w-11 rounded-full mr-4"
        // src={"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
        src={post?.data()?.userImg}
        alt="user-img"
      />
      {/* right side */}
      <div className="flex-1 ">
        {/* Header */}

        <div className="flex items-center justify-between ">
          {/* post user info */}
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
              {post?.data()?.name}
            </h4>
            <span className="text-sm sm:text-[15px]">
              @{post?.data()?.username} -{" "}
            </span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
            </span>
          </div>

          {/* dot icon */}
          <DotsHorizontalIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2 " />
        </div>

        {/* post text */}

        <p
          onClick={() => router.push(`/posts/${id}`)}
          className=" text-[15px sm:text-[16px] mb-2 w-[100%] break-all"
        >
          {post?.data()?.text}
        </p>

        {/* post image */}

        <img
          onClick={() => router.push(`/posts/${id}`)}
          className="rounded-2xl mr-2"
          src={post?.data()?.image}
          alt=""
        />

        {/* icons */}

        <div className="flex justify-between  p-2">
          <div className="flex items-center select-none">
            <ChatIcon
              onClick={() => {
                if (!currentUser) {
                  // signIn();
                  // router.push("/auth/signin");
                  setOnBoardMoal(true)
                } else {
                  setPostId(id);
                  setOpen(!open);
                }
              }}
              className="post-icon-blue"
            />
            {comments.length > 0 && (
              <span className="text-sm">{comments.length}</span>
            )}
          </div>
          {currentUser?.uid === post?.data()?.id && (
            <div className="flex items-center">
              <TrashIcon
                onClick={deletePost}
                className="post-icon-blue"
              />
            </div>
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likePost}
                className="post-icon-red-filled"
              />
            ) : (
              <HeartIcon
                onClick={likePost}
                className="post-icon-red"
              />
            )}
            {likes.length > 0 && (
              <span
                className={`${hasLiked && "text-red-600"} text-sm select-none`}
              >
                {" "}
                {likes.length}
              </span>
            )}
          </div>

          <div className="flex items-center"><ShareIcon className="post-icon-blue" /></div>
          <ChartBarIcon className="post-icon-blue" />
        </div>
      </div>
    </div>
  )
}
