import { spawn } from "node:child_process"
import { dlxCommand } from "./pnpm-command"

const command = dlxCommand("shadcn@4.8.0", "--version")
const [executable, ...args] = command
if (!executable) throw new Error("Missing command executable")
const child = spawn(executable, args, {
  cwd: import.meta.dirname,
  stdio: ["ignore", "pipe", "pipe"],
})
const output = await new Promise<{ stdout: string; stderr: string; exitCode: number | null }>(
  (resolve, reject) => {
    let stdout = ""
    let stderr = ""
    child.stdout.setEncoding("utf8").on("data", (chunk) => (stdout += chunk))
    child.stderr.setEncoding("utf8").on("data", (chunk) => (stderr += chunk))
    child.once("error", reject)
    child.once("exit", (exitCode) => resolve({ stdout, stderr, exitCode }))
  },
)

if (output.exitCode !== 0) throw new Error(`${command.join(" ")} failed: ${output.stderr}`)
if (command[0] !== "pnpm" || command.includes("bunx") || command.includes("npx")) {
  throw new Error(`expected an explicit pnpm dlx command, received: ${command.join(" ")}`)
}

console.log(`pnpm dlx ran shadcn ${output.stdout.trim()}`)
