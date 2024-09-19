import { BinaryValue, Gpio } from "onoff";
import { IGpioInterface } from ".";

export class GpioInterface implements IGpioInterface {
  private gpio: Gpio;

  constructor(
    pin: number,
    direction: "in" | "out",
    edge?: "none" | "rising" | "falling" | "both"
  ) {
    this.gpio = new Gpio(pin, direction, edge);
  }

  writeSync(value: BinaryValue) {
    this.gpio.writeSync(value);
  }

  readSync(): BinaryValue {
    return this.gpio.readSync();
  }

  watch(
    callback: (err: Error | null | undefined, value: BinaryValue) => void
  ): void {
    this.gpio.watch(callback);
  }

  unexport(): void {
    this.gpio.unexport();
  }
}
