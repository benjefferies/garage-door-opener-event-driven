import { BinaryValue, Gpio } from "onoff";
import { GpioInterface } from "./gpio";

jest.mock("onoff", () => {
  return {
    Gpio: jest.fn().mockImplementation(() => {
      return {
        writeSync: jest.fn(),
        readSync: jest.fn().mockReturnValue(1),
        watch: jest.fn(),
        unexport: jest.fn(),
      };
    }),
  };
});

describe("GpioInterface", () => {
  const pin = 17;
  const direction = "out";
  const edge = "both";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a new Gpio instance with correct parameters", () => {
    new GpioInterface(pin, direction, edge);

    expect(Gpio).toHaveBeenCalledWith(pin, direction, edge);
  });

  test("writeSync should call gpio.writeSync with correct value", () => {
    const gpioInterface = new GpioInterface(pin, direction, edge);
    const value: BinaryValue = 1;

    gpioInterface.writeSync(value);

    expect(gpioInterface["gpio"].writeSync).toHaveBeenCalledWith(value);
  });

  test("readSync should call gpio.readSync and return value", () => {
    const gpioInterface = new GpioInterface(pin, direction, edge);

    const returnValue = gpioInterface.readSync();

    expect(gpioInterface["gpio"].readSync).toHaveBeenCalled();
    expect(returnValue).toBe(1);
  });

  test("watch should call gpio.watch with correct callback", () => {
    const gpioInterface = new GpioInterface(pin, direction, edge);
    const callback = jest.fn();

    gpioInterface.watch(callback);

    expect(gpioInterface["gpio"].watch).toHaveBeenCalledWith(callback);
  });

  test("unexport should call gpio.unexport", () => {
    const gpioInterface = new GpioInterface(pin, direction, edge);

    gpioInterface.unexport();

    expect(gpioInterface["gpio"].unexport).toHaveBeenCalled();
  });
});
