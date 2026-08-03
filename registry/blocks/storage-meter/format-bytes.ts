/** Human-readable byte formatter (1.23 GB / 456 MB / 12.3 KB). */
export function formatBytes(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "—"
  const units = ["B", "KB", "MB", "GB", "TB"]
  let i = 0
  let v = n
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i += 1
  }
  const precision = v >= 100 || i === 0 ? 0 : v >= 10 ? 1 : 2
  return `${v.toFixed(precision)} ${units[i]}`
}
