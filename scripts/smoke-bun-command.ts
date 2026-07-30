import { bunCommand } from "./bun-command"

const windowsBunxDirectory = "/mnt/d/develop/nodejs"
const command = bunCommand("x", "shadcn@4.8.0", "--version")
const child = Bun.spawn(command, {
  cwd: import.meta.dir,
  env: { ...process.env, PATH: `${windowsBunxDirectory}:${process.env.PATH ?? ""}` },
  stdout: "pipe",
  stderr: "pipe",
})
const [stdout, stderr, exitCode] = await Promise.all([
  new Response(child.stdout).text(),
  new Response(child.stderr).text(),
  child.exited,
])

if (exitCode !== 0) throw new Error(`${command.join(" ")} failed: ${stderr}`)
if (command[0] !== process.execPath || command.includes("bunx") || command.includes("npx")) {
  throw new Error(`expected an explicit Bun command, received: ${command.join(" ")}`)
}

console.log(`Linux Bun ${process.execPath} ran shadcn ${stdout.trim()}`)
