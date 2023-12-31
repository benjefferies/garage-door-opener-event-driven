"use client";

import { sendToggleEvent } from "./services/garage";

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          sendToggleEvent();
        }}
      >
        Button
      </button>
    </main>
  );
}
