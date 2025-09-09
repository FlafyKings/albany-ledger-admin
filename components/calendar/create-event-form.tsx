"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { CalendarEvent, EventType } from "@/types/calendar"
import { eventFormSchema, type EventFormData, validateEventForm } from "@/lib/schemas/event"
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
  eventTypeConfig: Record<string, { label: string; color: string; bgColor: string }>
  onEventCreate: (event: Omit<CalendarEvent, "id">) => void
  onEventUpdate?: (eventId: string, event: Omit<CalendarEvent, "id">) => void
  initialDate?: Date
  editEvent?: CalendarEvent
  isLoading?: boolean
}

export function CreateEventForm({ eventTypeConfig, onEventCreate, onEventUpdate, initialDate, editEvent, isLoading = false }: CreateEventFormProps) {
  const isEditMode = !!editEvent
  
  // Initialize form state - use editEvent data if in edit mode, otherwise use defaults
  const [title, setTitle] = useState(editEvent?.title || "")
  const [description, setDescription] = useState(editEvent?.description || "")
  const [type, setType] = useState<EventType>(
    editEvent?.type || 
    (Object.keys(eventTypeConfig).length > 0 
      ? Object.keys(eventTypeConfig)[0] as EventType
      : "")
  )

  // Update type when eventTypeConfig changes (when event types load)
  useEffect(() => {
    if (!editEvent && Object.keys(eventTypeConfig).length > 0 && !type) {
      setType(Object.keys(eventTypeConfig)[0] as EventType)
    }
  }, [eventTypeConfig, editEvent, type])
  const [location, setLocation] = useState(editEvent?.location || "")
  const [startDate, setStartDate] = useState<Date | undefined>(
    editEvent ? new Date(editEvent.startDate) : initialDate
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    editEvent ? new Date(editEvent.endDate) : initialDate
  )
  const [startTime, setStartTime] = useState(
    editEvent && !editEvent.allDay 
      ? new Date(editEvent.startDate).toTimeString().slice(0, 5)
      : "09:00"
  )
  const [endTime, setEndTime] = useState(
    editEvent && !editEvent.allDay 
      ? new Date(editEvent.endDate).toTimeString().slice(0, 5)
      : "10:00"
  )
  const [allDay, setAllDay] = useState(editEvent?.allDay || false)
  
  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  
  // Helper function to get error message for a field
  const getFieldError = (fieldName: string) => {
    return errors[fieldName]?.[0] || null
  }
  
  // Helper function to check if a field has an error
  const hasFieldError = (fieldName: string) => {
    return !!errors[fieldName]?.length
  }

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

  // Handle start date change
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date)
    
    // If no end date set, or end date is before start date, update end date
    if (date && (!endDate || endDate < date)) {
      setEndDate(date)
    }
  }

  // Handle end date change
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
    
    // Clear previous errors
    setErrors({})

    // Prepare form data for validation
    const formData = {
      title,
      description: description || undefined,
      type,
      location: location || undefined,
      allDay,
      startDate,
      endDate: allDay ? endDate : undefined,
      startTime: allDay ? undefined : startTime,
      endTime: allDay ? undefined : endTime,
    }

    // Validate form data using Zod
    const validation = validateEventForm(formData)
    
    if (!validation.success) {
      setErrors(validation.errors)
      return
    }

    // If validation passes, proceed with creating the event
    const validatedData = validation.data

    const start = allDay
      ? new Date(validatedData.startDate.getFullYear(), validatedData.startDate.getMonth(), validatedData.startDate.getDate(), 0, 0, 0)
      : new Date(
          validatedData.startDate.getFullYear(),
          validatedData.startDate.getMonth(),
          validatedData.startDate.getDate(),
          Number.parseInt(validatedData.startTime!.split(":")[0]),
          Number.parseInt(validatedData.startTime!.split(":")[1]),
        )

    const end = allDay
      ? new Date(validatedData.endDate!.getFullYear(), validatedData.endDate!.getMonth(), validatedData.endDate!.getDate(), 23, 59, 59)
      : new Date(
          validatedData.startDate.getFullYear(),
          validatedData.startDate.getMonth(),
          validatedData.startDate.getDate(),
          Number.parseInt(validatedData.endTime!.split(":")[0]),
          Number.parseInt(validatedData.endTime!.split(":")[1]),
        )

    const eventData = {
      title: validatedData.title,
      description: validatedData.description || undefined,
      type: validatedData.type,
      location: validatedData.location || undefined,
      startDate: start,
      endDate: end,
      allDay: validatedData.allDay,
    }

    if (isEditMode && editEvent && onEventUpdate) {
      onEventUpdate(editEvent.id, eventData)
    } else {
      onEventCreate(eventData)
    }

    // Reset form only if not in edit mode
    if (!isEditMode) {
      setTitle("")
      setDescription("")
      setType(Object.keys(eventTypeConfig).length > 0 ? Object.keys(eventTypeConfig)[0] as EventType : "")
      setLocation("")
      setStartDate(undefined)
      setEndDate(undefined)
      setStartTime("09:00")
      setEndTime("10:00")
      setAllDay(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* General form errors */}
      {getFieldError("general") && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{getFieldError("general")}</p>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-[#5e6461] font-medium">Event Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter event title"
          className={`border-[#5e6461]/20 focus:border-[#d36530] focus:ring-[#d36530]/20 ${hasFieldError("title") ? "border-red-500 focus:border-red-500" : ""}`}
        />
        {getFieldError("title") && (
          <p className="text-sm text-red-600">{getFieldError("title")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" className="text-[#5e6461] font-medium">Event Type</Label>
        <Select value={type} onValueChange={(value: EventType) => setType(value)}>
          <SelectTrigger className={`cursor-pointer border-[#5e6461]/20 focus:border-[#d36530] focus:ring-[#d36530]/20 ${hasFieldError("type") ? "border-red-500 focus:border-red-500" : ""}`}>
            <SelectValue placeholder={Object.keys(eventTypeConfig).length === 0 ? "Loading event types..." : "Select event type"} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(eventTypeConfig).length === 0 ? (
              <SelectItem value="" disabled>
                No event types available
              </SelectItem>
            ) : (
              Object.entries(eventTypeConfig).map(([key, config]) => (
                <SelectItem key={key} value={key} className="cursor-pointer">
                  {config.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {getFieldError("type") && (
          <p className="text-sm text-red-600">{getFieldError("type")}</p>
        )}
      </div>

      {/* All Day Toggle */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="allDay"
          checked={allDay}
          onCheckedChange={(checked) => handleAllDayChange(checked as boolean)}
          className="cursor-pointer border-[#5e6461]/20 data-[state=checked]:bg-[#d36530] data-[state=checked]:border-[#d36530]"
        />
        <Label htmlFor="allDay" className="cursor-pointer text-[#5e6461] font-medium">
          All day event
        </Label>
      </div>

      {/* Date and Time Inputs */}
      <div className="space-y-4">
        {allDay ? (
          /* All Day Event - Two Date Inputs */
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#5e6461] font-medium">Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal cursor-pointer border-[#5e6461]/20 hover:border-[#d36530] hover:bg-[#d36530]/10 text-[#5e6461]",
                      !startDate && "text-muted-foreground",
                      hasFieldError("startDate") && "border-red-500 focus:border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "MMM d, yyyy") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={handleStartDateChange} initialFocus />
                </PopoverContent>
              </Popover>
              {getFieldError("startDate") && (
                <p className="text-sm text-red-600">{getFieldError("startDate")}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="text-[#5e6461] font-medium">End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal cursor-pointer border-[#5e6461]/20 hover:border-[#d36530] hover:bg-[#d36530]/10 text-[#5e6461]",
                      !endDate && "text-muted-foreground",
                      hasFieldError("endDate") && "border-red-500 focus:border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "MMM d, yyyy") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={handleEndDateChange} initialFocus />
                </PopoverContent>
              </Popover>
              {getFieldError("endDate") && (
                <p className="text-sm text-red-600">{getFieldError("endDate")}</p>
              )}
            </div>
          </div>
        ) : (
          /* Timed Event - One Date + Two Time Inputs */
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#5e6461] font-medium">Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal cursor-pointer border-[#5e6461]/20 hover:border-[#d36530] hover:bg-[#d36530]/10 text-[#5e6461]",
                      !startDate && "text-muted-foreground",
                      hasFieldError("startDate") && "border-red-500 focus:border-red-500",
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
              {getFieldError("startDate") && (
                <p className="text-sm text-red-600">{getFieldError("startDate")}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#5e6461] font-medium">Start Time *</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className={`cursor-pointer border-[#5e6461]/20 focus:border-[#d36530] focus:ring-[#d36530]/20 ${hasFieldError("startTime") ? "border-red-500 focus:border-red-500" : ""}`}
                />
                {getFieldError("startTime") && (
                  <p className="text-sm text-red-600">{getFieldError("startTime")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-[#5e6461] font-medium">End Time *</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={`cursor-pointer border-[#5e6461]/20 focus:border-[#d36530] focus:ring-[#d36530]/20 ${hasFieldError("endTime") ? "border-red-500 focus:border-red-500" : ""}`}
                />
                {getFieldError("endTime") && (
                  <p className="text-sm text-red-600">{getFieldError("endTime")}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-[#5e6461] font-medium">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter event location"
          className={`border-[#5e6461]/20 focus:border-[#d36530] focus:ring-[#d36530]/20 ${hasFieldError("location") ? "border-red-500 focus:border-red-500" : ""}`}
        />
        {getFieldError("location") && (
          <p className="text-sm text-red-600">{getFieldError("location")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-[#5e6461] font-medium">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter event description"
          rows={3}
          className={`border-[#5e6461]/20 focus:border-[#d36530] focus:ring-[#d36530]/20 ${hasFieldError("description") ? "border-red-500 focus:border-red-500" : ""}`}
        />
        {getFieldError("description") && (
          <p className="text-sm text-red-600">{getFieldError("description")}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full cursor-pointer bg-[#d36530] hover:bg-[#d36530]/90 text-white" 
        disabled={isLoading || Object.keys(eventTypeConfig).length === 0}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {isEditMode ? "Updating..." : "Creating..."}
          </>
        ) : Object.keys(eventTypeConfig).length === 0 ? (
          "Loading event types..."
        ) : (
          isEditMode ? "Update Event" : "Create Event"
        )}
      </Button>
    </form>
  )
}
