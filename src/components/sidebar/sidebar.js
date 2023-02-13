import Image from 'next/image'
import React, { useEffect } from 'react'
import SidebarMenuItem from './SidebarMenuItem'
import { HomeIcon } from "@heroicons/react/solid";
import {
    BellIcon,
    BookmarkIcon,
    ClipboardIcon,
    DotsCircleHorizontalIcon,
    DotsHorizontalIcon,
    HashtagIcon,
    InboxIcon,
    LightBulbIcon,
    MoonIcon,
    UserIcon,
} from "@heroicons/react/outline";
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { userState } from 'atom/userAtom';
import { db } from '../../../firebase';
import { onBaordState } from 'atom/modalAtom';

export default function Sidebar({ theme, setTheme }) {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useRecoilState(userState);
    const [onBoardMoal, setOnBoardMoal] = useRecoilState(onBaordState);

    const auth = getAuth();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const fetchUser = async () => {
                    const docRef = doc(db, "users", auth.currentUser.providerData[0].uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setCurrentUser(docSnap.data());
                    }
                };
                fetchUser();
            }
        });
    }, [auth?.currentUser?.providerData[0]?.uid]);

    function onSignOut() {
        signOut(auth);
        setCurrentUser(null);
    }
    return (
        <div className="sidebar">
            {/* Twitter Logo */}
            <div className="sidebar-twitter-logo">
                <Image
                    width="50"
                    height="50"
                    alt="twitter"
                    src="https://www.freepnglogos.com/uploads/twitter-logo-png/twitter-logo-vector-png-clipart-1.png"
                ></Image>
            </div>

            {/* Menu */}

            <div className="mt-4 mb-2.5 xl:items-start">
                <SidebarMenuItem text="Home" Icon={HomeIcon} active />
                <SidebarMenuItem text="Explore" Icon={HashtagIcon} />
                <div onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                    {theme !== 'light' ?
                        <SidebarMenuItem text="Light" Icon={LightBulbIcon} /> :
                        <SidebarMenuItem text="Dark" Icon={MoonIcon} />}
                </div>
                {currentUser && (
                    <>
                        <SidebarMenuItem text="Notifications" Icon={BellIcon} />
                        <SidebarMenuItem text="Messages" Icon={InboxIcon} />
                        <SidebarMenuItem text="Bookmarks" Icon={BookmarkIcon} />
                        <SidebarMenuItem text="Lists" Icon={ClipboardIcon} />
                        <SidebarMenuItem text="Profile" Icon={UserIcon} />

                        <SidebarMenuItem text="More" Icon={DotsCircleHorizontalIcon} />
                    </>
                )}

                {currentUser ? <> <button className="tweet-btn mt-2">
                    Tweet
                </button>

                    <div className="hoverEffect flex items-center justify-center xl:justify-start mt-5">
                        <img
                            onClick={onSignOut}
                            src={currentUser?.userImg}
                            alt="user-img"
                            className="h-10 w-10 rounded-full xl:mr-2"
                        />
                        <div className="leading-5 hidden xl:inline">
                            <h4 className="font-bold">{currentUser?.name}</h4>
                            <p className="">{currentUser?.username}</p>
                        </div>
                        <DotsHorizontalIcon className="h-5 xl:ml-8 hidden xl:inline" />
                    </div>
                </> : (
                    <button
                        // onClick={() => router.push("/auth/signin")}
                        onClick={() => setOnBoardMoal(true)}
                        className="tweet-btn mt-2"
                    >
                        Sign in
                    </button>
                )}
            </div>


        </div>
    )
}
