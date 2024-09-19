import debounce from "debounce";
import Pusher from "pusher";
import PusherClient from "pusher-js";
import { config } from "../config/environment";

const pusherOptions: Pusher.Options = {
  appId: config.pusher.appId,
  key: config.pusher.key,
  secret: config.pusher.secret,
  cluster: config.pusher.cluster,
};

const pusher = new Pusher(pusherOptions);
const pusherClient = new PusherClient(config.pusher.key, pusherOptions);

export const sendState = debounce((state: State) => {
  console.log("Sending state", state);
  pusher.trigger("cache-garage-door", "state", state);
}, 500);

export const subscribeToToggle = (callback: (data: any) => void) => {
  pusherClient.subscribe("garage-door").bind("toggle", callback);
};
