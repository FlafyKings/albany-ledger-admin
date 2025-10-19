/**
 * Issues API Client
 * API client for Enhanced Issue Reporting System - follows the same pattern as documents-api.ts
 */

import { api, type ApiResponse } from './api-client'

// ==================== TYPE DEFINITIONS ====================

export interface IssueCategory {
  id: number
  name: string
  description?: string
  icon?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface IssuePhoto {
  id: number
  issue_id: number
  file_url: string
  file_name: string
  file_size?: number
  caption?: string
  sort_order: number
  uploaded_by?: string
  upload_type: 'initial' | 'update' | 'resolution'
  created_at: string
}

export interface IssueUpdate {
  id: number
  issue_id: number
  old_status?: string
  new_status?: string
  update_type: 'status_change' | 'message' | 'resolution' | 'system'
  title?: string
  description: string
  is_public: boolean
  is_automated: boolean
  created_by: string
  created_at: string
}

export interface Issue {
  id: number
  short_id: string
  title: string
  description: string
  category_id: number
  status: 'submitted' | 'under_review' | 'in_progress' | 'resolved' | 'closed' | 'on_hold'
  location_address?: string
  latitude?: number
  longitude?: number
  ward?: string
  district?: string
  reporter_name: string
  reporter_email: string
  view_count: number
  created_at: string
  updated_at: string
  category_name?: string
  category_icon?: string
  photos?: IssuePhoto[]
  updates?: IssueUpdate[]
}

export interface IssueStatistics {
  total_issues: number
  total_categories: number
  issues_by_status: Array<{ status: string; count: number }>
  issues_by_category: Array<{ category_id: number; count: number; issue_categories?: { name: string } }>
  issues_by_location: Array<{ ward?: string; district?: string; count: number }>
  recent_issues: Issue[]
}

export interface SearchFilters {
  search?: string
  category_id?: number
  status?: string
  reporter_email?: string
  ward?: string
  district?: string
  date_from?: string
  date_to?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

// ==================== API FUNCTIONS ====================

// Issue Categories
export const categoriesApi = {
  list: async (): Promise<ApiResponse<{ categories: IssueCategory[]; total: number }>> => {
    const result = await api.get<{ categories: IssueCategory[]; total: number }>('/api/issues/categories')
    // Handle 404 gracefully - return empty array if endpoints don't exist yet
    if (!result.success && result.error?.includes('404')) {
      return { success: true, data: { categories: [], total: 0 } }
    }
    return result
  },
    
  get: (id: number): Promise<ApiResponse<IssueCategory>> =>
    api.get(`/api/issues/categories/${id}`),
    
  create: (data: { name: string; description?: string; icon?: string }): Promise<ApiResponse<IssueCategory>> =>
    api.post('/api/issues/categories', data),
    
  update: (id: number, data: { name?: string; description?: string; icon?: string }): Promise<ApiResponse<IssueCategory>> =>
    api.put(`/api/issues/categories/${id}`, data),
    
  delete: (id: number): Promise<ApiResponse<{ message: string }>> =>
    api.delete(`/api/issues/categories/${id}`)
}

// Issues  
export const issuesOperations = {
  list: async (filters?: SearchFilters): Promise<ApiResponse<{ issues: Issue[]; total: number; limit: number; offset: number }>> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const queryString = params.toString()
    const endpoint = queryString ? `/api/issues?${queryString}` : '/api/issues'
    const result = await api.get<{ issues: Issue[]; total: number; limit: number; offset: number }>(endpoint)
    // Handle 404 gracefully - return empty array if endpoints don't exist yet
    if (!result.success && result.error?.includes('404')) {
      return { success: true, data: { issues: [], total: 0, limit: filters?.limit || 20, offset: filters?.offset || 0 } }
    }
    return result
  },
  
  get: (id: number): Promise<ApiResponse<Issue>> =>
    api.get(`/api/issues/${id}`),
    
  getByShortId: (shortId: string): Promise<ApiResponse<Issue>> =>
    api.get(`/api/issues/track/${shortId}`),
    
