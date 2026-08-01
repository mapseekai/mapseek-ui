import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@registry/ui/accordion"
import { useLocaleLabels } from "../use-locale-labels"

export type AccordionOverviewDemoLabels = {
  readonly singleSection: string
  readonly whatIsMapseek: string
  readonly mapseekDescription: string
  readonly supportedFormats: string
  readonly supportedFormatsDescription: string
  readonly maxUploadSize: string
  readonly maxUploadSizeDescription: string
  readonly multipleSections: string
  readonly coordinateReferenceSystems: string
  readonly crsDescription: string
  readonly topologyPreservingEdits: string
  readonly topologyDescription: string
}

export const zhAccordionOverviewLabels = {
  singleSection: "单个面板",
  whatIsMapseek: "Mapseek 是什么？",
  mapseekDescription: "Mapseek 是面向矢量编辑和数据管理的 AI 原生地理空间平台。",
  supportedFormats: "支持哪些格式？",
  supportedFormatsDescription: "GeoJSON、TopoJSON、Zipped Shapefile、KML 和 GPX。",
  maxUploadSize: "最大上传大小？",
  maxUploadSizeDescription: "每个文件 500 MB。",
  multipleSections: "多个面板",
  coordinateReferenceSystems: "坐标参考系统",
  crsDescription: "支持 EPSG:4326、EPSG:3857 和自定义 CRS 定义。",
  topologyPreservingEdits: "保拓扑编辑",
  topologyDescription: "共享边界会一起更新，避免缝隙和重叠。",
} satisfies AccordionOverviewDemoLabels

export const enAccordionOverviewLabels = {
  singleSection: "Single section",
  whatIsMapseek: "What is Mapseek?",
  mapseekDescription:
    "Mapseek is an AI-native geospatial platform for vector editing and data management.",
  supportedFormats: "Supported formats?",
  supportedFormatsDescription: "GeoJSON, TopoJSON, Zipped Shapefile, KML, and GPX.",
  maxUploadSize: "Max upload size?",
  maxUploadSizeDescription: "500 MB per file.",
  multipleSections: "Multiple sections",
  coordinateReferenceSystems: "Coordinate reference systems",
  crsDescription: "Supports EPSG:4326, EPSG:3857, and custom CRS definitions.",
  topologyPreservingEdits: "Topology-preserving edits",
  topologyDescription: "Shared boundaries update together to avoid gaps and overlaps.",
} satisfies AccordionOverviewDemoLabels

export function AccordionOverviewDemo({
  labels,
}: {
  readonly labels?: AccordionOverviewDemoLabels
}) {
  const localizedLabels = useLocaleLabels({
    zh: zhAccordionOverviewLabels,
    en: enAccordionOverviewLabels,
  })
  const demoLabels = labels ?? localizedLabels

  return (
    <div className="grid gap-8 md:grid-cols-2" data-demo="accordion-overview">
      <section className="space-y-3" data-demo="accordion-single">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.singleSection}
        </h4>
        <Accordion defaultValue={["item-1"]} className="max-w-lg">
          <AccordionItem value="item-1">
            <AccordionTrigger>{demoLabels.whatIsMapseek}</AccordionTrigger>
            <AccordionContent>{demoLabels.mapseekDescription}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>{demoLabels.supportedFormats}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{demoLabels.supportedFormatsDescription}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>{demoLabels.maxUploadSize}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{demoLabels.maxUploadSizeDescription}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="space-y-3" data-demo="accordion-multiple">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.multipleSections}
        </h4>
        <Accordion multiple>
          <AccordionItem value="item-4">
            <AccordionTrigger>{demoLabels.coordinateReferenceSystems}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{demoLabels.crsDescription}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>{demoLabels.topologyPreservingEdits}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{demoLabels.topologyDescription}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  )
}
