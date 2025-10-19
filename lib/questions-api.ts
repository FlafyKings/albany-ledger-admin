/**
 * Questions API Client
 * API client for Questions & Answers system - follows the same pattern as issues-api.ts
 */

import { api, type ApiResponse } from './api-client'

// ==================== TYPE DEFINITIONS ====================

export interface QuestionCategory {
  id: number
  name: string
  description?: string
  icon?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface Question {
  id: number
  short_id: string
  question: string
  category_id: number
  status: 'pending' | 'answered'
  answer?: string
  answered_at?: string
  submitter_name?: string
  submitter_email?: string
  is_anonymous: boolean
  created_at: string
  updated_at: string
  category_name?: string
  category_icon?: string
}

export interface QuestionStatistics {
  total_questions: number
  pending_questions: number
  answered_questions: number
  questions_by_category: Array<{ category_id: number; count: number; issue_categories?: { name: string } }>
  recent_questions: Question[]
}

export interface SearchFilters {
  search?: string
  category_id?: number
  status?: string
  is_anonymous?: boolean
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

// ==================== API FUNCTIONS ====================

// Question Categories
export const categoriesApi = {
  list: async (): Promise<ApiResponse<{ categories: QuestionCategory[]; total: number }>> => {
    const result = await api.get<{ categories: QuestionCategory[]; total: number }>('/api/questions/categories')
    // Handle 404 gracefully - return empty array if endpoints don't exist yet
    if (!result.success && result.error?.includes('404')) {
      return { success: true, data: { categories: [], total: 0 } }
    }
    return result
  },
    
  get: (id: number): Promise<ApiResponse<QuestionCategory>> =>
    api.get(`/api/questions/categories/${id}`),
    
  create: (data: { name: string; description?: string; icon?: string }): Promise<ApiResponse<QuestionCategory>> =>
    api.post('/api/questions/categories', data),
    
  update: (id: number, data: { name?: string; description?: string; icon?: string }): Promise<ApiResponse<QuestionCategory>> =>
    api.put(`/api/questions/categories/${id}`, data),
    
  delete: (id: number): Promise<ApiResponse<{ message: string }>> =>
    api.delete(`/api/questions/categories/${id}`)
}

// Questions  
export const questionsOperations = {
  list: async (filters?: SearchFilters): Promise<ApiResponse<{ questions: Question[]; total: number; limit: number; offset: number }>> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const queryString = params.toString()
    const endpoint = queryString ? `/api/questions?${queryString}` : '/api/questions'
    const result = await api.get<{ questions: Question[]; total: number; limit: number; offset: number }>(endpoint)
    // Handle 404 gracefully - return empty array if endpoints don't exist yet
    if (!result.success && result.error?.includes('404')) {
      return { success: true, data: { questions: [], total: 0, limit: filters?.limit || 20, offset: filters?.offset || 0 } }
    }
    return result
  },
  
  get: (id: number): Promise<ApiResponse<Question>> =>
    api.get(`/api/questions/${id}`),
    
  getByShortId: (shortId: string): Promise<ApiResponse<Question>> =>
    api.get(`/api/questions/track/${shortId}`),
    
  create: (data: {
    question: string
    category_id: number
    is_anonymous?: boolean
    submitter_name?: string
    submitter_email?: string
  }): Promise<ApiResponse<Question>> =>
    api.post('/api/questions', data),
    
  update: (id: number, data: {
    question?: string
    category_id?: number
    is_anonymous?: boolean
    submitter_name?: string
    submitter_email?: string
  }): Promise<ApiResponse<Question>> =>
    api.put(`/api/questions/${id}`, data),
    
  answer: (id: number, data: { answer: string }): Promise<ApiResponse<{ message: string; question: Question }>> =>
    api.put(`/api/questions/${id}/answer`, data),
    
  delete: (id: number): Promise<ApiResponse<{ message: string }>> =>
    api.delete(`/api/questions/${id}`)
}

// Health check
export const healthApi = {
  check: (): Promise<ApiResponse<{ status: string; service: string; timestamp: string }>> =>
    api.get('/api/questions/health')
}

// ==================== COMBINED API CLIENT ====================

// Legacy compatibility - combines all APIs into one object like the old structure
const questionsApiClient = {
  // Categories
  listCategories: categoriesApi.list,
  getCategory: categoriesApi.get,
  createCategory: categoriesApi.create,
  updateCategory: categoriesApi.update,
  deleteCategory: categoriesApi.delete,
  
  // Questions
  listQuestions: questionsOperations.list,
  getQuestion: questionsOperations.get,
  getQuestionByShortId: questionsOperations.getByShortId,
  createQuestion: questionsOperations.create,
  updateQuestion: questionsOperations.update,
  answerQuestion: questionsOperations.answer,
  deleteQuestion: questionsOperations.delete,
  
  // Health
  healthCheck: healthApi.check
}

// Export the legacy client for backward compatibility
export const questionsApi = questionsApiClient

// ==================== UTILITY FUNCTIONS ====================

export const questionsUtils = {
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'answered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  },

  getStatusLabel: (status: string): string => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'answered':
        return 'Answered'
      default:
        return status
    }
  },

  getStatusIcon: (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'answered':
        return '✅'
      default:
        return '❓'
    }
  }
}
