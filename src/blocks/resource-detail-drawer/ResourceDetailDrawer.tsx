import { type CSSProperties, useState } from "react"
import { IconCopy, IconDownload, IconPencil, IconScissors } from "@tabler/icons-react"
import { Button } from "../../components/button"
import { Checkbox } from "../../components/checkbox"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../components/sheet"
import { Textarea } from "../../components/textarea"
import { PlaceholderGlyph } from "../placeholder-glyph"
import { cn } from "../../lib/utils"
import { svgDataUri } from "../../lib/svg-data-uri"
import type { FontDetail, IconDetail, ResourceDetailDrawerProps, SpriteDetail } from "./types"

const CHECKER: CSSProperties = {
  background:
    "repeating-conic-gradient(var(--background) 0% 25%, color-mix(in oklch, var(--muted-foreground) 8%, transparent) 0% 50%) 50% / 10px 10px",
}

const DRAWER_FOOTER_CLASS =
  "sticky bottom-0 z-10 mt-auto flex gap-1.5 border-t border-border bg-background px-4 py-3"

const DRAWER_PANEL_FOOTER_CLASS =
  "sticky bottom-0 z-10 -mx-2.5 -mb-2.5 mt-3 flex gap-1.5 border-t border-border bg-muted p-2.5"

function fontClass(family: FontDetail["family"]): string {
  return family === "mono" ? "font-mono" : "font-sans"
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 font-mono text-[10px] tracking-[0.06em] text-muted-foreground uppercase">
      {children}
    </div>
  )
}

function KVRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2 py-[5px] text-[11.5px]">
      <span className="text-muted-foreground">{k}</span>
      <span className="max-w-[180px] truncate text-right font-mono text-[11px] text-foreground">
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
  onClose,
  onEditSprite,
  onCopy,
  onDownload,
  onRunSlice,
  className,
}: ResourceDetailDrawerProps) {
  const wide = detail.kind !== "icon"
  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className={cn(wide ? "w-[460px]" : "w-[380px]", className)}>
        <SheetHeader className="pr-12">
          <SheetTitle className="truncate text-[15px]">{detail.title}</SheetTitle>
          <SheetDescription className="truncate font-mono text-[11.5px]">
            {detail.subtitle}
          </SheetDescription>
        </SheetHeader>

        <SheetBody>
          {detail.kind === "icon" && (
            <IconBody detail={detail} onCopy={onCopy} onDownload={onDownload} />
          )}
          {detail.kind === "sprite" && (
            <SpriteBody detail={detail} onEditSprite={onEditSprite} onDownload={onDownload} />
          )}
          {detail.kind === "font" && (
            <FontBody detail={detail} onDownload={onDownload} onRunSlice={onRunSlice} />
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
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
          <img src={svgDataUri(detail.svg)} alt="" className="h-14 w-14 object-contain" />
        ) : (
          <PlaceholderGlyph size={72} seed={detail.seed} />
        )}
      </div>
      <div className="border-b border-border px-4 py-3.5">
        {detail.rows.map((r) => (
          <KVRow key={r.k} k={r.k} v={r.v} />
        ))}
      </div>
      <div className="border-b border-border px-4 py-3.5">
        <SectionTitle>{detail.tagsTitle}</SectionTitle>
        <div className="flex flex-wrap gap-1">
          {detail.tags.map((t, i) => (
            <span
              key={i}
              className="border border-border bg-muted px-1.5 py-0.5 font-mono text-[10.5px] font-medium text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="border-b border-border px-4 py-3.5">
        <SectionTitle>{detail.sizesTitle}</SectionTitle>
        <div className="grid grid-cols-3 gap-1.5">
          {detail.sizes.map((s) => (
            <div
              key={s}
              className="flex flex-col items-center gap-1 border border-border bg-muted p-2"
            >
              <PlaceholderGlyph size={s} seed={detail.seed} />
              <span className="font-mono text-[9px] font-medium text-muted-foreground uppercase">
                {s}px
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={DRAWER_FOOTER_CLASS}>
        <Button variant="outline" size="sm" className="flex-1" onClick={onCopy}>
          <IconCopy size={12} stroke={1.75} />
          {detail.copyLabel}
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={onDownload}>
          <IconDownload size={12} stroke={1.75} />
          {detail.downloadLabel}
        </Button>
      </div>
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
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex min-h-[200px] items-center justify-center border-b border-border bg-muted p-6">
        {detail.previewUrl ? (
          <img
            src={detail.previewUrl}
            alt=""
            className="max-h-full max-w-full border border-border object-contain"
            style={CHECKER}
          />
        ) : (
          <div
            className="grid border border-border"
            style={{
              ...CHECKER,
              gridTemplateColumns: `repeat(${detail.cols}, 36px)`,
            }}
          >
            {detail.previewSeeds.slice(0, 32).map((seed, i) => (
              <div key={i} className="grid size-9 place-items-center">
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
            {detail.sources.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 border border-border px-2.5 py-1.5 text-xs"
              >
                <span>{s.label}</span>
                <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">{s.tag}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="border-b border-border px-4 py-3.5">
        <SectionTitle>{detail.infoTitle}</SectionTitle>
        {detail.infoRows.map((r) => (
          <KVRow key={r.k} k={r.k} v={r.v} />
        ))}
      </div>
      <div className="border-b border-border px-4 py-3.5">
        <SectionTitle>{detail.filesTitle}</SectionTitle>
        <div className="flex flex-col gap-1.5">
          {detail.files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 border border-border px-2.5 py-1.5">
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[11.5px]">{f.name}</div>
                <div className="text-[10px] text-muted-foreground">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={DRAWER_FOOTER_CLASS}>
        <Button size="sm" className="flex-1" onClick={onEditSprite}>
          <IconPencil size={12} stroke={1.75} />
          {detail.editLabel}
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={onDownload}>
          <IconDownload size={12} stroke={1.75} />
          {detail.downloadLabel}
        </Button>
      </div>
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

  const totalSelected = selected.reduce((sum, id) => {
    const c = slicing?.charsets.find((x) => x.id === id)
    return sum + (c ? c.glyphs : 0)
  }, 0)
  const estMb = Math.round((totalSelected / 3000) * 100) / 100

  return (
    <div className="flex min-h-full flex-col">
      <div
        className={cn(
          "flex min-h-[140px] flex-col items-center justify-center gap-2 border-b border-border bg-muted p-6 text-5xl leading-none font-semibold",
          fontClass(detail.family),
        )}
      >
        <div>{detail.specimen}</div>
        <div className="font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
          {detail.title.toUpperCase()}
        </div>
      </div>
      <div className="border-b border-border px-4 py-3.5">
        {detail.rows.map((r) => (
          <KVRow key={r.k} k={r.k} v={r.v} />
        ))}
      </div>
      <div className="border-b border-border px-4 py-3.5">
        <SectionTitle>{detail.sampleTitle}</SectionTitle>
        <div
          className={cn(
            "border border-border bg-muted px-3 py-2.5 text-lg leading-relaxed",
            fontClass(detail.family),
          )}
        >
          {detail.sample}
        </div>
      </div>

      {slicing && !open && (
        <div className={DRAWER_FOOTER_CLASS}>
          <Button size="sm" className="flex-1" onClick={() => setOpen(true)}>
            <IconScissors size={12} stroke={1.75} />
            {slicing.configureLabel}
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={onDownload}>
            <IconDownload size={12} stroke={1.75} />
            {slicing.downloadLabel}
          </Button>
        </div>
      )}
      {!slicing && detail.downloadLabel && (
        <div className={DRAWER_FOOTER_CLASS}>
          <Button variant="outline" size="sm" className="flex-1" onClick={onDownload}>
            <IconDownload size={12} stroke={1.75} />
            {detail.downloadLabel}
          </Button>
        </div>
      )}
      {slicing && open && (
        <div className="px-4 py-3.5">
          <div className="mb-2 flex items-center font-mono text-[10px] tracking-[0.06em] text-muted-foreground uppercase">
            <span>{slicing.panelTitle}</span>
            <button
              type="button"
              className="ml-auto cursor-pointer text-[10px] tracking-normal text-muted-foreground normal-case"
              onClick={() => setOpen(false)}
            >
              {slicing.collapseLabel}
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {slicing.charsets.map((c) => {
              const isSel = selected.includes(c.id)
              return (
                <label
                  key={c.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 border border-border px-2 py-1.5",
                    isSel ? "bg-primary/5" : "bg-background",
                  )}
                >
                  <Checkbox
                    checked={isSel}
                    onCheckedChange={() =>
                      setSelected((s) => (isSel ? s.filter((x) => x !== c.id) : [...s, c.id]))
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11.5px] font-medium">{c.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {c.range} · {c.glyphs.toLocaleString()}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{c.size}</span>
                </label>
              )
            })}
          </div>
          <div className="mt-3 mb-2 font-mono text-[10px] tracking-[0.06em] text-muted-foreground uppercase">
            {slicing.customTitle}
          </div>
          <Textarea
            rows={2}
            className="resize-y p-2 font-mono text-[11px]"
            value={customChars}
            onChange={(e) => setCustomChars(e.target.value)}
            placeholder={slicing.customPlaceholder}
          />
          <div className="mt-3 border border-border bg-muted p-2.5">
            <KVRow k={slicing.rawSizeLabel} v={slicing.rawSizeValue} />
            <div className="flex justify-between gap-2 py-[5px] text-[11.5px]">
              <span className="text-muted-foreground">{slicing.estimateLabel}</span>
              <span className="font-mono text-[11px] text-primary">~{estMb} MB</span>
            </div>
            <KVRow
              k={slicing.selectedLabel}
              v={`${totalSelected.toLocaleString()} + ${customChars.length}`}
            />
          </div>
          <div className={DRAWER_PANEL_FOOTER_CLASS}>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setOpen(false)}>
              {slicing.cancelLabel}
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onRunSlice?.(selected, customChars)}
            >
              <IconScissors size={12} stroke={1.75} />
              {slicing.runLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
