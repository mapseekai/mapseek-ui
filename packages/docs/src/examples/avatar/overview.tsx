import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@registry/ui/avatar"
import { IconCheck } from "@tabler/icons-react"

export function AvatarOverviewDemo() {
  return (
    <div className="space-y-8" data-demo="avatar-overview">
      <section className="space-y-3">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Fallback initials
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <Avatar>
            <AvatarFallback>ZW</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>GS</AvatarFallback>
          </Avatar>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Sizes and badge
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <Avatar size="sm" data-demo="avatar-size-sm">
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <Avatar data-demo="avatar-size-default">
            <AvatarFallback>MD</AvatarFallback>
            <AvatarBadge />
          </Avatar>
          <Avatar size="lg" data-demo="avatar-size-lg">
            <AvatarFallback>LG</AvatarFallback>
            <AvatarBadge>
              <IconCheck />
            </AvatarBadge>
          </Avatar>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Group</h4>
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>RD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>QA</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>OP</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
      </section>
    </div>
  )
}
