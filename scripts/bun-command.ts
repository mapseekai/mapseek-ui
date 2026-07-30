export function bunCommand(...args: readonly string[]): string[] {
  return [process.execPath, ...args]
}
