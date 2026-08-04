import { cn } from "@registry/lib/utils"
import { Button } from "@registry/ui/button"
import { Calendar } from "@registry/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@registry/ui/popover"
import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { zhCN } from "react-day-picker/locale"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    single: "选择日期",
    range: "日期范围",
    picker: "弹出式日期选择",
    selected: "已选日期",
    selectedRange: "已选范围",
    none: "未选择",
    pickDate: "选择日期",
  },
  en: {
    single: "Select a date",
    range: "Date range",
    picker: "Popover date picker",
    selected: "Selected date",
    selectedRange: "Selected range",
    none: "None",
    pickDate: "Pick a date",
  },
}

function formatDate(date: Date | undefined, locale: "zh-CN" | "en") {
  if (!date) return undefined
  return date.toLocaleDateString(locale === "zh-CN" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function CalendarOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const dayPickerLocale = locale === "zh-CN" ? zhCN : undefined
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [range, setRange] = useState<DateRange | undefined>()
  const [picked, setPicked] = useState<Date | undefined>()

  return (
    <div className="space-y-8">
      <section className="space-y-3" data-demo="calendar-single">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.single}
        </h4>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={dayPickerLocale}
          className="rounded-none border"
        />
        <p className="text-xs text-muted-foreground">
          {demoLabels.selected}: {formatDate(date, locale) ?? demoLabels.none}
        </p>
      </section>

      <section className="space-y-3" data-demo="calendar-range">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.range}
        </h4>
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          locale={dayPickerLocale}
          className="rounded-none border"
        />
        <p className="text-xs text-muted-foreground">
          {demoLabels.selectedRange}:{" "}
          {range?.from
            ? `${formatDate(range.from, locale)} – ${formatDate(range.to, locale) ?? demoLabels.none}`
            : demoLabels.none}
        </p>
      </section>

      <section className="space-y-3" data-demo="calendar-picker">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.picker}
        </h4>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className={cn("w-56 justify-start", !picked && "text-muted-foreground")}
              />
            }
          >
            {formatDate(picked, locale) ?? demoLabels.pickDate}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={picked}
              onSelect={setPicked}
              locale={dayPickerLocale}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </section>
    </div>
  )
}
