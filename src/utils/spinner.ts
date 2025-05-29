import type { Ora } from "ora";

import ora from "ora";

export class SpinnerManager {
  private spinner: Ora | null = null;

  start(message: string): void {
    this.spinner = ora(message).start();
  }

  updateText(message: string): void {
    if (this.spinner) {
      this.spinner.text = ` ${message}`;
    }
  }

  succeed(message?: string): void {
    if (this.spinner) {
      this.spinner.succeed(` ${message}`);
      this.spinner = null;
    }
  }

  fail(message?: string): void {
    if (this.spinner) {
      this.spinner.fail(` ${message}`);
      this.spinner = null;
    }
  }

  stop(): void {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }
}

export const spinner = new SpinnerManager();
