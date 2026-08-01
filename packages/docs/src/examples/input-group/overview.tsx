import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@registry/ui/input-group"
import { IconSearch } from "@tabler/icons-react"

export function InputGroupOverviewDemo() {
  return (
    <div className="grid max-w-3xl gap-8" data-demo="input-group-overview">
      <section className="space-y-3" data-demo="input-group-prefix">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Icon prefix
        </h4>
        <InputGroup>
          <InputGroupAddon>
            <IconSearch size={14} stroke={1.75} />
          </InputGroupAddon>
          <InputGroupInput aria-label="Search layers" placeholder="Search layers..." />
        </InputGroup>
      </section>

      <section className="space-y-3" data-demo="input-group-suffix">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Text suffix
        </h4>
        <InputGroup>
          <InputGroupInput aria-label="Longitude" placeholder="0.00000" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>deg</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </section>

      <section className="space-y-3" data-demo="input-group-invalid">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Invalid
        </h4>
        <InputGroup>
          <InputGroupInput aria-label="Invalid EPSG code" aria-invalid defaultValue="EPSG:" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>CRS</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </section>

      <section className="space-y-3" data-demo="input-group-textarea">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Block addon
        </h4>
        <InputGroup>
          <InputGroupAddon align="block-start">
            <InputGroupText>Notes</InputGroupText>
          </InputGroupAddon>
          <InputGroupTextarea aria-label="Layer notes" placeholder="Describe this layer..." />
        </InputGroup>
      </section>
    </div>
  )
}
