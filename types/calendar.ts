export type EventType = "commission" | "county" | "school-board" | "election"

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  type: EventType
  location?: string
  allDay?: boolean
}

export type CalendarView = "month" | "week"

export interface EventTypeConfig {
  label: string
  color: string
  bgColor: string
}
