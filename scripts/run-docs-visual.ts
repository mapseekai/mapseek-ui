import { spawn } from "node:child_process"
import { tsxCommand } from "./pnpm-command"

type VisualCheck = {
  readonly name: string
  readonly args: readonly string[]
}

const checks: readonly VisualCheck[] = [
  { name: "onboarding", args: ["--case", "onboarding", "--port", "4175"] },
  { name: "pilots", args: ["--case", "pilots", "--port", "4176"] },
  { name: "primitive pages", args: ["--category", "primitive", "--port", "4177"] },
  { name: "block pages", args: ["--category", "block", "--port", "4178"] },
]

function tail(output: string): string {
  return output.length > 6000 ? output.slice(-6000) : output
}

for (const check of checks) {
  const [executable, ...args] = tsxCommand("scripts/docs-visual-qa.ts", ...check.args)
  const child = spawn(executable, args, {
    cwd: `${import.meta.dirname}/..`,
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

  if (output.exitCode !== 0) {
    console.error(`Docs visual ${check.name} failed.`)
    if (output.stdout.trim()) console.error(tail(output.stdout))
    if (output.stderr.trim()) console.error(tail(output.stderr))
    process.exit(output.exitCode ?? 1)
  }

  console.log(`Docs visual ${check.name} passed.`)
}
