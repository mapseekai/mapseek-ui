import { spawn, spawnSync, type ChildProcess } from "node:child_process"

const packageManager = process.platform === "win32" ? "pnpm.cmd" : "pnpm"
const children: ChildProcess[] = []
let stopping = false

function stopAll(exitCode: number): void {
  if (stopping) return
  stopping = true
  for (const child of children) {
    if (process.platform === "win32" && child.pid) {
      spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" })
    } else {
      child.kill()
    }
  }
  process.exitCode = exitCode
}

function start(command: readonly string[]): ChildProcess {
  const [executable, ...args] = command
  if (!executable) throw new Error("Missing development command")
  const child = spawn(executable, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  })
  children.push(child)
  child.once("error", (error) => {
    console.error(error)
    stopAll(1)
  })
  child.once("exit", (code) => {
    if (!stopping && code !== 0) stopAll(code ?? 1)
  })
  return child
}

start([packageManager, "--filter", "@mapseek/docs", "dev"])
start([packageManager, "run", "showcase:dev"])

process.once("SIGINT", () => stopAll(0))
process.once("SIGTERM", () => stopAll(0))
