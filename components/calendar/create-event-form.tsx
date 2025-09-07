"use client"

import type React from "react"
import { useState } from "react"
import type { CalendarEvent, EventType } from "@/types/calendar"
import { EVENT_TYPE_CONFIG } from "@/lib/calendar-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CreateEventFormProps {
  onEventCreate: (event: Omit<CalendarEvent, "id">) => void
  initialDate?: Date
  isLoading?: boolean
}

export function CreateEventForm({ onEventCreate, initialDate, isLoading = false }: CreateEventFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<EventType>("commission")
  const [location, setLocation] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(initialDate)
  const [startTime, setStartTime] = useState("09:00")
  const [endDate, setEndDate] = useState<Date | undefined>(initialDate)
  const [endTime, setEndTime] = useState("10:00")
  const [allDay, setAllDay] = useState(false)

  // Auto-adjust end time when start time changes (Google Calendar behavior)
  const handleStartTimeChange = (newStartTime: string) => {
    setStartTime(newStartTime)
    
    // Auto-set end time to 1 hour later
    const [hours, minutes] = newStartTime.split(':').map(Number)
    const endHour = (hours + 1) % 24
    const endTimeString = `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    setEndTime(endTimeString)
  }

  // When toggling all-day, adjust dates appropriately
  const handleAllDayChange = (checked: boolean) => {
    setAllDay(checked)
    
    // If switching from all-day to timed event, ensure we have reasonable times
    if (!checked && startTime === endTime) {
      setStartTime("09:00")
      setEndTime("10:00")
    }
  }

  // Smart date selection - when start date changes, adjust end date if needed
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date)
    
    // If no end date set, or end date is before start date, update end date
    if (date && (!endDate || endDate < date)) {
      setEndDate(date)
    }
  }

  // Ensure end date is not before start date
  const handleEndDateChange = (date: Date | undefined) => {
    if (date && startDate && date < startDate) {
      // If end date is before start date, set it to start date
      setEndDate(startDate)
    } else {
      setEndDate(date)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !startDate || !endDate) return

    const start = allDay
      ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0)
      : new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          Number.parseInt(startTime.split(":")[0]),
          Number.parseInt(startTime.split(":")[1]),
        )

    const end = allDay
      ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59)
      : new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
          Number.parseInt(endTime.split(":")[0]),
          Number.parseInt(endTime.split(":")[1]),
        )

    onEventCreate({
      title,
      description: description || undefined,
      type,
      location: location || undefined,
      startDate: start,
      endDate: end,
      allDay,
    })

    // Reset form
    setTitle("")
    setDescription("")
    setLocation("")
    setStartDate(undefined)
    setEndDate(undefined)
    setStartTime("09:00")
    setEndTime("10:00")
    setAllDay(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mx-4">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter event title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Event Type</Label>
        <Select value={type} onValueChange={(value: EventType) => setType(value)}>
          <SelectTrigger className="cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(EVENT_TYPE_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key} className="cursor-pointer">
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* All Day Toggle */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="allDay"
          checked={allDay}
          onCheckedChange={(checked) => handleAllDayChange(checked as boolean)}
          className="cursor-pointer"
        />
        <Label htmlFor="allDay" className="cursor-pointer">
          All day event
        </Label>
      </div>

      {/* Date and Time Inputs - Google Calendar Style */}
      <div className="space-y-4">
        {/* Start Date/Time */}
        <div className="space-y-2">
          <Label>Start {allDay ? 'Date' : 'Date & Time'} *</Label>
          <div className="flex gap-2">
            {/* Date Input */}
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal cursor-pointer",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={handleStartDateChange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Time Input - only show for non-all-day events */}
            {!allDay && (
              <div className="w-32">
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* End Date/Time */}
        <div className="space-y-2">
          <Label>
            End {allDay ? 'Date' : 'Date & Time'} *
            {startDate && endDate && startDate.toDateString() === endDate.toDateString() && !allDay && (
              <span className="text-xs text-muted-foreground ml-1">(same day)</span>
            )}
          </Label>
          <div className="flex gap-2">
            {/* Date Input */}
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal cursor-pointer",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={handleEndDateChange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Time Input - only show for non-all-day events */}
            {!allDay && (
              <div className="w-32">
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter event location"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter event description"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Creating...
          </>
        ) : (
          "Create Event"
        )}
      </Button>
    </form>
  )
}
