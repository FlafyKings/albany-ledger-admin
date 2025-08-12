"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Users,
  AlertTriangle,
  Mail,
  BarChart3,
  MapPin,
  Vote,
  Shield,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  Clock,
  Star,
  Copy,
  ExternalLink,
  Megaphone,
  Newspaper,
  PhoneCall,
  AlertCircle,
  Cloud,
  Car,
  Info,
  Send,
  Globe,
  Smartphone,
  AtSign,
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Header } from "@/components/Header"

// Import content API functions
import { 
  emergencyContactsApi, 
  breakingNewsApi, 
  articlesApi,
  contentUtils,
  type EmergencyContact,
  type BreakingNewsAlert,
  type Article 
} from "@/lib/content-api"

// Import toast and confirmation dialog
import { useToast } from "@/hooks/use-toast"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

// Sidebar is provided globally by the app layout

export default function ContentManagement() {
  // Data state
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])
  const [breakingNewsAlerts, setBreakingNewsAlerts] = useState<BreakingNewsAlert[]>([])
  const [newsArticles, setNewsArticles] = useState<Article[]>([])
  
  // Loading states
  const [isLoadingContacts, setIsLoadingContacts] = useState(true)
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true)
  const [isLoadingArticles, setIsLoadingArticles] = useState(true)
  
  // Error states
  const [contactsError, setContactsError] = useState<string | null>(null)
  const [alertsError, setAlertsError] = useState<string | null>(null)
  const [articlesError, setArticlesError] = useState<string | null>(null)
  
  // Dialog states
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<BreakingNewsAlert | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [showArticleDialog, setShowArticleDialog] = useState(false)
  const [isEditingContact, setIsEditingContact] = useState(false)
  const [editingContactId, setEditingContactId] = useState<number | null>(null)
  
  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    onConfirm: () => void
    variant?: "default" | "destructive"
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })
  
  // Toast hook
  const { toast } = useToast()

  // Form states for creating new items
  const [newContactData, setNewContactData] = useState({
    name: '',
    department: '',
    emergency_number: '',
    non_emergency_number: '',
    after_hours_number: '',
    hours: '',
    address: '',
    email: '',
    notes: ''
  })
  
  const [newAlertData, setNewAlertData] = useState({
    title: '',
    content: '',
    type: '',
    priority: '',
    status: 'Draft',
    publish_date: '',
    expiration_date: '',
    channels: [] as string[],
    author: ''
  })

  // Load data on component mount
  useEffect(() => {
    loadEmergencyContacts()
    loadBreakingNews()
    loadArticles()
  }, [])

  // ==================== API FUNCTIONS ====================

  const loadEmergencyContacts = async () => {
    try {
      setIsLoadingContacts(true)
      setContactsError(null)
      const response = await emergencyContactsApi.list()
      if (response.success && response.data) {
        setEmergencyContacts(response.data)
      } else {
        setContactsError(response.error || 'Failed to load emergency contacts')
      }
    } catch (error) {
      setContactsError('Failed to load emergency contacts')
      console.error('Error loading emergency contacts:', error)
    } finally {
      setIsLoadingContacts(false)
    }
  }

  const loadBreakingNews = async () => {
    try {
      setIsLoadingAlerts(true)
      setAlertsError(null)
      const response = await breakingNewsApi.list()
      if (response.success && response.data) {
        setBreakingNewsAlerts(response.data)
      } else {
        setAlertsError(response.error || 'Failed to load breaking news alerts')
      }
    } catch (error) {
      setAlertsError('Failed to load breaking news alerts')
      console.error('Error loading breaking news alerts:', error)
    } finally {
      setIsLoadingAlerts(false)
    }
  }

  const loadArticles = async () => {
    try {
      setIsLoadingArticles(true)
      setArticlesError(null)
      const response = await articlesApi.list()
      if (response.success && response.data) {
        // Backend returns a simple array of articles
        setNewsArticles(response.data)
      } else {
        setArticlesError(response.error || 'Failed to load articles')
      }
    } catch (error) {
      setArticlesError('Failed to load articles')
      console.error('Error loading articles:', error)
    } finally {
      setIsLoadingArticles(false)
    }
  }

  const createEmergencyContact = async () => {
    try {
      const response = await emergencyContactsApi.create(newContactData)
      if (response.success && response.data) {
        setEmergencyContacts([...emergencyContacts, response.data])
        setShowContactDialog(false)
        setNewContactData({
          name: '',
          department: '',
          emergency_number: '',
          non_emergency_number: '',
          after_hours_number: '',
          hours: '',
          address: '',
          email: '',
          notes: ''
        })
        toast({
          title: "Contact Created",
          description: "Emergency contact has been created successfully.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || 'Failed to create emergency contact',
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to create emergency contact',
      })
      console.error('Error creating emergency contact:', error)
    }
  }

  const updateEmergencyContact = async () => {
    if (!editingContactId) return
    
    try {
      const response = await emergencyContactsApi.update(editingContactId, newContactData)
      if (response.success && response.data) {
        setEmergencyContacts(emergencyContacts.map(contact => 
          contact.id === editingContactId ? response.data! : contact
        ))
        setShowContactDialog(false)
        setIsEditingContact(false)
        setEditingContactId(null)
        setNewContactData({
          name: '',
          department: '',
          emergency_number: '',
          non_emergency_number: '',
          after_hours_number: '',
          hours: '',
          address: '',
          email: '',
          notes: ''
        })
        toast({
          title: "Contact Updated",
          description: "Emergency contact has been updated successfully.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || 'Failed to update emergency contact',
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to update emergency contact',
      })
      console.error('Error updating emergency contact:', error)
    }
  }

  const handleEditContact = (contact: EmergencyContact) => {
    setIsEditingContact(true)
    setEditingContactId(contact.id)
    setNewContactData({
      name: contact.name,
      department: contact.department,
      emergency_number: contact.emergency_number,
      non_emergency_number: contact.non_emergency_number || '',
      after_hours_number: contact.after_hours_number || '',
      hours: contact.hours || '',
      address: contact.address || '',
      email: contact.email || '',
      notes: contact.notes || ''
    })
    setShowContactDialog(true)
  }

  const handleCloseContactDialog = () => {
    setShowContactDialog(false)
    setIsEditingContact(false)
    setEditingContactId(null)
    setNewContactData({
      name: '',
      department: '',
      emergency_number: '',
      non_emergency_number: '',
      after_hours_number: '',
      hours: '',
      address: '',
      email: '',
      notes: ''
    })
  }

  const createBreakingNewsAlert = async () => {
    try {
      const response = await breakingNewsApi.create(newAlertData)
      if (response.success && response.data) {
        setBreakingNewsAlerts([...breakingNewsAlerts, response.data])
        setShowAlertDialog(false)
        setNewAlertData({
          title: '',
          content: '',
          type: '',
          priority: '',
          status: 'Draft',
          publish_date: '',
          expiration_date: '',
          channels: [],
          author: ''
        })
        toast({
          title: "Alert Created",
          description: "Breaking news alert has been created successfully.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || 'Failed to create breaking news alert',
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to create breaking news alert',
      })
      console.error('Error creating breaking news alert:', error)
    }
  }

  const deleteEmergencyContact = (id: number) => {
    setConfirmDialog({
      open: true,
      title: "Delete Emergency Contact",
      description: "Are you sure you want to delete this emergency contact? This action cannot be undone.",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const response = await emergencyContactsApi.delete(id)
          if (response.success) {
            setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id))
            toast({
              title: "Contact Deleted",
              description: "Emergency contact has been deleted successfully.",
            })
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: response.error || 'Failed to delete emergency contact',
            })
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: 'Failed to delete emergency contact',
          })
          console.error('Error deleting emergency contact:', error)
        }
      }
    })
  }

  const deleteBreakingNewsAlert = (id: number) => {
    setConfirmDialog({
      open: true,
      title: "Delete Breaking News Alert",
      description: "Are you sure you want to delete this breaking news alert? This action cannot be undone.",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const response = await breakingNewsApi.delete(id)
          if (response.success) {
            setBreakingNewsAlerts(breakingNewsAlerts.filter(alert => alert.id !== id))
            toast({
              title: "Alert Deleted",
              description: "Breaking news alert has been deleted successfully.",
            })
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: response.error || 'Failed to delete breaking news alert',
            })
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: 'Failed to delete breaking news alert',
          })
          console.error('Error deleting breaking news alert:', error)
        }
      }
    })
  }

  const deleteArticle = (id: number) => {
    setConfirmDialog({
      open: true,
      title: "Delete Article",
      description: "Are you sure you want to delete this article? This action cannot be undone.",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const response = await articlesApi.delete(id)
          if (response.success) {
            setNewsArticles(newsArticles.filter(article => article.id !== id))
            toast({
              title: "Article Deleted",
              description: "Article has been deleted successfully.",
            })
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: response.error || 'Failed to delete article',
            })
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: 'Failed to delete article',
          })
          console.error('Error deleting article:', error)
        }
      }
    })
  }

  // Use utility functions from content-api
  const getPriorityColor = contentUtils.getPriorityColor
  const getStatusColor = contentUtils.getStatusColor

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Emergency":
        return <AlertCircle className="h-4 w-4" />
      case "Weather":
        return <Cloud className="h-4 w-4" />
      case "Traffic":
        return <Car className="h-4 w-4" />
      case "Announcement":
        return <Info className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <>
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header 
          title="Content Management" 
          subtitle="Manage emergency contacts, breaking news, and articles"
          searchPlaceholder="Search content..."
        />

        {/* Content */}
        <main className="flex-1 p-6">
          <Tabs defaultValue="emergency" className="space-y-6">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger
                value="emergency"
                className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white"
              >
                <PhoneCall className="h-4 w-4 mr-2" />
                Emergency Contacts
              </TabsTrigger>
              <TabsTrigger value="alerts" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                <Megaphone className="h-4 w-4 mr-2" />
                Breaking News
              </TabsTrigger>
              <TabsTrigger value="news" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                <Newspaper className="h-4 w-4 mr-2" />
                News Articles
              </TabsTrigger>
            </TabsList>

            {/* Emergency Contacts Tab */}
            <TabsContent value="emergency" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#5e6461]">Emergency Contacts</CardTitle>
                    <CardDescription>Manage emergency and department contact information</CardDescription>
                  </div>
                  <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#d36530] hover:bg-[#d36530]/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Contact
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{isEditingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}</DialogTitle>
                        <DialogDescription>
                          {isEditingContact ? 'Update the emergency contact information' : 'Create a new emergency contact entry'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact-name">Contact Name</Label>
                          <Input 
                            id="contact-name" 
                            placeholder="Department or Service Name"
                            value={newContactData.name}
                            onChange={(e) => setNewContactData({...newContactData, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select 
                            value={newContactData.department} 
                            onValueChange={(value) => setNewContactData({...newContactData, department: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Public Safety">Public Safety</SelectItem>
                              <SelectItem value="Public Works">Public Works</SelectItem>
                              <SelectItem value="Utilities">Utilities</SelectItem>
                              <SelectItem value="Health Services">Health Services</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergency-number">Emergency Number</Label>
                          <Input 
                            id="emergency-number" 
                            placeholder="911 or emergency line"
                            value={newContactData.emergency_number}
                            onChange={(e) => setNewContactData({...newContactData, emergency_number: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="non-emergency">Non-Emergency Number</Label>
                          <Input 
                            id="non-emergency" 
                            placeholder="(518) 123-4567"
                            value={newContactData.non_emergency_number}
                            onChange={(e) => setNewContactData({...newContactData, non_emergency_number: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="after-hours">After Hours Number</Label>
                          <Input 
                            id="after-hours" 
                            placeholder="(518) 123-4568"
                            value={newContactData.after_hours_number}
                            onChange={(e) => setNewContactData({...newContactData, after_hours_number: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hours">Operating Hours</Label>
                          <Input 
                            id="hours" 
                            placeholder="Mon-Fri 8AM-5PM"
                            value={newContactData.hours}
                            onChange={(e) => setNewContactData({...newContactData, hours: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address" 
                            placeholder="Street address"
                            value={newContactData.address}
                            onChange={(e) => setNewContactData({...newContactData, address: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="contact@albanyny.gov"
                            value={newContactData.email}
                            onChange={(e) => setNewContactData({...newContactData, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea 
                            id="notes" 
                            placeholder="Additional information..."
                            value={newContactData.notes}
                            onChange={(e) => setNewContactData({...newContactData, notes: e.target.value})}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={handleCloseContactDialog}>
                          Cancel
                        </Button>
                        <Button 
                          className="bg-[#d36530] hover:bg-[#d36530]/90"
                          onClick={isEditingContact ? updateEmergencyContact : createEmergencyContact}
                        >
                          {isEditingContact ? 'Update Contact' : 'Add Contact'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {contactsError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-800 text-sm">{contactsError}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={loadEmergencyContacts}
                        className="mt-2 bg-transparent"
                      >
                        Retry
                      </Button>
                    </div>
                  )}
                  
                  {isLoadingContacts ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d36530]"></div>
                      <span className="ml-2 text-[#5e6461]">Loading emergency contacts...</span>
                    </div>
                  ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contact Name</TableHead>
                        <TableHead>Emergency</TableHead>
                        <TableHead>Non-Emergency</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>After Hours</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!emergencyContacts || emergencyContacts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-[#5e6461]/60">
                              No emergency contacts found. Click "Add Contact" to create one.
                            </TableCell>
                          </TableRow>
                        ) : (
                          emergencyContacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-red-600" />
                                  {contact.emergency_number}
                            </div>
                          </TableCell>
                              <TableCell>{contact.non_emergency_number || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{contact.department}</Badge>
                          </TableCell>
                          <TableCell>
                                {contact.after_hours_number ? (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                                    {contact.after_hours_number}
                            </div>
                                ) : 'N/A'}
                          </TableCell>
                              <TableCell>{contact.hours || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedContact(contact)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Number
                                </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-red-600"
                                      onClick={() => deleteEmergencyContact(contact.id)}
                                    >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                          ))
                        )}
                    </TableBody>
                  </Table>
                  )}
                </CardContent>
              </Card>

              {/* Contact Details Dialog */}
              {selectedContact && (
                <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{selectedContact.name}</DialogTitle>
                      <DialogDescription>Complete contact information</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-[#5e6461]">Emergency Number</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-4 w-4 text-red-600" />
                            <span className="font-mono">{selectedContact.emergency_number}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-[#5e6461]">Non-Emergency</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <span className="font-mono">{selectedContact.non_emergency_number || 'N/A'}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-[#5e6461]">After Hours</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4 text-orange-600" />
                            <span className="font-mono">{selectedContact.after_hours_number || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-[#5e6461]">Department</Label>
                          <Badge variant="secondary" className="mt-1">
                            {selectedContact.department}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-[#5e6461]">Operating Hours</Label>
                          <p className="mt-1">{selectedContact.hours || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-[#5e6461]">Email</Label>
                          <p className="mt-1">{selectedContact.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label className="text-sm font-medium text-[#5e6461]">Address</Label>
                        <p>{selectedContact.address || 'N/A'}</p>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label className="text-sm font-medium text-[#5e6461]">Notes</Label>
                        <p className="text-sm text-[#5e6461]/70">{selectedContact.notes || 'No additional notes'}</p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSelectedContact(null)}>
                        Close
                      </Button>
                      <Button className="bg-[#d36530] hover:bg-[#d36530]/90">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Contact
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </TabsContent>

            {/* Breaking News Alerts Tab */}
            <TabsContent value="alerts" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#5e6461]">Breaking News Alerts</CardTitle>
                    <CardDescription>Manage emergency alerts and breaking news notifications</CardDescription>
                  </div>
                  <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#d36530] hover:bg-[#d36530]/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Alert
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create Breaking News Alert</DialogTitle>
                        <DialogDescription>
                          Create a new emergency alert or breaking news notification
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="alert-title">Alert Title</Label>
                          <Input 
                            id="alert-title" 
                            placeholder="Brief, descriptive title"
                            value={newAlertData.title}
                            onChange={(e) => setNewAlertData({...newAlertData, title: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="alert-content">Alert Content</Label>
                          <Textarea 
                            id="alert-content" 
                            placeholder="Detailed alert message..." 
                            rows={4}
                            value={newAlertData.content}
                            onChange={(e) => setNewAlertData({...newAlertData, content: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="alert-type">Alert Type</Label>
                            <Select 
                              value={newAlertData.type} 
                              onValueChange={(value) => setNewAlertData({...newAlertData, type: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Emergency">Emergency</SelectItem>
                                <SelectItem value="Weather">Weather</SelectItem>
                                <SelectItem value="Traffic">Traffic</SelectItem>
                                <SelectItem value="Announcement">Announcement</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="alert-priority">Priority Level</Label>
                            <Select 
                              value={newAlertData.priority} 
                              onValueChange={(value) => setNewAlertData({...newAlertData, priority: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Critical">Critical</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="publish-date">Publish Date</Label>
                            <Input 
                              id="publish-date" 
                              type="datetime-local"
                              value={newAlertData.publish_date}
                              onChange={(e) => setNewAlertData({...newAlertData, publish_date: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expiration-date">Expiration Date</Label>
                            <Input 
                              id="expiration-date" 
                              type="datetime-local"
                              value={newAlertData.expiration_date}
                              onChange={(e) => setNewAlertData({...newAlertData, expiration_date: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="alert-author">Author</Label>
                          <Input 
                            id="alert-author" 
                            placeholder="Author name"
                            value={newAlertData.author}
                            onChange={(e) => setNewAlertData({...newAlertData, author: e.target.value})}
                          />
                        </div>
                        <div className="space-y-3">
                          <Label>Distribution Channels</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="website" 
                                checked={newAlertData.channels.includes('Website')}
                                onCheckedChange={(checked) => {
                                  const channels = checked 
                                    ? [...newAlertData.channels, 'Website']
                                    : newAlertData.channels.filter(c => c !== 'Website')
                                  setNewAlertData({...newAlertData, channels})
                                }}
                              />
                              <Label htmlFor="website" className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Website
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="mobile" 
                                checked={newAlertData.channels.includes('Mobile App')}
                                onCheckedChange={(checked) => {
                                  const channels = checked 
                                    ? [...newAlertData.channels, 'Mobile App']
                                    : newAlertData.channels.filter(c => c !== 'Mobile App')
                                  setNewAlertData({...newAlertData, channels})
                                }}
                              />
                              <Label htmlFor="mobile" className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4" />
                                Mobile App
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="email" 
                                checked={newAlertData.channels.includes('Email')}
                                onCheckedChange={(checked) => {
                                  const channels = checked 
                                    ? [...newAlertData.channels, 'Email']
                                    : newAlertData.channels.filter(c => c !== 'Email')
                                  setNewAlertData({...newAlertData, channels})
                                }}
                              />
                              <Label htmlFor="email" className="flex items-center gap-2">
                                <AtSign className="h-4 w-4" />
                                Email
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAlertDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          className="bg-[#d36530] hover:bg-[#d36530]/90"
                          onClick={createBreakingNewsAlert}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Create Alert
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {alertsError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-800 text-sm">{alertsError}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={loadBreakingNews}
                        className="mt-2 bg-transparent"
                      >
                        Retry
                      </Button>
                    </div>
                  )}
                  
                  {isLoadingAlerts ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d36530]"></div>
                      <span className="ml-2 text-[#5e6461]">Loading breaking news alerts...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {!breakingNewsAlerts || breakingNewsAlerts.length === 0 ? (
                        <div className="text-center py-8 text-[#5e6461]/60">
                          No breaking news alerts found. Click "Create Alert" to create one.
                        </div>
                      ) : (
                        breakingNewsAlerts.map((alert) => (
                      <Card key={alert.id} className="border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getTypeIcon(alert.type)}
                                <h3 className="font-semibold text-[#5e6461]">{alert.title}</h3>
                                <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                                <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                              </div>
                              <p className="text-sm text-[#5e6461]/70 mb-3">{alert.content}</p>
                              <div className="flex items-center gap-4 text-xs text-[#5e6461]/60">
                                <span>By {alert.author}</span>
                                {alert.publish_date && (
                                  <span>Published: {contentUtils.formatDate(alert.publish_date)}</span>
                                )}
                                {alert.expiration_date && (
                                  <span>Expires: {contentUtils.formatDate(alert.expiration_date)}</span>
                                )}
                                <span>{alert.views} views</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                {alert.channels.map((channel) => (
                                  <Badge key={channel} variant="outline" className="text-xs">
                                    {channel}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedAlert(alert)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Alert
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => deleteBreakingNewsAlert(alert.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                        ))
                      )}
                  </div>
                  )}
                </CardContent>
              </Card>

              {/* Alert Details Dialog */}
              {selectedAlert && (
                <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {getTypeIcon(selectedAlert.type)}
                        {selectedAlert.title}
                      </DialogTitle>
                      <DialogDescription>Alert details and distribution information</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(selectedAlert.priority)}>{selectedAlert.priority}</Badge>
                        <Badge className={getStatusColor(selectedAlert.status)}>{selectedAlert.status}</Badge>
                        <Badge variant="outline">{selectedAlert.type}</Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-[#5e6461]">Content</Label>
                        <p className="mt-1 text-sm">{selectedAlert.content}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-[#5e6461]">Published</Label>
                          <p className="mt-1 text-sm">
                            {selectedAlert.publish_date 
                              ? contentUtils.formatDate(selectedAlert.publish_date) 
                              : 'Not published'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-[#5e6461]">Expires</Label>
                          <p className="mt-1 text-sm">
                            {selectedAlert.expiration_date 
                              ? contentUtils.formatDate(selectedAlert.expiration_date) 
                              : 'No expiration'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-[#5e6461]">Distribution Channels</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {selectedAlert.channels.map((channel) => (
                            <Badge key={channel} variant="outline">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-[#5e6461]">Author</Label>
                          <p className="mt-1 text-sm">{selectedAlert.author}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-[#5e6461]">Views</Label>
                          <p className="mt-1 text-sm">{selectedAlert.views.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSelectedAlert(null)}>
                        Close
                      </Button>
                      <Button className="bg-[#d36530] hover:bg-[#d36530]/90">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Alert
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </TabsContent>

            {/* News Articles Tab */}
            <TabsContent value="news" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#5e6461]">News Articles</CardTitle>
                    <CardDescription>Manage news articles and blog posts</CardDescription>
                  </div>
                  <Link href="/content/articles/new">
                    <Button className="bg-[#d36530] hover:bg-[#d36530]/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Article
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {articlesError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-800 text-sm">{articlesError}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={loadArticles}
                        className="mt-2 bg-transparent"
                      >
                        Retry
                      </Button>
                    </div>
                  )}

                  {isLoadingArticles ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d36530]"></div>
                      <span className="ml-2 text-[#5e6461]">Loading articles...</span>
                    </div>
                  ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!newsArticles || newsArticles.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-[#5e6461]/60">
                              No articles found. Click "Create Article" to create one.
                            </TableCell>
                          </TableRow>
                        ) : (
                          newsArticles.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-[#5e6461]">{article.title}</div>
                              {article.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            </div>
                            <div className="text-sm text-[#5e6461]/70 mt-1">{article.excerpt}</div>
                          </TableCell>
                          <TableCell>
                                <Badge variant="secondary">{article.category || 'Uncategorized'}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(article.status)}>{article.status}</Badge>
                          </TableCell>
                          <TableCell>{article.author}</TableCell>
                          <TableCell>
                                {article.publish_date 
                                  ? contentUtils.formatDate(article.publish_date) 
                                  : "Not published"}
                          </TableCell>
                          <TableCell>{article.views.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/content/articles/${article.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Article
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/content/articles/${article.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Article
                                  </Link>
                                </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={async () => {
                                        try {
                                          const response = await articlesApi.duplicate(article.id)
                                          if (response.success) {
                                            loadArticles() // Refresh the list
                                            toast({
                                              title: "Article Duplicated",
                                              description: "Article has been duplicated successfully.",
                                            })
                                          } else {
                                            toast({
                                              variant: "destructive",
                                              title: "Error",
                                              description: response.error || 'Failed to duplicate article',
                                            })
                                          }
                                        } catch (error) {
                                          toast({
                                            variant: "destructive",
                                            title: "Error",
                                            description: 'Failed to duplicate article',
                                          })
                                        }
                                      }}
                                    >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-red-600"
                                      onClick={() => deleteArticle(article.id)}
                                    >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                          ))
                        )}
                    </TableBody>
                  </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        confirmText={confirmDialog.variant === "destructive" ? "Delete" : "Confirm"}
        onConfirm={confirmDialog.onConfirm}
      />
    </>
  )
}
