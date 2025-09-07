"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/calendar/calendar"
import { CreateEventForm } from "@/components/calendar/create-event-form"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { calendarApi, apiEventToLocal, localEventToApi } from "@/lib/calendar-api"
import type { CalendarEvent } from "@/types/calendar"
import { useToast } from "@/hooks/use-toast"
import { CalendarSkeleton } from "@/components/calendar/calendar-skeleton"

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  // Load events on component mount
  useEffect(() => {
    loadEvents()
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

  const handleEventCreate = async (newEvent: Omit<CalendarEvent, "id">) => {
    setIsCreating(true)
    try {
      const apiEvent = localEventToApi(newEvent)
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

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsCreateFormOpen(true)
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
                <SheetTitle>Create New Event</SheetTitle>
                <SheetDescription>Add a new event to the calendar. Fill in the details below.</SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <CreateEventForm 
                  onEventCreate={handleEventCreate} 
                  initialDate={selectedDate || undefined}
                  isLoading={isCreating}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {isLoading ? (
          <CalendarSkeleton />
        ) : (
          <Calendar 
            events={events} 
            onDateClick={handleDateClick}
            onEventsChange={setEvents}
            isLoading={false}
          />
        )}
      </main>
    </div>
  )
}
