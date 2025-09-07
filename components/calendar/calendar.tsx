"use client"

import { useState, useMemo, useEffect } from "react"
import type { CalendarEvent, CalendarView, EventType } from "@/types/calendar"
import { downloadICS } from "@/lib/calendar-utils"
import { calendarApi, apiEventToLocal } from "@/lib/calendar-api"
import { CalendarSkeleton } from "./calendar-skeleton"
import { CalendarHeader } from "./calendar-header"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import { EventFilters } from "./event-filters"
import { EventDetailsModal } from "./event-details-modal"
import { useToast } from "@/hooks/use-toast"

interface CalendarProps {
  events: CalendarEvent[]
  onDateClick?: (date: Date) => void
  onEventsChange?: (events: CalendarEvent[]) => void
  isLoading?: boolean
}

export function Calendar({ events, onDateClick, onEventsChange, isLoading = false }: CalendarProps) {
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
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // Load additional events when the view or date changes
  useEffect(() => {
    loadEventsForPeriod()
  }, [currentDate, view]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadEventsForPeriod = async () => {
    if (view === "month") {
      setIsLoadingMore(true)
      try {
        const month = currentDate.getMonth() + 1 // API expects 1-based month
        const year = currentDate.getFullYear()
        
        const response = await calendarApi.getCalendarEvents(month, year, view)
        if (response.success && response.data) {
          const newEvents = response.data.events.map(apiEventToLocal)
          // Merge with existing events, avoiding duplicates
          const existingIds = new Set(events.map(e => e.id))
          const uniqueNewEvents = newEvents.filter(e => !existingIds.has(e.id))
          
          if (uniqueNewEvents.length > 0 && onEventsChange) {
            onEventsChange([...events, ...uniqueNewEvents])
          }
        }
      } catch (error) {
        console.error('Error loading events for period:', error)
        toast({
          title: "Error",
          description: "Failed to load events for the selected period.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingMore(false)
      }
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

  const handleExport = async () => {
    try {
      // Try to use the API export first
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      
      const response = await calendarApi.exportCalendar({
        format: 'ics',
        start_date: startOfMonth.toISOString(),
        end_date: endOfMonth.toISOString(),
        event_types: selectedEventTypes,
      })
      
      if (response.success) {
        toast({
          title: "Export",
          description: response.data?.message || "Export functionality is being prepared.",
        })
      } else {
        // Fallback to local export
        downloadICS(filteredEvents, "calendar-events.ics")
      }
    } catch (error) {
      // Fallback to local export on error
      downloadICS(filteredEvents, "calendar-events.ics")
    }
  }

  const handleDateClick = (date: Date) => {
    onDateClick?.(date)
  }

  const handleDateChange = (date: Date) => {
    setCurrentDate(date)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Reload current period events
      await loadEventsForPeriod()
      toast({
        title: "Success",
        description: "Calendar events refreshed successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Show skeleton if explicitly loading
  if (isLoading) {
    return <CalendarSkeleton view={view} />
  }

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-sm p-6">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onDateChange={handleDateChange}
        onExport={handleExport}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <EventFilters
        selectedTypes={selectedEventTypes}
        onTypeToggle={handleEventTypeToggle}
        onClearAll={handleClearAllFilters}
      />

      {isLoadingMore && (
        <div className="text-center py-2">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#d36530] mr-2"></div>
            <span className="text-[#5e6461]/70 text-sm">Loading events...</span>
          </div>
        </div>
      )}

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

      <EventDetailsModal 
        event={selectedEvent} 
        isOpen={isEventModalOpen} 
        onClose={() => setIsEventModalOpen(false)}
        onEventDelete={(eventId) => {
          const updatedEvents = events.filter(e => e.id !== eventId)
          onEventsChange?.(updatedEvents)
        }}
        onEventEdit={(event) => {
          // TODO: Implement edit functionality - for now just close modal
          setIsEventModalOpen(false)
        }}
      />
    </div>
  )
}
