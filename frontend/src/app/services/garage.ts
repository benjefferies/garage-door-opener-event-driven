"use server";

import Pusher from "pusher";

export async function sendToggleEvent() {
    const pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID,
        key: process.env.PUSHER_APP_KEY,
        secret: process.env.PUSHER_APP_SECRET,
        cluster: process.env.PUSHER_APP_CLUSTER,
    });
    
    await pusher.trigger("garage-door", "toggle", { message: "toggle" });
}