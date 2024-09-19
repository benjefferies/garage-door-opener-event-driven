import { BinaryValue } from "onoff";

export interface IGpioInterface {
  writeSync(value: BinaryValue): void;
  readSync(): BinaryValue;
  watch(
    callback: (err: Error | null | undefined, value: BinaryValue) => void
  ): void;
  unexport(): void;
}
export class GpioService {
  private relay: IGpioInterface;
  private detect: IGpioInterface;

  constructor(relayGpio: IGpioInterface, detectGpio: IGpioInterface) {
    this.relay = relayGpio;
    this.detect = detectGpio;
  }

  isOpen(value: BinaryValue): boolean {
    return value === 1;
  }

  unexportGPIO(): void {
    this.detect.unexport();
    this.relay.unexport();
  }

  watchGarage(
    callback: (err: Error | null | undefined, value: BinaryValue) => void
  ): void {
    this.detect.watch(callback);
  }

  readDetectSync(): BinaryValue {
    return this.detect.readSync();
  }

  async toggleRelay(): Promise<void> {
    this.relay.writeSync(1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.relay.writeSync(0);
  }
}
