import { Button } from "@registry/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@registry/ui/empty"
import { IconBox, IconMap2, IconSearch } from "@tabler/icons-react"

export function EmptyOverviewDemo() {
  return (
    <div className="grid max-w-4xl gap-5 md:grid-cols-3" data-demo="empty-overview">
      <Empty data-demo="empty-default">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconBox size={16} stroke={1.5} />
          </EmptyMedia>
          <EmptyTitle>No datasets</EmptyTitle>
          <EmptyDescription>Upload your first dataset to get started.</EmptyDescription>
        </EmptyHeader>
      </Empty>

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
