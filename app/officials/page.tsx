"use client"

import Link from "next/link"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { useMemo, useState } from "react"
import { Calendar, FileText, Home, MessageSquare, Settings, Users, AlertTriangle, Mail, BarChart3, MapPin, VoteIcon, Shield, Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Building } from 'lucide-react'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { deleteOfficial, getOfficials } from "@/data/officials"

// Sidebar is now provided by the app layout

export default function OfficialsIndexPage() {
  const [query, setQuery] = useState("")
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    onConfirm: () => void
  }>({
    open: false,
    onConfirm: () => {},
  })
  const [list, setList] = useState(getOfficials())

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter((o) => {
      return (
        o.name.toLowerCase().includes(q) ||
        o.roleTitle.toLowerCase().includes(q) ||
        o.contact.email.toLowerCase().includes(q) ||
        o.contact.phone.toLowerCase().includes(q)
      )
    })
  }, [query, list])

  const handleDelete = (id: number) => {
    setConfirmDialog({
      open: true,
      onConfirm: () => {
        const removed = deleteOfficial(id)
        if (removed) {
          setList(getOfficials())
        }
      }
    })
  }

  return (
    <>
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#5e6461]">Officials</h2>
              <p className="text-[#5e6461]/70">Manage elected officials and their public profiles</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6461]/50" />
                <Input
                  placeholder="Search by name, email, role..."
                  className="pl-10 w-72 border-gray-300 focus:border-[#d36530] focus:ring-[#d36530]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Link href="/officials/new">
                <Button className="bg-[#d36530] hover:bg-[#d36530]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Official
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Card className="border-gray-200">
            <CardHeader className="pb-0">
              <CardTitle className="text-[#5e6461]">All Officials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Official</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Office</TableHead>
                      <TableHead>Committees</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="min-w-[220px]">
                          <div className="flex items-center gap-3">
                            <img
                              src={o.image || "/placeholder.svg"}
                              alt={o.name}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium text-[#5e6461]">{o.name}</div>
                              <div className="text-xs text-[#5e6461]/70">ID: {o.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{o.roleTitle}</TableCell>
                        <TableCell>
                          {new Date(o.termStart).getFullYear()}–{new Date(o.termEnd).getFullYear()}
                        </TableCell>
                        <TableCell className="min-w-[220px]">
                          <div className="text-sm text-[#5e6461]/80">{o.contact.email}</div>
                          <div className="text-xs text-[#5e6461]/60">{o.contact.phone}</div>
                        </TableCell>
                        <TableCell className="min-w-[220px]">
                          <div className="text-sm text-[#5e6461]/80">
                            {o.contact.office.addressLine1}
                            {o.contact.office.addressLine2 ? `, ${o.contact.office.addressLine2}` : ""}
                          </div>
                          <div className="text-xs text-[#5e6461]/60">
                            {o.contact.office.city}, {o.contact.office.state} {o.contact.office.zip}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-white">
                            {o.committees.length} membership{o.committees.length === 1 ? "" : "s"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/officials/${o.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Profile
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/officials/${o.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(o.id)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-[#5e6461]/60">
                          No officials match “{query}”.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-[#5e6461]/60">
                <Building className="h-3.5 w-3.5" />
                Showing {filtered.length} of {list.length}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title="Remove Official"
        description="Are you sure you want to remove this official? This action cannot be undone."
        variant="destructive"
        confirmText="Remove"
        onConfirm={confirmDialog.onConfirm}
      />
    </>
  )
}
