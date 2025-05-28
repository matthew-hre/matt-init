"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinner = void 0;
const chalk_1 = __importDefault(require("chalk"));
class Spinner {
    constructor(message) {
        this.interval = null;
        this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        this.currentFrame = 0;
        this.message = message;
    }
    start() {
        process.stdout.write('\x1B[?25l'); // Hide cursor
        this.interval = setInterval(() => {
            process.stdout.write('\r' + chalk_1.default.blue(this.frames[this.currentFrame]) + ' ' + this.message);
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        }, 80);
    }
    updateMessage(message) {
        this.message = message;
    }
    succeed(message) {
        this.stop();
        process.stdout.write('\r' + chalk_1.default.green('✓') + ' ' + (message || this.message) + '\n');
    }
    fail(message) {
        this.stop();
        process.stdout.write('\r' + chalk_1.default.red('✗') + ' ' + (message || this.message) + '\n');
    }
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        process.stdout.write('\r\x1B[K'); // Clear line
        process.stdout.write('\x1B[?25h'); // Show cursor
    }
}
exports.Spinner = Spinner;
//# sourceMappingURL=spinner.js.map