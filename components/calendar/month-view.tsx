"use client"

import type { CalendarEvent } from "@/types/calendar"
import { getMonthDays, getEventsForDay, isToday, EVENT_TYPE_CONFIG } from "@/lib/calendar-utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { useState } from "react"

interface MonthViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onDateClick: (date: Date) => void
}

export function MonthView({ currentDate, events, onEventClick, onDateClick }: MonthViewProps) {
  const monthDays = getMonthDays(currentDate)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  return (
    <div className="border border-[#5e6461]/20 rounded-lg overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 bg-[#5e6461]/5">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-[#5e6461]">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {monthDays.map((date, index) => {
          const dayEvents = getEventsForDay(events, date)
          const isCurrentMonthDay = isCurrentMonth(date)
          const isTodayDate = isToday(date)
          const visibleEvents = dayEvents.slice(0, 2)
          const hasMoreEvents = dayEvents.length > 2
          const showHoverAdd = hoveredDay === index

          return (
            <div
              key={index}
              className={cn(
                "min-h-[120px] border-r border-b border-[#5e6461]/10 p-2 relative transition-colors duration-150",
                !isCurrentMonthDay && "bg-[#5e6461]/5 text-[#5e6461]/60",
                isTodayDate && "bg-[#d36530]/10 border-[#d36530]/30",
                showHoverAdd && "bg-[#5e6461]/10",
              )}
              onMouseEnter={() => setHoveredDay(index)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <div className="flex items-center justify-between mb-1 h-7">
                <div
                  className={cn(
                    "text-sm font-medium text-[#5e6461]",
                    isTodayDate && "text-white bg-[#d36530] rounded px-2 py-1 inline-block font-bold",
                  )}
                >
                  {date.getDate()}
                </div>

                {showHoverAdd && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-3 text-xs border border-[#d36530]/50 bg-[#d36530]/10 hover:bg-[#d36530]/20 text-[#5e6461] hover:text-[#5e6461] cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDateClick(date)
                    }}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                )}
              </div>

              <div className="space-y-1">
                {visibleEvents.map((event) => {
                  const config = EVENT_TYPE_CONFIG[event.type]
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "w-full h-auto p-1 text-xs rounded cursor-pointer transition-all duration-150",
                        config.bgColor,
                        config.color,
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                    >
                      <span className="truncate">{event.title}</span>
                    </div>
                  )
                })}

                {hasMoreEvents && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-auto p-1 text-xs justify-start text-[#5e6461]/70 hover:text-[#5e6461] hover:bg-[#5e6461]/10 transition-all duration-150 cursor-pointer"
                      >
                        +{dayEvents.length - 2} more
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-3" align="start">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-[#5e6461]">
                          {date.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </h4>
                        <div className="space-y-1 max-h-60 overflow-y-auto">
                          {dayEvents.map((event) => {
                            const config = EVENT_TYPE_CONFIG[event.type]
                            return (
                              <Button
                                key={event.id}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "w-full h-auto p-2 text-xs justify-start cursor-pointer",
                                  config.bgColor,
                                  config.color,
                                )}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEventClick(event)
                                }}
                              >
                                <div className="flex flex-col items-start">
                                  <span className="font-medium">{event.title}</span>
                                  <span className="text-xs opacity-75">
                                    {new Date(event.startDate).toLocaleTimeString("en-US", {
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </span>
                                </div>
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
