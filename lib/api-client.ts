import { createClient } from './supabase'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://albany-ledger-ac0ae29a7839.herokuapp.com'

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

// Get auth token from Supabase session
async function getAuthToken(): Promise<string | null> {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || null
  } catch (error) {
    return null
  }
}

// Generic API client for all admin panel requests
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    // Build headers - only set Content-Type if not explicitly provided
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
    }
    
    // Add custom headers, but skip undefined Content-Type
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        // Skip Content-Type if it's undefined or null
        if (key === 'Content-Type' && (value === undefined || value === null)) {
          return
        }
        if (value !== undefined && value !== null) {
          headers[key] = value as string
        }
      })
    }
    
    // Only set default Content-Type if not already provided AND not FormData
    if (!('Content-Type' in headers) && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { success: false, error: `HTTP ${response.status}: ${errorText}` }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Helper methods for common HTTP operations
export const api = {
  get: <T>(endpoint: string) => apiCall<T>(endpoint, { method: 'GET' }),
  
  post: <T>(endpoint: string, body?: any) => apiCall<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  }),
  
  // Special method for FormData (file uploads)
  postForm: <T>(endpoint: string, formData: FormData, customHeaders?: Record<string, string>) => {
    const headers = {
      // Don't set Content-Type for FormData, let browser set it with boundary
      'Content-Type': undefined,
      ...customHeaders,
    }
    
    return apiCall<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    })
  },
  
  put: <T>(endpoint: string, body?: any) => apiCall<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  }),
  
  patch: <T>(endpoint: string, body?: any) => apiCall<T>(endpoint, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  }),
  
  delete: <T>(endpoint: string) => apiCall<T>(endpoint, { method: 'DELETE' }),
}
