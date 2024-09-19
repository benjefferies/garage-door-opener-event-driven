import fs from "fs";
import { IGpioInterface } from ".";
import { config } from "../../config/environment";
import { GpioInterface } from "./gpio";
import { GpioSimulator } from "./simulator";

export class GpioFactory {
  static createRelayGpio(): IGpioInterface {
    if (this.isRaspberryPi()) {
      return new GpioInterface(config.gpioOut, "out");
    } else {
      return new GpioSimulator();
    }
  }

  static createDetectGpio(): IGpioInterface {
    if (this.isRaspberryPi()) {
      return new GpioInterface(config.gpioIn, "in", "both");
    } else {
      return new GpioSimulator();
    }
  }

  private static isRaspberryPi(): boolean {
    try {
      const cpuInfo = fs.readFileSync("/proc/cpuinfo", "utf8");
      return cpuInfo.toLowerCase().includes("raspberry pi");
    } catch (err) {
      return false;
    }
  }
}
