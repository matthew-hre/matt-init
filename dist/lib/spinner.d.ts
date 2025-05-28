export declare class Spinner {
    private interval;
    private frames;
    private currentFrame;
    private message;
    constructor(message: string);
    start(): void;
    updateMessage(message: string): void;
    succeed(message?: string): void;
    fail(message?: string): void;
    stop(): void;
}
//# sourceMappingURL=spinner.d.ts.map