import { createBrowserClient } from '@supabase/ssr'

// Single client used from client-side only (auth in UI)
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  )




