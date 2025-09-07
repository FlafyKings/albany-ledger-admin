"use client"

import type { CalendarEvent } from "@/types/calendar"
import { getWeekDays, getEventsForDay, isToday, formatTime } from "@/lib/calendar-utils"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WeekViewProps {
  currentDate: Date
  events: CalendarEvent[]
  eventTypeConfig: Record<string, { label: string; color: string; bgColor: string }>
  getEventTypeConfig: (event: CalendarEvent) => { label: string; color: string; bgColor: string; style: React.CSSProperties }
  onEventClick: (event: CalendarEvent) => void
  onDateClick: (date: Date) => void
}

export function WeekView({ currentDate, events, eventTypeConfig, getEventTypeConfig, onEventClick, onDateClick }: WeekViewProps) {
  const weekDays = getWeekDays(currentDate)
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Separate all-day events from timed events
  const allDayEvents = events.filter(event => event.allDay)
  const timedEvents = events.filter(event => !event.allDay)

  // Get all-day events for each day of the week
  const getAllDayEventsForDay = (date: Date) => {
    return allDayEvents.filter(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)
      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)
      
      return eventStart <= dayEnd && eventEnd >= dayStart
    })
  }

  return (
    <div className="border border-[#5e6461]/20 rounded-lg overflow-hidden">
      {/* Week grid */}
      <div className="max-h-[600px] overflow-y-auto">
        {/* Week day headers */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-[#5e6461]/5 border-b border-[#5e6461]/10 sticky top-0 z-10">
          <div className="p-2 text-center text-sm font-medium border-r border-[#5e6461]/10 text-[#5e6461]">Time</div>
          {weekDays.map((date, index) => {
            const isTodayDate = isToday(date)
            return (
              <div
                key={date.toISOString()}
                className={cn(
                  "p-2 text-center text-sm font-medium hover:bg-[#5e6461]/10 border-r border-[#5e6461]/10 text-[#5e6461] cursor-pointer",
                  isTodayDate && "bg-[#d36530]/10 border-[#d36530]/30",
                )}
                onClick={() => onDateClick(date)}
              >
                <div>{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                <div className={cn("text-lg", isTodayDate && "text-[#d36530] font-bold")}>{date.getDate()}</div>
              </div>
            )
          })}
        </div>

        {/* All-day events section */}
        {allDayEvents.length > 0 && (
          <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-[#5e6461]/10">
            <div className="p-2 text-center text-sm font-medium border-r border-[#5e6461]/10 text-[#5e6461] bg-[#5e6461]/5">
              All Day
            </div>
            {weekDays.map((date) => {
              const dayAllDayEvents = getAllDayEventsForDay(date)
              return (
                <div key={date.toISOString()} className="p-1 border-r border-[#5e6461]/10 min-h-[40px]">
                  {dayAllDayEvents.map((event) => {
                    const config = getEventTypeConfig(event)
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "w-full h-auto p-1 text-xs rounded mb-1 cursor-pointer transition-all duration-150 border",
                          config.bgColor,
                          config.color,
                        )}
                        style={config.style}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick(event)
                        }}
                      >
                        <div className="truncate">
                          <div className="font-medium">{event.title}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}

        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          {/* Time column */}
          <div className="border-r border-[#5e6461]/10">
            {hours.map((hour) => (
              <div key={hour} className="h-24 border-b border-[#5e6461]/10 p-2 text-xs text-[#5e6461]/70 text-center">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((date, dayIndex) => {
            const dayTimedEvents = getEventsForDay(timedEvents, date)

            return (
              <div key={date.toISOString()} className="border-r border-[#5e6461]/10">
                {hours.map((hour) => {
                  const hourEvents = dayTimedEvents.filter((event) => {
                    const eventHour = new Date(event.startDate).getHours()
                    return eventHour === hour
                  })

                  return (
                    <div key={hour} className="h-24 border-b border-[#5e6461]/10 p-2 hover:bg-[#5e6461]/5 cursor-pointer" onClick={() => onDateClick(date)}>
                      {hourEvents.map((event) => {
                        const config = getEventTypeConfig(event)
                        return (
                          <div
                            key={event.id}
                            className={cn(
                              "w-full h-auto p-1 text-xs rounded mb-1 cursor-pointer transition-all duration-150 border",
                              config.bgColor,
                              config.color,
                            )}
                            style={config.style}
                            onClick={(e) => {
                              e.stopPropagation()
                              onEventClick(event)
                            }}
                          >
                            <div className="truncate">
                              <div className="font-medium">{event.title}</div>
                              {!event.allDay && (
                                <div className="text-xs opacity-75">{formatTime(new Date(event.startDate))}</div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
