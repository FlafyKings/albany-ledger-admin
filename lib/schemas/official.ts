import { z } from "zod"

// Schema for role experience
export const roleExperienceSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  organization: z.string().min(1, "Organization is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
})

// Schema for committee membership
export const committeeMembershipSchema = z.object({
  id: z.string(),
  committeeId: z.number().min(1, "Committee is required"),
  name: z.string(),
  role: z.enum(["Chair", "Vice Chair", "Member"]),
})

// Schema for achievement
export const achievementSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  period: z.string().optional(),
})

// Schema for office details
export const officeDetailsSchema = z.object({
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  room: z.string().optional(),
  hours: z.string().optional(),
})

// Schema for contact information
export const contactSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone is required"),
  office: officeDetailsSchema,
})

// Main schema for official form (matches backend snake_case requirements)
export const officialFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  roleTitle: z.string().min(1, "Role/Title is required"),
  termStart: z.string().min(1, "Term start date is required"),
  termEnd: z.string().min(1, "Term end date is required"),
  contact: contactSchema,
  biography: z.string().optional(),
  district: z.string().optional(),
  party: z.string().optional(),
  ward: z.string().optional(), // Add ward field
  officeAddress: z.string().optional(),
  officeHours: z.string().optional(),
  status: z.string().optional(),
  experience: z.array(roleExperienceSchema).default([]),
  committees: z.array(committeeMembershipSchema).default([]),
  achievements: z.array(achievementSchema).default([]),
})

// Schema for registration (includes password)
export const officialRegistrationSchema = officialFormSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

// Type inference
export type OfficialFormData = z.infer<typeof officialFormSchema>
export type OfficialRegistrationData = z.infer<typeof officialRegistrationSchema>
export type RoleExperienceData = z.infer<typeof roleExperienceSchema>
export type CommitteeMembershipData = z.infer<typeof committeeMembershipSchema>
export type AchievementData = z.infer<typeof achievementSchema>
