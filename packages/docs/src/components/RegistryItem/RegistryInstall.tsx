import { useState } from "react"

export type RegistryInstallProps = {
  readonly registryName: string
}

export function RegistryInstall({ registryName }: RegistryInstallProps) {
  const [copied, setCopied] = useState(false)
  const command = `bunx shadcn@4.8.0 add @mapseek/${registryName}`

  const copyCommand = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
  }

  return (
    <div>
      <pre>
        <code>{command}</code>
      </pre>
      <button type="button" onClick={copyCommand}>
        Copy install command
      </button>
      <span aria-live="polite">{copied ? "Command copied" : null}</span>
    </div>
  )
}
