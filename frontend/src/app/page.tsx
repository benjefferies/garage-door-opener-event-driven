"use client";

import { redirect, useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { sendToggleEvent } from "./services/garage";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
});

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    require("@passageidentity/passage-elements/passage-auth");
  }, []);

  useEffect(() => {
    pusher.subscribe("cache-garage-door").bind("state", (data: State) => {
      const { isOpen, ...rest } = data;
      console.log("Received state", { ...rest, isOpen });
      setIsOpened(isOpen);
      setLoading(false);
    });
  }, []);

  const user = useCurrentUser();
  const router = useRouter();

  if (user.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!user.isAuthorized) {
    // redirect to login
    return redirect("/login");
  }

  return (
    <div className="flex flex-col h-dvh bg-gray-900">
      <header className="flex justify-between items-center p-4">
        <h1 className="text-white sm:text-4xl text-xl">Garage Door Opener</h1>
        <div className="flex space-x-2">
          <button
            className="bg-gray-700 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded text-nowrap"
            onClick={() => {
              router.push("/profile");
            }}
          >
            Profile
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded text-nowrap	"
            onClick={() => {
              user.signOut();
              router.push("/login");
            }}
          >
            Sign out
          </button>
        </div>
      </header>
      <main className={`sm:p-24 p-4 flex grow`}>
        <button
          className="bg-gray-700 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-3xl w-full text-4xl sm:text-9xl"
          onClick={() => {
            setLoading(true);
            sendToggleEvent(user.username);
            setTimeout(() => {
              setLoading(false);
            }, 5000);
          }}
        >
          {!loading && (isOpened ? "Close" : "Open")}
          {loading && "Loading..."}
        </button>
      </main>
    </div>
  );
}
