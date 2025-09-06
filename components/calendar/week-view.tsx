"use client"

import type { CalendarEvent } from "@/types/calendar"
import { getWeekDays, getEventsForDay, isToday, EVENT_TYPE_CONFIG, formatTime } from "@/lib/calendar-utils"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WeekViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onDateClick: (date: Date) => void
}

export function WeekView({ currentDate, events, onEventClick, onDateClick }: WeekViewProps) {
  const weekDays = getWeekDays(currentDate)
  const hours = Array.from({ length: 24 }, (_, i) => i)

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

        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          {/* Time column */}
          <div className="border-r border-[#5e6461]/10">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b border-[#5e6461]/10 p-2 text-xs text-[#5e6461]/70 text-center">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((date, dayIndex) => {
            const dayEvents = getEventsForDay(events, date)

            return (
              <div key={date.toISOString()} className="border-r border-[#5e6461]/10">
                {hours.map((hour) => {
                  const hourEvents = dayEvents.filter((event) => {
                    if (event.allDay) return hour === 0
                    const eventHour = new Date(event.startDate).getHours()
                    return eventHour === hour
                  })

                  return (
                    <div key={hour} className="h-16 border-b border-[#5e6461]/10 p-2 hover:bg-[#5e6461]/5 cursor-pointer" onClick={() => onDateClick(date)}>
                      {hourEvents.map((event) => {
                        const config = EVENT_TYPE_CONFIG[event.type]
                        return (
                          <div
                            key={event.id}
                            className={cn(
                              "w-full h-auto p-1 text-xs rounded mb-1 cursor-pointer transition-all duration-150",
                              config.bgColor,
                              config.color,
                            )}
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
