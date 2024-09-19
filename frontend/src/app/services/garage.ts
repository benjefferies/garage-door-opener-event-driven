"use server";

import Pusher from "pusher";

const options: Pusher.Options = {
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
};

const pusher = new Pusher(options);

export async function sendToggleEvent(user: string) {
  await pusher.trigger("garage-door", "toggle", {
    message: {
      timestamp: new Date().toISOString(),
      user: user,
    },
  });
}
