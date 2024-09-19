import dotenv from "dotenv";

dotenv.config();

export const config = {
  gpioOut: parseInt(process.env.GPIO_OUT || "0"),
  gpioIn: parseInt(process.env.GPIO_IN || "0"),
  pusher: {
    appId: process.env.PUSHER_APP_ID || "",
    key: process.env.PUSHER_APP_KEY || "",
    secret: process.env.PUSHER_APP_SECRET || "",
    cluster: process.env.PUSHER_APP_CLUSTER || "",
  },
  sendGrid: {
    apiKey: process.env.SENDGRID_API_KEY || "",
    toEmail: process.env.TO_EMAIL || "",
    fromEmail: process.env.FROM_EMAIL || "",
  },
};
