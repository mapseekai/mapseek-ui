import { readFile, realpath } from "node:fs/promises"
import { createServer, type Server, type ServerResponse } from "node:http"
import { extname, resolve, sep } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const repoRoot = fileURLToPath(new URL("..", import.meta.url))
const publicRoot = resolve(repoRoot, "public")

async function respond(pathname: string, response: ServerResponse): Promise<void> {
  let decoded: string
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    response.writeHead(400).end("Bad request")
    return
  }
  if (!decoded.startsWith("/")) {
    response.writeHead(404).end("Not found")
    return
  }
  const file = resolve(publicRoot, `.${decoded}`)
  if (file !== publicRoot && !file.startsWith(`${publicRoot}${sep}`)) {
    response.writeHead(403).end("Forbidden")
    return
  }
  let realPublicRoot: string
  let realFile: string
  try {
    ;[realPublicRoot, realFile] = await Promise.all([realpath(publicRoot), realpath(file)])
  } catch {
    response.writeHead(404).end("Not found")
    return
  }
  if (realFile !== realPublicRoot && !realFile.startsWith(`${realPublicRoot}${sep}`)) {
    response.writeHead(403).end("Forbidden")
    return
  }
  const source = await readFile(realFile)
  response
    .writeHead(200, {
      "content-type":
        decoded.startsWith("/r/") && decoded.endsWith(".json")
          ? "application/json; charset=utf-8"
          : contentType(realFile),
    })
    .end(source)
}

function contentType(path: string): string {
  const extension = extname(path)
  if (extension === ".html") return "text/html; charset=utf-8"
  if (extension === ".css") return "text/css; charset=utf-8"
  if (extension === ".js") return "text/javascript; charset=utf-8"
  if (extension === ".json") return "application/json; charset=utf-8"
  if (extension === ".svg") return "image/svg+xml"
  if (extension === ".png") return "image/png"
  if (extension === ".webp") return "image/webp"
  return "application/octet-stream"
}

export async function startRegistryServer(): Promise<Server> {
  const server = createServer((request, response) => {
    void respond(new URL(request.url ?? "/", "http://127.0.0.1").pathname, response)
  })
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject)
    server.listen(4174, "127.0.0.1", resolve)
  })
  return server
}

export async function withRegistryServer<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
  const server = await startRegistryServer()
  try {
    const ready = await fetch("http://127.0.0.1:4174/r/registry.json")
    if (!ready.ok) throw new Error("Registry server readiness failed")
    return await run("http://127.0.0.1:4174")
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await startRegistryServer()