  create: async (data: {
    title: string
    description: string
    category_id: number
    location?: string
    reporter_name?: string
    reporter_email?: string
    photos?: File[]
  }): Promise<ApiResponse<Issue>> => {
    try {
      if (data.photos && data.photos.length > 0) {
        // Send as multipart form data when photos are included
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('description', data.description)
        formData.append('category_id', data.category_id.toString())
        formData.append('reporter_name', data.reporter_name || '')
        formData.append('reporter_email', data.reporter_email || '')
        if (data.location) formData.append('location', data.location)
        
        // Append all photos
        data.photos.forEach(photo => {
          formData.append('photos', photo)
        })
        
        const result = await api.postForm<Issue>('/api/issues', formData)
        return result
      } else {
        // Send as JSON when no photos
        const { photos, ...jsonData } = data
        const result = await api.post<Issue>('/api/issues', jsonData)
        return result
      }
    } catch (error) {
      throw error
    }
  },
    
  update: (id: number, data: {
    title?: string
    description?: string
    category_id?: number
    location_address?: string
    latitude?: number
    longitude?: number
    ward?: string
    district?: string
  }): Promise<ApiResponse<Issue>> =>
    api.put(`/api/issues/${id}`, data),
    
  updateStatus: (id: number, data: { status: string; description?: string }): Promise<ApiResponse<{ message: string; issue: Issue }>> =>
    api.put(`/api/issues/${id}/status`, data),
    
  delete: (id: number): Promise<ApiResponse<{ message: string }>> =>
    api.delete(`/api/issues/${id}`)
}

// Issue Updates
export const updatesApi = {
  list: (issueId: number): Promise<ApiResponse<{ updates: IssueUpdate[]; total: number }>> =>
    api.get(`/api/issues/${issueId}/updates`),
    
  create: (issueId: number, data: {
    update_type: 'status_change' | 'message' | 'resolution' | 'system'
    title?: string
    description: string
    is_public?: boolean
    is_automated?: boolean
    new_status?: string
  }): Promise<ApiResponse<IssueUpdate>> =>
    api.post(`/api/issues/${issueId}/updates`, data),
    
  update: (updateId: number, data: {
    title?: string
    description?: string
    is_public?: boolean
  }): Promise<ApiResponse<IssueUpdate>> =>
    api.put(`/api/issues/updates/${updateId}`, data),
    
  delete: (updateId: number): Promise<ApiResponse<{ message: string }>> =>
    api.delete(`/api/issues/updates/${updateId}`)
}

// Photos
export const photosApi = {
  list: (issueId: number): Promise<ApiResponse<{ photos: IssuePhoto[]; total: number }>> =>
    api.get(`/api/issues/${issueId}/photos`),
    
  upload: async (issueId: number, files: FileList): Promise<ApiResponse<{
    message: string
    uploaded_photos: IssuePhoto[]
    failed_uploads: string[]
  }>> => {
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i])
    }
    return api.postForm(`/api/issues/${issueId}/photos`, formData)
  },
  
  delete: (photoId: number): Promise<ApiResponse<{ message: string }>> =>
    api.delete(`/api/issues/photos/${photoId}`),
    
  update: (issueId: number, photoId: number, data: {
    caption?: string
    sort_order?: number
  }): Promise<ApiResponse<IssuePhoto>> =>
    api.put(`/api/issues/${issueId}/photos/${photoId}`, data)
}

// Search and Statistics
export const searchApi = {
  search: (filters: SearchFilters): Promise<ApiResponse<{
    issues: Issue[]
    total_count: number
    categories: IssueCategory[]
    facets: {
      categories: any[]
      statuses: any[]
    }
  }>> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    const queryString = params.toString()
    return api.get(`/api/issues/search?${queryString}`)
  },
  
  statistics: async (): Promise<ApiResponse<IssueStatistics>> => {
    const result = await api.get<IssueStatistics>('/api/issues/statistics')
    // Handle 404 gracefully - return empty statistics if endpoints don't exist yet
    if (!result.success && result.error?.includes('404')) {
      return { 
        success: true, 
        data: {
          total_issues: 0,
          total_categories: 0,
          issues_by_status: [],
          issues_by_category: [],
          issues_by_location: [],
          recent_issues: []
        }
      }
    }
    return result
  }
}

// Health check
export const healthApi = {
  check: (): Promise<ApiResponse<{ status: string; service: string; timestamp: string }>> =>
    api.get('/api/issues/health')
}

// ==================== SHORT ID API WRAPPERS ====================

// Helper function to get numeric ID from short ID
const getNumericIdFromShortId = async (shortId: string): Promise<number> => {
  const result = await issuesOperations.getByShortId(shortId)
  if (!result.success || !result.data) {
    throw new Error(`Failed to get issue by short ID: ${shortId}`)
  }
  return result.data.id
}

