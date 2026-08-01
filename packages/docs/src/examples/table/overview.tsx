import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@registry/ui/table"

const rows = [
  { id: "feat-001", name: "Yangtze River", type: "LineString", area: "-" },
  { id: "feat-002", name: "Sichuan Basin", type: "Polygon", area: "485,000 km2" },
  { id: "feat-003", name: "Tianmen Mountain", type: "Point", area: "-" },
]

export function TableOverviewDemo() {
  return (
    <div className="max-w-lg space-y-3" data-demo="table-overview">
      <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
        Feature table
      </h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Area</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-mono">{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.area}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
