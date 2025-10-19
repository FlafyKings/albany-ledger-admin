import { api } from './api-client'

// ==================== TYPE DEFINITIONS ====================

export interface DocumentCategory {
  id: number
  display_name: string
  description?: string
  color_hex: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  document_count?: number
}

export interface Document {
  id: number
  title: string
  description?: string
  category_id: number
  category_name?: string
  category_color?: string
  document_type: 'file' | 'external_link'
  file_url?: string
  file_name?: string
  file_size?: number
  external_url?: string
  upload_date: string
  publish_date: string
  download_count: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface DocumentListParams {
  search?: string
  category_id?: number
  document_type?: 'file' | 'external_link'
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
  sort_by?: 'title' | 'upload_date' | 'publish_date' | 'view_count'
  sort_order?: 'asc' | 'desc'
}

export interface CreateDocumentData {
  title: string
  description?: string
  category_id: number
  document_type: 'file' | 'external_link'
  external_url?: string
}

export interface UpdateDocumentData {
  title?: string
  description?: string
  category_id?: number
  external_url?: string
}

export interface DocumentSearchResult {
  documents: Document[]
  total_count: number
  categories: DocumentCategory[]
  facets: {
    categories: Array<{ category_id: number; count: number }>
    document_types: Array<{ type: string; count: number }>
  }
}

export interface DocumentStats {
  total_documents: number
  total_categories: number
  documents_by_category: Array<{ category: DocumentCategory; count: number }>
  top_documents: Document[]
  recent_uploads: Document[]
}

export interface CreateCategoryData {
  display_name: string
  description?: string
  color_hex: string
  sort_order?: number
}

export interface UpdateCategoryData {
  display_name?: string
  description?: string
  color_hex?: string
  sort_order?: number
  is_active?: boolean
}

export interface CategoryOrderData {
  id: number
  sort_order: number
}

// ==================== DOCUMENTS API ====================

export const documentsApi = {
  // List documents with filtering
  list: (params?: DocumentListParams) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.category_id) searchParams.append('category_id', params.category_id.toString())
    if (params?.document_type) searchParams.append('document_type', params.document_type)
    if (params?.date_from) searchParams.append('date_from', params.date_from)
    if (params?.date_to) searchParams.append('date_to', params.date_to)
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())
    if (params?.sort_by) searchParams.append('sort_by', params.sort_by)
    if (params?.sort_order) searchParams.append('sort_order', params.sort_order)
    
    const query = searchParams.toString()
    return api.get<Document[]>(`/api/documents${query ? '?' + query : ''}`)
  },

  // Get specific document
  get: (id: number) => api.get<Document>(`/api/documents/${id}`),

  // Create new document (with optional file)
  create: (data: CreateDocumentData, file?: File) => {
    if (file && data.document_type === 'file') {
      // Send as multipart form data when file is included
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('category_id', data.category_id.toString())
      formData.append('document_type', data.document_type)
      if (data.description) formData.append('description', data.description)
      formData.append('file', file)
      
      return api.postForm<Document>('/api/documents', formData)
    } else {
      // Send as JSON for external links
      return api.post<Document>('/api/documents', data)
    }
  },

  // Update document
  update: (id: number, data: UpdateDocumentData) => 
    api.put<Document>(`/api/documents/${id}`, data),

  // Delete document
  delete: (id: number) => api.delete(`/api/documents/${id}`),

  // Upload PDF file
  uploadFile: (id: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.postForm<{ message: string; file_url: string; document: Document }>(`/api/documents/${id}/upload`, formData)
  },

  // Delete PDF file
  deleteFile: (id: number) => 
    api.delete<{ message: string; document: Document }>(`/api/documents/${id}/file`),

  // Advanced search
  search: (params?: DocumentListParams) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.category_id) searchParams.append('category_id', params.category_id.toString())
    if (params?.document_type) searchParams.append('document_type', params.document_type)
    if (params?.date_from) searchParams.append('date_from', params.date_from)
    if (params?.date_to) searchParams.append('date_to', params.date_to)
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())
    if (params?.sort_by) searchParams.append('sort_by', params.sort_by)
    if (params?.sort_order) searchParams.append('sort_order', params.sort_order)
    
    const query = searchParams.toString()
    return api.get<DocumentSearchResult>(`/api/documents/search${query ? '?' + query : ''}`)
  },

  // Get statistics
  getStats: () => api.get<DocumentStats>('/api/documents/stats'),
}

// ==================== CATEGORIES API ====================

export const categoriesApi = {
  // List all categories
  list: () => api.get<DocumentCategory[]>('/api/document-categories'),

  // Get specific category
  get: (id: number) => api.get<DocumentCategory>(`/api/document-categories/${id}`),

  // Create new category
  create: (data: CreateCategoryData) => api.post<DocumentCategory>('/api/document-categories', data),

  // Update category
  update: (id: number, data: UpdateCategoryData) => 
    api.put<DocumentCategory>(`/api/document-categories/${id}`, data),

  // Delete category
  delete: (id: number) => api.delete(`/api/document-categories/${id}`),

  // Reorder categories
  reorder: (orderData: CategoryOrderData[]) => 
    api.post<{ message: string }>('/api/document-categories/reorder', orderData),
}

// ==================== HELPER FUNCTIONS ====================

export const documentsUtils = {
  // Format file size
  formatFileSize: (bytes?: number): string => {
    if (!bytes) return 'Unknown'
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  },

  // Format date
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString()
  },

  // Get file icon class based on file extension
  getFileIconColor: (fileName?: string, documentType?: string): string => {
    if (documentType === 'external_link') {
      return 'text-blue-600'
    }
    
    if (!fileName) return 'text-gray-600'
    
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return 'text-red-600'
      case 'doc':
      case 'docx':
        return 'text-blue-600'
      case 'xls':
      case 'xlsx':
        return 'text-green-600'
      case 'ppt':
      case 'pptx':
        return 'text-orange-600'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'webp':
        return 'text-purple-600'
      case 'zip':
      case 'rar':
      case '7z':
        return 'text-yellow-600'
      case 'txt':
      case 'md':
        return 'text-gray-700'
      default:
        return 'text-gray-600'
    }
  },


}
