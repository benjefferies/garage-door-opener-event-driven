import fs from "fs";
import { GpioFactory } from "./factory";
import { GpioInterface } from "./gpio";
import { GpioSimulator } from "./simulator";

jest.mock("fs");
jest.mock("onoff");

describe("GpioFactory", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should return GpioInterface when running on Raspberry Pi", () => {
    (fs.readFileSync as jest.Mock).mockReturnValue(
      "Model           : Raspberry Pi Zero 2 W Rev 1.0"
    );

    const relayGpio = GpioFactory.createRelayGpio();
    const detectGpio = GpioFactory.createDetectGpio();

    expect(relayGpio).toBeInstanceOf(GpioInterface);
    expect(detectGpio).toBeInstanceOf(GpioInterface);
  });

  test("should return GpioSimulator when not running on Raspberry Pi", () => {
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error("File not found");
    });

    const relayGpio = GpioFactory.createRelayGpio();
    const detectGpio = GpioFactory.createDetectGpio();

    expect(relayGpio).toBeInstanceOf(GpioSimulator);
    expect(detectGpio).toBeInstanceOf(GpioSimulator);
  });

  test('should return GpioSimulator when /proc/cpuinfo does not contain "Raspberry Pi"', () => {
    (fs.readFileSync as jest.Mock).mockReturnValue("Some other hardware info");

    const relayGpio = GpioFactory.createRelayGpio();
    const detectGpio = GpioFactory.createDetectGpio();

    expect(relayGpio).toBeInstanceOf(GpioSimulator);
    expect(detectGpio).toBeInstanceOf(GpioSimulator);
  });
});
