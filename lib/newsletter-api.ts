import { api, ApiResponse } from './api-client'

// Issue types
export type Issue = {
  id: string
  subject: string
  preheader?: string
  markdown: string
  status: 'draft' | 'scheduled' | 'sent'
  scheduled_at?: string
  sent_at?: string
  created_at: string
}

export type CreateIssuePayload = {
  subject: string
  preheader?: string
  markdown: string
  status?: 'draft' | 'scheduled' | 'sent'
  scheduled_at?: string
}

export type UpdateIssuePayload = Partial<CreateIssuePayload>

// Subscriber types
export type Subscriber = {
  id: string
  email: string
  name?: string
  status: 'pending' | 'active' | 'unsubscribed'
  confirm_token?: string
  confirmed_at?: string
  unsubscribed_at?: string
  consent_ip?: string
  consent_user_agent?: string
  consent_ts?: string
  created_at: string
  updated_at: string
}

export type SubscriberSummary = {
  pending: number
  active: number
  unsubscribed: number
}

// Stats types
export type NewsletterStats = {
  total_subscribers: number
  issues_created: number
  newsletters_sent: number
}

// Settings types
export type FooterSettings = {
  footer_address: string
}

// Issue API
export const issueApi = {
  list: async (status?: string, limit: number = 50): Promise<ApiResponse<Issue[]>> => {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    params.append('limit', limit.toString())
    
    return api.get<Issue[]>(`/newsletter/admin/issues?${params}`)
  },

  get: async (id: string): Promise<ApiResponse<Issue>> => {
    return api.get<Issue>(`/newsletter/admin/issues/${id}`)
  },

  create: async (payload: CreateIssuePayload): Promise<ApiResponse<Issue>> => {
    return api.post<Issue>('/newsletter/admin/issues', payload)
  },

  update: async (id: string, payload: UpdateIssuePayload): Promise<ApiResponse<Issue>> => {
    return api.patch<Issue>(`/newsletter/admin/issues/${id}`, payload)
  },

  testSend: async (issueId: string, toEmail: string): Promise<ApiResponse<any>> => {
    return api.post<any>(`/newsletter/admin/issues/${issueId}/test-send`, { to_email: toEmail })
  },

  bulkSend: async (issueId: string): Promise<ApiResponse<any>> => {
    return api.post<any>(`/newsletter/admin/issues/${issueId}/send`)
  },

  cancelSchedule: async (issueId: string): Promise<ApiResponse<Issue>> => {
    return api.post<Issue>(`/newsletter/admin/issues/${issueId}/cancel-schedule`)
  },
}

// Subscriber API
export const subscriberApi = {
  getSummary: async (): Promise<ApiResponse<SubscriberSummary>> => {
    return api.get<SubscriberSummary>('/newsletter/admin/subscribers/summary')
  },

  list: async (params?: { limit?: number; status?: string }): Promise<ApiResponse<Subscriber[]>> => {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    
    const url = `/newsletter/admin/subscribers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return api.get<Subscriber[]>(url)
  },
}

// Stats API
export const statsApi = {
  get: async (): Promise<ApiResponse<NewsletterStats>> => {
    return api.get<NewsletterStats>('/newsletter/admin/stats')
  },
}

// Settings API
export const settingsApi = {
  getFooterAddress: async (): Promise<ApiResponse<FooterSettings>> => {
    return api.get<FooterSettings>('/newsletter/admin/settings/footer-address')
  },

  setFooterAddress: async (footerAddress: string): Promise<ApiResponse<FooterSettings>> => {
    return api.put<FooterSettings>('/newsletter/admin/settings/footer-address', { footer_address: footerAddress })
  },
}

// Automation API
export const automationApi = {
  processScheduled: async (): Promise<ApiResponse<{ status: string; processed: number; due_count: number }>> => {
    return api.post('/newsletter/admin/process-scheduled')
  },
}
