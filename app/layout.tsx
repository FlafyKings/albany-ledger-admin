import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import SidebarShell from '@/components/SidebarShell'
import AuthLogger from '@/components/AuthLogger'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Albany Ledger Admin Panel',
  description: 'Albany Ledger',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AuthLogger />
        <SidebarShell>{children}</SidebarShell>
        <Toaster />
      </body>
    </html>
  )
}
