import { XIcon } from "@heroicons/react/outline";
import { onBaordState } from "atom/modalAtom";
import Modal from "react-modal";
import { useRecoilState } from "recoil";
import { getProviders } from "next-auth/react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { db, auth } from "../../../firebase";
import { useState } from "react";

export default function Onboarding({ theme }) {
  const [open, setOpen] = useRecoilState(onBaordState);
  const [createAccount, setCreateAccount] = useState(false);
  const [loginAccount, setLoginAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

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
      setOpen(false);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  const onSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async function (data) {
          console.log("Sign up successful!", data?.user?.providerData[0]);
          const user = data?.user?.providerData[0];
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            await setDoc(docRef, {
              name: name,
              email: user.email,
              username: username.split(" ").join("").toLocaleLowerCase(),
              userImg:
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              uid: user.uid,
              timestamp: serverTimestamp(),
            });
            setCreateAccount(false);
            setLoginAccount(false);
            setOpen(false);
            router.push("/");
          }
        })
        .catch(function (error) {
          console.error("Sign up failed:", error);
        });
    } catch (error) {}
  };
  const onSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        function (data) {
          setCreateAccount(false);
          setLoginAccount(false);
          setOpen(false);
          router.push("/");
        }
      );
    } catch (error) {}
  };
  return (
    <>
      {open && (
        <Modal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          className="modal"
        >
          <div
            className="p-1 pb-12"
            style={{
              backgroundColor: theme === "light" ? "#fff" : "#343541",
              color: theme === "light" ? "#343541" : "#fff",
              borderRadius: "30px",
            }}
          >
            <div className="py-2 px-1.5">
              <div className=" w-full flex items-center justify-start">
                <XIcon
                  onClick={() => setOpen(false)}
                  className={
                    theme === "light"
                      ? "h-[23px] text-gray-700 p-0"
                      : "h-[23px] text-gray-400 p-0"
                  }
                />
                <img
                  width="40"
                  height="40"
                  className="ml-[45%] "
                  src="https://www.freepnglogos.com/uploads/twitter-logo-png/twitter-logo-vector-png-clipart-1.png"
                />
              </div>
            </div>
            <div className="onboard-content my-3">
              <h1 className="font-bold text-2xl mt-3">
                {createAccount && "Create your account"}{" "}
                {loginAccount && "Sign in to Twitter"}{" "}
                {!createAccount && !loginAccount && "Join Twitter today"}
                {theme}
              </h1>
              <div className="w-3/5">
                <button
                  className="onboard-login-btn mt-3 mb-3 border border-gray-500"
                  onClick={onGoogleClick}
                >
                  <img
                    src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                    width={24}
                    height={24}
                  />
                  Sign up with Google
                </button>
                {!createAccount && !loginAccount && (
                  <>
                    <div className="text-between-hl ">
                      <span
                        style={{
                          backgroundColor:
                            theme === "light" ? "#fff" : "#343541",
                          color: theme === "light" ? "#343541" : "#fff",
                        }}
                      >
                        or
                      </span>
                    </div>
                    <button
                      className="onboard-login-btn-black mt-2"
                      onClick={() => setCreateAccount(true)}
                    >
                      Create Account
                    </button>
                    <small>
                      By signing up, you agree to the Terms of Service and
                      Privacy Policy, including Cookie Use.
                    </small>
                    <div className="mt-3">
                      <span>
                        Have an account already?{" "}
                        <a href="#" onClick={() => setLoginAccount(true)}>
                          Log in
                        </a>
                      </span>
                    </div>
                  </>
                )}
                {createAccount && (
                  <>
                    <div className="w-full max-w-xs">
                      <form>
                        <div className="mb-4">
                          <label
                            className="block text-sm font-bold mb-2"
                            for="username"
                          >
                            Name
                          </label>
                          <input
                            onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Name"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            className="block text-sm font-bold mb-2"
                            for="username"
                          >
                            Username
                          </label>
                          <input
                            onChange={(e) => setUserName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder="Username"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            className="block text-sm font-bold mb-2"
                            for="username"
                          >
                            Email
                          </label>
                          <input
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                          />
                        </div>
                        <div className="mb-6">
                          <label
                            className="block text-sm font-bold mb-2"
                            for="password"
                          >
                            Password
                          </label>
                          <input
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="******************"
                          />
                          {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={onSignUp}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                          >
                            Sign Up
                          </button>
                        </div>
                        <div className="mt-3">
                          <span>
                            Have an account already?{" "}
                            <a
                              href="#"
                              onClick={() => {
                                setLoginAccount(true);
                                setCreateAccount(false);
                              }}
                            >
                              Log in
                            </a>
                          </span>
                        </div>
                      </form>
                    </div>
                  </>
                )}
                {loginAccount && (
                  <>
                    <div className="w-full max-w-xs">
                      <form>
                        <div className="mb-4">
                          <label
                            className="block text-sm font-bold mb-2"
                            for="username"
                          >
                            Email
                          </label>
                          <input
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                          />
                        </div>
                        <div className="mb-6">
                          <label
                            className="block text-sm font-bold mb-2"
                            for="password"
                          >
                            Password
                          </label>
                          <input
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="******************"
                          />
                          {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={onSignIn}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                          >
                            Sign In
                          </button>
                        </div>
                        <div className="mt-3">
                          <span>
                            Don't have an account?{" "}
                            <a
                              href="#"
                              onClick={() => {
                                setLoginAccount(false);
                                setCreateAccount(true);
                              }}
                            >
                              Sign up
                            </a>
                          </span>
                        </div>
                      </form>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
