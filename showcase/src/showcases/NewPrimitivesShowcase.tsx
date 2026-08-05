import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@registry/ui/alert-dialog"
import { AspectRatio } from "@registry/ui/aspect-ratio"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@registry/ui/breadcrumb"
import { Button } from "@registry/ui/button"
import { ButtonGroup, ButtonGroupText } from "@registry/ui/button-group"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@registry/ui/hover-card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@registry/ui/item"
import { Kbd, KbdGroup } from "@registry/ui/kbd"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@registry/ui/menubar"
import { NativeSelect, NativeSelectOption } from "@registry/ui/native-select"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@registry/ui/navigation-menu"
import { ScrollArea } from "@registry/ui/scroll-area"
import { Spinner } from "@registry/ui/spinner"
import { IconMapPin, IconPhoto } from "@tabler/icons-react"
import type { LocalizedDemoProps } from "./types"

const imageryTileLabels = Array.from({ length: 12 }, (_, index) => `Imagery tile ${index + 1}`)

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
        {title}
      </h4>
      {children}
    </section>
  )
}

export function AlertDialogOverviewDemo(_props: LocalizedDemoProps) {
  return (
    <Section title="Confirmation dialog">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive">Delete layer</Button>} />
        <AlertDialogContent data-demo="alert-dialog-content">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “boundaries-2026”?</AlertDialogTitle>
            <AlertDialogDescription>
              This action permanently removes the selected layer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Section>
  )
}

export function AspectRatioOverviewDemo(_props: LocalizedDemoProps) {
  return (
    <Section title="16:9 content frame">
      <AspectRatio ratio={16 / 9} className="max-w-xl border border-border bg-muted">
        <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
          16:9 map preview
        </div>
      </AspectRatio>
    </Section>
  )
}

export function BreadcrumbOverviewDemo(_props: LocalizedDemoProps) {
  return (
    <Section title="Resource path">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#breadcrumb">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#breadcrumb">Coastal survey</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Layers</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Section>
  )
}

export function ButtonGroupOverviewDemo(_props: LocalizedDemoProps) {
  return (
    <Section title="Grouped actions">
      <ButtonGroup>
        <Button variant="outline" size="sm">
          Zoom in
        </Button>
        <Button variant="outline" size="sm">
          Zoom out
        </Button>
        <ButtonGroupText>1:20,000</ButtonGroupText>
      </ButtonGroup>
    </Section>
  )
}

export function HoverCardOverviewDemo(_props: LocalizedDemoProps) {
  return (
    <Section title="Preview on hover or focus">
      <HoverCard>
        <HoverCardTrigger render={<Button variant="outline">Layer owner</Button>} />
        <HoverCardContent data-demo="hover-card-content" className="space-y-1">
          <p className="font-medium">Mapseek Survey Team</p>
          <p className="text-muted-foreground">Published 12 vector layers this month.</p>
        </HoverCardContent>
      </HoverCard>
    </Section>
  )
}

export function ItemOverviewDemo(_props: LocalizedDemoProps) {
  return (
    <Section title="Compact resource row">
      <ItemGroup className="max-w-xl">
        <Item>
          <ItemMedia variant="icon">
            <IconMapPin />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Administrative boundaries</ItemTitle>
            <ItemDescription>Vector tile layer · EPSG:4326 · 2,847 features</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="sm">
              Open
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </Section>
  )
}

export function KbdOverviewDemo(_props: LocalizedDemoProps) {
  return (
    <Section title="Keyboard shortcut">
      <p className="text-xs text-muted-foreground">
        Search the current workspace with{" "}
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        .
      </p>
    </Section>
  )
}

export function MenubarOverviewDemo(_props: LocalizedDemoProps) {
  return (
    <Section title="Desktop menu">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent data-demo="menubar-file-content">
            <MenubarItem>
              New layer <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>Import data</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Close project</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Toggle grid</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Section>
  )
}

export function NativeSelectOverviewDemo(_props: LocalizedDemoProps) {
  return (
    <Section title="Browser-native select">
      <NativeSelect aria-label="Coordinate reference system" defaultValue="epsg4326">
        <NativeSelectOption value="epsg4326">EPSG:4326</NativeSelectOption>
        <NativeSelectOption value="epsg3857">EPSG:3857</NativeSelectOption>
      </NativeSelect>
    </Section>
  )
}

export function NavigationMenuOverviewDemo(_props: LocalizedDemoProps) {
  return (
    <Section title="Disclosure navigation">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Workspace</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-56 gap-1 p-1">
                <NavigationMenuLink href="#navigation-menu">Recent maps</NavigationMenuLink>
                <NavigationMenuLink href="#navigation-menu">Shared layers</NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </Section>
  )
}

export function ScrollAreaOverviewDemo(_props: LocalizedDemoProps) {
  return (
    <Section title="Contained overflow">
      <ScrollArea className="h-36 w-full max-w-xl border border-border">
        <div className="space-y-2 p-3">
          {imageryTileLabels.map((label) => (
            <div key={label} className="flex items-center gap-2 text-xs">
              <IconPhoto className="size-3.5 text-muted-foreground" /> {label}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Section>
  )
}

export function SpinnerOverviewDemo(_props: LocalizedDemoProps) {
  return (
    <Section title="Loading state">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Spinner /> Loading map tiles…
      </div>
    </Section>
  )
}
