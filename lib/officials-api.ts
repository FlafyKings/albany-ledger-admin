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
    return api.get<{
      officials: Official[];
      total: number;
      limit: number;
      offset: number;
    }>(`/api/officials${query ? '?' + query : ''}`)
  },

  // Get specific official
  get: (id: number) => api.get<Official>(`/api/officials/${id}`),

  // Create new official
  create: (data: Omit<Official, 'id'>) => api.post<Official>('/api/officials', data),

  // Update official
  update: (id: number, data: Partial<Omit<Official, 'id'>>) => 
    api.put<Official>(`/api/officials/${id}`, data),

  // Delete official
  delete: (id: number) => api.delete(`/api/officials/${id}`),

  // Upload official image
  uploadImage: (id: number, imageFile: File) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    return api.post<{ imageUrl: string }>(`/api/officials/${id}/image`, formData, {
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        'Content-Type': undefined,
      },
    })
  },
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
    roleTitle: apiOfficial.roleTitle,
    termStart: apiOfficial.termStart,
    termEnd: apiOfficial.termEnd,
    contact: {
      email: apiOfficial.email,
      phone: apiOfficial.phone,
      office: {
        addressLine1: apiOfficial.officeAddress || apiOfficial.office?.addressLine1 || '',
        addressLine2: apiOfficial.office?.addressLine2,
        city: apiOfficial.office?.city || 'Albany',
        state: apiOfficial.office?.state || 'NY',
        zip: apiOfficial.office?.zip || '12207',
        room: apiOfficial.office?.room,
        hours: apiOfficial.officeHours || apiOfficial.office?.hours,
      },
    },
    biography: apiOfficial.biography || '',
    experience: apiOfficial.experience || [],
    committees: apiOfficial.committees || [],
    votingHistory: apiOfficial.votingHistory || [],
    achievements: apiOfficial.achievements || [],
    image: apiOfficial.image || '/placeholder.svg?height=64&width=64',
  }
}

// Helper function to transform official data for API submission
export function transformForApi(official: Partial<Official>): any {
  return {
    name: official.name,
    roleTitle: official.roleTitle,
    termStart: official.termStart,
    termEnd: official.termEnd,
    email: official.contact?.email,
    phone: official.contact?.phone,
    biography: official.biography,
    district: official.contact?.office?.addressLine2,
    party: '', // Not in current schema, but API expects it
    officeAddress: official.contact?.office?.addressLine1,
    officeHours: official.contact?.office?.hours,
    // Include related data if available
    committees: official.committees,
    experience: official.experience,
    achievements: official.achievements,
  }
}
