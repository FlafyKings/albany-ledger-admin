import { api } from './api-client'

// ==================== TYPE DEFINITIONS ====================

export interface EmergencyContact {
  id: number
  name: string
  department: 'Public Safety' | 'Public Works' | 'Utilities' | 'Health Services'
  emergency_number: string
  non_emergency_number?: string
  after_hours_number?: string
  hours?: string
  address?: string
  email?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface BreakingNewsAlert {
  id: number
  title: string
  content: string
  type: 'Emergency' | 'Weather' | 'Traffic' | 'Announcement'
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'Active' | 'Scheduled' | 'Expired' | 'Draft'
  publish_date?: string
  expiration_date?: string
  channels: string[]
  author: string
  views: number
  created_at: string
  updated_at: string
}

export interface Article {
  id: number
  title: string
  excerpt?: string
  content?: string
  category?: string
  status: 'Published' | 'Draft' | 'Archived'
  featured: boolean
  author: string
  publish_date?: string
  image_url?: string

  views: number
  slug: string
  meta_description?: string
  created_at: string
  updated_at: string
}

export interface CreateEmergencyContactData {
  name: string
  department: string
  emergency_number: string
  non_emergency_number?: string
  after_hours_number?: string
  hours?: string
  address?: string
  email?: string
  notes?: string
}

export interface CreateBreakingNewsData {
  title: string
  content: string
  type: string
  priority: string
  status?: string
  publish_date?: string
  expiration_date?: string
  channels?: string[]
  author: string
}

export interface CreateArticleData {
  title: string
  excerpt?: string
  content?: string
  category?: string
  status?: string
  featured?: boolean
  author: string
  publish_date?: string
  image_url?: string

  meta_description?: string
}

// ==================== EMERGENCY CONTACTS API ====================

export const emergencyContactsApi = {
  // List all emergency contacts
  list: (params?: { search?: string; department?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.department) searchParams.append('department', params.department)
    const query = searchParams.toString()
    return api.get<EmergencyContact[]>(`/api/emergency-contacts${query ? '?' + query : ''}`)
  },

  // Get specific emergency contact
  get: (id: number) => api.get<EmergencyContact>(`/api/emergency-contacts/${id}`),

  // Create new emergency contact
  create: (data: CreateEmergencyContactData) => 
    api.post<EmergencyContact>('/api/emergency-contacts', data),

  // Update emergency contact
  update: (id: number, data: Partial<CreateEmergencyContactData>) => 
    api.put<EmergencyContact>(`/api/emergency-contacts/${id}`, data),

  // Delete emergency contact
  delete: (id: number) => api.delete(`/api/emergency-contacts/${id}`),
}

// ==================== BREAKING NEWS ALERTS API ====================

export const breakingNewsApi = {
  // List all breaking news alerts
  list: (params?: { search?: string; type?: string; priority?: string; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.type) searchParams.append('type', params.type)
    if (params?.priority) searchParams.append('priority', params.priority)
    if (params?.status) searchParams.append('status', params.status)
    const query = searchParams.toString()
    return api.get<BreakingNewsAlert[]>(`/newsletter/admin/alerts${query ? '?' + query : ''}`)
  },

  // Get specific breaking news alert
  get: (id: number) => api.get<BreakingNewsAlert>(`/newsletter/admin/alerts/${id}`),

  // Create new breaking news alert
  create: (data: CreateBreakingNewsData) => 
    api.post<BreakingNewsAlert>('/newsletter/admin/alerts', data),

  // Update breaking news alert - only title, content, and website toggle
  update: (id: number, data: { title?: string; content?: string; website?: boolean }) => 
    api.put<BreakingNewsAlert>(`/api/breaking-news/${id}`, data),

  // Delete breaking news alert
  delete: (id: number) => api.delete(`/newsletter/admin/alerts/${id}`),

  // Increment view count
  incrementViews: (id: number) => api.post(`/api/breaking-news/${id}/view`, {}),

  // Publish breaking news alert
  publish: (id: number) => api.post(`/api/breaking-news/${id}/publish`, {}),

  // Expire breaking news alert
  expire: (id: number) => api.post(`/api/breaking-news/${id}/expire`, {}),

  // Duplicate breaking news alert
  duplicate: (id: number) => api.post<BreakingNewsAlert>(`/api/breaking-news/${id}/duplicate`, {}),

  // Send alert to subscribers
  send: (id: number) => api.post(`/newsletter/admin/alerts/${id}/send`, {}),
}

// ==================== ARTICLES API ====================

export const articlesApi = {
  // List all articles
  list: (params?: { 
    search?: string; 
    category?: string; 
    status?: string; 
    featured?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.category) searchParams.append('category', params.category)
    if (params?.status) searchParams.append('status', params.status)
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())
    const query = searchParams.toString()
    return api.get<Article[]>(`/api/articles${query ? '?' + query : ''}`)
  },

  // Get specific article
  get: (id: number) => api.get<Article>(`/api/articles/${id}`),

  // Get article by slug
  getBySlug: (slug: string) => api.get<Article>(`/api/articles/slug/${slug}`),

  // Create new article
  create: (data: CreateArticleData) => api.post<Article>('/api/articles', data),

  // Update article
  update: (id: number, data: Partial<CreateArticleData>) => 
    api.put<Article>(`/api/articles/${id}`, data),

  // Delete article
  delete: (id: number) => api.delete(`/api/articles/${id}`),

  // Increment view count
  incrementViews: (id: number) => api.post(`/api/articles/${id}/view`, {}),

  // Publish article
  publish: (id: number) => api.post(`/api/articles/${id}/publish`, {}),

  // Unpublish article
  unpublish: (id: number) => api.post(`/api/articles/${id}/unpublish`, {}),

  // Toggle featured status
  toggleFeatured: (id: number) => api.post(`/api/articles/${id}/toggle-featured`, {}),

  // Duplicate article
  duplicate: (id: number) => api.post<Article>(`/api/articles/${id}/duplicate`, {}),
}

// ==================== BULK OPERATIONS ====================

// ==================== PUBLIC API ====================

export const publicApi = {
  // Get public emergency contacts
  getEmergencyContacts: () => api.get<EmergencyContact[]>('/api/public/emergency-contacts'),

  // Get active breaking news
  getActiveBreakingNews: () => api.get<BreakingNewsAlert[]>('/api/public/breaking-news/active'),

  // Get published articles
  getPublishedArticles: (params?: { limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())
    const query = searchParams.toString()
    return api.get<Article[]>(`/api/public/articles/published${query ? '?' + query : ''}`)
  },

  // Get featured articles
  getFeaturedArticles: () => api.get<Article[]>('/api/public/articles/featured'),
}

// ==================== ANALYTICS API ====================

export const analyticsApi = {
  // Get content statistics
  getContentStats: () => api.get<{
    emergency_contacts: number;
    breaking_news: number;
    articles: number;
    published_articles: number;
    total_views: number;
  }>('/api/content/stats'),
}

// ==================== UTILITY FUNCTIONS ====================

export const contentUtils = {
  // Generate slug from title
  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  },

  // Format date for display
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  // Get priority color class
  getPriorityColor: (priority: string): string => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  },

  // Get status color class
  getStatusColor: (status: string): string => {
    switch (status) {
      case 'Active':
      case 'Published': return 'bg-green-100 text-green-800'
      case 'Scheduled': return 'bg-blue-100 text-blue-800'
      case 'Draft': return 'bg-yellow-100 text-yellow-800'
      case 'Expired':
      case 'Archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
}
