import {
  IconChevronLeft,
  IconCurrentLocation,
  IconMapPin,
  IconSearch,
  IconX,
} from "@tabler/icons-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { resolveLabels } from "@/lib/mapseek-labels"
import { cn } from "@/lib/utils"

import { parseCoordinate } from "./coordinates"
import { DEFAULT_MAP_SEARCH_LABELS } from "./defaults"
import type { MapSearchLabels } from "./labels"
import type { MapSearchProps, PlaceSearchResult } from "./types"

type SearchState = "idle" | "loading" | "success" | "error"
type LocateState = "idle" | "loading" | "error"

function coordinateError(
  raw: string,
  min: number,
  max: number,
  touched: boolean,
  rangeMessage: string,
  labels: MapSearchLabels,
): string | null {
  const result = parseCoordinate(raw, min, max)
  if (result.error === "range") return rangeMessage
  if (!touched || result.error === null) return null
  return result.error === "required" ? labels.coordinateRequired : labels.coordinateInvalid
}

function PlaceResult({
  place,
  selected,
  onSelect,
}: {
  place: PlaceSearchResult
  selected: boolean
  onSelect: () => void
}) {
  return (
    <Button
      type="button"
      role="option"
      aria-selected={selected}
      variant="ghost"
      className="h-auto w-full justify-start px-2 py-2 text-start whitespace-normal"
      onClick={onSelect}
    >
      <IconMapPin data-icon="inline-start" />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-medium">{place.name}</span>
        <span className="truncate text-[11px] text-muted-foreground">
          {place.description ?? `${place.longitude}, ${place.latitude}`}
        </span>
      </span>
    </Button>
  )
}

