#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const cli_1 = require("~/lib/cli");
async function main() {
    try {
        await (0, cli_1.runCli)();
    }
    catch (error) {
        console.error(chalk_1.default.red('❌ Error creating project:'), error instanceof Error ? error.message : error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map