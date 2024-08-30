import debounce from "debounce";
import dotenv from "dotenv";
import { Gpio } from "onoff";
import Pusher from "pusher";
import PusherClient from "pusher-js";

dotenv.config();

const relay = new Gpio(parseInt(process.env.GPIO_OUT), "out");
const detect = new Gpio(parseInt(process.env.GPIO_IN), "in", "both");

process.on("SIGINT", (_) => {
  detect.unexport();
  relay.unexport();
  process.exit();
});

const options: Pusher.Options = {
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
};

const pusher = new Pusher(options);
const pusherClient = new PusherClient(options.key, options);

const sendState = debounce((state: State) => {
  console.log("Sending state", state);
  pusher.trigger("cache-garage-door", "state", state);
}, 500);

const isOpen = (value: number) => value === 1;

pusherClient.subscribe("garage-door").bind("toggle", async (data: Message) => {
  console.log("Received toggle", data);
  relay.writeSync(1);
  await new Promise((resolve) => setTimeout(resolve, 1_000));
  relay.writeSync(0);
  const state: State = {
    ...data,
    isOpen: isOpen(detect.readSync()),
  };
  sendState(state);
});

detect.watch((err, value) => {
  if (err) {
    throw err;
  }

  const state: State = {
    timestamp: new Date().toISOString(),
    isOpen: isOpen(value),
  };
  console.log("Detect", value);
  sendState.clear();
  sendState(state);
});

// Read initial state
const state: State = {
  timestamp: new Date().toISOString(),
  isOpen: isOpen(detect.readSync()),
};
sendState(state);
