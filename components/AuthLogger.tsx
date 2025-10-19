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

        if (!loggedIn && window.location.pathname !== '/login' && window.location.pathname !== '/privacy') {
          const current = window.location.pathname + (window.location.search || '')
          const url = `/login?redirect=${encodeURIComponent(current)}`
          window.location.replace(url)
          return
        }

        // Check user role and redirect non-admin users to profile page
        if (loggedIn) {
          const userRole = localStorage.getItem('userRole')
          const currentPath = window.location.pathname
          
          // Admin-only pages that non-admin users shouldn't access
          const adminOnlyPages = [
            '/',
            '/content',
            '/officials',
            '/meetings',
            '/documents',
            '/issues',
            '/questions',
            '/newsletter',
            '/wards',
            '/elections',
            '/analytics',
            '/users',
            '/settings'
          ]
          
          // If non-admin user tries to access admin pages, redirect to profile
          if (userRole !== 'admin' && adminOnlyPages.includes(currentPath)) {
            window.location.replace('/profile')
            return
          }
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
      
      if (!loggedIn && window.location.pathname !== '/login' && window.location.pathname !== '/privacy') {
        const current = window.location.pathname + (window.location.search || '')
        const url = `/login?redirect=${encodeURIComponent(current)}`
        window.location.replace(url)
      } else if (loggedIn) {
        // Check user role and redirect non-admin users to profile page
        const userRole = localStorage.getItem('userRole')
        const currentPath = window.location.pathname
        
        // Admin-only pages that non-admin users shouldn't access
        const adminOnlyPages = [
          '/',
          '/content',
          '/officials',
          '/meetings',
          '/documents',
          '/issues',
          '/questions',
          '/newsletter',
          '/wards',
          '/elections',
          '/analytics',
          '/users',
          '/settings'
        ]
        
        // If non-admin user tries to access admin pages, redirect to profile
        if (userRole !== 'admin' && adminOnlyPages.includes(currentPath)) {
          window.location.replace('/profile')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  // Show nothing while checking auth (could add a loading spinner here)
  return isChecking ? null : null
}


