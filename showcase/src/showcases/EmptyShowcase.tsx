import { Button } from "@registry/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@registry/ui/empty"
import { Separator } from "@registry/ui/separator"
import { IconBox, IconMap2, IconSearch } from "@tabler/icons-react"
import type { LocalizedDemoProps } from "./types"

export function EmptyOverviewDemo(_props: LocalizedDemoProps) {
  return (
    <div className="grid w-full max-w-xl">
      <Empty data-demo="empty-default">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconBox size={16} stroke={1.5} />
          </EmptyMedia>
          <EmptyTitle>No datasets</EmptyTitle>
          <EmptyDescription>Upload your first dataset to get started.</EmptyDescription>
        </EmptyHeader>
      </Empty>

      <Separator />

      <Empty data-demo="empty-action">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconMap2 size={16} stroke={1.5} />
          </EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>Create a new project or open an existing one.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm">New project</Button>
        </EmptyContent>
      </Empty>

      <Separator />

      <Empty data-demo="empty-no-action">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconSearch size={16} stroke={1.5} />
          </EmptyMedia>
          <EmptyTitle>No layers found</EmptyTitle>
          <EmptyDescription>Try a different search term or filter.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