// API functions that work with short_id (for admin convenience)
export const shortIdApi = {
  // Get issue updates by short ID
  getIssueUpdates: async (shortId: string): Promise<ApiResponse<{ updates: IssueUpdate[]; total: number }>> => {
    const numericId = await getNumericIdFromShortId(shortId)
    return updatesApi.list(numericId)
  },
  
  // Get issue photos by short ID  
  getIssuePhotos: async (shortId: string): Promise<ApiResponse<{ photos: IssuePhoto[]; total: number }>> => {
    const numericId = await getNumericIdFromShortId(shortId)
    return photosApi.list(numericId)
  },
  
  // Update issue status by short ID
  updateIssueStatus: async (shortId: string, data: { status: string; description?: string }): Promise<ApiResponse<{ message: string; issue: Issue }>> => {
    const numericId = await getNumericIdFromShortId(shortId)
    return issuesOperations.updateStatus(numericId, data)
  },
  
  // Create issue update by short ID
  createIssueUpdate: async (shortId: string, data: {
    update_type: 'status_change' | 'message' | 'resolution' | 'system'
    title?: string
    description: string
    is_public?: boolean
    is_automated?: boolean
    new_status?: string
  }): Promise<ApiResponse<IssueUpdate>> => {
    const numericId = await getNumericIdFromShortId(shortId)
    return updatesApi.create(numericId, data)
  },
  
  // Update issue by short ID
  updateIssue: async (shortId: string, data: {
    title?: string
    description?: string
    category_id?: number
    location_address?: string
    latitude?: number
    longitude?: number
    ward?: string
    district?: string
  }): Promise<ApiResponse<Issue>> => {
    const numericId = await getNumericIdFromShortId(shortId)
    return issuesOperations.update(numericId, data)
  },
  
  // Delete issue by short ID
  deleteIssue: async (shortId: string): Promise<ApiResponse<{ message: string }>> => {
    const numericId = await getNumericIdFromShortId(shortId)
    return issuesOperations.delete(numericId)
  }
}

// ==================== COMBINED API CLIENT ====================

// Legacy compatibility - combines all APIs into one object like the old structure
const issuesApiClient = {
  // Categories
  listCategories: categoriesApi.list,
  getCategory: categoriesApi.get,
  createCategory: categoriesApi.create,
  updateCategory: categoriesApi.update,
  deleteCategory: categoriesApi.delete,
  
  // Issues
  listIssues: issuesOperations.list,
  getIssue: issuesOperations.get,
  getIssueByShortId: issuesOperations.getByShortId,
  createIssue: issuesOperations.create,
  updateIssue: issuesOperations.update,
  updateIssueStatus: issuesOperations.updateStatus,
  deleteIssue: issuesOperations.delete,
  
  // Updates
  getIssueUpdates: updatesApi.list,
  createIssueUpdate: updatesApi.create,
  updateIssueUpdate: updatesApi.update,
  deleteIssueUpdate: updatesApi.delete,
  
  // Photos
  getIssuePhotos: photosApi.list,
  uploadIssuePhotos: photosApi.upload,
  deleteIssuePhoto: photosApi.delete,
  updateIssuePhoto: photosApi.update,
  
  // Search & Stats
  searchIssues: searchApi.search,
  getStatistics: searchApi.statistics,
  
  // Health
  healthCheck: healthApi.check,
  
  // Short ID convenience methods
  shortId: shortIdApi
}

// Export the legacy client for backward compatibility
export const issuesApi = issuesApiClient

// ==================== UTILITY FUNCTIONS ====================

export const issuesUtils = {
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  },

  formatDateTime: (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  },

  getStatusColor: (status: string): string => {
    switch (status) {
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800'
      case 'under_review':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-purple-100 text-purple-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      case 'on_hold':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  },

  getStatusLabel: (status: string): string => {
    switch (status) {
      case 'submitted':
        return 'Submitted'
      case 'under_review':
        return 'Under Review'
      case 'in_progress':
        return 'In Progress'
      case 'resolved':
        return 'Resolved'
      case 'closed':
        return 'Closed'
      case 'on_hold':
        return 'On Hold'
      default:
        return status
    }
  },

  getUpdateTypeLabel: (type: string): string => {
    switch (type) {
      case 'status_change':
        return 'Status Change'
      case 'message':
        return 'Message'
      case 'resolution':
        return 'Resolution'
      case 'system':
        return 'System'
      default:
        return type
    }
  },

  formatFileSize: (bytes?: number): string => {
    if (!bytes) return 'Unknown'
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  },
}
