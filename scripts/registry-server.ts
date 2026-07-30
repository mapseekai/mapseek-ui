import { realpath } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { resolve, sep } from "node:path"

const repoRoot = fileURLToPath(new URL("..", import.meta.url))
const publicRoot = resolve(repoRoot, "public")

async function response(pathname: string): Promise<Response> {
  let decoded: string
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    return new Response("Bad request", { status: 400 })
  }
  if (!decoded.startsWith("/")) return new Response("Not found", { status: 404 })
  const file = resolve(publicRoot, `.${decoded}`)
  if (file !== publicRoot && !file.startsWith(`${publicRoot}${sep}`)) return new Response("Forbidden", { status: 403 })
  let realPublicRoot: string
  let realFile: string
  try {
    [realPublicRoot, realFile] = await Promise.all([realpath(publicRoot), realpath(file)])
  } catch {
    return new Response("Not found", { status: 404 })
  }
  if (realFile !== realPublicRoot && !realFile.startsWith(`${realPublicRoot}${sep}`)) return new Response("Forbidden", { status: 403 })
  const source = Bun.file(realFile)
  return new Response(source, { headers: { "content-type": decoded.startsWith("/r/") && decoded.endsWith(".json") ? "application/json; charset=utf-8" : source.type || "application/octet-stream" } })
}
export function startRegistryServer() {
  return Bun.serve({ hostname: "127.0.0.1", port: 4174, fetch(request) { return response(new URL(request.url).pathname) } })
}

export async function withRegistryServer<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
  const server = startRegistryServer()
  try {
    const ready = await fetch("http://127.0.0.1:4174/r/registry.json")
    if (!ready.ok) throw new Error("Registry server readiness failed")
    return await run("http://127.0.0.1:4174")
  } finally {
    server.stop(true)
  }
}

if (import.meta.main) startRegistryServer()
