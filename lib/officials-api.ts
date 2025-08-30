import { api, type ApiResponse } from './api-client'
import type { Official, CommitteeCatalogItem } from '@/data/officials'

// ==================== OFFICIALS API ====================

export const officialsApi = {
  // List all officials with optional filtering
  list: (params?: { 
    search?: string; 
    role?: string; 
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.role) searchParams.append('role', params.role)
    if (params?.status) searchParams.append('status', params.status)
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())
    const query = searchParams.toString()
    return api.get<Official[]>(`/api/officials${query ? '?' + query : ''}`)
  },

  // Get specific official
  get: (id: number) => api.get<Official>(`/api/officials/${id}`),

  // Create new official
  create: (data: any) => api.post<Official>('/api/officials', data),

  // Update official
  update: (id: number, data: any) => 
    api.put<Official>(`/api/officials/${id}`, data),

  // Delete official
  delete: (id: number) => api.delete(`/api/officials/${id}`),

  // Upload profile picture
  uploadProfilePicture: (id: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.postForm<{ image_url: string; official: any }>(`/api/officials/${id}/profile-picture`, formData)
  },

  // Delete profile picture
  deleteProfilePicture: (id: number) => 
    api.delete<{ official: any }>(`/api/officials/${id}/profile-picture`),

  // Get current user's profile (uses auth token)
  getProfile: () => api.get<Official>('/api/profile'),
}

// ==================== COMMITTEES API ====================

export const committeesApi = {
  // List all committees
  list: () => api.get<CommitteeCatalogItem[]>('/api/committees'),

  // Get specific committee
  get: (id: number) => api.get<CommitteeCatalogItem>(`/api/committees/${id}`),

  // Create new committee
  create: (data: Omit<CommitteeCatalogItem, 'id'>) => 
    api.post<CommitteeCatalogItem>('/api/committees', data),

  // Update committee
  update: (id: number, data: Partial<Omit<CommitteeCatalogItem, 'id'>>) => 
    api.put<CommitteeCatalogItem>(`/api/committees/${id}`, data),

  // Delete committee
  delete: (id: number) => api.delete(`/api/committees/${id}`),
}

// ==================== PUBLIC API (No Auth Required) ====================

export const publicOfficialsApi = {
  // Get all public officials (no auth required)
  list: () => api.get<Official[]>('/api/public/officials'),

  // Get specific public official (no auth required)
  get: (id: number) => api.get<Official>(`/api/public/officials/${id}`),

  // Get all public committees (no auth required)
  getCommittees: () => api.get<CommitteeCatalogItem[]>('/api/public/committees'),
}

// ==================== MIGRATION HELPERS ====================

// Helper function to transform API response to match existing data structure
export function transformApiOfficial(apiOfficial: any): Official {
  return {
    id: apiOfficial.id,
    name: apiOfficial.name,
    roleTitle: apiOfficial.roleTitle || apiOfficial.role_title || '',
    termStart: apiOfficial.termStart || apiOfficial.term_start || '',
    termEnd: apiOfficial.termEnd || apiOfficial.term_end || '',
    contact: {
      email: apiOfficial.email,
      phone: apiOfficial.phone,
      office: {
        addressLine1: apiOfficial.officeAddress || apiOfficial.office_address || '',
        addressLine2: apiOfficial.district || '',
        city: 'Albany',
        state: 'NY',
        zip: '12207',
        room: undefined,
        hours: apiOfficial.officeHours || apiOfficial.office_hours || '',
      },
    },
    biography: apiOfficial.biography || '',
    experience: (apiOfficial.experience || []).map((exp: any) => ({
      id: String(exp.id || crypto.randomUUID()),
      title: exp.title,
      organization: exp.organization,
      startDate: exp.startDate || exp.start_date || '',
      endDate: exp.endDate || exp.end_date || '',
      description: exp.description,
    })),
    committees: (apiOfficial.committees || []).map((comm: any) => ({
      id: String(comm.id || crypto.randomUUID()),
      committeeId: comm.committeeId || comm.committee_id || 1,
      name: `Committee ${comm.committeeId || comm.committee_id || 1}`, // We'll need to fetch committee names separately
      role: comm.role,
    })),
    votingHistory: [], // Not in current API response
    achievements: (apiOfficial.achievements || []).map((ach: any) => ({
      id: String(ach.id || crypto.randomUUID()),
      title: ach.title,
      description: ach.description,
      period: ach.period,
    })),
    image: apiOfficial.imageUrl || apiOfficial.image_url || '/placeholder.svg?height=64&width=64',
  }
}

// Helper function to transform official data for API submission
export function transformForApi(official: Partial<Official>): any {
  // Ensure we have the required fields
  if (!official.name || !official.contact?.email || !official.contact?.phone) {
    throw new Error('Name, email, and phone are required fields')
  }

  if (!official.roleTitle) {
    throw new Error('Role/Title is required')
  }

  if (!official.termStart) {
    throw new Error('Term start date is required')
  }

  if (!official.termEnd) {
    throw new Error('Term end date is required')
  }

  return {
    name: official.name,
    role_title: official.roleTitle,
    term_start: official.termStart,
    term_end: official.termEnd,
    email: official.contact.email,
    phone: official.contact.phone,
    biography: official.biography || '',
    district: official.contact?.office?.addressLine2 || 'Citywide',
    party: 'Democrat', // Default value since not in current schema
    office_address: official.contact?.office?.addressLine1 || '',
    office_hours: official.contact?.office?.hours || '',
    status: 'active', // Default status as expected by backend
    // Committees - backend expects only committee_id and role
    committees: official.committees?.map(comm => ({
      committee_id: comm.committeeId || 1,
      role: comm.role || 'Member',
    })) || [],
    // Experience - backend expects title, organization, start_date, end_date, description
    experience: official.experience?.map(exp => ({
      title: exp.title || '',
      organization: exp.organization || '',
      start_date: exp.startDate || '',
      end_date: exp.endDate || '',
      description: exp.description || '',
    })) || [],
    // Achievements - backend expects title, description, period
    achievements: official.achievements?.map(ach => ({
      title: ach.title || '',
      description: ach.description || '',
      period: ach.period || '',
    })) || [],
  }
}
