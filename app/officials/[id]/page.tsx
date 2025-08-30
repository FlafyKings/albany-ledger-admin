"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getOfficialById, type Official } from "@/data/officials"
import OfficialProfileLoading from "./loading"
import OfficialView from "@/components/OfficialView"



export default function OfficialProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = Number(params?.id)
  const [official, setOfficial] = useState<Official | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOfficial = async () => {
      if (id) {
        setLoading(true)
        try {
          const officialData = await getOfficialById(id)
          setOfficial(officialData || null)
        } catch (error) {
          console.error('Failed to load official:', error)
          toast({
            title: "Error",
            description: "Failed to load official data. Please try again.",
            variant: "destructive"
          })
        } finally {
          setLoading(false)
        }
      }
    }

    loadOfficial()
  }, [id, toast])

  if (loading) {
    return <OfficialProfileLoading />
  }

  if (!official) {
    return (
      <div className="flex-1 p-8">
        <Button variant="ghost" onClick={() => router.push("/officials")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Officials
        </Button>
        <Card>
          <CardContent className="py-14 text-center text-[#5e6461]">
            Could not find official.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <OfficialView 
      official={official}
      isProfileView={false}
      showBackButton={true}
      showEditButton={true}
      showLogoutButton={false}
    />
  )
}
