import sgMail from "@sendgrid/mail";
import { config } from "../config/environment";
import { sendBootNotification } from "./email";

jest.mock("@sendgrid/mail");

describe("sendBootNotification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sgMail.setApiKey(config.sendGrid.apiKey);
  });

  test("should send boot notification email when garage door is open", async () => {
    const mockSend = sgMail.send as jest.MockedFunction<typeof sgMail.send>;

    mockSend.mockResolvedValue([
      { statusCode: 202, headers: {}, body: {} },
      {},
    ]);

    const isOpen = true;
    const bootTimestamp = new Date("2023-01-01T00:00:00Z");

    await expect(
      sendBootNotification(isOpen, bootTimestamp)
    ).resolves.not.toThrow();

    expect(mockSend).toHaveBeenCalledTimes(1);

    const expectedMsg = {
      to: config.sendGrid.toEmail,
      from: config.sendGrid.fromEmail,
      subject: "Garage Door Opener - Boot Notification",
      text: `Garage door is open at boot. Time of boot: ${bootTimestamp.toISOString()}`,
      html: `<strong>Garage door is open at boot. Time of boot: ${bootTimestamp.toISOString()}</strong>`,
    };

    expect(mockSend).toHaveBeenCalledWith(expectedMsg);
  });

  test("should send boot notification email when garage door is closed", async () => {
    const mockSend = sgMail.send as jest.MockedFunction<typeof sgMail.send>;

    mockSend.mockResolvedValue([
      { statusCode: 202, headers: {}, body: {} },
      {},
    ]);

    const isOpen = false;
    const bootTimestamp = new Date("2023-01-01T00:00:00Z");

    await expect(
      sendBootNotification(isOpen, bootTimestamp)
    ).resolves.not.toThrow();

    expect(mockSend).toHaveBeenCalledTimes(1);

    const expectedMsg = {
      to: config.sendGrid.toEmail,
      from: config.sendGrid.fromEmail,
      subject: "Garage Door Opener - Boot Notification",
      text: `Garage door is closed at boot. Time of boot: ${bootTimestamp.toISOString()}`,
      html: `<strong>Garage door is closed at boot. Time of boot: ${bootTimestamp.toISOString()}</strong>`,
    };

    expect(mockSend).toHaveBeenCalledWith(expectedMsg);
  });

  test("should throw error if email sending fails (non-202 status code)", async () => {
    const mockSend = sgMail.send as jest.MockedFunction<typeof sgMail.send>;

    mockSend.mockResolvedValue([
      { statusCode: 500, headers: {}, body: {} },
      {},
    ]);

    const isOpen = true;
    const bootTimestamp = new Date();

    await expect(sendBootNotification(isOpen, bootTimestamp)).rejects.toThrow(
      "Failed to send boot notification email"
    );

    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test("should throw error if sgMail.send rejects", async () => {
    const mockSend = sgMail.send as jest.MockedFunction<typeof sgMail.send>;

    const error = new Error("Network error");
    mockSend.mockRejectedValue(error);

    const isOpen = true;
    const bootTimestamp = new Date();

    await expect(sendBootNotification(isOpen, bootTimestamp)).rejects.toThrow(
      error
    );

    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});
