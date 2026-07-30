export function resolveLabels<T extends object>(defaults: T, overrides?: Partial<T>): T {
  return overrides ? { ...defaults, ...overrides } : defaults
}
