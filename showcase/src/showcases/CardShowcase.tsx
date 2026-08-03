import { Badge } from "@registry/ui/badge"
import { Button } from "@registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@registry/ui/card"
import type { LocalizedDemoProps } from "./types"

export function CardOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  return (
    <div className="grid max-w-3xl gap-6 md:grid-cols-2">
      <Card data-demo="card-basic">
        <CardHeader>
          <CardTitle>Dataset Details</CardTitle>
          <CardDescription>GeoJSON upload · 14.2 MB · EPSG:4326</CardDescription>
        </CardHeader>
      </Card>
      <Card data-demo="card-action">
        <CardHeader>
          <CardTitle>Road Network · v3</CardTitle>
          <CardDescription>Mapseek vector layer</CardDescription>
          <CardAction>
            <Badge variant="outline">EPSG:4326</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Hover rows in the source app for focus cues.
          </p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2" data-demo="card-footer">
        <CardHeader>
          <CardTitle>Project Export</CardTitle>
          <CardDescription>Export all layers to a TopoJSON archive.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Includes 12 layers · about 87 MB</p>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Export</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
