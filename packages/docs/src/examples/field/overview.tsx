import { Checkbox } from "@registry/ui/checkbox"
import { Field, FieldDescription, FieldError, FieldLabel } from "@registry/ui/field"
import { Input } from "@registry/ui/input"

export function FieldOverviewDemo() {
  return (
    <div className="grid max-w-3xl gap-8" data-demo="field-overview">
      <section className="space-y-3" data-demo="field-basic">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Basic field
        </h4>
        <Field>
          <FieldLabel htmlFor="docs-field-name">Dataset Name</FieldLabel>
          <Input id="docs-field-name" placeholder="Enter name..." />
          <FieldDescription>Used as the display name in the layer list.</FieldDescription>
        </Field>
      </section>

      <section className="space-y-3" data-demo="field-invalid">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Invalid field
        </h4>
        <Field data-invalid="true">
          <FieldLabel htmlFor="docs-field-crs">CRS</FieldLabel>
          <Input id="docs-field-crs" aria-invalid defaultValue="not-a-crs" />
          <FieldError>Must be a valid EPSG code, e.g. EPSG:4326</FieldError>
        </Field>
      </section>

      <section className="space-y-3" data-demo="field-horizontal">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Horizontal control
        </h4>
        <Field orientation="horizontal">
          <Checkbox id="docs-field-topology" defaultChecked />
          <FieldLabel htmlFor="docs-field-topology">Preserve topology</FieldLabel>
        </Field>
      </section>

      <section className="space-y-3" data-demo="field-disabled">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Disabled field
        </h4>
        <Field data-disabled>
          <FieldLabel htmlFor="docs-field-locked">Locked layer id</FieldLabel>
          <Input id="docs-field-locked" value="layer-roads-01" readOnly disabled />
        </Field>
      </section>
    </div>
  )
}
