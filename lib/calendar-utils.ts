import type { CalendarEvent, EventType } from "@/types/calendar"

export const EVENT_TYPE_CONFIG: Record<EventType, { label: string; color: string; bgColor: string }> = {
  commission: {
    label: "Commission",
    color: "text-[#d36530]",
    bgColor: "bg-[#d36530]/20 hover:bg-[#d36530]/30",
  },
  county: {
    label: "County",
    color: "text-[#059669]",
    bgColor: "bg-[#059669]/20 hover:bg-[#059669]/30",
  },
  "school-board": {
    label: "School Board",
    color: "text-[#7c3aed]",
    bgColor: "bg-[#7c3aed]/20 hover:bg-[#7c3aed]/30",
  },
  election: {
    label: "Election",
    color: "text-[#dc2626]",
    bgColor: "bg-[#dc2626]/20 hover:bg-[#dc2626]/30",
  },
}

export function getWeekDays(date: Date): Date[] {
  const start = new Date(date)
  const day = start.getDay()
  const diff = start.getDate() - day
  start.setDate(diff)

  const days = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    days.push(day)
  }
  return days
}

export function getMonthDays(date: Date): Date[] {
  const year = date.getFullYear()
  const month = date.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  const endDate = new Date(lastDay)

  // Get the first day of the week for the first day of the month
  const startDay = startDate.getDay()
  startDate.setDate(startDate.getDate() - startDay)

  // Get the last day of the week for the last day of the month
  const endDay = endDate.getDay()
  endDate.setDate(endDate.getDate() + (6 - endDay))

  const days = []
  const current = new Date(startDate)

  while (current <= endDate) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return days
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function getEventsForDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = new Date(event.startDate)
    const eventEnd = new Date(event.endDate)

    return isSameDay(eventStart, date) || isSameDay(eventEnd, date) || (eventStart < date && eventEnd > date)
  })
}

export function exportToICS(events: CalendarEvent[]): string {
  const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Calendar App//Calendar App//EN",
    "CALSCALE:GREGORIAN",
  ]

  events.forEach((event) => {
    icsContent.push(
      "BEGIN:VEVENT",
      `UID:${event.id}@calendar-app.com`,
      `DTSTART:${formatICSDate(new Date(event.startDate))}`,
      `DTEND:${formatICSDate(new Date(event.endDate))}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ""}`,
      `LOCATION:${event.location || ""}`,
      `CATEGORIES:${EVENT_TYPE_CONFIG[event.type].label}`,
      "END:VEVENT",
    )
  })

  icsContent.push("END:VCALENDAR")
  return icsContent.join("\r\n")
}

export function downloadICS(events: CalendarEvent[], filename = "calendar-events.ics"): void {
  const icsContent = exportToICS(events)
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
