import * as fs from "fs";
import * as path from "path";

export type PackageManager = "npm" | "yarn" | "pnpm";

export function detectPackageManager(workspacePath: string): PackageManager {
  // Check for lock files
  if (fs.existsSync(path.join(workspacePath, "yarn.lock"))) {
    return "yarn";
  }
  if (fs.existsSync(path.join(workspacePath, "pnpm-lock.yaml"))) {
    return "pnpm";
  }
  return "npm"; // Default to npm
}

export function getRunCommand(packageManager: PackageManager): string {
  switch (packageManager) {
    case "yarn":
      return "yarn";
    case "pnpm":
      return "pnpm";
    default:
      return "npm run";
  }
}
