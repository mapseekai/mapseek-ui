import { describe, expect, it } from "vitest"

import {
  buildCoordinateSystemList,
  DEFAULT_COORDINATE_SYSTEM_ITEMS,
} from "./built-in-coordinate-systems"

describe("coordinate system defaults", () => {
  it("includes the four common geographic coordinate systems", () => {
    expect(
      DEFAULT_COORDINATE_SYSTEM_ITEMS.filter((item) => item.kind === "geographic").map(
        (item) => item.epsg,
      ),
    ).toEqual(["EPSG:4326", "EPSG:4490", "EPSG:4214", "EPSG:4610"])
  })

  it("includes Web Mercator plus the agreed CGCS2000 Gauss-Kruger zone ranges", () => {
    expect(
      DEFAULT_COORDINATE_SYSTEM_ITEMS.filter((item) => item.kind === "projected").map(
        (item) => item.epsg,
      ),
    ).toEqual([
      "EPSG:3857",
      "EPSG:4491",
      "EPSG:4492",
      "EPSG:4493",
      "EPSG:4494",
      "EPSG:4495",
      "EPSG:4496",
      "EPSG:4497",
      "EPSG:4498",
      "EPSG:4499",
      "EPSG:4500",
      "EPSG:4501",
      "EPSG:4513",
      "EPSG:4514",
      "EPSG:4515",
      "EPSG:4516",
      "EPSG:4517",
      "EPSG:4518",
      "EPSG:4519",
      "EPSG:4520",
      "EPSG:4521",
      "EPSG:4522",
      "EPSG:4523",
      "EPSG:4524",
      "EPSG:4525",
      "EPSG:4526",
      "EPSG:4527",
      "EPSG:4528",
      "EPSG:4529",
      "EPSG:4530",
      "EPSG:4531",
      "EPSG:4532",
      "EPSG:4533",
    ])
    expect(DEFAULT_COORDINATE_SYSTEM_ITEMS).toContainEqual({
      epsg: "EPSG:4491",
      name: "CGCS2000 / Gauss-Kruger zone 13",
      kind: "projected",
    })
    expect(DEFAULT_COORDINATE_SYSTEM_ITEMS).toContainEqual({
      epsg: "EPSG:4533",
      name: "CGCS2000 / 3-degree Gauss-Kruger zone 45",
      kind: "projected",
    })
  })

  it("does not include central-meridian or historical-datum Gauss-Kruger projections", () => {
    const epsgs = new Set(DEFAULT_COORDINATE_SYSTEM_ITEMS.map((item) => item.epsg))

    expect(epsgs).not.toContain("EPSG:4502")
    expect(epsgs).not.toContain("EPSG:4534")
    expect(epsgs).not.toContain("EPSG:2327")
    expect(epsgs).not.toContain("EPSG:2401")
  })

  it("uses the last extra item to override an EPSG and appends new coordinate systems", () => {
    const systems = buildCoordinateSystemList([
      { epsg: "EPSG:4491", name: "First override", kind: "projected" },
      { epsg: "EPSG:32650", name: "WGS 84 / UTM zone 50N", kind: "projected" },
      { epsg: "EPSG:4491", name: "Final override", kind: "projected" },
    ])

    expect(systems.find((item) => item.epsg === "EPSG:4491")).toEqual({
      epsg: "EPSG:4491",
      name: "Final override",
      kind: "projected",
    })
    expect(systems.at(-1)).toEqual({
      epsg: "EPSG:32650",
      name: "WGS 84 / UTM zone 50N",
      kind: "projected",
    })
  })
})
