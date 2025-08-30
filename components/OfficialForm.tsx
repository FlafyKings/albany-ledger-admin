"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Plus, Trash2, Camera } from 'lucide-react'

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
  createOfficial,
  getOfficialById,
  getOfficialByEmail,
  upsertOfficial,
} from "@/data/officials"
import { committeesApi, officialsApi, type CommitteeCatalogItem } from "@/lib/officials-api"
import { 
  officialFormSchema, 
  officialRegistrationSchema,
  type OfficialFormData,
  type OfficialRegistrationData 
} from "@/lib/schemas/official"
import EditOfficialLoading from "@/app/officials/[id]/edit/loading"
import ProfilePictureDialog from "@/components/ProfilePictureDialog"
import { createClient } from "@/lib/supabase"

interface OfficialFormProps {
  mode: 'create' | 'edit' | 'register'
  officialId?: number
}

export default function OfficialForm({ mode, officialId }: OfficialFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditMode = mode === 'edit'
  const isRegisterMode = mode === 'register'
  const [loading, setLoading] = useState(false)
  const [verificationStep, setVerificationStep] = useState<string>("")
  const [existing, setExisting] = useState<Official | null>(null)
  const [committeesCatalog, setCommitteesCatalog] = useState<CommitteeCatalogItem[]>([])
  const [committeesLoading, setCommitteesLoading] = useState(true)
  const [officialLoading, setOfficialLoading] = useState(isEditMode)
  const [showProfilePictureDialog, setShowProfilePictureDialog] = useState(false)
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<File | null>(null)

  // Initialize form with react-hook-form and Zod validation
  const schema = isRegisterMode ? officialRegistrationSchema : officialFormSchema
  const form = useForm<OfficialFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      roleTitle: "",
      termStart: "",
      termEnd: "",
      contact: {
        email: "",
        phone: "",
        office: {
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "NY",
          zip: "",
          room: "",
          hours: "",
        },
      },
      biography: "",
      district: "Citywide",
      party: "Democrat",
      officeAddress: "",
      officeHours: "",
      status: "active",
      experience: [],
      committees: [],
      achievements: [],
    },
  })

  // Field arrays for dynamic sections
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control: form.control,
    name: "experience",
  })

  const { fields: committeeFields, append: appendCommittee, remove: removeCommittee } = useFieldArray({
    control: form.control,
    name: "committees",
  })

  const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } = useFieldArray({
    control: form.control,
    name: "achievements",
  })

  // Load committees catalog
  useEffect(() => {
    const loadCommittees = async () => {
      try {
        const result = await committeesApi.list()
        if (result.success && result.data) {
          setCommitteesCatalog(result.data)
        } else {
          console.error('Failed to load committees:', result.error)
          toast({
            title: "Warning",
            description: "Failed to load committees. You may need to create them first.",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error('Failed to load committees:', error)
        toast({
          title: "Warning",
          description: "Failed to load committees. You may need to create them first.",
          variant: "destructive"
        })
      } finally {
        setCommitteesLoading(false)
      }
    }
    
    loadCommittees()
  }, [toast])
  
  // Load existing official data for edit mode
  useEffect(() => {
    const loadOfficial = async () => {
      if (isEditMode && officialId) {
        setOfficialLoading(true)
        try {
          const official = await getOfficialById(officialId)
          setExisting(official || null)
          
          // Check if user is editing their own profile (for non-admin users)
          const userEmail = localStorage.getItem('userEmail')
          const userRole = localStorage.getItem('userRole')
          
          if (userRole !== 'admin' && userEmail !== official?.contact.email) {
            toast({
              title: "Access Denied",
              description: "You can only edit your own profile.",
              variant: "destructive"
            })
            router.push('/profile')
            return
          }
        } catch (error) {
          console.error('Failed to load official:', error)
          toast({
            title: "Error",
            description: "Failed to load official data. Please try again.",
            variant: "destructive"
          })
        } finally {
          setOfficialLoading(false)
        }
      }
    }
    
    loadOfficial()
  }, [isEditMode, officialId, toast, router])

  // Update form fields when existing data is loaded
  useEffect(() => {
    if (existing) {
      form.reset({
        name: existing.name || "",
        roleTitle: existing.roleTitle || "",
        termStart: existing.termStart || "",
        termEnd: existing.termEnd || "",
        contact: {
          email: existing.contact.email || "",
          phone: existing.contact.phone || "",
          office: {
            addressLine1: existing.contact.office.addressLine1 || "",
            addressLine2: existing.contact.office.addressLine2 || "",
            city: existing.contact.office.city || "",
            state: existing.contact.office.state || "NY",
            zip: existing.contact.office.zip || "",
            room: existing.contact.office.room || "",
            hours: existing.contact.office.hours || "",
          },
        },
        biography: existing.biography || "",
        district: existing.contact?.office?.addressLine2 || "Citywide",
        party: "Democrat", // Default since not in existing data
        officeAddress: existing.contact?.office?.addressLine1 || "",
        officeHours: existing.contact?.office?.hours || "",
        status: "active",
        experience: existing.experience || [],
        committees: existing.committees || [],
        achievements: existing.achievements || [],
      })
    }
  }, [existing, form])

  // Only redirect if we're in edit mode, not loading, and no existing data
  useEffect(() => {
    if (isEditMode && !officialLoading && !existing) {
      router.push("/officials")
    }
  }, [isEditMode, officialLoading, existing, router])

  // Show loading state while official data is being fetched
  if (isEditMode && officialLoading) {
    return <EditOfficialLoading />
  }

  if (isEditMode && !existing) return null

  const addExperience = () => {
    appendExperience({
      id: crypto.randomUUID(),
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
    })
  }

  const addCommittee = () => {
    if (committeesCatalog.length === 0) {
      toast({
        title: "No Committees Available",
        description: "Please create committees first before adding committee memberships.",
        variant: "destructive"
      })
      return
    }
    
    appendCommittee({
      id: crypto.randomUUID(),
      committeeId: committeesCatalog[0]?.id || 1,
      name: committeesCatalog[0]?.name || "Unknown Committee",
      role: "Member",
    })
  }

  const addAchievement = () => {
    appendAchievement({
      id: crypto.randomUUID(),
      title: "",
      description: "",
      period: "",
    })
  }

  const onSubmit = form.handleSubmit(async (data) => {
    setLoading(true)
    
    try {
      if (isRegisterMode) {
        // Check if account already exists in our database
        try {
          const existingOfficial = await getOfficialByEmail(data.contact.email)
          if (existingOfficial) {
            toast({
              title: "Error",
              description: "An account with this email already exists. Please use a different email or try logging in.",
              variant: "destructive"
            })
            setLoading(false)
            return
          }
        } catch (error) {
          console.log('No existing official found with this email, proceeding with account creation')
        }

        // Show verification steps
        setVerificationStep("Creating your account...")
        
        // First create the Supabase auth user
        const supabase = createClient()
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.contact.email,
          password: data.password,
          options: {
            data: {
              role: 'official'
            }
          }
        })

        if (authError) {
          if (authError.message.includes('already registered')) {
            toast({
              title: "Error",
              description: "An account with this email already exists. Please use a different email or try logging in.",
              variant: "destructive"
            })
            return
          }
          throw new Error(authError.message)
        }

        if (!authData.user) {
          throw new Error('Failed to create user account')
        }

        setVerificationStep("Creating your official profile...")
        
        // Then create the official profile using the existing API endpoint
        const official: Omit<Official, "id"> = {
          name: data.name,
          roleTitle: data.roleTitle,
          termStart: data.termStart,
          termEnd: data.termEnd,
          contact: {
            email: data.contact.email,
            phone: data.contact.phone,
            office: {
              addressLine1: data.contact.office.addressLine1,
              addressLine2: data.contact.office.addressLine2,
              city: data.contact.office.city,
              state: data.contact.office.state,
              zip: data.contact.office.zip,
              room: data.contact.office.room,
              hours: data.contact.office.hours,
            },
          },
          biography: data.biography,
          experience: data.experience.map((e) => ({
            ...e,
            endDate: e.endDate || undefined,
            description: e.description?.trim() ? e.description : undefined,
          })),
          committees: data.committees,
          votingHistory: [],
          achievements: data.achievements,
          image: "/placeholder.svg?height=64&width=64",
        }
        
        const created = await createOfficial(official)
        
        // Upload profile picture if one was selected
        if (selectedProfilePicture && created.id) {
          try {
            const uploadResult = await officialsApi.uploadProfilePicture(created.id, selectedProfilePicture)
            if (uploadResult.success && uploadResult.data) {
              created.image = uploadResult.data.image_url
            }
          } catch (error) {
            console.error('Failed to upload profile picture:', error)
            toast({
              title: "Warning",
              description: "Official created successfully, but profile picture upload failed.",
            })
          }
        }
        
        toast({
          title: "Success",
          description: "Official profile created successfully! You can now log in.",
        })

        router.push('/login')
      } else if (isEditMode && existing) {
        const updated: Official = {
          id: existing.id,
          name: data.name,
          roleTitle: data.roleTitle,
          termStart: data.termStart,
          termEnd: data.termEnd,
          contact: {
            email: data.contact.email,
            phone: data.contact.phone,
            office: {
              addressLine1: data.contact.office.addressLine1,
              addressLine2: data.contact.office.addressLine2,
              city: data.contact.office.city,
              state: data.contact.office.state,
              zip: data.contact.office.zip,
              room: data.contact.office.room,
              hours: data.contact.office.hours,
            },
          },
          biography: data.biography,
          experience: data.experience.map((e) => ({
            ...e,
            endDate: e.endDate || undefined,
            description: e.description?.trim() ? e.description : undefined,
          })),
          committees: data.committees,
          votingHistory: existing.votingHistory,
          achievements: data.achievements,
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
          name: data.name,
          roleTitle: data.roleTitle,
          termStart: data.termStart,
          termEnd: data.termEnd,
          contact: {
            email: data.contact.email,
            phone: data.contact.phone,
            office: {
              addressLine1: data.contact.office.addressLine1,
              addressLine2: data.contact.office.addressLine2,
              city: data.contact.office.city,
              state: data.contact.office.state,
              zip: data.contact.office.zip,
              room: data.contact.office.room,
              hours: data.contact.office.hours,
            },
          },
          biography: data.biography,
          experience: data.experience.map((e) => ({
            ...e,
            endDate: e.endDate || undefined,
            description: e.description?.trim() ? e.description : undefined,
          })),
          committees: data.committees,
          votingHistory: [],
          achievements: data.achievements,
          image: "/placeholder.svg?height=64&width=64",
        }
        const created = await createOfficial(official)
        
        // Upload profile picture if one was selected
        if (selectedProfilePicture && created.id) {
          try {
            const uploadResult = await officialsApi.uploadProfilePicture(created.id, selectedProfilePicture)
            if (uploadResult.success && uploadResult.data) {
              created.image = uploadResult.data.image_url
            }
          } catch (error) {
            console.error('Failed to upload profile picture:', error)
            toast({
              title: "Warning",
              description: "Official created successfully, but profile picture upload failed.",
            })
          }
        }
        
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
      setVerificationStep("")
    }
  })

  // Check if user is admin to determine cancel destination
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null
  const isAdmin = userRole === 'admin'
  
  const pageTitle = isEditMode ? "Edit Official" : isRegisterMode ? "Create Your Official Account" : "Create Official"
  const pageDescription = isEditMode ? `Update ${existing?.name}'s profile` : isRegisterMode ? "Complete your profile and create your account credentials" : "Add a new official profile"
  const submitButtonText = isEditMode ? "Save Changes" : isRegisterMode ? "Create Official Account" : "Create Official"
  
  // For non-admin users in edit mode, always go back to profile
  const cancelHref = isEditMode 
    ? (isAdmin ? `/officials/${existing?.id}` : '/profile')
    : isRegisterMode ? "/" : "/officials"

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            {!isRegisterMode && isAdmin && (
              <Link href="/officials" className="text-sm text-[#5e6461]/70 hover:text-[#d36530] inline-flex items-center gap-2 cursor-pointer">
                <span aria-hidden>←</span>
                Officials
              </Link>
            )}
            {!isRegisterMode && !isAdmin && (
              <Link href="/profile" className="text-sm text-[#5e6461]/70 hover:text-[#d36530] inline-flex items-center gap-2 cursor-pointer">
                <span aria-hidden>←</span>
                Profile
              </Link>
            )}
            <h1 className="text-2xl font-bold text-[#5e6461] mt-2">
              {pageTitle}
            </h1>
            <p className="text-[#5e6461]/70">
              {pageDescription}
            </p>
          </div>
          {!isRegisterMode && (
            <div className="flex gap-2">
              <Link href={cancelHref}>
                <Button variant="outline" disabled={loading} className="bg-transparent">
                  Cancel
                </Button>
              </Link>
              <Button 
                onClick={onSubmit}
                disabled={loading}
                className="bg-[#d36530] hover:bg-[#d36530]/90"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditMode ? "Saving..." : (verificationStep || "Creating...")}
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          )}
          {isRegisterMode && (
            <div className="flex gap-2">
              <Button 
                onClick={onSubmit}
                disabled={loading}
                className="bg-[#d36530] hover:bg-[#d36530]/90"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {verificationStep || "Creating..."}
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          )}
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
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name" 
                  {...form.register("name")}
                  className={form.formState.errors.name ? "border-red-500" : ""}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleTitle">Role/Title *</Label>
                <Input 
                  id="roleTitle" 
                  {...form.register("roleTitle")}
                  className={form.formState.errors.roleTitle ? "border-red-500" : ""}
                />
                {form.formState.errors.roleTitle && (
                  <p className="text-sm text-red-500">{form.formState.errors.roleTitle.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="termStart">Term Start *</Label>
                <Input 
                  id="termStart" 
                  type="date" 
                  {...form.register("termStart")}
                  className={form.formState.errors.termStart ? "border-red-500" : ""}
                />
                {form.formState.errors.termStart && (
                  <p className="text-sm text-red-500">{form.formState.errors.termStart.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="termEnd">Term End *</Label>
                <Input 
                  id="termEnd" 
                  type="date" 
                  {...form.register("termEnd")}
                  className={form.formState.errors.termEnd ? "border-red-500" : ""}
                />
                {form.formState.errors.termEnd && (
                  <p className="text-sm text-red-500">{form.formState.errors.termEnd.message}</p>
                )}
              </div>
              {/* Profile Picture - Only show for admins (not in register mode) */}
              {!isRegisterMode && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <img
                        src={existing?.image || (selectedProfilePicture ? URL.createObjectURL(selectedProfilePicture) : "/placeholder.svg")}
                        alt="Profile picture"
                        className="w-16 h-16 rounded-full object-cover cursor-pointer transition-opacity group-hover:opacity-80 border-2 border-gray-200"
                        onClick={() => setShowProfilePictureDialog(true)}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-black/50 rounded-full p-1">
                          <Camera className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        Click the image to upload a new profile picture
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...form.register("contact.email")}
                  className={form.formState.errors.contact?.email ? "border-red-500" : ""}
                />
                {form.formState.errors.contact?.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.contact.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input 
                  id="phone" 
                  {...form.register("contact.phone")}
                  className={form.formState.errors.contact?.phone ? "border-red-500" : ""}
                />
                {form.formState.errors.contact?.phone && (
                  <p className="text-sm text-red-500">{form.formState.errors.contact.phone.message}</p>
                )}
              </div>
              {isRegisterMode && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    {...form.register("password" as any)}
                    className={form.formState.errors.password ? "border-red-500" : ""}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                  )}
                </div>
              )}
              <Separator className="md:col-span-2" />
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input 
                  id="addressLine1" 
                  {...form.register("contact.office.addressLine1")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input 
                  id="addressLine2" 
                  {...form.register("contact.office.addressLine2")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  {...form.register("contact.office.city")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select 
                  value={form.watch("contact.office.state")} 
                  onValueChange={(val) => form.setValue("contact.office.state", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AL">Alabama</SelectItem>
                    <SelectItem value="AK">Alaska</SelectItem>
                    <SelectItem value="AZ">Arizona</SelectItem>
                    <SelectItem value="AR">Arkansas</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="CO">Colorado</SelectItem>
                    <SelectItem value="CT">Connecticut</SelectItem>
                    <SelectItem value="DE">Delaware</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="HI">Hawaii</SelectItem>
                    <SelectItem value="ID">Idaho</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="IN">Indiana</SelectItem>
                    <SelectItem value="IA">Iowa</SelectItem>
                    <SelectItem value="KS">Kansas</SelectItem>
                    <SelectItem value="KY">Kentucky</SelectItem>
                    <SelectItem value="LA">Louisiana</SelectItem>
                    <SelectItem value="ME">Maine</SelectItem>
                    <SelectItem value="MD">Maryland</SelectItem>
                    <SelectItem value="MA">Massachusetts</SelectItem>
                    <SelectItem value="MI">Michigan</SelectItem>
                    <SelectItem value="MN">Minnesota</SelectItem>
                    <SelectItem value="MS">Mississippi</SelectItem>
                    <SelectItem value="MO">Missouri</SelectItem>
                    <SelectItem value="MT">Montana</SelectItem>
                    <SelectItem value="NE">Nebraska</SelectItem>
                    <SelectItem value="NV">Nevada</SelectItem>
                    <SelectItem value="NH">New Hampshire</SelectItem>
                    <SelectItem value="NJ">New Jersey</SelectItem>
                    <SelectItem value="NM">New Mexico</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="NC">North Carolina</SelectItem>
                    <SelectItem value="ND">North Dakota</SelectItem>
                    <SelectItem value="OH">Ohio</SelectItem>
                    <SelectItem value="OK">Oklahoma</SelectItem>
                    <SelectItem value="OR">Oregon</SelectItem>
                    <SelectItem value="PA">Pennsylvania</SelectItem>
                    <SelectItem value="RI">Rhode Island</SelectItem>
                    <SelectItem value="SC">South Carolina</SelectItem>
                    <SelectItem value="SD">South Dakota</SelectItem>
                    <SelectItem value="TN">Tennessee</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="UT">Utah</SelectItem>
                    <SelectItem value="VT">Vermont</SelectItem>
                    <SelectItem value="VA">Virginia</SelectItem>
                    <SelectItem value="WA">Washington</SelectItem>
                    <SelectItem value="WV">West Virginia</SelectItem>
                    <SelectItem value="WI">Wisconsin</SelectItem>
                    <SelectItem value="WY">Wyoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">Zip</Label>
                <Input 
                  id="zip" 
                  {...form.register("contact.office.zip")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Input 
                  id="room" 
                  {...form.register("contact.office.room")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input 
                  id="district" 
                  {...form.register("district")}
                  placeholder="e.g., Citywide, District 1" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="party">Political Party</Label>
                <Input 
                  id="party" 
                  {...form.register("party")}
                  placeholder="e.g., Democrat, Republican" 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="hours">Office Hours</Label>
                <Input 
                  id="hours" 
                  {...form.register("contact.office.hours")}
                  placeholder="Mon–Fri, 9–5" 
                />
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
                {...form.register("biography")}
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
              {experienceFields.length === 0 && <div className="text-sm text-[#5e6461]/60">No entries yet.</div>}
              {experienceFields.map((field, index) => (
                <div key={field.id} className="rounded-md border border-gray-200 bg-white p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        {...form.register(`experience.${index}.title`)}
                        className={form.formState.errors.experience?.[index]?.title ? "border-red-500" : ""}
                      />
                      {form.formState.errors.experience?.[index]?.title && (
                        <p className="text-sm text-red-500">{form.formState.errors.experience[index]?.title?.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Organization *</Label>
                      <Input
                        {...form.register(`experience.${index}.organization`)}
                        className={form.formState.errors.experience?.[index]?.organization ? "border-red-500" : ""}
                      />
                      {form.formState.errors.experience?.[index]?.organization && (
                        <p className="text-sm text-red-500">{form.formState.errors.experience[index]?.organization?.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Input
                        type="date"
                        {...form.register(`experience.${index}.startDate`)}
                        className={form.formState.errors.experience?.[index]?.startDate ? "border-red-500" : ""}
                      />
                      {form.formState.errors.experience?.[index]?.startDate && (
                        <p className="text-sm text-red-500">{form.formState.errors.experience[index]?.startDate?.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        {...form.register(`experience.${index}.endDate`)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={3}
                        {...form.register(`experience.${index}.description`)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button type="button" variant="ghost" onClick={() => removeExperience(index)}>
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
              {committeesLoading && <div className="text-sm text-[#5e6461]/60">Loading committees...</div>}
              {!committeesLoading && committeeFields.length === 0 && <div className="text-sm text-[#5e6461]/60">No memberships yet.</div>}
              {!committeesLoading && committeeFields.map((field, index) => (
                <div key={field.id} className="rounded-md border border-gray-200 bg-white p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Committee</Label>
                      <Select
                        value={String(form.watch(`committees.${index}.committeeId`))}
                        onValueChange={(val) => {
                          const id = Number(val)
                          const cat = committeesCatalog.find((c) => c.id === id)
                          form.setValue(`committees.${index}.committeeId`, id)
                          form.setValue(`committees.${index}.name`, cat?.name || "Unknown Committee")
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
                        value={form.watch(`committees.${index}.role`)}
                        onValueChange={(val) => form.setValue(`committees.${index}.role`, val as any)}
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
                    <Button type="button" variant="ghost" onClick={() => removeCommittee(index)}>
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
              {achievementFields.length === 0 && <div className="text-sm text-[#5e6461]/60">No achievements yet.</div>}
              {achievementFields.map((field, index) => (
                <div key={field.id} className="rounded-md border border-gray-200 bg-white p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        {...form.register(`achievements.${index}.title`)}
                        className={form.formState.errors.achievements?.[index]?.title ? "border-red-500" : ""}
                      />
                      {form.formState.errors.achievements?.[index]?.title && (
                        <p className="text-sm text-red-500">{form.formState.errors.achievements[index]?.title?.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Period</Label>
                      <Input
                        {...form.register(`achievements.${index}.period`)}
                        placeholder="e.g., Jan 2023 – Dec 2023"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description *</Label>
                      <Textarea
                        rows={3}
                        {...form.register(`achievements.${index}.description`)}
                        className={form.formState.errors.achievements?.[index]?.description ? "border-red-500" : ""}
                      />
                      {form.formState.errors.achievements?.[index]?.description && (
                        <p className="text-sm text-red-500">{form.formState.errors.achievements[index]?.description?.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button type="button" variant="ghost" onClick={() => removeAchievement(index)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </form>
      </main>
      <ProfilePictureDialog
        open={showProfilePictureDialog}
        onOpenChange={setShowProfilePictureDialog}
        officialId={existing?.id || 0}
        currentImageUrl={existing?.image}
        officialName={existing?.name || "Official"}
        onImageUpdated={(newImageUrl, file) => {
          if (existing?.id) {
            setExisting(prev => prev ? { ...prev, image: newImageUrl || undefined } : null)
          } else {
            setSelectedProfilePicture(file || null)
          }
        }}
      />
    </div>
  )
}

