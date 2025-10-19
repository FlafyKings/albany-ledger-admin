"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Calendar, FileText, AlertTriangle, MessageSquare, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Content", href: "/content", icon: FileText },
  { label: "Officials", href: "/officials", icon: Users },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Issue Reports", href: "/issues", icon: AlertTriangle },
  { label: "Q&A", href: "/questions", icon: MessageSquare },
  { label: "Newsletter", href: "/newsletter", icon: Mail },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-[#5e6461]">Albany Ledger</h1>
        <p className="text-sm text-[#5e6461]/70">Admin Panel</p>
      </div>

      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-[#d36530] text-white" : "text-[#5e6461] hover:bg-[#f2f0e3] hover:text-[#d36530]",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
