"use client"

import { useState, useMemo, useEffect } from "react"
import type { CalendarEvent, CalendarView, EventType } from "@/types/calendar"
import type { EventTypeAPI } from "@/lib/calendar-api"
import { CalendarSkeleton } from "./calendar-skeleton"
import { CalendarHeader } from "./calendar-header"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import { EventFilters } from "./event-filters"
import { EventDetailsModal } from "./event-details-modal"

interface CalendarProps {
  events: CalendarEvent[]
  eventTypes: EventTypeAPI[]
  onDateClick?: (date: Date) => void
  onEventEdit?: (event: CalendarEvent) => void
  onExport?: () => void
  onRefresh?: () => void
  isLoading?: boolean
  isRefreshing?: boolean
}

export function Calendar({ events, eventTypes, onDateClick, onEventEdit, onExport, onRefresh, isLoading = false, isRefreshing = false }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [view, setView] = useState<CalendarView>("month")
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)

  // Create dynamic event type configuration from API data
  const eventTypeConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string; bgColor: string; colorHex: string }> = {}
    
    eventTypes.forEach(eventType => {
      config[eventType.name] = {
        label: eventType.display_name,
        color: `text-[${eventType.color_hex}]`,
        bgColor: `bg-[${eventType.color_hex}]/20 hover:bg-[${eventType.color_hex}]/30`,
        colorHex: eventType.color_hex, // Include raw hex color for chips
      }
    })
    
    return config
  }, [eventTypes])

  // Helper function to get event type config for an event
  const getEventTypeConfig = (event: CalendarEvent) => {
    // First try to get from the eventTypeConfig (for filtering and form dropdowns)
    const configFromTypes = eventTypeConfig[event.type as keyof typeof eventTypeConfig]
    if (configFromTypes) {
      return {
        label: configFromTypes.label,
        color: "text-black", // Use black text
        bgColor: "hover:opacity-80", // Simple hover effect
        style: {
          backgroundColor: `${configFromTypes.colorHex}20`, // 20% opacity
          borderColor: `${configFromTypes.colorHex}30`, // 30% opacity
        }
      }
    }
    
    // Fallback for events that might not be in the current eventTypes list
    return {
      label: event.type,
      color: "text-black",
      bgColor: "bg-gray-200 hover:bg-gray-300",
      style: {}
    }
  }


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


  const handleDateClick = (date: Date) => {
    onDateClick?.(date)
  }

  const handleDateChange = (date: Date) => {
    setCurrentDate(date)
  }

  // Show skeleton if explicitly loading or no event types loaded yet
  if (isLoading || eventTypes.length === 0) {
    return <CalendarSkeleton view={view} />
  }

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-sm p-6">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onDateChange={handleDateChange}
        onExport={onExport || (() => {})}
        onRefresh={onRefresh || (() => {})}
        isRefreshing={isRefreshing}
      />

      <EventFilters
        selectedTypes={selectedEventTypes}
        eventTypeConfig={eventTypeConfig}
        onTypeToggle={handleEventTypeToggle}
        onClearAll={handleClearAllFilters}
      />


      {view === "month" ? (
        <MonthView
          currentDate={currentDate}
          events={filteredEvents}
          eventTypeConfig={eventTypeConfig}
          getEventTypeConfig={getEventTypeConfig}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
        />
      ) : (
        <WeekView
          currentDate={currentDate}
          events={filteredEvents}
          eventTypeConfig={eventTypeConfig}
          getEventTypeConfig={getEventTypeConfig}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
        />
      )}

      <EventDetailsModal 
        event={selectedEvent} 
        eventTypeConfig={eventTypeConfig}
        isOpen={isEventModalOpen} 
        onClose={() => setIsEventModalOpen(false)}
        onEventDelete={() => {
          // Event deletion should be handled by parent component
        }}
        onEventEdit={(event) => {
          onEventEdit?.(event)
          setIsEventModalOpen(false)
        }}
      />
    </div>
  )
}
