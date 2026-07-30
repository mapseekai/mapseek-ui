import { join } from "node:path"

type BunRuntimeOptions = {
  environment?: NodeJS.ProcessEnv
  execPath?: string
  isBun?: boolean
  platform?: NodeJS.Platform
}

export function resolveBunExecutable({
  environment = process.env,
  execPath = process.execPath,
  isBun = typeof Bun !== "undefined",
  platform = process.platform,
}: BunRuntimeOptions = {}): string {
  if (isBun) return execPath

  const bunInstall = environment.BUN_INSTALL
  if (!bunInstall) throw new Error("BUN_INSTALL is required to resolve Bun outside the Bun runtime")
  return join(bunInstall, "bin", platform === "win32" ? "bun.exe" : "bun")
}

export function bunCommand(...args: readonly string[]): string[] {
  return [resolveBunExecutable(), ...args]
}
