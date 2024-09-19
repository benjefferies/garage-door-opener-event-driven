import { BinaryValue } from "onoff";
import { IGpioInterface } from ".";

export class GpioSimulator implements IGpioInterface {
  private value: BinaryValue = 0;

  writeSync(value: BinaryValue): void {
    this.value = value;
    console.log(`Mock GPIO: Written ${value}`);
  }

  readSync(): BinaryValue {
    console.log(`Mock GPIO: Read ${this.value}`);
    return this.value;
  }

  watch(
    callback: (err: Error | null | undefined, value: BinaryValue) => void
  ): void {
    console.log("Mock GPIO: Watching for changes");
    // Simulate a change after a delay for testing
    setTimeout(() => callback(null, this.value), 1000);
  }

  unexport(): void {
    console.log("Mock GPIO: Unexported");
  }
}
