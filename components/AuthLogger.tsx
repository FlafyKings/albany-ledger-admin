"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function AuthLogger() {
  const [isChecking, setIsChecking] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        const loggedIn = !error && !!session?.user
        
        // Visible in browser devtools
        // eslint-disable-next-line no-console
        console.log(`[Auth] loggedIn=${loggedIn}`, { session: session?.user?.id || 'none' })

        if (!loggedIn && window.location.pathname !== '/login') {
          const current = window.location.pathname + (window.location.search || '')
          const url = `/login?redirect=${encodeURIComponent(current)}`
          window.location.replace(url)
          return
        }

        setIsChecking(false)
      } catch (err) {
        console.error('[Auth] Session check failed:', err)
        setIsChecking(false)
      }
    }

    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const loggedIn = !!session?.user
      // eslint-disable-next-line no-console
      console.log(`[Auth] State changed: ${event}, loggedIn=${loggedIn}`)
      
      if (!loggedIn && window.location.pathname !== '/login') {
        const current = window.location.pathname + (window.location.search || '')
        const url = `/login?redirect=${encodeURIComponent(current)}`
        window.location.replace(url)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  // Show nothing while checking auth (could add a loading spinner here)
  return isChecking ? null : null
}


