"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, Calendar as CalendarIcon, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/calendar/calendar"
import { CreateEventForm } from "@/components/calendar/create-event-form"
import { EventTypesManager } from "@/components/calendar/event-types-manager"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calendarApi, apiEventToLocal, localEventToApi, type EventTypeAPI } from "@/lib/calendar-api"
import type { CalendarEvent } from "@/types/calendar"
import { useToast } from "@/hooks/use-toast"
import { CalendarSkeleton } from "@/components/calendar/calendar-skeleton"

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [eventTypes, setEventTypes] = useState<EventTypeAPI[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingEventTypes, setIsLoadingEventTypes] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  // Client-side detection to prevent hydration mismatches
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Create dynamic event type configuration from API data
  const eventTypeConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string; bgColor: string }> = {}
    
    // Provide fallback colors for common event types to prevent hydration mismatches
    const fallbackConfig = {
      commission: { label: "Commission", color: "text-[#d36530]", bgColor: "bg-[#d36530]/20 hover:bg-[#d36530]/30" },
      county: { label: "County", color: "text-[#059669]", bgColor: "bg-[#059669]/20 hover:bg-[#059669]/30" },
      "school-board": { label: "School Board", color: "text-[#7c3aed]", bgColor: "bg-[#7c3aed]/20 hover:bg-[#7c3aed]/30" },
      election: { label: "Election", color: "text-[#dc2626]", bgColor: "bg-[#dc2626]/20 hover:bg-[#dc2626]/30" },
    }
    
    // Always use fallback config on server side to prevent hydration mismatches
    if (!isClient) {
      return fallbackConfig
    }
    
    // Use API data if available on client side, otherwise fall back to default colors
    if (eventTypes.length > 0) {
      eventTypes.forEach(eventType => {
        config[eventType.name] = {
          label: eventType.display_name,
          color: `text-[${eventType.color_hex}]`,
          bgColor: `bg-[${eventType.color_hex}]/20 hover:bg-[${eventType.color_hex}]/30`,
        }
      })
    } else {
      // Use fallback configuration to ensure consistent server/client rendering
      Object.assign(config, fallbackConfig)
    }
    
    return config
  }, [eventTypes, isClient])

  // Load events and event types on component mount
  useEffect(() => {
    loadEvents()
    loadEventTypes()
  }, [])

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      const response = await calendarApi.getEvents()
      if (response.success && response.data) {
        const convertedEvents = response.data.events.map(apiEventToLocal)
        setEvents(convertedEvents)
        console.log(`Loaded ${convertedEvents.length} events from API`)
      } else {
        throw new Error(response.error || 'Failed to load events')
      }
    } catch (error) {
      console.error('Error loading events:', error)
      toast({
        title: "Error",
        description: "Failed to load calendar events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadEventTypes = async () => {
    setIsLoadingEventTypes(true)
    try {
      const response = await calendarApi.getEventTypes()
      if (response.success && response.data) {
        setEventTypes(response.data)
        console.log(`Loaded ${response.data.length} event types from API`)
      } else {
        throw new Error(response.error || 'Failed to load event types')
      }
    } catch (error) {
      console.error('Error loading event types:', error)
      toast({
        title: "Error",
        description: "Failed to load event types. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingEventTypes(false)
    }
  }

  const handleEventCreate = async (newEvent: Omit<CalendarEvent, "id">) => {
    setIsCreating(true)
    try {
      // Find the event type ID from the eventTypes array
      const eventType = eventTypes.find(et => et.name === newEvent.type)
      if (!eventType) {
        throw new Error(`Event type "${newEvent.type}" not found. Please refresh the page and try again.`)
      }
      
      const apiEvent = localEventToApi(newEvent, eventType.id)
      const response = await calendarApi.createEvent(apiEvent)
      
      if (response.success && response.data) {
        const createdEvent = apiEventToLocal(response.data)
        setEvents((prev) => [...prev, createdEvent])
        setIsCreateFormOpen(false)
        toast({
          title: "Success",
          description: "Event created successfully!",
        })
      } else {
        throw new Error(response.error || 'Failed to create event')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleEventUpdate = async (eventId: string, eventData: Omit<CalendarEvent, "id">) => {
    setIsUpdating(true)
    try {
      // Find the event type ID from the eventTypes array
      const eventType = eventTypes.find(et => et.name === eventData.type)
      if (!eventType) {
        throw new Error(`Event type "${eventData.type}" not found. Please refresh the page and try again.`)
      }
      
      const apiEvent = localEventToApi(eventData, eventType.id)
      const response = await calendarApi.updateEvent(eventId, apiEvent)
      
      if (response.success && response.data) {
        // Refresh events from server to ensure consistency
        await loadEvents()
        setIsEditFormOpen(false)
        setEditingEvent(null)
        toast({
          title: "Success",
          description: "Event updated successfully!",
        })
      } else {
        throw new Error(response.error || 'Failed to update event')
      }
    } catch (error) {
      console.error('Error updating event:', error)
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEventEdit = (event: CalendarEvent) => {
    setEditingEvent(event)
    setIsEditFormOpen(true)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsCreateFormOpen(true)
  }

  const handleExportRequest = async () => {
    setIsExporting(true)
    try {
      // Use backend export endpoint
      const response = await calendarApi.exportCalendar({
        format: 'ics',
        calendar_name: 'Albany Ledger Calendar'
      })
      
      if (response.success && response.data) {
        // Create blob and download
        const blob = new Blob([response.data], { type: 'text/calendar; charset=utf-8' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `calendar-${new Date().toISOString().split('T')[0]}.ics`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        toast({
          title: "Export Successful",
          description: "Calendar exported as ICS file successfully!",
        })
      } else {
        throw new Error(response.error || 'Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Export Error",
        description: "Failed to export calendar as ICS. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await loadEvents()
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
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#5e6461]">Calendar</h2>
            <p className="text-[#5e6461]/70">Track commission, county, school board, and election events</p>
          </div>

          <Sheet open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
            <SheetTrigger asChild>
              <Button className="bg-[#d36530] hover:bg-[#d36530]/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-[#5e6461]">Create New Event</SheetTitle>
                <SheetDescription className="text-[#5e6461]/70">Add a new event to the calendar. Fill in the details below.</SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <CreateEventForm 
                  eventTypeConfig={eventTypeConfig}
                  onEventCreate={handleEventCreate} 
                  initialDate={selectedDate || undefined}
                  isLoading={isCreating}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Edit Event Form Sheet */}
          <Sheet open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-[#5e6461]">Edit Event</SheetTitle>
                <SheetDescription className="text-[#5e6461]/70">Update the event details below.</SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                {editingEvent && (
                  <CreateEventForm 
                    eventTypeConfig={eventTypeConfig}
                    onEventCreate={handleEventCreate}
                    onEventUpdate={handleEventUpdate}
                    editEvent={editingEvent}
                    isLoading={isUpdating}
                  />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger
              value="calendar"
              className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="event-types" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
              <Tag className="h-4 w-4 mr-2" />
              Event Types
            </TabsTrigger>
          </TabsList>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            {isLoading || isLoadingEventTypes ? (
              <CalendarSkeleton />
            ) : (
              <Calendar 
                events={events} 
                eventTypes={eventTypes}
                onDateClick={handleDateClick}
                onEventEdit={handleEventEdit}
                onExport={handleExportRequest}
                isLoading={false}
                isExporting={isExporting}
              />
            )}
          </TabsContent>

          {/* Event Types Tab */}
          <TabsContent value="event-types" className="space-y-6">
            <EventTypesManager 
              eventTypes={eventTypes}
              isLoading={isLoadingEventTypes}
              onEventTypesChange={setEventTypes}
              onReload={loadEventTypes}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
