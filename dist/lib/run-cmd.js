"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCmd = runCmd;
const execa_1 = require("execa");
async function runCmd(cmd, args, opts = {}) {
    const result = await (0, execa_1.execa)(cmd, args, { stdio: 'inherit', ...opts });
    return result;
}
//# sourceMappingURL=run-cmd.js.map