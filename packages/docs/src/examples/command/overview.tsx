import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@registry/ui/command"

export function CommandOverviewDemo() {
  return (
    <div className="grid gap-8" data-demo="command-overview">
      <section className="space-y-3" data-demo="command-palette">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Command palette
        </h4>
        <div className="h-72 max-w-sm border border-border">
          <Command>
            <CommandInput placeholder="Type a command..." />
            <CommandList>
              <CommandGroup heading="Layers">
                <CommandItem>Add Point Layer</CommandItem>
                <CommandItem>Add Line Layer</CommandItem>
                <CommandItem>Add Polygon Layer</CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Project">
                <CommandItem>
                  Save Project
                  <CommandShortcut>Cmd S</CommandShortcut>
                </CommandItem>
                <CommandItem>Export to GeoJSON</CommandItem>
                <CommandItem disabled>Export to Shapefile</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </section>

      <section className="space-y-3" data-demo="command-empty-state">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Empty state
        </h4>
        <div className="h-32 max-w-sm border border-border">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
          </Command>
        </div>
      </section>
    </div>
  )
}
