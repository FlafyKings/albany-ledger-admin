import { z } from "zod"

// Event form validation schema
export const eventFormSchema = z.object({
  title: z
    .string()
    .min(1, "Event title is required")
    .max(255, "Event title must be less than 255 characters"),
  
  description: z
    .string()
    .optional()
    .or(z.literal("")),
  
  type: z
    .string()
    .min(1, "Please select an event type"),
  
  location: z
    .string()
    .max(255, "Location must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  
  allDay: z.boolean(),
  
  startDate: z
    .date({
      required_error: "Start date is required",
      invalid_type_error: "Please select a valid start date",
    }),
  
  endDate: z
    .date({
      required_error: "End date is required for all-day events",
      invalid_type_error: "Please select a valid end date",
    })
    .optional(),
  
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (HH:MM)")
    .optional(),
  
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (HH:MM)")
    .optional(),
}).refine((data) => {
  // For all-day events, endDate is required
  if (data.allDay && !data.endDate) {
    return false
  }
  return true
}, {
  message: "End date is required for all-day events",
  path: ["endDate"],
}).refine((data) => {
  // For all-day events, endDate should not be before startDate
  if (data.allDay && data.endDate && data.endDate < data.startDate) {
    return false
  }
  return true
}, {
  message: "End date cannot be before start date",
  path: ["endDate"],
}).refine((data) => {
  // For timed events, startTime and endTime are required
  if (!data.allDay && (!data.startTime || !data.endTime)) {
    return false
  }
  return true
}, {
  message: "Start time and end time are required for timed events",
  path: ["startTime"],
}).refine((data) => {
  // For timed events, endTime should be after startTime
  if (!data.allDay && data.startTime && data.endTime) {
    const [startHour, startMin] = data.startTime.split(':').map(Number)
    const [endHour, endMin] = data.endTime.split(':').map(Number)
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    if (endMinutes <= startMinutes) {
      return false
    }
  }
  return true
}, {
  message: "End time must be after start time",
  path: ["endTime"],
})

// Type inference for the form data
export type EventFormData = z.infer<typeof eventFormSchema>

// Helper function to validate form data
export function validateEventForm(data: unknown): { success: true; data: EventFormData } | { success: false; errors: Record<string, string[]> } {
  try {
    const validatedData = eventFormSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(err.message)
      })
      return { success: false, errors }
    }
    return { success: false, errors: { general: ["An unexpected error occurred"] } }
  }
}
