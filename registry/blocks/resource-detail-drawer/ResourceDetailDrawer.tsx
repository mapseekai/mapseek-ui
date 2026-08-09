import {
  IconAlertTriangle,
  IconCopy,
  IconDownload,
  IconInbox,
  IconLoader2,
  IconPencil,
  IconScissors,
} from "@tabler/icons-react"
import { type CSSProperties, type ReactNode, useId, useState } from "react"
import { PlaceholderGlyph } from "@/components/blocks/placeholder-glyph"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tag } from "@/components/ui/tag"
import { Textarea } from "@/components/ui/textarea"
import { svgDataUri } from "@/lib/svg-data-uri"
import { cn } from "@/lib/utils"
import type {
  FontDetail,
  IconDetail,
  ResourceDetailDrawerProps,
  ResourceDetailDrawerState,
  SpriteDetail,
} from "./types"

const CHECKER: CSSProperties = {
  background:
    "repeating-conic-gradient(var(--background) 0% 25%, color-mix(in oklch, var(--muted-foreground) 8%, transparent) 0% 50%) 50% / 10px 10px",
}

const DRAWER_FOOTER_CLASS =
  "sticky bottom-0 z-10 mt-auto flex flex-col gap-1.5 border-t border-border bg-background px-4 py-3 sm:flex-row"

const DRAWER_PANEL_FOOTER_CLASS =
  "sticky bottom-0 z-10 -mx-2.5 -mb-2.5 mt-3 flex flex-col gap-1.5 border-t border-border bg-muted p-2.5 sm:flex-row"

function fontClass(family: FontDetail["family"]): string {
  return family === "mono" ? "font-mono" : "font-sans"
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2 font-mono text-label-md text-muted-foreground uppercase">{children}</h3>
  )
}

function KVRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex min-w-0 justify-between gap-2 py-[5px] text-body-md">
      <span className="min-w-0 truncate text-muted-foreground" title={k}>
        {k}
      </span>
      <span
        className="max-w-[60%] truncate text-right font-mono text-body-sm text-foreground"
        title={v}
      >
        {v}
      </span>
    </div>
  )
}

/**
 * Right-side detail drawer for a single resource. Renders an icon / sprite /
 * font body from a pre-localized view-model. Pure view except for the font
 * slicing panel, whose selection state is owned locally; the run action is
 * delegated via `onRunSlice`.
 */
