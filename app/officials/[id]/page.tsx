"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Calendar, FileText, Home, MessageSquare, Settings, Users, AlertTriangle, Mail, BarChart3, MapPin, VoteIcon, Shield, ArrowLeft, Phone, MailIcon, MapPinIcon, Clock, Edit, CheckCircle, XCircle, MinusCircle, Award, Building } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getOfficialById } from "@/data/officials"

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

function formatAddress(o: ReturnType<typeof getOfficialById>["contact"]["office"]) {
  return `${o.addressLine1}${o.addressLine2 ? ", " + o.addressLine2 : ""}, ${o.city}, ${o.state} ${o.zip}`
}

function formatRange(start: string, end?: string) {
  const s = new Date(start)
  const e = end ? new Date(end) : undefined
  const opts: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" }
  return `${s.toLocaleDateString(undefined, opts)} – ${e ? e.toLocaleDateString(undefined, opts) : "Present"}`
}

function VoteIconFor(vote: "Yes" | "No" | "Abstain") {
  if (vote === "Yes") return <CheckCircle className="h-4 w-4 text-green-600" />
  if (vote === "No") return <XCircle className="h-4 w-4 text-red-600" />
  return <MinusCircle className="h-4 w-4 text-gray-600" />
}

export default function OfficialProfilePage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params?.id)
  const official = getOfficialById(id)

  if (!official) {
    return (
      <div className="flex min-h-screen bg-[#f2f0e3]">
        <div className="w-64 bg-white border-r border-gray-200 shadow-sm" />
        <div className="flex-1 p-8">
          <Button variant="ghost" onClick={() => router.push("/officials")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Officials
          </Button>
          <Card>
            <CardContent className="py-14 text-center text-[#5e6461]">
              Could not find official.
            </CardContent>
          </Card>
        </div>
      </div>
    )
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

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-[#5e6461]">{official.name}</h2>
                <p className="text-[#5e6461]/70">{official.roleTitle}</p>
              </div>
            </div>
            <Link href={`/officials/${official.id}/edit`}>
              <Button className="bg-[#d36530] hover:bg-[#d36530]/90">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6">
          {/* Header card */}
          <Card className="border-gray-200 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <img
                  src={official.image || "/placeholder.svg"}
                  alt={official.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-semibold text-[#5e6461]">{official.name}</h3>
                      <p className="text-[#5e6461]/70">{official.roleTitle}</p>
                      <p className="text-xs text-[#5e6461]/60">
                        Term: {new Date(official.termStart).getFullYear()} –{" "}
                        {new Date(official.termEnd).getFullYear()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a href={`mailto:${official.contact.email}`}>
                        <Button variant="outline" size="sm">
                          <MailIcon className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                      </a>
                      <a href={`tel:${official.contact.phone}`}>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                      </a>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-start gap-2 text-sm text-[#5e6461]/80">
                      <MailIcon className="h-4 w-4 mt-0.5" />
                      <div>
                        <div className="font-medium text-[#5e6461]">Email</div>
                        <div>{official.contact.email}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-[#5e6461]/80">
                      <Phone className="h-4 w-4 mt-0.5" />
                      <div>
                        <div className="font-medium text-[#5e6461]">Phone</div>
                        <div>{official.contact.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-[#5e6461]/80">
                      <Clock className="h-4 w-4 mt-0.5" />
                      <div>
                        <div className="font-medium text-[#5e6461]">Office Hours</div>
                        <div>{official.contact.office.hours || "—"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Bio + Achievements */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Biography</CardTitle>
                  <CardDescription>Background and overview</CardDescription>
                </CardHeader>
                <CardContent className="text-[#5e6461]/80 leading-relaxed">{official.biography}</CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Key Achievements</CardTitle>
                  <CardDescription>Highlights integrated into the profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {official.achievements.length === 0 && (
                    <div className="text-[#5e6461]/60 text-sm">No achievements recorded.</div>
                  )}
                  {official.achievements.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white"
                    >
                      <Award className="h-5 w-5 text-[#d36530] mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-[#5e6461]">{a.title}</div>
                        <div className="text-sm text-[#5e6461]/80">{a.description}</div>
                        {a.period && <div className="text-xs text-[#5e6461]/60 mt-1">{a.period}</div>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Role & Experience</CardTitle>
                  <CardDescription>Timeline of positions (LinkedIn style)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="relative border-s border-gray-200">
                    {official.experience.map((exp, idx) => (
                      <li key={exp.id} className="mb-8 ms-6">
                        <span className="absolute -start-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#d36530]" />
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-[#5e6461]">{exp.title}</div>
                          <div className="text-xs text-[#5e6461]/60">{formatRange(exp.startDate, exp.endDate)}</div>
                        </div>
                        <div className="text-sm text-[#5e6461]/80">{exp.organization}</div>
                        {exp.description && (
                          <div className="text-sm text-[#5e6461]/70 mt-1">{exp.description}</div>
                        )}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>

            {/* Right column: Office, Committees, Voting */}
            <div className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Office Details</CardTitle>
                  <CardDescription>Where and when to reach</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPinIcon className="h-4 w-4 mt-0.5 text-[#5e6461]" />
                    <div className="text-[#5e6461]/80">{formatAddress(official.contact.office)}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#5e6461]/70">
                    <div>
                      <div className="font-medium text-[#5e6461]">Room</div>
                      <div>{official.contact.office.room || "—"}</div>
                    </div>
                    <div>
                      <div className="font-medium text-[#5e6461]">Hours</div>
                      <div>{official.contact.office.hours || "—"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Committee Memberships</CardTitle>
                  <CardDescription>With roles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {official.committees.length === 0 && (
                    <div className="text-sm text-[#5e6461]/60">No committee memberships.</div>
                  )}
                  {official.committees.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2"
                    >
                      <div className="text-sm text-[#5e6461]">{m.name}</div>
                      <Badge variant="outline" className="bg-[#f2f0e3]">
                        {m.role}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Recent Voting History</CardTitle>
                  <CardDescription>With outcomes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {official.votingHistory.length === 0 && (
                    <div className="text-sm text-[#5e6461]/60">No votes recorded.</div>
                  )}
                  {official.votingHistory.map((v) => (
                    <div key={v.id} className="rounded-md border border-gray-200 bg-white p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-[#5e6461]">{v.issue}</div>
                        <div className="text-xs text-[#5e6461]/60">
                          {new Date(v.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          {VoteIconFor(v.vote)}
                          <span
                            className={
                              v.vote === "Yes"
                                ? "text-green-700"
                                : v.vote === "No"
                                ? "text-red-700"
                                : "text-gray-700"
                            }
                          >
                            {v.vote}
                          </span>
                        </div>
                        <Badge
                          className={
                            v.result === "Passed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }
                        >
                          {v.result}
                        </Badge>
                      </div>
                      {v.description && (
                        <div className="text-xs text-[#5e6461]/70 mt-2">{v.description}</div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
