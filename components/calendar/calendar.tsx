"use client"

import { useState, useMemo } from "react"
import type { CalendarEvent, CalendarView, EventType } from "@/types/calendar"
import { downloadICS } from "@/lib/calendar-utils"
import { CalendarHeader } from "./calendar-header"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import { EventFilters } from "./event-filters"
import { EventDetailsModal } from "./event-details-modal"

interface CalendarProps {
  events: CalendarEvent[]
  onDateClick?: (date: Date) => void
}

export function Calendar({ events, onDateClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>("month")
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([
    "commission",
    "county",
    "school-board",
    "election",
  ])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)

  const filteredEvents = useMemo(() => {
    return events.filter((event) => selectedEventTypes.includes(event.type))
  }, [events, selectedEventTypes])

  const handleEventTypeToggle = (type: EventType) => {
    setSelectedEventTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleClearAllFilters = () => {
    setSelectedEventTypes([])
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const handleExport = () => {
    downloadICS(filteredEvents, "calendar-events.ics")
  }

  const handleDateClick = (date: Date) => {
    onDateClick?.(date)
  }

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-sm p-6">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onDateChange={setCurrentDate}
        onExport={handleExport}
      />

      <EventFilters
        selectedTypes={selectedEventTypes}
        onTypeToggle={handleEventTypeToggle}
        onClearAll={handleClearAllFilters}
      />

      {view === "month" ? (
        <MonthView
          currentDate={currentDate}
          events={filteredEvents}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
        />
      ) : (
        <WeekView
          currentDate={currentDate}
          events={filteredEvents}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
        />
      )}

      <EventDetailsModal event={selectedEvent} isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} />
    </div>
  )
}
