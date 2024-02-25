import Pusher from 'pusher-js';
import dotenv from 'dotenv';
import { Gpio } from 'onoff';
const relay = new Gpio(14, 'out');
const detect = new Gpio(26, 'in', 'both');

dotenv.config();

type Message = {
  message: string;
};

const pusher = new Pusher(process.env.PUSHER_APP_KEY, {
  cluster: process.env.PUSHER_APP_CLUSTER,
});

process.on('SIGINT', _ => {
  detect.unexport();
  relay.unexport();
});

pusher.subscribe('garage-door').bind('toggle', (data: Message) => {
  console.log('Received toggle:', data.message);
  relay.writeSync(relay.readSync() === 0 ? 1 : 0);
});


detect.watch((err, value) => {
  if (err) {
    throw err;
  }

  console.log('Button pressed:', value);
});
