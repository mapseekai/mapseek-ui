/** SVG 文本 → <img> 可用的 data URI。经 <img> 渲染的 SVG 不执行脚本。 */
export function svgDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
