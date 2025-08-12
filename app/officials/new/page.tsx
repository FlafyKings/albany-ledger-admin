"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Calendar, FileText, Home, MessageSquare, Settings, Users, AlertTriangle, Mail, BarChart3, MapPin, VoteIcon, Shield, ArrowLeft, Plus, Trash2 } from 'lucide-react'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Achievement,
  CommitteeMembership,
  Official,
  RoleExperience,
  committeesCatalog,
  createOfficial,
} from "@/data/officials"

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: FileText, label: "Home Screen", href: "/home-screen" },
  { icon: Users, label: "Officials", href: "/officials", active: true },
  { icon: Calendar, label: "Meetings", href: "/meetings" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: AlertTriangle, label: "Issue Reports", href: "/issues" },
  { icon: MessageSquare, label: "Q&A", href: "/questions" },
  { icon: Mail, label: "Newsletter", href: "/newsletter" },
  { icon: MapPin, label: "Wards & Districts", href: "/wards" },
  { icon: VoteIcon, label: "Elections", href: "/elections" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Shield, label: "User Management", href: "/users" },
  { icon: Settings, label: "System Config", href: "/settings" },
]

export default function NewOfficialPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [roleTitle, setRoleTitle] = useState("")
  const [termStart, setTermStart] = useState("")
  const [termEnd, setTermEnd] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("NY")
  const [zip, setZip] = useState("")
  const [room, setRoom] = useState("")
  const [hours, setHours] = useState("")
  const [biography, setBiography] = useState("")

  const [experience, setExperience] = useState<RoleExperience[]>([])
  const [committees, setCommittees] = useState<CommitteeMembership[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const addExperience = () => {
    setExperience((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        organization: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ])
  }
  const removeExperience = (id: string) => setExperience((prev) => prev.filter((e) => e.id !== id))

  const addCommittee = () => {
    setCommittees((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        committeeId: committeesCatalog[0]?.id || 1,
        name: committeesCatalog[0]?.name || "Budget Committee",
        role: "Member",
      },
    ])
  }
  const removeCommittee = (id: string) => setCommittees((prev) => prev.filter((c) => c.id !== id))

  const addAchievement = () => {
    setAchievements((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        period: "",
      },
    ])
  }
  const removeAchievement = (id: string) => setAchievements((prev) => prev.filter((a) => a.id !== id))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const official: Omit<Official, "id"> = {
      name,
      roleTitle,
      termStart,
      termEnd,
      contact: {
        email,
        phone,
        office: {
          addressLine1,
          addressLine2,
          city,
          state,
          zip,
          room,
          hours,
        },
      },
      biography,
      experience: experience.map((e) => ({
        ...e,
        endDate: e.endDate || undefined,
        description: e.description?.trim() ? e.description : undefined,
      })),
      committees,
      votingHistory: [],
      achievements,
      image: "/placeholder.svg?height=64&width=64",
    }
    const created = createOfficial(official)
    router.push(`/officials/${created.id}`)
  }

  return (
    <div className="flex min-h-screen bg-[#f2f0e3]">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#5e6461]">Albany Ledger</h1>
          <p className="text-sm text-[#5e6461]/70">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active ? "bg-[#d36530] text-white" : "text-[#5e6461] hover:bg-[#f2f0e3] hover:text-[#d36530]"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Button variant="ghost" onClick={() => history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-[#5e6461]">Create Official</h2>
              <p className="text-[#5e6461]/70">Add a new official profile</p>
            </div>
            <div />
          </div>
        </header>

        <main className="flex-1 p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-[#5e6461]">Basic Information</CardTitle>
                <CardDescription>Name, role, and term</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role/Title</Label>
                  <Input id="role" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="termStart">Term Start</Label>
                  <Input id="termStart" type="date" value={termStart} onChange={(e) => setTermStart(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="termEnd">Term End</Label>
                  <Input id="termEnd" type="date" value={termEnd} onChange={(e) => setTermEnd(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-[#5e6461]">Contact & Office Details</CardTitle>
                <CardDescription>Email, phone, and office location</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <Separator className="md:col-span-2" />
                <div className="space-y-2">
                  <Label htmlFor="address1">Address Line 1</Label>
                  <Input id="address1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address2">Address Line 2</Label>
                  <Input id="address2" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">Zip</Label>
                  <Input id="zip" value={zip} onChange={(e) => setZip(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room">Room</Label>
                  <Input id="room" value={room} onChange={(e) => setRoom(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="hours">Office Hours</Label>
                  <Input id="hours" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Mon–Fri, 9–5" />
                </div>
              </CardContent>
            </Card>

            {/* Biography */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-[#5e6461]">Biography</CardTitle>
                <CardDescription>Short description</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  rows={5}
                  placeholder="Write a short background..."
                />
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[#5e6461]">Role & Experience</CardTitle>
                  <CardDescription>Timeline entries</CardDescription>
                </div>
                <Button type="button" onClick={addExperience} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {experience.length === 0 && <div className="text-sm text-[#5e6461]/60">No entries yet.</div>}
                {experience.map((exp, idx) => (
                  <div key={exp.id} className="rounded-md border border-gray-200 bg-white p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) =>
                            setExperience((prev) => prev.map((x) => (x.id === exp.id ? { ...x, title: e.target.value } : x)))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Organization</Label>
                        <Input
                          value={exp.organization}
                          onChange={(e) =>
                            setExperience((prev) =>
                              prev.map((x) => (x.id === exp.id ? { ...x, organization: e.target.value } : x))
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) =>
                            setExperience((prev) =>
                              prev.map((x) => (x.id === exp.id ? { ...x, startDate: e.target.value } : x))
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={exp.endDate || ""}
                          onChange={(e) =>
                            setExperience((prev) =>
                              prev.map((x) => (x.id === exp.id ? { ...x, endDate: e.target.value } : x))
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={exp.description || ""}
                          onChange={(e) =>
                            setExperience((prev) =>
                              prev.map((x) => (x.id === exp.id ? { ...x, description: e.target.value } : x))
                            )
                          }
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button type="button" variant="ghost" onClick={() => removeExperience(exp.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Committees */}
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[#5e6461]">Committee Memberships</CardTitle>
                  <CardDescription>Assign committee and role</CardDescription>
                </div>
                <Button type="button" onClick={addCommittee} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Membership
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {committees.length === 0 && <div className="text-sm text-[#5e6461]/60">No memberships yet.</div>}
                {committees.map((cm) => (
                  <div key={cm.id} className="rounded-md border border-gray-200 bg-white p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Committee</Label>
                        <Select
                          value={String(cm.committeeId)}
                          onValueChange={(val) => {
                            const id = Number(val)
                            const cat = committeesCatalog.find((c) => c.id === id)
                            setCommittees((prev) =>
                              prev.map((x) =>
                                x.id === cm.id ? { ...x, committeeId: id, name: cat?.name || x.name } : x
                              )
                            )
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select committee" />
                          </SelectTrigger>
                          <SelectContent>
                            {committeesCatalog.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select
                          value={cm.role}
                          onValueChange={(val) =>
                            setCommittees((prev) => prev.map((x) => (x.id === cm.id ? { ...x, role: val as any } : x)))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Chair">Chair</SelectItem>
                            <SelectItem value="Vice Chair">Vice Chair</SelectItem>
                            <SelectItem value="Member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button type="button" variant="ghost" onClick={() => removeCommittee(cm.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[#5e6461]">Key Achievements</CardTitle>
                  <CardDescription>These will display in profile details</CardDescription>
                </div>
                <Button type="button" onClick={addAchievement} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.length === 0 && <div className="text-sm text-[#5e6461]/60">No achievements yet.</div>}
                {achievements.map((a) => (
                  <div key={a.id} className="rounded-md border border-gray-200 bg-white p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={a.title}
                          onChange={(e) =>
                            setAchievements((prev) => prev.map((x) => (x.id === a.id ? { ...x, title: e.target.value } : x)))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Period</Label>
                        <Input
                          value={a.period || ""}
                          onChange={(e) =>
                            setAchievements((prev) => prev.map((x) => (x.id === a.id ? { ...x, period: e.target.value } : x)))
                          }
                          placeholder="e.g., Jan 2023 – Dec 2023"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={3}
                          value={a.description}
                          onChange={(e) =>
                            setAchievements((prev) =>
                              prev.map((x) => (x.id === a.id ? { ...x, description: e.target.value } : x))
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button type="button" variant="ghost" onClick={() => removeAchievement(a.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-3">
              <Link href="/officials">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" className="bg-[#d36530] hover:bg-[#d36530]/90">
                Create Official
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
