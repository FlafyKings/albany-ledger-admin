"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { issuesApi, type Issue } from "@/lib/issues-api"
import IssueDetailsLoading from "./loading"
import IssueView from "@/components/IssueView"

export default function IssueDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const idParam = params?.id as string
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadIssue = async () => {
      if (idParam) {
        setLoading(true)
        try {
          // Always use the track endpoint with short_id (same as mobile app)
          const result = await issuesApi.getIssueByShortId(idParam)
          
          if (result.success && result.data) {
            setIssue(result.data)
          } else {
            toast({
              title: "Error", 
              description: result.error || "Failed to load issue",
              variant: "destructive"
            })
          }
        } catch (error) {
          console.error('Failed to load issue:', error)
          toast({
            title: "Error",
            description: "Failed to load issue data. Please try again.",
            variant: "destructive"
          })
        } finally {
          setLoading(false)
        }
      }
    }

    loadIssue()
  }, [idParam, toast])

  const handleBackClick = () => {
    router.push('/issues')
  }

  if (loading) {
    return <IssueDetailsLoading />
  }

  if (!issue) {
    return (
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-[#5e6461]">Issue Not Found</h2>
              <p className="text-[#5e6461]/70">The requested issue could not be found</p>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="text-center">
            <p className="text-gray-500">The issue you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <IssueView 
      issue={issue} 
      showBackButton={true}
      onBackClick={handleBackClick}
      onIssueUpdate={setIssue}
    />
  )
}
