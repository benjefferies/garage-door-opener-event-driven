import Pusher from 'pusher-js';
import dotenv from 'dotenv';
const Gpio = require('onoff').Gpio;
const relay = new Gpio(14, 'out');

dotenv.config();

type Message = {
  message: string;
};

const pusher = new Pusher(process.env.PUSHER_APP_KEY, {
  cluster: process.env.PUSHER_APP_CLUSTER,
});

process.on('SIGINT', _ => {
  relay.unexport();
});

pusher.subscribe('garage-door').bind('toggle', (data: Message) => {
  console.log('Received toggle:', data.message);
  relay.writeSync(relay.readSync() === 0 ? 1 : 0);
});
