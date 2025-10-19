"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { PropsWithChildren } from "react"
import { createClient } from "@/lib/supabase"

export default function SidebarShell({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const supabase = createClient()
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setIsLoading(false)
          return
        }

        if (session?.user) {
          // Get role from user metadata
          const role = session.user.user_metadata?.role || 'official'
          setUserRole(role)
        } else {
          setUserRole(null)
        }
      } catch (error) {
        console.error('Error checking user role:', error)
        setUserRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUserRole()
  }, [])

  // Hide sidebar for login, registration, privacy, and non-admin users
  const hideSidebar = pathname === "/login" || 
                     pathname === "/official-registration" || 
                     pathname === "/privacy" ||
                     (userRole !== 'admin') // Hide for any role that's not admin

  if (isLoading) {
    return <div className="min-h-screen bg-[#f2f0e3]">{children}</div>
  }

  
  if (hideSidebar) {
    return <div className="min-h-screen bg-[#f2f0e3]">{children}</div>
  }

  return (
    <div className="flex min-h-screen bg-[#f2f0e3]">
      <Sidebar />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  )
}


