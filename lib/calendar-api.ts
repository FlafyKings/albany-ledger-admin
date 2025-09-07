import { api } from './api-client'

// API Response types matching the new schema
export interface CalendarEventAPI {
  id: string
  title: string
  description: string | null
  start_date: string // ISO 8601
  end_date: string | null // ISO 8601
  all_day: boolean
  event_type_id: string
  location: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  event_types?: {
    id: string
    name: string
    display_name: string
    color_hex: string
    created_at: string
  }
}

export interface EventsListResponse {
  events: CalendarEventAPI[]
  total: number
  limit: number
  offset: number
}

export interface EventTypeAPI {
  id: string
  name: string
  display_name: string
  color_hex: string
  created_at: string
}

export interface CalendarStatsResponse {
  total_events: number
  events_by_type: {
    commission: number
    county: number
    'school-board': number
    election: number
  }
  upcoming_events: number
  events_this_month: number
}

// Request types for creating/updating events
export interface CreateEventRequest {
  title: string
  description?: string
  start_date: string // ISO 8601
  end_date?: string // ISO 8601
  all_day?: boolean
  event_type_id: string // Event type ID instead of string
  location?: string
}

export interface UpdateEventRequest {
  title?: string
  description?: string
  start_date?: string // ISO 8601
  end_date?: string // ISO 8601
  all_day?: boolean
  event_type_id?: string // Event type ID instead of string
  location?: string
}

// Calendar API client
export const calendarApi = {
  // Events endpoints
  async getEvents(params?: {
    start_date?: string
    end_date?: string
    event_type_id?: string
    limit?: number
    offset?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params?.start_date) queryParams.append('start_date', params.start_date)
    if (params?.end_date) queryParams.append('end_date', params.end_date)
    if (params?.event_type_id) queryParams.append('event_type_id', params.event_type_id)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    
    const query = queryParams.toString()
    return api.get<EventsListResponse>(`/api/events${query ? `?${query}` : ''}`)
  },

  async getEvent(eventId: string) {
    return api.get<CalendarEventAPI>(`/api/events/${eventId}`)
  },

  async createEvent(event: CreateEventRequest) {
    return api.post<CalendarEventAPI>('/api/events', event)
  },

  async updateEvent(eventId: string, event: UpdateEventRequest) {
    return api.put<CalendarEventAPI>(`/api/events/${eventId}`, event)
  },

  async deleteEvent(eventId: string) {
    return api.delete<{ message: string }>(`/api/events/${eventId}`)
  },

  // Calendar-specific endpoints
  async getCalendarEvents(month: number, year: number, view?: 'month' | 'week') {
    const queryParams = new URLSearchParams({
      month: month.toString(),
      year: year.toString(),
    })
    if (view) queryParams.append('view', view)
    
    return api.get<{ events: CalendarEventAPI[] }>(`/api/calendar/events?${queryParams.toString()}`)
  },

  async exportCalendar(params?: {
    format?: 'ics' | 'csv' | 'pdf'
    start_date?: string
    end_date?: string
    event_type_ids?: string[]
  }) {
    const queryParams = new URLSearchParams()
    if (params?.format) queryParams.append('format', params.format)
    if (params?.start_date) queryParams.append('start_date', params.start_date)
    if (params?.end_date) queryParams.append('end_date', params.end_date)
    if (params?.event_type_ids) {
      params.event_type_ids.forEach(typeId => queryParams.append('event_type_ids', typeId))
    }
    
    const query = queryParams.toString()
    return api.get<{
      message: string
      format: string
      start_date: string | null
      end_date: string | null
      event_type_ids: string[]
    }>(`/api/calendar/export${query ? `?${query}` : ''}`)
  },

  // Event Types endpoints
  async getEventTypes() {
    return api.get<EventTypeAPI[]>('/api/event-types')
  },

  async getEventType(typeId: string) {
    return api.get<EventTypeAPI>(`/api/event-types/${typeId}`)
  },

  async createEventType(eventType: {
    name: string
    display_name: string
    color_hex: string
  }) {
    return api.post<EventTypeAPI>('/api/event-types', eventType)
  },

  async updateEventType(typeId: string, eventType: {
    name?: string
    display_name?: string
    color_hex?: string
  }) {
    return api.put<EventTypeAPI>(`/api/event-types/${typeId}`, eventType)
  },

  async deleteEventType(typeId: string) {
    return api.delete<{ message: string }>(`/api/event-types/${typeId}`)
  },

  // Statistics endpoint
  async getCalendarStats() {
    return api.get<CalendarStatsResponse>('/api/calendar/stats')
  },

  // Public endpoints (no auth required)
  async getPublicEvents(params?: {
    start_date?: string
    end_date?: string
    event_type_id?: string
    limit?: number
    offset?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params?.start_date) queryParams.append('start_date', params.start_date)
    if (params?.end_date) queryParams.append('end_date', params.end_date)
    if (params?.event_type_id) queryParams.append('event_type_id', params.event_type_id)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    
    const query = queryParams.toString()
    return api.get<EventsListResponse>(`/api/public/events${query ? `?${query}` : ''}`)
  },

  async getPublicCalendarEvents(month: number, year: number, view?: 'month' | 'week') {
    const queryParams = new URLSearchParams({
      month: month.toString(),
      year: year.toString(),
    })
    if (view) queryParams.append('view', view)
    
    return api.get<{ events: CalendarEventAPI[] }>(`/api/public/calendar/events?${queryParams.toString()}`)
  },

  async getPublicEventTypes() {
    return api.get<EventTypeAPI[]>('/api/public/event-types')
  },
}

// Helper functions to convert between API and local format
export function apiEventToLocal(apiEvent: CalendarEventAPI): import('@/types/calendar').CalendarEvent {
  // Debug logging to understand the issue
  if (!apiEvent.event_types) {
    console.warn('Event missing event_types:', apiEvent.id, apiEvent.title, apiEvent)
  }
  
  return {
    id: apiEvent.id,
    title: apiEvent.title,
    description: apiEvent.description || undefined,
    startDate: new Date(apiEvent.start_date),
    endDate: new Date(apiEvent.end_date || apiEvent.start_date),
    allDay: apiEvent.all_day,
    type: apiEvent.event_types?.name || 'unknown' as import('@/types/calendar').EventType, // Use name from event_types object with fallback
    location: apiEvent.location || undefined,
  }
}

export function localEventToApi(localEvent: Omit<import('@/types/calendar').CalendarEvent, 'id'>, eventTypeId: string): CreateEventRequest {
  return {
    title: localEvent.title,
    description: localEvent.description,
    start_date: localEvent.startDate.toISOString(),
    end_date: localEvent.endDate?.toISOString(),
    all_day: localEvent.allDay || false,
    event_type_id: eventTypeId, // Use event type ID instead of string
    location: localEvent.location,
  }
} 