import { IconButton } from "@registry/ui/icon-button"
import { IconDownload, IconPencil, IconRefresh, IconTrash } from "@tabler/icons-react"

const iconProps = { size: 14, stroke: 1.75 } as const

export function IconButtonOverviewDemo() {
  return (
    <div className="space-y-8" data-demo="icon-button-overview">
      <section className="space-y-3" data-demo="icon-button-default">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Default md
        </h4>
        <div className="flex gap-2">
          <IconButton aria-label="Edit layer" title="Edit layer">
            <IconPencil {...iconProps} />
          </IconButton>
          <IconButton aria-label="Download layer" title="Download layer">
            <IconDownload {...iconProps} />
          </IconButton>
          <IconButton aria-label="Refresh layer" title="Refresh layer">
            <IconRefresh {...iconProps} />
          </IconButton>
        </div>
      </section>

      <section className="space-y-3" data-demo="icon-button-small">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Small</h4>
        <div className="flex gap-2">
          <IconButton size="sm" aria-label="Edit small layer" title="Edit small layer">
            <IconPencil {...iconProps} />
          </IconButton>
          <IconButton size="sm" aria-label="Download small layer" title="Download small layer">
            <IconDownload {...iconProps} />
          </IconButton>
        </div>
      </section>

      <section className="space-y-3" data-demo="icon-button-danger">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Danger
        </h4>
        <div className="flex gap-2">
          <IconButton danger aria-label="Delete layer" title="Delete layer">
            <IconTrash {...iconProps} />
          </IconButton>
          <IconButton danger size="sm" aria-label="Delete small layer" title="Delete small layer">
            <IconTrash {...iconProps} />
          </IconButton>
          <IconButton aria-label="Disabled refresh" title="Disabled refresh" disabled>
            <IconRefresh {...iconProps} />
          </IconButton>
        </div>
      </section>
    </div>
  )
}
