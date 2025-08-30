"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUserProfile, type Official } from "@/data/officials"
import OfficialView from "@/components/OfficialView"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ProfileLoading from "./loading"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [official, setOfficial] = useState<Official | null>(null)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Load the current user's profile using auth token
    loadOfficialProfile()
  }, [router, toast])

  const loadOfficialProfile = async () => {
    try {
      const officialData = await getCurrentUserProfile()
      setOfficial(officialData)
    } catch (error) {
      console.error('Failed to load profile:', error)
      toast({
        title: "Error",
        description: "Failed to load your profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }



  if (loading) {
    return <ProfileLoading />
  }

  if (!official) {
    return (
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#5e6461]">My Profile</h1>
              <p className="text-[#5e6461]/70">Your official profile</p>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <p className="text-[#5e6461] mb-4">No profile found for your account.</p>
              <Button onClick={() => router.push('/official-registration')}>
                Complete Your Profile
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <OfficialView 
      official={official}
      isProfileView={true}
      showBackButton={false}
      showEditButton={true}
      showLogoutButton={true}
    />
  )
}
