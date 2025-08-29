"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Achievement,
  CommitteeMembership,
  Official,
  RoleExperience,
  committeesCatalog,
  createOfficial,
  getOfficialById,
  upsertOfficial,
} from "@/data/officials"

interface OfficialFormProps {
  mode: 'create' | 'edit'
  officialId?: number
}

export default function OfficialForm({ mode, officialId }: OfficialFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditMode = mode === 'edit'
  const [loading, setLoading] = useState(false)
  const [existing, setExisting] = useState<Official | null>(null)
  
  // Load existing official data for edit mode
  useEffect(() => {
    const loadOfficial = async () => {
      if (isEditMode && officialId) {
        try {
          const official = await getOfficialById(officialId)
          setExisting(official || null)
        } catch (error) {
          console.error('Failed to load official:', error)
          toast({
            title: "Error",
            description: "Failed to load official data. Please try again.",
            variant: "destructive"
          })
        }
      }
    }
    
    loadOfficial()
  }, [isEditMode, officialId, toast])

  const [name, setName] = useState(existing?.name || "")
  const [roleTitle, setRoleTitle] = useState(existing?.roleTitle || "")
  const [termStart, setTermStart] = useState(existing?.termStart || "")
  const [termEnd, setTermEnd] = useState(existing?.termEnd || "")
  const [email, setEmail] = useState(existing?.contact.email || "")
  const [phone, setPhone] = useState(existing?.contact.phone || "")
  const [addressLine1, setAddressLine1] = useState(existing?.contact.office.addressLine1 || "")
  const [addressLine2, setAddressLine2] = useState(existing?.contact.office.addressLine2 || "")
  const [city, setCity] = useState(existing?.contact.office.city || "")
  const [state, setState] = useState(existing?.contact.office.state || "NY")
  const [zip, setZip] = useState(existing?.contact.office.zip || "")
  const [room, setRoom] = useState(existing?.contact.office.room || "")
  const [hours, setHours] = useState(existing?.contact.office.hours || "")
  const [biography, setBiography] = useState(existing?.biography || "")

  const [experience, setExperience] = useState<RoleExperience[]>(existing?.experience || [])
  const [committees, setCommittees] = useState<CommitteeMembership[]>(existing?.committees || [])
  const [achievements, setAchievements] = useState<Achievement[]>(existing?.achievements || [])

  useEffect(() => {
    if (isEditMode && !existing) {
      router.push("/officials")
    }
  }, [isEditMode, existing, router])

  if (isEditMode && !existing) return null

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (isEditMode && existing) {
        const updated: Official = {
          id: existing.id,
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
          votingHistory: existing.votingHistory,
          achievements,
          image: existing.image,
        }
        await upsertOfficial(updated)
        toast({
          title: "Success",
          description: "Official updated successfully.",
        })
        router.push(`/officials/${existing.id}`)
      } else {
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
        const created = await createOfficial(official)
        toast({
          title: "Success",
          description: "Official created successfully.",
        })
        router.push(`/officials/${created.id}`)
      }
    } catch (error) {
      console.error('Failed to save official:', error)
      toast({
        title: "Error",
        description: "Failed to save official. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const pageTitle = isEditMode ? "Edit Official" : "Create Official"
  const pageDescription = isEditMode ? `Update ${existing?.name}'s profile` : "Add a new official profile"
  const submitButtonText = isEditMode ? "Save Changes" : "Create Official"
  const cancelHref = isEditMode ? `/officials/${existing?.id}` : "/officials"

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-[#5e6461]">{pageTitle}</h2>
            <p className="text-[#5e6461]/70">{pageDescription}</p>
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
              {experience.map((exp) => (
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
                        rows={3}
                        value={exp.description || ""}
                        onChange={(e) =>
                          setExperience((prev) =>
                            prev.map((x) => (x.id === exp.id ? { ...x, description: e.target.value } : x))
                          )
                        }
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
            <Link href={cancelHref}>
              <Button variant="outline" disabled={loading}>Cancel</Button>
            </Link>
            <Button 
              type="submit" 
              className="bg-[#d36530] hover:bg-[#d36530]/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditMode ? "Saving..." : "Creating..."}
                </>
              ) : (
                submitButtonText
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

