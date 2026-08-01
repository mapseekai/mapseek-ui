import { Button } from "@registry/ui/button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@registry/ui/sheet"

export function SheetOverviewDemo() {
  return (
    <div className="flex flex-wrap gap-3" data-demo="sheet-overview">
      <Sheet>
        <SheetTrigger
          render={
            <Button data-demo="sheet-right-trigger" variant="outline">
              Open resource detail
            </Button>
          }
        />
        <SheetContent
          data-demo="sheet-right-content"
          side="right"
          className="w-[min(420px,calc(100vw-16px))]"
        >
          <SheetHeader>
            <SheetTitle>Administrative boundaries</SheetTitle>
            <SheetDescription>Review dataset metadata and publishing status.</SheetDescription>
          </SheetHeader>
          <SheetBody className="space-y-3 p-4 text-xs">
            <div>Type: vector dataset</div>
            <div>CRS: EPSG:4326</div>
            <div>Features: 2,847</div>
            <div>Storage: 2.4 MB</div>
            <div>Status: staged for publish</div>
          </SheetBody>
          <SheetFooter>
            <SheetClose
              render={
                <Button data-demo="sheet-right-close" variant="outline">
                  Close
                </Button>
              }
            />
            <Button>Open dataset</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger
          render={
            <Button data-demo="sheet-bottom-trigger" variant="outline">
              Open publish queue
            </Button>
          }
        />
        <SheetContent
          data-demo="sheet-bottom-content"
          side="bottom"
          className="max-h-[min(360px,calc(100vh-16px))]"
        >
          <SheetHeader>
            <SheetTitle>Publish queue</SheetTitle>
            <SheetDescription>Bottom sheets work for compact confirmation panels.</SheetDescription>
          </SheetHeader>
          <SheetBody className="grid gap-2 p-4 text-xs sm:grid-cols-3">
            <div className="border border-border p-2">Tiles: 18 queued</div>
            <div className="border border-border p-2">Sprites: ready</div>
            <div className="border border-border p-2">Fonts: synced</div>
          </SheetBody>
          <SheetFooter>
            <SheetClose
              render={
                <Button data-demo="sheet-bottom-close" variant="outline">
                  Close
                </Button>
              }
            />
            <Button>Publish</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
