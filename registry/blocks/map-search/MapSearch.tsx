import { IconChevronLeft, IconMapPin, IconSearch, IconX } from "@tabler/icons-react"
import * as React from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

function PlaceResult({ place }: { place: PlaceSearchResult }) {
  return (
    <ComboboxItem
      value={place}
      aria-label={
        place.description
          ? `${place.name}, ${place.description}`
          : `${place.name}, ${place.longitude}, ${place.latitude}`
      }
      className="h-7 justify-start px-3 py-1 text-start data-selected:bg-selection-bg data-selected:text-primary data-selected:hover:bg-selection-bg data-selected:hover:text-primary data-selected:data-highlighted:bg-selection-bg"
    >
      <span className="flex min-w-0 flex-1 items-baseline gap-3">
        <span className="min-w-0 truncate font-medium" title={place.name}>
          {place.name}
        </span>
        <span className="min-w-0 flex-1 truncate text-body-sm text-muted-foreground">
          {place.description ?? (
            <span className="tnum">{`${place.longitude}, ${place.latitude}`}</span>
          )}
        </span>
      </span>
    </ComboboxItem>
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
  const [selectedPlace, setSelectedPlace] = React.useState<PlaceSearchResult | null>(null)
  const [results, setResults] = React.useState<PlaceSearchResult[]>([])
  const [resultsOpen, setResultsOpen] = React.useState(false)
  const [searchState, setSearchState] = React.useState<SearchState>("idle")
  const [locateState, setLocateState] = React.useState<LocateState>("idle")
  const [longitude, setLongitude] = React.useState("")
  const [latitude, setLatitude] = React.useState("")
  const [longitudeTouched, setLongitudeTouched] = React.useState(false)
  const [latitudeTouched, setLatitudeTouched] = React.useState(false)
  const activeSearchRef = React.useRef<AbortController | null>(null)
  const allowResultsOpenRef = React.useRef(false)
  const expandButtonRef = React.useRef<HTMLButtonElement>(null)
  const placeInputRef = React.useRef<HTMLInputElement>(null)
  const placeAnchorRef = useComboboxAnchor()
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
      allowResultsOpenRef.current = false
      setResults([])
      setResultsOpen(false)
      setSearchState("idle")
      return
    }

    if (selectedPlace && query === selectedPlace.name) {
      activeSearchRef.current?.abort()
      activeSearchRef.current = null
      setResultsOpen(false)
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
          setResultsOpen(
            nextResults.length > 0 &&
              allowResultsOpenRef.current &&
              placeInputRef.current === document.activeElement,
          )
          if (nextResults.length === 0) allowResultsOpenRef.current = false
          setSearchState("success")
        }
      } catch {
        if (!controller.signal.aborted) {
          allowResultsOpenRef.current = false
          setResults([])
          setResultsOpen(false)
          setSearchState("error")
        }
      }
    }, searchDelay)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [onSearchPlace, query, searchDelay, selectedPlace])

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
    allowResultsOpenRef.current = false
    setQuery("")
    setSelectedPlace(null)
    setResults([])
    setResultsOpen(false)
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
      <IconButton
        ref={expandButtonRef}
        data-slot="map-search-trigger"
        label={labels.expand}
        tooltip
        onClick={() => setCollapsed(false)}
      >
        <IconSearch />
      </IconButton>
    )
  }

  return (
    <Tabs
      data-slot="map-search"
      value={tab}
      onValueChange={(value) => {
        if (value === "place" || value === "coordinates") {
          if (value !== "place") {
            allowResultsOpenRef.current = false
            setResultsOpen(false)
          }
          setTab(value)
        }
      }}
      className={cn(
        "@container/map-search relative w-full max-w-sm gap-0 border border-border bg-card text-card-foreground",
        className,
      )}
    >
      <div className="flex h-9 items-center border-b border-border px-2">
        <TabsList variant="line" className="h-9 min-w-0 flex-1 border-0 p-0">
          <TabsTrigger value="place">{labels.placeTab}</TabsTrigger>
          <TabsTrigger value="coordinates">{labels.coordinatesTab}</TabsTrigger>
        </TabsList>
        <IconButton
          size="xs"
          label={labels.collapse}
          tooltip
          onClick={() => {
            allowResultsOpenRef.current = false
            setResultsOpen(false)
            setCollapsed(true)
          }}
        >
          <IconChevronLeft className="rtl:rotate-180" />
        </IconButton>
      </div>

      <TabsContent value="place" className="flex flex-col gap-1.5 p-2">
        <Field>
          <FieldLabel htmlFor={placeInputId} className="sr-only">
            {labels.placeInputLabel}
          </FieldLabel>
          <Combobox<PlaceSearchResult>
            value={selectedPlace}
            onValueChange={(place) => {
              if (!place) return

              activeSearchRef.current?.abort()
              activeSearchRef.current = null
              allowResultsOpenRef.current = false
              setSelectedPlace(place)
              setQuery(place.name)
              setResultsOpen(false)
              setSearchState("idle")
              setLocateState("idle")
              onSelectPlace(place)
            }}
            open={resultsOpen}
            onOpenChange={(nextOpen) => {
              if (nextOpen) return

              allowResultsOpenRef.current = false
              setResultsOpen(false)
            }}
            inputValue={query}
            onInputValueChange={(inputValue, eventDetails) => {
              if (eventDetails.reason === "input-change" || eventDetails.reason === "input-clear") {
                allowResultsOpenRef.current = true
                setQuery(inputValue)
                setSelectedPlace(null)
                setResults([])
                setResultsOpen(false)
                setSearchState("idle")
                setLocateState("idle")
              }
            }}
            items={resultsOpen ? results : []}
            filter={null}
            itemToStringLabel={(place) => place.name}
            itemToStringValue={(place) => place.id}
            isItemEqualToValue={(left, right) => left.id === right.id}
            autoHighlight
          >
            <div ref={placeAnchorRef} className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-1">
              <ComboboxInput
                ref={placeInputRef}
                id={placeInputId}
                aria-label={labels.placeInputLabel}
                placeholder={labels.placePlaceholder}
                className="w-full"
                showTrigger={false}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    allowResultsOpenRef.current = false
                    setResultsOpen(false)
                    return
                  }

                  if (
                    (event.key === "ArrowDown" || event.key === "ArrowUp") &&
                    results.length > 0
                  ) {
                    allowResultsOpenRef.current = true
                    setResultsOpen(true)
                  }
                }}
              />
              <IconButton
                size="md"
                label={labels.clearPlace}
                tooltip
                className="border-border text-foreground"
                onClick={clearPlace}
              >
                <IconX />
              </IconButton>
              <IconButton
                size="md"
                label={labels.locatePlace}
                tooltip
                aria-busy={locateState === "loading"}
                disabled={!query.trim() || locateState === "loading"}
                className="bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
                onClick={locatePlace}
              >
                {locateState === "loading" ? <Spinner /> : <IconMapPin />}
              </IconButton>
            </div>
            <ComboboxContent anchor={placeAnchorRef} className="max-h-56 min-w-0">
              <ComboboxList aria-label={labels.resultsLabel}>
                {resultsOpen
                  ? results.map((place) => <PlaceResult key={place.id} place={place} />)
                  : null}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>

        {searchState !== "idle" || locateState === "error" ? (
          <div aria-live="polite" className="text-body-md text-muted-foreground">
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
        ) : null}
      </TabsContent>

      <TabsContent value="coordinates" className="flex flex-col gap-1.5 p-2">
        <FieldGroup className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] items-start gap-1">
          <Field data-invalid={Boolean(longitudeError)}>
            <FieldLabel htmlFor={longitudeInputId} className="sr-only">
              {labels.longitudeLabel}
            </FieldLabel>
            <Input
              id={longitudeInputId}
              className="tnum"
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
            <FieldLabel htmlFor={latitudeInputId} className="sr-only">
              {labels.latitudeLabel}
            </FieldLabel>
            <Input
              id={latitudeInputId}
              className="tnum"
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
          <IconButton
            size="md"
            label={labels.clearCoordinates}
            tooltip
            className="border-border text-foreground"
            onClick={clearCoordinates}
          >
            <IconX />
          </IconButton>
          <IconButton
            size="md"
            label={labels.locateCoordinates}
            tooltip
            className="bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
            onClick={locateCoordinates}
          >
            <IconMapPin />
          </IconButton>
        </FieldGroup>
      </TabsContent>
    </Tabs>
  )
}

export { MapSearch }
