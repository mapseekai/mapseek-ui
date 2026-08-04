import {
  StyleEditorPanelCard,
  StyleEditorPanelContent,
  StyleEditorPanelEmpty,
  StyleEditorPanelHeader,
  StyleEditorPanelRoot,
  StyleEditorPanelSection,
} from "@registry/blocks/style-editor-panel"
import { Badge } from "@registry/ui/badge"
import { Button } from "@registry/ui/button"
import { Input } from "@registry/ui/input"
import { Label } from "@registry/ui/label"
import { IconPlaylistAdd, IconTrash } from "@tabler/icons-react"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

type SourceItem = {
  readonly id: string
  readonly title: string
  readonly subtitle: string
  readonly tone: "dataset" | "tileset"
  readonly typeLabel: string
  readonly url?: string
}

const labels = {
  "zh-CN": {
    title: "数据源",
    add: "添加",
    active: "可用数据源",
    emptySection: "空分组",
    empty: "没有可用数据。",
    type: "类型",
    url: "URL",
    remove: "删除",
    added: "已添加临时数据源",
    removed: "已删除",
    tileset: "瓦片集",
    dataset: "数据集",
    vector: "矢量",
    raster: "栅格",
    sources: {
      openMapTiles: {
        title: "OpenMapTiles",
        subtitle: "openmaptiles",
      },
      landcover: {
        title: "地表覆盖",
        subtitle: "landcover_2026",
      },
      analysisGrid: {
        title: "分析网格",
        subtitle: "analysis_grid",
      },
    },
  },
  en: {
    title: "Sources",
    add: "Add",
    active: "Active sources",
    emptySection: "Empty section",
    empty: "No available data.",
    type: "Type",
    url: "URL",
    remove: "Remove",
    added: "Added temporary source",
    removed: "Removed",
    tileset: "Tileset",
    dataset: "Dataset",
    vector: "Vector",
    raster: "Raster",
    sources: {
      openMapTiles: {
        title: "OpenMapTiles",
        subtitle: "openmaptiles",
      },
      landcover: {
        title: "Landcover",
        subtitle: "landcover_2026",
      },
      analysisGrid: {
        title: "Analysis Grid",
        subtitle: "analysis_grid",
      },
    },
  },
}

function initialSources(demoLabels: (typeof labels)[keyof typeof labels]): SourceItem[] {
  return [
    {
      id: "openmaptiles",
      title: demoLabels.sources.openMapTiles.title,
      subtitle: demoLabels.sources.openMapTiles.subtitle,
      tone: "tileset",
      typeLabel: demoLabels.vector,
      url: "mapseek://tiles/openmaptiles",
    },
    {
      id: "landcover",
      title: demoLabels.sources.landcover.title,
      subtitle: demoLabels.sources.landcover.subtitle,
      tone: "dataset",
      typeLabel: demoLabels.raster,
    },
  ]
}

function FieldRow({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Label className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Input value={value} readOnly />
    </Label>
  )
}

export function StyleEditorPanelDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [sources, setSources] = useState(() => initialSources(demoLabels))
  const [status, setStatus] = useState(demoLabels.empty)

  function addSource() {
    const nextSource: SourceItem = {
      id: "analysis",
      title: demoLabels.sources.analysisGrid.title,
      subtitle: demoLabels.sources.analysisGrid.subtitle,
      tone: "dataset",
      typeLabel: demoLabels.raster,
    }
    setSources((current) =>
      current.some((source) => source.id === nextSource.id) ? current : [...current, nextSource],
    )
    setStatus(demoLabels.added)
  }

  function removeSource(id: string, title: string) {
    setSources((current) => current.filter((source) => source.id !== id))
    setStatus(`${demoLabels.removed}: ${title}`)
  }

  return (
    <section className="space-y-3">
      <div className="h-[520px] max-w-[420px] border border-border">
        <StyleEditorPanelRoot dataWdKey="docs:style-editor-panel">
          <StyleEditorPanelHeader
            title={demoLabels.title}
            actions={
              <Button
                type="button"
                size="sm"
                data-demo-action="style-editor-panel-add"
                onClick={addSource}
              >
                <IconPlaylistAdd />
                {demoLabels.add}
              </Button>
            }
          />
          <StyleEditorPanelContent>
            <StyleEditorPanelSection title={demoLabels.active}>
              {sources.map((source) => (
                <StyleEditorPanelCard
                  key={source.id}
                  title={source.title}
                  subtitle={source.subtitle}
                  meta={
                    <Badge variant="outline">
                      {source.tone === "tileset" ? demoLabels.tileset : demoLabels.dataset}
                    </Badge>
                  }
                  action={
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="destructive"
                      aria-label={`${demoLabels.remove}: ${source.title}`}
                      data-demo-action={`style-editor-panel-remove-${source.id}`}
                      onClick={() => removeSource(source.id, source.title)}
                    >
                      <IconTrash />
                    </Button>
                  }
                >
                  <FieldRow label={demoLabels.type} value={source.typeLabel} />
                  {source.url ? <FieldRow label={demoLabels.url} value={source.url} /> : null}
                </StyleEditorPanelCard>
              ))}
            </StyleEditorPanelSection>
            <StyleEditorPanelSection title={demoLabels.emptySection}>
              <StyleEditorPanelEmpty>{demoLabels.empty}</StyleEditorPanelEmpty>
            </StyleEditorPanelSection>
          </StyleEditorPanelContent>
        </StyleEditorPanelRoot>
      </div>
      <p data-demo-status="style-editor-panel" className="m-0 font-mono text-xs">
        {status}
      </p>
    </section>
  )
}
