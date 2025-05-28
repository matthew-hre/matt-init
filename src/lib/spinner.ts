import chalk from 'chalk';

export class Spinner {
    private interval: NodeJS.Timeout | null = null;
    private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    private currentFrame = 0;
    private message: string;

    constructor(message: string) {
        this.message = message;
    }

    start(): void {
        process.stdout.write('\x1B[?25l'); // Hide cursor
        this.interval = setInterval(() => {
            process.stdout.write('\r' + chalk.blue(this.frames[this.currentFrame]) + ' ' + this.message);
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        }, 80);
    }

    updateMessage(message: string): void {
        this.message = message;
    }

    succeed(message?: string): void {
        this.stop();
        process.stdout.write('\r' + chalk.green('✓') + ' ' + (message || this.message) + '\n');
    }

    fail(message?: string): void {
        this.stop();
        process.stdout.write('\r' + chalk.red('✗') + ' ' + (message || this.message) + '\n');
    }

    stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        process.stdout.write('\r\x1B[K'); // Clear line
        process.stdout.write('\x1B[?25h'); // Show cursor
    }
}