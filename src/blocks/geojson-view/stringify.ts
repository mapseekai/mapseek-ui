/** Pretty-print a value as the GeoJSON string the viewer renders. */
export function stringifyGeoJSON(data: unknown): string {
  return JSON.stringify(data ?? {}, null, 2)
}
