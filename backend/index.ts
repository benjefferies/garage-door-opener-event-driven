import sgMail from "@sendgrid/mail";
import debounce from "debounce";
import dotenv from "dotenv";
import { Gpio } from "onoff";
import Pusher from "pusher";
import PusherClient from "pusher-js";

dotenv.config();

const relay = new Gpio(parseInt(process.env.GPIO_OUT), "out");
const detect = new Gpio(parseInt(process.env.GPIO_IN), "in", "both");

let openTimestamp: Date | undefined;
const bootTimestamp = new Date();

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
  const toggleIsOpen = isOpen(detect.readSync());
  if (!toggleIsOpen) {
    openTimestamp = undefined;
  } else if (!openTimestamp) {
    openTimestamp = new Date();
  }
  const state: State = {
    ...data,
    isOpen: toggleIsOpen,
    openTimestamp,
    bootTimestamp,
  };
  sendState(state);
});

detect.watch((err, value) => {
  if (err) {
    throw err;
  }

  if (!isOpen(value)) {
    openTimestamp = undefined;
  } else if (!openTimestamp) {
    openTimestamp = new Date();
  }

  const state: State = {
    timestamp: new Date().toISOString(),
    isOpen: isOpen(value),
    openTimestamp,
    bootTimestamp,
  };
  console.log("Detect", value);
  sendState.clear();
  sendState(state);
});

const bootIsOpen = isOpen(detect.readSync());
if (bootIsOpen) {
  openTimestamp = new Date();
}

// Read initial state
const state: State = {
  timestamp: new Date().toISOString(),
  isOpen: bootIsOpen,
  bootTimestamp,
};
sendState(state);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: process.env.TO_EMAIL,
  from: process.env.FROM_EMAIL,
  subject: "Garage Door Opener - Boot Notification",
  text: `Garage door is ${
    bootIsOpen ? "open" : "closed"
  } at boot. Time of boot: ${bootTimestamp.toISOString()}`,
  html: `<strong>Garage door is ${
    bootIsOpen ? "open" : "closed"
  } at boot. Time of boot: ${bootTimestamp.toISOString()}</strong>`,
};

sgMail
  .send(msg)
  .then((response) => {
    console.log(response[0].statusCode);
    console.log(response[0].headers);
  })
  .catch((error) => {
    console.error(error);
  });