export function ResourceDetailDrawer({
  detail,
  state,
  onClose,
  onEditSprite,
  onCopy,
  onDownload,
  onRunSlice,
  onRetry,
  className,
}: ResourceDetailDrawerProps) {
  if (!detail && !state) {
    return null
  }

  const wide = detail?.kind !== "icon"
  const title = state?.title ?? detail?.title ?? ""
  const description = state?.description ?? detail?.subtitle

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className={cn(
          "w-[380px] max-w-[calc(100%-2rem)] max-sm:inset-y-4 max-sm:right-4 max-sm:h-[calc(100%-2rem)] max-sm:w-[calc(100%-2rem)]",
          wide && "sm:w-[460px]",
          className,
        )}
      >
        <SheetHeader className={cn("pr-12", state && "sr-only")}>
          <SheetTitle className="truncate text-headline-md" title={title}>
            {title}
          </SheetTitle>
          {description && (
            <SheetDescription className="truncate font-mono text-body-md" title={description}>
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        <SheetBody>
          {state ? <DrawerState state={state} onRetry={onRetry} /> : null}
          {!state && detail?.kind === "icon" && (
            <IconBody detail={detail} onCopy={onCopy} onDownload={onDownload} />
          )}
          {!state && detail?.kind === "sprite" && (
            <SpriteBody detail={detail} onEditSprite={onEditSprite} onDownload={onDownload} />
          )}
          {!state && detail?.kind === "font" && (
            <FontBody detail={detail} onDownload={onDownload} onRunSlice={onRunSlice} />
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}

function DrawerState({
  state,
  onRetry,
}: {
  state: ResourceDetailDrawerState
  onRetry?: () => void
}) {
  const StateIcon =
    state.kind === "loading" ? IconLoader2 : state.kind === "error" ? IconAlertTriangle : IconInbox
  const role = state.kind === "error" ? "alert" : "status"

  return (
    <Empty
      aria-live={state.kind === "error" ? undefined : "polite"}
      className="min-h-full"
      role={role}
    >
      <EmptyHeader>
        <EmptyMedia
          className={state.kind === "error" ? "text-destructive" : undefined}
          variant="icon"
        >
          <StateIcon
            aria-hidden="true"
            className={
              state.kind === "loading" ? "animate-spin motion-reduce:animate-none" : undefined
            }
            size={16}
            stroke={1.5}
          />
        </EmptyMedia>
        <EmptyTitle>{state.title}</EmptyTitle>
        {state.description && <EmptyDescription>{state.description}</EmptyDescription>}
      </EmptyHeader>
      {state.kind === "error" && state.retryLabel && onRetry && (
        <EmptyContent>
          <Button size="sm" type="button" onClick={onRetry}>
            {state.retryLabel}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}

function IconBody({
  detail,
  onCopy,
  onDownload,
}: {
  detail: IconDetail
  onCopy?: () => void
  onDownload?: () => void
}) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex min-h-[140px] items-center justify-center border-b border-border bg-muted p-6">
        {detail.svg ? (
          <img
            src={svgDataUri(detail.svg)}
            alt={detail.title}
            width={56}
            height={56}
            className="size-14 object-contain"
          />
        ) : (
          <PlaceholderGlyph size={72} seed={detail.seed} title={detail.title} />
        )}
      </div>
      {detail.rows.length > 0 && (
        <div className="border-b border-border px-4 py-3.5">
          {detail.rows.map((r) => (
            <KVRow key={r.k} k={r.k} v={r.v} />
          ))}
        </div>
      )}
      {detail.tags.length > 0 && (
        <div className="border-b border-border px-4 py-3.5">
          <SectionTitle>{detail.tagsTitle}</SectionTitle>
          <div className="flex flex-wrap gap-1">
            {detail.tags.map((t) => (
              <Tag key={t} className="max-w-full truncate" color="gray" size="sm" title={t}>
                {t}
              </Tag>
            ))}
          </div>
        </div>
      )}
      {detail.sizes.length > 0 && (
        <div className="border-b border-border px-4 py-3.5">
          <SectionTitle>{detail.sizesTitle}</SectionTitle>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            {detail.sizes.map((s) => (
              <div
                key={s}
                className="flex flex-col items-center gap-1 border border-border bg-muted p-2"
              >
                {detail.svg ? (
                  <img
                    src={svgDataUri(detail.svg)}
                    alt={detail.title}
                    width={s}
                    height={s}
                    style={{ width: s, height: s }}
                    className="object-contain"
                  />
                ) : (
                  <PlaceholderGlyph size={s} seed={detail.seed} />
                )}
                <span className="font-mono text-[10px] font-medium text-muted-foreground uppercase">
                  {s}px
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {(onCopy || onDownload) && (
        <div className={DRAWER_FOOTER_CLASS}>
          {onCopy && (
            <Button
              className="w-full sm:flex-1"
              size="sm"
              type="button"
              variant="outline"
              onClick={onCopy}
            >
              <IconCopy data-icon="inline-start" stroke={1.75} />
              {detail.copyLabel}
            </Button>
          )}
          {onDownload && (
            <Button
              className="w-full sm:flex-1"
              size="sm"
              type="button"
              variant="outline"
              onClick={onDownload}
            >
              <IconDownload data-icon="inline-start" stroke={1.75} />
              {detail.downloadLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function SpriteBody({
  detail,
  onEditSprite,
  onDownload,
}: {
  detail: SpriteDetail
  onEditSprite?: () => void
  onDownload?: () => void
}) {
  const previewColumns = Math.max(1, detail.cols)
  const previewWidth = detail.previewWidth ?? previewColumns * 36
  const previewHeight =
    detail.previewHeight ?? Math.max(1, Math.ceil(detail.previewSeeds.length / previewColumns)) * 36

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex min-h-[200px] items-center justify-center border-b border-border bg-muted p-6">
        {detail.previewUrl ? (
          <img
            src={detail.previewUrl}
            alt={detail.title}
            width={previewWidth}
            height={previewHeight}
            className="max-h-full max-w-full border border-border object-contain"
            style={CHECKER}
          />
        ) : (
          <div
            className="grid border border-border"
            style={{
              ...CHECKER,
              gridTemplateColumns: `repeat(${previewColumns}, 36px)`,
            }}
          >
            {detail.previewSeeds.slice(0, 32).map((seed) => (
              <div key={seed} className="grid size-9 place-items-center">
                <PlaceholderGlyph size={22} seed={seed} />
              </div>
            ))}
          </div>
        )}
      </div>
      {detail.sources && detail.sources.length > 0 && (
        <div className="border-b border-border px-4 py-3.5">
          <SectionTitle>{detail.sourceTitle}</SectionTitle>
          <div className="flex flex-col gap-1.5">
            {detail.sources.map((s) => (
              <div
                key={`${s.label}:${s.tag}`}
                className="flex min-w-0 items-center gap-2 border border-border px-2.5 py-1.5 text-body-md"
              >
                <span className="min-w-0 flex-1 truncate" title={s.label}>
                  {s.label}
                </span>
                <Tag className="max-w-[45%] shrink-0 truncate" color="gray" size="sm" title={s.tag}>
                  {s.tag}
                </Tag>
              </div>
            ))}
          </div>
        </div>
      )}
      {detail.infoRows.length > 0 && (
        <div className="border-b border-border px-4 py-3.5">
          <SectionTitle>{detail.infoTitle}</SectionTitle>
          {detail.infoRows.map((r) => (
            <KVRow key={r.k} k={r.k} v={r.v} />
          ))}
        </div>
      )}
      {detail.files.length > 0 && (
        <div className="border-b border-border px-4 py-3.5">
          <SectionTitle>{detail.filesTitle}</SectionTitle>
          <div className="flex flex-col gap-1.5">
            {detail.files.map((f) => (
              <div
                key={`${f.name}:${f.desc}`}
                className="flex items-center gap-2 border border-border px-2.5 py-1.5"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono text-body-md" title={f.name}>
                    {f.name}
                  </div>
                  <div className="break-words text-[10px] text-muted-foreground [overflow-wrap:anywhere]">
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {(onEditSprite || onDownload) && (
        <div className={DRAWER_FOOTER_CLASS}>
          {onEditSprite && (
            <Button className="w-full sm:flex-1" size="sm" type="button" onClick={onEditSprite}>
              <IconPencil data-icon="inline-start" stroke={1.75} />
              {detail.editLabel}
            </Button>
          )}
          {onDownload && (
            <Button
              className="w-full sm:flex-1"
              size="sm"
              type="button"
              variant="outline"
              onClick={onDownload}
            >
              <IconDownload data-icon="inline-start" stroke={1.75} />
              {detail.downloadLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function FontBody({
  detail,
  onDownload,
  onRunSlice,
}: {
  detail: FontDetail
  onDownload?: () => void
  onRunSlice?: (selected: string[], customChars: string) => void
}) {
  const { slicing } = detail
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>(slicing?.defaultSelected ?? [])
  const [customChars, setCustomChars] = useState("")
  const slicePanelId = useId()
  const customCharactersId = useId()

  const totalSelected = selected.reduce((sum, id) => {
    const c = slicing?.charsets.find((x) => x.id === id)
    return sum + (c ? c.glyphs : 0)
  }, 0)
  const estMb = Math.round((totalSelected / 3000) * 100) / 100

  return (
    <div className="flex min-h-full flex-col">
      <div
        className={cn(
          "flex min-h-[140px] min-w-0 flex-col items-center justify-center gap-2 border-b border-border bg-muted p-6 text-center text-data-display",
          fontClass(detail.family),
        )}
      >
        <div className="break-words [overflow-wrap:anywhere]">{detail.specimen}</div>
        <div
          className="max-w-full truncate font-mono text-label-sm text-muted-foreground"
          title={detail.title}
        >
          {detail.title.toUpperCase()}
        </div>
      </div>
      {detail.rows.length > 0 && (
        <div className="border-b border-border px-4 py-3.5">
          {detail.rows.map((r) => (
            <KVRow key={r.k} k={r.k} v={r.v} />
          ))}
        </div>
      )}
      {detail.sample && (
        <div className="border-b border-border px-4 py-3.5">
          <SectionTitle>{detail.sampleTitle}</SectionTitle>
          <div
            className={cn(
              "break-words border border-border bg-muted px-3 py-2.5 text-headline-lg leading-relaxed [overflow-wrap:anywhere]",
              fontClass(detail.family),
            )}
          >
            {detail.sample}
          </div>
        </div>
      )}

      {slicing && !open && (onRunSlice || onDownload) && (
        <div className={DRAWER_FOOTER_CLASS}>
          {onRunSlice && (
            <Button
              aria-controls={slicePanelId}
              aria-expanded={false}
              className="w-full sm:flex-1"
              size="sm"
              type="button"
              onClick={() => setOpen(true)}
            >
              <IconScissors data-icon="inline-start" stroke={1.75} />
              {slicing.configureLabel}
            </Button>
          )}
          {onDownload && (
            <Button
              className="w-full sm:flex-1"
              size="sm"
              type="button"
              variant="outline"
              onClick={onDownload}
            >
              <IconDownload data-icon="inline-start" stroke={1.75} />
              {slicing.downloadLabel}
            </Button>
          )}
        </div>
      )}
      {!slicing && detail.downloadLabel && onDownload && (
        <div className={DRAWER_FOOTER_CLASS}>
          <Button
            className="w-full sm:flex-1"
            size="sm"
            type="button"
            variant="outline"
            onClick={onDownload}
          >
            <IconDownload data-icon="inline-start" stroke={1.75} />
            {detail.downloadLabel}
          </Button>
        </div>
      )}
      {slicing && open && (
        <div id={slicePanelId} className="px-4 py-3.5">
          <div className="mb-2 flex min-w-0 items-center font-mono text-label-md text-muted-foreground uppercase">
            <h3 className="min-w-0 truncate" title={slicing.panelTitle}>
              {slicing.panelTitle}
            </h3>
            <Button
              aria-controls={slicePanelId}
              aria-expanded={true}
              variant="ghost"
              size="sm"
              type="button"
              className="ml-auto cursor-pointer text-[10px] tracking-normal text-muted-foreground normal-case"
              onClick={() => setOpen(false)}
            >
              {slicing.collapseLabel}
            </Button>
          </div>
          <div className="flex flex-col gap-1.5">
            {slicing.charsets.map((c) => {
              const isSel = selected.includes(c.id)
              const checkboxId = `slice-charset-${c.id}`
              return (
                <label
                  key={c.id}
                  htmlFor={checkboxId}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 border border-border px-2 py-1.5",
                    isSel ? "bg-primary/5" : "bg-background",
                  )}
                >
                  <Checkbox
                    id={checkboxId}
                    checked={isSel}
                    onCheckedChange={() =>
                      setSelected((s) => (isSel ? s.filter((x) => x !== c.id) : [...s, c.id]))
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-body-md-medium" title={c.name}>
                      {c.name}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {c.range} · {c.glyphs.toLocaleString()}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{c.size}</span>
                </label>
              )
            })}
          </div>
          <label
            className="mt-3 mb-2 block font-mono text-label-md text-muted-foreground uppercase"
            htmlFor={customCharactersId}
          >
            {slicing.customTitle}
          </label>
          <Textarea
            id={customCharactersId}
            aria-label={slicing.customTitle}
            name="custom-characters"
            rows={2}
            className="resize-y p-2 font-mono text-body-sm"
            value={customChars}
            onChange={(e) => setCustomChars(e.target.value)}
            placeholder={slicing.customPlaceholder}
          />
          <div className="mt-3 border border-border bg-muted p-2.5">
            <KVRow k={slicing.rawSizeLabel} v={slicing.rawSizeValue} />
            <div className="flex justify-between gap-2 py-[5px] text-body-md">
              <span className="text-muted-foreground">{slicing.estimateLabel}</span>
              <span className="font-mono text-body-sm text-primary">~{estMb} MB</span>
            </div>
            <KVRow
              k={slicing.selectedLabel}
              v={`${totalSelected.toLocaleString()} + ${customChars.length}`}
            />
          </div>
          <div className={DRAWER_PANEL_FOOTER_CLASS}>
            <Button
              className="w-full sm:flex-1"
              size="sm"
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {slicing.cancelLabel}
            </Button>
            {onRunSlice && (
              <Button
                className="w-full sm:flex-1"
                size="sm"
                type="button"
                onClick={() => onRunSlice(selected, customChars)}
              >
                <IconScissors data-icon="inline-start" stroke={1.75} />
                {slicing.runLabel}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