function MapSearch({
  onSearchPlace,
  onSelectPlace,
  onLocatePlace,
  onLocateCoordinates,
  defaultTab = "place",
  defaultCollapsed = false,
  searchDelay = 300,
  labels: labelsProp,
  className,
}: MapSearchProps) {
  const labels = resolveLabels(DEFAULT_MAP_SEARCH_LABELS, labelsProp)
  const [tab, setTab] = React.useState(defaultTab)
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)
  const [query, setQuery] = React.useState("")
  const [selectedPlaceId, setSelectedPlaceId] = React.useState<string | null>(null)
  const [results, setResults] = React.useState<PlaceSearchResult[]>([])
  const [searchState, setSearchState] = React.useState<SearchState>("idle")
  const [locateState, setLocateState] = React.useState<LocateState>("idle")
  const [longitude, setLongitude] = React.useState("")
  const [latitude, setLatitude] = React.useState("")
  const [longitudeTouched, setLongitudeTouched] = React.useState(false)
  const [latitudeTouched, setLatitudeTouched] = React.useState(false)
  const activeSearchRef = React.useRef<AbortController | null>(null)
  const expandButtonRef = React.useRef<HTMLButtonElement>(null)
  const placeInputId = React.useId()
  const longitudeInputId = React.useId()
  const latitudeInputId = React.useId()
  const longitudeErrorId = React.useId()
  const latitudeErrorId = React.useId()

  React.useEffect(() => {
    if (collapsed) expandButtonRef.current?.focus()
  }, [collapsed])

  React.useEffect(() => {
    const keyword = query.trim()
    if (!keyword) {
      activeSearchRef.current?.abort()
      activeSearchRef.current = null
      setResults([])
      setSearchState("idle")
      return
    }

    const controller = new AbortController()
    activeSearchRef.current?.abort()
    activeSearchRef.current = controller
    const timer = window.setTimeout(async () => {
      setSearchState("loading")
      try {
        const nextResults = await onSearchPlace(keyword, controller.signal)
        if (!controller.signal.aborted) {
          setResults(nextResults)
          setSearchState("success")
        }
      } catch {
        if (!controller.signal.aborted) setSearchState("error")
      }
    }, searchDelay)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [onSearchPlace, query, searchDelay])

  const longitudeError = coordinateError(
    longitude,
    -180,
    180,
    longitudeTouched,
    labels.longitudeRange,
    labels,
  )
  const latitudeError = coordinateError(
    latitude,
    -90,
    90,
    latitudeTouched,
    labels.latitudeRange,
    labels,
  )

  function clearPlace() {
    activeSearchRef.current?.abort()
    activeSearchRef.current = null
    setQuery("")
    setSelectedPlaceId(null)
    setResults([])
    setSearchState("idle")
    setLocateState("idle")
  }

  async function locatePlace() {
    const keyword = query.trim()
    if (!keyword || locateState === "loading") return

    setLocateState("loading")
    try {
      await onLocatePlace(keyword)
      setLocateState("idle")
    } catch {
      setLocateState("error")
    }
  }

  function clearCoordinates() {
    setLongitude("")
    setLatitude("")
    setLongitudeTouched(false)
    setLatitudeTouched(false)
  }

  function locateCoordinates() {
    setLongitudeTouched(true)
    setLatitudeTouched(true)
    const longitudeResult = parseCoordinate(longitude, -180, 180)
    const latitudeResult = parseCoordinate(latitude, -90, 90)
    if (longitudeResult.error !== null || latitudeResult.error !== null) return

    onLocateCoordinates({
      longitude: longitudeResult.value,
      latitude: latitudeResult.value,
    })
  }

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <IconButton
              ref={expandButtonRef}
              data-slot="map-search-trigger"
              aria-label={labels.expand}
              onClick={() => setCollapsed(false)}
            >
              <IconSearch />
            </IconButton>
          }
        />
        <TooltipContent>{labels.expand}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tabs
      data-slot="map-search"
      value={tab}
      onValueChange={(value) => {
        if (value === "place" || value === "coordinates") setTab(value)
      }}
      className={cn(
        "w-full max-w-sm gap-0 overflow-hidden border border-border bg-card text-card-foreground",
        className,
      )}
    >
      <div className="flex items-center border-b border-border bg-muted/40">
        <TabsList variant="line" className="min-w-0 flex-1 border-0">
          <TabsTrigger value="place">{labels.placeTab}</TabsTrigger>
          <TabsTrigger value="coordinates">{labels.coordinatesTab}</TabsTrigger>
        </TabsList>
        <Tooltip>
          <TooltipTrigger
            render={
              <IconButton size="sm" aria-label={labels.collapse} onClick={() => setCollapsed(true)}>
                <IconChevronLeft />
              </IconButton>
            }
          />
          <TooltipContent>{labels.collapse}</TooltipContent>
        </Tooltip>
      </div>

      <TabsContent value="place" className="flex flex-col gap-2 p-3">
        <Field>
          <FieldLabel htmlFor={placeInputId} className="sr-only">
            {labels.placeInputLabel}
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id={placeInputId}
              aria-label={labels.placeInputLabel}
              placeholder={labels.placePlaceholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setSelectedPlaceId(null)
                setLocateState("idle")
              }}
            />
            <InputGroupAddon align="inline-end">
              {query.length > 0 && (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <InputGroupButton
                        size="icon-xs"
                        aria-label={labels.clearPlace}
                        onClick={clearPlace}
                      >
                        <IconX />
                      </InputGroupButton>
                    }
                  />
                  <TooltipContent>{labels.clearPlace}</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger
                  render={
                    <InputGroupButton
                      size="icon-xs"
                      aria-label={labels.locatePlace}
                      aria-busy={locateState === "loading"}
                      disabled={!query.trim() || locateState === "loading"}
                      onClick={locatePlace}
                    >
                      {locateState === "loading" ? <Spinner /> : <IconCurrentLocation />}
                    </InputGroupButton>
                  }
                />
                <TooltipContent>{labels.locatePlace}</TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <div aria-live="polite" className="min-h-4 text-xs text-muted-foreground">
          {searchState === "loading" && labels.searchLoading}
          {searchState === "success" && results.length === 0 && labels.noResults}
          {searchState === "error" && (
            <span role="alert" className="text-destructive">
              {labels.searchFailed}
            </span>
          )}
          {locateState === "error" && (
            <span role="alert" className="text-destructive">
              {labels.locateFailed}
            </span>
          )}
        </div>

        {results.length > 0 && (
          <div
            role="listbox"
            aria-label={labels.resultsLabel}
            className="flex max-h-56 flex-col gap-0.5 overflow-y-auto border border-border bg-background p-1"
          >
            {results.map((place) => (
              <PlaceResult
                key={place.id}
                place={place}
                selected={selectedPlaceId === place.id}
                onSelect={() => {
                  setSelectedPlaceId(place.id)
                  setQuery(place.name)
                  onSelectPlace(place)
                }}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="coordinates" className="flex flex-col gap-3 p-3">
        <FieldGroup className="grid gap-3 @sm/field-group:grid-cols-2">
          <Field data-invalid={Boolean(longitudeError)}>
            <FieldLabel htmlFor={longitudeInputId}>{labels.longitudeLabel}</FieldLabel>
            <Input
              id={longitudeInputId}
              inputMode="decimal"
              placeholder={labels.longitudePlaceholder}
              value={longitude}
              aria-invalid={Boolean(longitudeError)}
              aria-describedby={longitudeError ? longitudeErrorId : undefined}
              onBlur={() => setLongitudeTouched(true)}
              onChange={(event) => setLongitude(event.target.value)}
            />
            <FieldError id={longitudeErrorId}>{longitudeError}</FieldError>
          </Field>
          <Field data-invalid={Boolean(latitudeError)}>
            <FieldLabel htmlFor={latitudeInputId}>{labels.latitudeLabel}</FieldLabel>
            <Input
              id={latitudeInputId}
              inputMode="decimal"
              placeholder={labels.latitudePlaceholder}
              value={latitude}
              aria-invalid={Boolean(latitudeError)}
              aria-describedby={latitudeError ? latitudeErrorId : undefined}
              onBlur={() => setLatitudeTouched(true)}
              onChange={(event) => setLatitude(event.target.value)}
            />
            <FieldError id={latitudeErrorId}>{latitudeError}</FieldError>
          </Field>
        </FieldGroup>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={clearCoordinates}>
            <IconX data-icon="inline-start" />
            {labels.clearCoordinates}
          </Button>
          <Button type="button" size="sm" onClick={locateCoordinates}>
            <IconCurrentLocation data-icon="inline-start" />
            {labels.locateCoordinates}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}

export { MapSearch }
