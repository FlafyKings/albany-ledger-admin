"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import NewsletterForm, { NewsletterFormData } from "@/components/NewsletterForm"
import { issueApi } from "@/lib/newsletter-api"
import { useToast } from "@/hooks/use-toast"

export default function EditNewsletterPage() {
  const params = useParams()
  const { toast } = useToast()
  const [issue, setIssue] = useState<NewsletterFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadIssue = async () => {
      try {
        const issueId = Array.isArray(params.id) ? params.id[0] : params.id
        if (!issueId) {
          setError("No issue ID provided")
          return
        }

        const result = await issueApi.get(issueId)
        if (result.success && result.data) {
          setIssue({
            id: result.data.id,
            subject: result.data.subject,
            preheader: result.data.preheader,
            markdown: result.data.markdown || "",
            status: result.data.status,
            scheduled_at: result.data.scheduled_at,
          })
        } else {
          setError(result.error || "Failed to load newsletter")
          toast({ 
            title: "Load failed", 
            description: result.error || "Failed to load newsletter", 
            variant: "destructive" 
          })
        }
      } catch (err) {
        setError("An unexpected error occurred")
        toast({ 
          title: "Load failed", 
          description: "An unexpected error occurred while loading the newsletter", 
          variant: "destructive" 
        })
      } finally {
        setLoading(false)
      }
    }

    loadIssue()
  }, [params.id, toast])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading newsletter...</p>
        </div>
      </div>
    )
  }

  if (error || !issue) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Newsletter not found"}</p>
          <a 
            href="/newsletter" 
            className="text-blue-600 hover:underline"
          >
            ← Back to newsletters
          </a>
        </div>
      </div>
    )
  }

  return <NewsletterForm mode="edit" initialData={issue} />
}