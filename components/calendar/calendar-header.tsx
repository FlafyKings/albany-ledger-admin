"use client"

import type { CalendarView } from "@/types/calendar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"

interface CalendarHeaderProps {
  currentDate: Date
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onDateChange: (date: Date) => void
  onExport: () => void
  isExporting?: boolean
}

export function CalendarHeader({ currentDate, view, onViewChange, onDateChange, onExport, isExporting = false }: CalendarHeaderProps) {
  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setDate(newDate.getDate() - 7)
    }
    onDateChange(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    onDateChange(newDate)
  }


  const formatHeaderDate = () => {
    if (view === "month") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    } else {
      const weekStart = new Date(currentDate)
      const day = weekStart.getDay()
      const diff = weekStart.getDate() - day
      weekStart.setDate(diff)

      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      return `${weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${weekEnd.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPrevious} className="cursor-pointer border-[#5e6461]/20 hover:border-[#d36530] hover:bg-[#d36530]/10">
            <ChevronLeft className="h-4 w-4 text-[#5e6461]" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToNext} className="cursor-pointer border-[#5e6461]/20 hover:border-[#d36530] hover:bg-[#d36530]/10">
            <ChevronRight className="h-4 w-4 text-[#5e6461]" />
          </Button>
        </div>

        <h2 className="text-xl font-semibold text-balance text-[#5e6461]">{formatHeaderDate()}</h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex rounded-md border border-[#5e6461]/20">
          <Button
            variant={view === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("month")}
            className={`rounded-r-none cursor-pointer ${
              view === "month" 
                ? "bg-[#d36530] hover:bg-[#d36530]/90 text-white" 
                : "text-[#5e6461] hover:bg-[#d36530]/10"
            }`}
          >
            Month
          </Button>
          <Button
            variant={view === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("week")}
            className={`rounded-l-none cursor-pointer ${
              view === "week" 
                ? "bg-[#d36530] hover:bg-[#d36530]/90 text-white" 
                : "text-[#5e6461] hover:bg-[#d36530]/10"
            }`}
          >
            Week
          </Button>
        </div>

        
        <Button 
          variant="outline" 
          size="sm" 
          className="cursor-pointer border-[#5e6461]/20 hover:border-[#d36530] hover:bg-[#d36530]/10 text-[#5e6461]"
          onClick={onExport}
          disabled={isExporting}
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </div>
    </div>
  )
}
