export type OfficeDetails = {
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zip: string
  room?: string
  hours?: string
}

export type RoleExperience = {
  id: string
  title: string
  organization: string
  startDate: string // YYYY-MM-DD
  endDate?: string // YYYY-MM-DD
  description?: string
}

export type CommitteeCatalogItem = {
  id: number
  name: string
  description?: string
}

export type CommitteeMembership = {
  id: string
  committeeId: number
  name: string
  role: "Chair" | "Vice Chair" | "Member"
}

export type VoteRecord = {
  id: string
  issue: string
  vote: "Yes" | "No" | "Abstain"
  result: "Passed" | "Failed"
  date: string // YYYY-MM-DD
  description?: string
}

export type Achievement = {
  id: string
  title: string
  description: string
  period?: string // e.g., Jan 2023 - Dec 2023
}

export type Official = {
  id: number
  name: string
  roleTitle: string
  termStart: string
  termEnd: string
  ward?: string // Add ward field
  contact: {
    email: string
    phone: string
    office: OfficeDetails
  }
  biography: string
  experience: RoleExperience[]
  committees: CommitteeMembership[]
  votingHistory: VoteRecord[]
  achievements: Achievement[]
  image?: string
}

// Import API client
import { officialsApi, transformApiOfficial, transformForApi } from '@/lib/officials-api'

// API-only functions - no fallback to dummy data
export async function getOfficials() {
  try {
    const result = await officialsApi.list()
    
    if (result.success && result.data) {
      // Handle different response structures
      let officials: any[] = []
      
      // Check if data is directly an array
      if (Array.isArray(result.data)) {
        officials = result.data
      } 
      // Check if data has an 'officials' property
      else if (result.data && typeof result.data === 'object' && 'officials' in result.data && Array.isArray(result.data.officials)) {
        officials = result.data.officials
      }
      // Check if data has a 'data' property
      else if (result.data && typeof result.data === 'object' && 'data' in result.data && Array.isArray(result.data.data)) {
        officials = result.data.data
      }
      // Check if data is a single object (shouldn't happen for list, but handle it)
      else if (result.data && typeof result.data === 'object' && !Array.isArray(result.data)) {
        officials = [result.data]
      }
      
      // Transform officials, filtering out any that fail transformation
      const transformed: Official[] = []
      for (const official of officials) {
        try {
          const transformedOfficial = transformApiOfficial(official)
          transformed.push(transformedOfficial)
        } catch (error) {
          // Continue processing other officials even if one fails
        }
      }
      
      return transformed
    }
    
    throw new Error(result.error || 'Failed to fetch officials')
  } catch (error) {
    console.error('Failed to load officials from API:', error)
    throw error
  }
}

export async function getOfficialById(id: number) {
  try {
    const result = await officialsApi.get(id)
    if (result.success && result.data) {
      return transformApiOfficial(result.data)
    }
    throw new Error(result.error || 'Failed to fetch official')
  } catch (error) {
    console.error('Failed to load official from API:', error)
    throw error
  }
}

export async function getOfficialByEmail(email: string) {
  try {
    const result = await officialsApi.list()
    if (result.success && result.data) {
      const officials = Array.isArray(result.data) ? result.data : []
      // Transform the officials first, then search by email
      const transformedOfficials = officials.map(transformApiOfficial)
      const official = transformedOfficials.find((o: Official) => o.contact.email === email)
      if (official) {
        return official
      }
      throw new Error('Official not found')
    }
    throw new Error(result.error || 'Failed to fetch officials')
  } catch (error) {
    console.error('Failed to load official by email from API:', error)
    throw error
  }
}

export async function getCurrentUserProfile() {
  try {
    const result = await officialsApi.getProfile()
    if (result.success && result.data) {
      return transformApiOfficial(result.data)
    }
    throw new Error(result.error || 'Failed to fetch profile')
  } catch (error) {
    console.error('Failed to load current user profile from API:', error)
    throw error
  }
}

export async function upsertOfficial(official: Official) {
  try {
    const apiData = transformForApi(official)
    const result = await officialsApi.update(official.id, apiData)
    if (result.success && result.data) {
      return transformApiOfficial(result.data)
    }
    throw new Error(result.error || 'Failed to update official')
  } catch (error) {
    console.error('Failed to update official via API:', error)
    throw error
  }
}

export async function createOfficial(partial: Omit<Official, "id">) {
  try {
    const apiData = transformForApi(partial)
    const result = await officialsApi.create(apiData)
    if (result.success && result.data) {
      return transformApiOfficial(result.data)
    }
    throw new Error(result.error || 'Failed to create official')
  } catch (error) {
    console.error('Failed to create official via API:', error)
    throw error
  }
}

export async function deleteOfficial(id: number) {
  try {
    const result = await officialsApi.delete(id)
    if (result.success) {
      return true
    }
    throw new Error(result.error || 'Failed to delete official')
  } catch (error) {
    console.error('Failed to delete official via API:', error)
    throw error
  }
}
