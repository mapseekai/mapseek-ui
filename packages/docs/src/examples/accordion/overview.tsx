import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@registry/ui/accordion"

export function AccordionOverviewDemo() {
  return (
    <div className="grid gap-8 md:grid-cols-2" data-demo="accordion-overview">
      <section className="space-y-3" data-demo="accordion-single">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Single section
        </h4>
        <Accordion defaultValue={["item-1"]} className="max-w-lg">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is Mapseek?</AccordionTrigger>
            <AccordionContent>
              Mapseek is an AI-native geospatial platform for vector editing and data management.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Supported formats?</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                GeoJSON, TopoJSON, Zipped Shapefile, KML, and GPX.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Max upload size?</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">500 MB per file.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="space-y-3" data-demo="accordion-multiple">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Multiple sections
        </h4>
        <Accordion multiple>
          <AccordionItem value="item-4">
            <AccordionTrigger>Coordinate reference systems</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Supports EPSG:4326, EPSG:3857, and custom CRS definitions.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Topology-preserving edits</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Shared boundaries update together to avoid gaps and overlaps.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  )
}
