export function pnpmCommand(...args: readonly string[]): string[] {
  return ["pnpm", ...args]
}

export function dlxCommand(...args: readonly string[]): string[] {
  return pnpmCommand("dlx", ...args)
}
