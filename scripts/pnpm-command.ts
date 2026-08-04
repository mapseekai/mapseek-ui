const packageManager = process.platform === "win32" ? "pnpm.cmd" : "pnpm"
const npmExecutable = process.platform === "win32" ? "npm.cmd" : "npm"

export function pnpmCommand(...args: readonly string[]): string[] {
  return [packageManager, ...args]
}

export function dlxCommand(...args: readonly string[]): string[] {
  return pnpmCommand("dlx", ...args)
}

export function npmCommand(...args: readonly string[]): string[] {
  return [npmExecutable, ...args]
}

export function tsxCommand(...args: readonly string[]): string[] {
  return [process.execPath, "--import", "tsx", ...args]
}
