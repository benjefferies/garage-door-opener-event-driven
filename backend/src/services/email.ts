import sgMail from "@sendgrid/mail";
import { config } from "../config/environment";

sgMail.setApiKey(config.sendGrid.apiKey);

export const sendBootNotification = async (
  isOpen: boolean,
  bootTimestamp: Date
) => {
  const msg = {
    to: config.sendGrid.toEmail,
    from: config.sendGrid.fromEmail,
    subject: "Garage Door Opener - Boot Notification",
    text: `Garage door is ${
      isOpen ? "open" : "closed"
    } at boot. Time of boot: ${bootTimestamp.toISOString()}`,
    html: `<strong>Garage door is ${
      isOpen ? "open" : "closed"
    } at boot. Time of boot: ${bootTimestamp.toISOString()}</strong>`,
  };

  const response = await sgMail.send(msg);
  if (response[0].statusCode !== 202) {
    throw new Error("Failed to send boot notification email");
  }
};
