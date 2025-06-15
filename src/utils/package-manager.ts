import type { PackageManager } from "../types";

export function detectPackageManager(): PackageManager {
  /* eslint-disable node/no-process-env */
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent) {
    if (userAgent.startsWith("yarn")) {
      return "yarn";
    }
    else if (userAgent.startsWith("pnpm")) {
      return "pnpm";
    }
    else if (userAgent.startsWith("bun")) {
      return "bun";
    }
    else {
      return "npm";
    }
  }
  else {
    // assume npm if no user agent is set
    return "npm";
  }
};
