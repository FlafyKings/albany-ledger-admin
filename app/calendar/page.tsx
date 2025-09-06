"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/calendar/calendar"
import { CreateEventForm } from "@/components/calendar/create-event-form"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { mockEvents } from "@/lib/mock-data"
import type { CalendarEvent } from "@/types/calendar"

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)

  const handleEventCreate = (newEvent: Omit<CalendarEvent, "id">) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: Date.now().toString(),
    }
    setEvents((prev) => [...prev, event])
    setIsCreateFormOpen(false)
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
                <CreateEventForm onEventCreate={handleEventCreate} initialDate={selectedDate || undefined} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Calendar events={events} onDateClick={handleDateClick} />
      </main>
    </div>
  )
}
