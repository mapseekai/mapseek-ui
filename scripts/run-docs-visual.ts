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
  const child = Bun.spawn([process.execPath, "scripts/docs-visual-qa.ts", ...check.args], {
    cwd: `${import.meta.dirname}/..`,
    stdout: "pipe",
    stderr: "pipe",
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ])

  if (exitCode !== 0) {
    console.error(`Docs visual ${check.name} failed.`)
    if (stdout.trim()) console.error(tail(stdout))
    if (stderr.trim()) console.error(tail(stderr))
    process.exit(exitCode)
  }

  console.log(`Docs visual ${check.name} passed.`)
}
