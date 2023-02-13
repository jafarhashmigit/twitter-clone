import {
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRef, useState } from "react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "../../../firebase";
import { userState } from "atom/userAtom";
import { useRecoilState } from "recoil";
import { signOut, getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import EmojiPicker from "emoji-picker-react";

export default function InputPost() {
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emoji, setEmoji] = useState(false);
  const filePickerRef = useRef(null);
  const auth = getAuth();

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: currentUser.uid,
      text: input,
      userImg: currentUser.userImg,
      timestamp: serverTimestamp(),
      name: currentUser.name,
      username: currentUser.username,
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setInput("");
    setSelectedFile(null);
    setLoading(false);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  function onSignOut() {
    signOut(auth);
    setCurrentUser(null);
  }

  return (
    <>
      {currentUser && (
        <div className="flex  border-b border-color p-3 space-x-3">
          <img
            onClick={onSignOut}
            // src={"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            src={currentUser?.userImg}
            alt="user-img"
            className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
          />
          <div className="w-full ">
            <textarea
              className="w-full border-b border-color focus:ring-0 text-lg tracking-wide min-h-[50px] "
              rows="3"
              placeholder="What's happening?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
            {selectedFile && (
              <div className="relative">
                <XIcon
                  onClick={() => setSelectedFile(null)}
                  className="border h-7 text-black absolute cursor-pointer shadow-md border-white m-1 rounded-full"
                />
                <img
                  src={selectedFile}
                  className={`${loading && "animate-pulse"}`}
                />
              </div>
            )}
            <div className="flex items-center justify-between pt-2.5">
              <>
                <div className="flex">
                  <div
                    className=""
                    onClick={() => filePickerRef.current.click()}
                  >
                    <PhotographIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                    <input
                      type="file"
                      hidden
                      ref={filePickerRef}
                      onChange={addImageToPost}
                    />
                  </div>
                  <EmojiHappyIcon onClick={()=>setEmoji(!emoji)} className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100"  />
                  {emoji && <div className="inputEmoji" onMouseLeave={()=>setEmoji(false)}>
                    <EmojiPicker onEmojiClick={(e)=>setInput(input+e.emoji)} />
                  </div>}
                </div>
                <button
                  onClick={sendPost}
                  disabled={!input.trim()}
                  className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                >
                  Tweet
                </button>
              </>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
