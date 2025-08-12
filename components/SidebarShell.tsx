"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { PropsWithChildren } from "react"

export default function SidebarShell({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const hideSidebar = pathname === "/login"

  if (hideSidebar) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-[#f2f0e3]">
      <Sidebar />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  )
}


