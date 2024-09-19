import { GpioService, IGpioInterface } from ".";

describe("GpioService", () => {
  let gpioService: GpioService;
  let mockRelay: jest.Mocked<IGpioInterface>;
  let mockDetect: jest.Mocked<IGpioInterface>;

  beforeEach(() => {
    mockRelay = {
      writeSync: jest.fn(),
      readSync: jest.fn(),
      watch: jest.fn(),
      unexport: jest.fn(),
    };

    mockDetect = {
      writeSync: jest.fn(),
      watch: jest.fn(),
      unexport: jest.fn(),
      readSync: jest.fn().mockReturnValue(1),
    } as any;

    gpioService = new GpioService(mockRelay, mockDetect);
  });

  test("isOpen should return true when value is 1", () => {
    expect(gpioService.isOpen(1)).toBe(true);
  });

  test("isOpen should return false when value is 0", () => {
    expect(gpioService.isOpen(0)).toBe(false);
  });

  test("unexportGPIO should call unexport on both relay and detect", () => {
    gpioService.unexportGPIO();

    expect(mockDetect.unexport).toHaveBeenCalled();
    expect(mockRelay.unexport).toHaveBeenCalled();
  });

  test("watchGarage should call watch on detect with provided callback", () => {
    const callback = jest.fn();

    gpioService.watchGarage(callback);

    expect(mockDetect.watch).toHaveBeenCalledWith(callback);
  });

  test("readDetectSync should return the value from detect.readSync", () => {
    const value = gpioService.readDetectSync();

    expect(mockDetect.readSync).toHaveBeenCalled();
    expect(value).toBe(1);
  });

  test("toggleRelay should toggle the relay correctly", async () => {
    const togglePromise = gpioService.toggleRelay();

    jest.advanceTimersByTime(1000);

    await togglePromise;

    expect(mockRelay.writeSync).toHaveBeenNthCalledWith(1, 1);
    expect(mockRelay.writeSync).toHaveBeenNthCalledWith(2, 0);
  });
});
