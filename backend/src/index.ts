import { sendBootNotification } from "./services/email";
import { sendState, subscribeToToggle } from "./services/event";
import { GpioService } from "./services/gpio";
import { GpioFactory } from "./services/gpio/factory";

const relayGpio = GpioFactory.createRelayGpio();
const detectGpio = GpioFactory.createDetectGpio();
const gpioService = new GpioService(relayGpio, detectGpio);

const isOpen = gpioService.isOpen(gpioService.readDetectSync());
const bootTimestamp = new Date();
let openTimestamp: Date | undefined = isOpen ? new Date() : undefined;

process.on("SIGINT", () => {
  gpioService.unexportGPIO();
  process.exit();
});

// Pusher subscription
subscribeToToggle(async (data: Message) => {
  console.log("Received toggle", data);
  await gpioService.toggleRelay();

  const toggleIsOpen = gpioService.isOpen(gpioService.readDetectSync());
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

// GPIO watcher
gpioService.watchGarage((err, value) => {
  if (err) {
    throw err;
  }

  if (!gpioService.isOpen(value)) {
    openTimestamp = undefined;
  } else if (!openTimestamp) {
    openTimestamp = new Date();
  }

  const state: State = {
    timestamp: new Date().toISOString(),
    isOpen: gpioService.isOpen(value),
    openTimestamp,
    bootTimestamp,
  };

  console.log("Detect", value);
  sendState.clear();
  sendState(state);
});

const initialState: State = {
  timestamp: new Date().toISOString(),
  isOpen: isOpen,
  bootTimestamp,
};
sendState(initialState);

// Send boot notification email
sendBootNotification(isOpen, bootTimestamp);
