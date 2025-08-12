"use client"

import { useState } from "react"
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
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Clock,
  MapPinIcon,
  Upload,
  Download,
  Play,
  CalendarIcon,
  User,
  FileAudio,
  Paperclip,
  ChevronDown,
  ChevronRight,
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
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: FileText, label: "Home Screen", href: "/home-screen" },
  { icon: Users, label: "Officials", href: "/officials" },
  { icon: Calendar, label: "Meetings", href: "/meetings", active: true },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: AlertTriangle, label: "Issue Reports", href: "/issues" },
  { icon: MessageSquare, label: "Q&A", href: "/questions" },
  { icon: Mail, label: "Newsletter", href: "/newsletter" },
  { icon: MapPin, label: "Wards & Districts", href: "/wards" },
  { icon: Vote, label: "Elections", href: "/elections" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Shield, label: "User Management", href: "/users" },
  { icon: Settings, label: "System Config", href: "/settings" },
]

const meetingTypes = [
  {
    id: 1,
    name: "City Council",
    description: "Regular city council meetings for municipal governance",
    color: "#d36530",
    defaultDuration: 120,
    publicComments: true,
    recordingEnabled: true,
  },
  {
    id: 2,
    name: "Planning Commission",
    description: "Planning and zoning commission meetings",
    color: "#059669",
    defaultDuration: 90,
    publicComments: true,
    recordingEnabled: true,
  },
  {
    id: 3,
    name: "School Board",
    description: "Albany School District board meetings",
    color: "#7c3aed",
    defaultDuration: 150,
    publicComments: true,
    recordingEnabled: true,
  },
  {
    id: 4,
    name: "Budget Committee",
    description: "Budget planning and review meetings",
    color: "#dc2626",
    defaultDuration: 180,
    publicComments: false,
    recordingEnabled: false,
  },
]

const meetings = [
  {
    id: 1,
    title: "Regular City Council Meeting",
    type: "City Council",
    typeColor: "#d36530",
    date: "2024-03-20",
    time: "19:00",
    location: "City Hall - Council Chambers",
    status: "Scheduled",
    publicComments: true,
    agendaItems: 8,
    hasMinutes: false,
    hasRecording: false,
  },
  {
    id: 2,
    title: "Planning Commission Review",
    type: "Planning Commission",
    typeColor: "#059669",
    date: "2024-03-18",
    time: "18:30",
    location: "City Hall - Conference Room A",
    status: "Completed",
    publicComments: true,
    agendaItems: 5,
    hasMinutes: true,
    hasRecording: true,
  },
  {
    id: 3,
    title: "Emergency Budget Session",
    type: "Budget Committee",
    typeColor: "#dc2626",
    date: "2024-03-22",
    time: "14:00",
    location: "City Hall - Executive Conference Room",
    status: "Postponed",
    publicComments: false,
    agendaItems: 3,
    hasMinutes: false,
    hasRecording: false,
  },
]

const agendaItems = [
  {
    id: 1,
    meetingId: 1,
    order: 1,
    title: "Call to Order",
    description: "Meeting opening and roll call",
    timeAllocation: 5,
    presenter: "Mayor Sarah Johnson",
    type: "Administrative",
  },
  {
    id: 2,
    meetingId: 1,
    order: 2,
    title: "Public Comments",
    description: "Open floor for public comments and concerns",
    timeAllocation: 15,
    presenter: "Mayor Sarah Johnson",
    type: "Public Input",
  },
  {
    id: 3,
    meetingId: 1,
    order: 3,
    title: "Budget Amendment Discussion",
    description: "Review proposed amendments to the 2024 city budget",
    timeAllocation: 30,
    presenter: "Finance Director",
    type: "Discussion",
  },
  {
    id: 4,
    meetingId: 1,
    order: 4,
    title: "Downtown Parking Ordinance",
    description: "Second reading of proposed parking regulation changes",
    timeAllocation: 20,
    presenter: "Council Member Chen",
    type: "Ordinance",
  },
]

const archivedMeetings = [
  {
    id: 1,
    title: "City Council Meeting - February 2024",
    date: "2024-02-15",
    type: "City Council",
    hasMinutes: true,
    hasRecording: true,
    hasDocuments: true,
    documentsCount: 5,
  },
  {
    id: 2,
    title: "Planning Commission - January 2024",
    date: "2024-01-22",
    type: "Planning Commission",
    hasMinutes: true,
    hasRecording: false,
    hasDocuments: true,
    documentsCount: 3,
  },
]

export default function MeetingsManagement() {
  const [activeTab, setActiveTab] = useState("meetings")
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false)
  const [isAddTypeOpen, setIsAddTypeOpen] = useState(false)
  const [isAddAgendaOpen, setIsAddAgendaOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [expandedAgenda, setExpandedAgenda] = useState<number | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      case "Postponed":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#5e6461]">Meetings & Calendar</h2>
              <p className="text-[#5e6461]/70">Manage meetings, agendas, and archives</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5e6461]/50" />
                <Input
                  placeholder="Search meetings..."
                  className="pl-10 w-64 border-gray-300 focus:border-[#d36530] focus:ring-[#d36530]"
                />
              </div>

              <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsAddMeetingOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="meetings" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                Meetings
              </TabsTrigger>
              <TabsTrigger value="types" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                Meeting Types
              </TabsTrigger>
              <TabsTrigger value="agenda" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                Agenda Management
              </TabsTrigger>
              <TabsTrigger value="archives" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                Archives
              </TabsTrigger>
              <TabsTrigger value="alerts" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                Alert Settings
              </TabsTrigger>
            </TabsList>

            {/* Meetings Tab */}
            <TabsContent value="meetings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {meetings.map((meeting) => (
                  <Card key={meeting.id} className="border-gray-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-[#5e6461] mb-2">{meeting.title}</CardTitle>
                          <Badge style={{ backgroundColor: meeting.typeColor, color: "white" }} className="mb-2">
                            {meeting.type}
                          </Badge>
                          <Badge className={getStatusColor(meeting.status)}>{meeting.status}</Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Meeting
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Manage Agenda
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancel Meeting
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-[#5e6461]/70">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#5e6461]/70">
                          <MapPinIcon className="h-4 w-4" />
                          {meeting.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#5e6461]/70">
                          <FileText className="h-4 w-4" />
                          {meeting.agendaItems} agenda items
                        </div>
                        {meeting.publicComments && (
                          <div className="flex items-center gap-2 text-sm text-[#5e6461]/70">
                            <MessageSquare className="h-4 w-4" />
                            Public comments enabled
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        {meeting.hasMinutes && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Minutes
                          </Badge>
                        )}
                        {meeting.hasRecording && (
                          <Badge variant="outline" className="text-xs">
                            <FileAudio className="h-3 w-3 mr-1" />
                            Recording
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add Meeting Dialog */}
              <Dialog open={isAddMeetingOpen} onOpenChange={setIsAddMeetingOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Schedule New Meeting</DialogTitle>
                    <DialogDescription>Create a new meeting with agenda and details.</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="title">Meeting Title</Label>
                      <Input id="title" placeholder="Enter meeting title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Meeting Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {meetingTypes.map((type) => (
                            <SelectItem key={type.id} value={type.name}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="postponed">Postponed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" type="time" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="Enter meeting location" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Enter meeting description..." rows={3} />
                    </div>
                    <div className="col-span-2 flex items-center space-x-2">
                      <Switch id="public-comments" />
                      <Label htmlFor="public-comments">Enable public comments</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddMeetingOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-[#d36530] hover:bg-[#d36530]/90">Schedule Meeting</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Meeting Types Tab */}
            <TabsContent value="types" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#5e6461]">Meeting Types</CardTitle>
                    <CardDescription>Configure meeting types and their default settings</CardDescription>
                  </div>
                  <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsAddTypeOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Type
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {meetingTypes.map((type) => (
                      <Card key={type.id} className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: type.color }}></div>
                              <div>
                                <CardTitle className="text-lg text-[#5e6461]">{type.name}</CardTitle>
                                <CardDescription>{type.description}</CardDescription>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Type
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Type
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-[#5e6461]">Default Duration:</span>
                              <p className="text-[#5e6461]/70">{type.defaultDuration} minutes</p>
                            </div>
                            <div>
                              <span className="font-medium text-[#5e6461]">Public Comments:</span>
                              <p className="text-[#5e6461]/70">{type.publicComments ? "Enabled" : "Disabled"}</p>
                            </div>
                            <div>
                              <span className="font-medium text-[#5e6461]">Recording:</span>
                              <p className="text-[#5e6461]/70">{type.recordingEnabled ? "Enabled" : "Disabled"}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Add Meeting Type Dialog */}
              <Dialog open={isAddTypeOpen} onOpenChange={setIsAddTypeOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Meeting Type</DialogTitle>
                    <DialogDescription>Create a new meeting type with default settings.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="type-name">Type Name</Label>
                      <Input id="type-name" placeholder="Enter type name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type-description">Description</Label>
                      <Textarea id="type-description" placeholder="Enter type description..." rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type-color">Color</Label>
                      <Input id="type-color" type="color" defaultValue="#d36530" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-duration">Default Duration (minutes)</Label>
                      <Input id="default-duration" type="number" placeholder="120" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="type-public-comments" />
                        <Label htmlFor="type-public-comments">Enable public comments by default</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="type-recording" />
                        <Label htmlFor="type-recording">Enable recording by default</Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddTypeOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-[#d36530] hover:bg-[#d36530]/90">Add Type</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Agenda Management Tab */}
            <TabsContent value="agenda" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#5e6461]">Agenda Management</CardTitle>
                    <CardDescription>Manage agenda items for upcoming meetings</CardDescription>
                  </div>
                  <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsAddAgendaOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Agenda Item
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {meetings
                      .filter((m) => m.status === "Scheduled")
                      .map((meeting) => (
                        <Card key={meeting.id} className="border border-gray-200">
                          <CardHeader className="pb-3">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => setExpandedAgenda(expandedAgenda === meeting.id ? null : meeting.id)}
                            >
                              <div className="flex items-center gap-3">
                                {expandedAgenda === meeting.id ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                <div>
                                  <CardTitle className="text-lg text-[#5e6461]">{meeting.title}</CardTitle>
                                  <CardDescription>
                                    {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                                  </CardDescription>
                                </div>
                              </div>
                              <Badge variant="outline">{meeting.agendaItems} items</Badge>
                            </div>
                          </CardHeader>
                          {expandedAgenda === meeting.id && (
                            <CardContent>
                              <div className="space-y-3">
                                {agendaItems
                                  .filter((item) => item.meetingId === meeting.id)
                                  .sort((a, b) => a.order - b.order)
                                  .map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-xs">
                                          {item.order}
                                        </Badge>
                                        <div>
                                          <h4 className="font-medium text-[#5e6461]">{item.title}</h4>
                                          <p className="text-sm text-[#5e6461]/70">{item.description}</p>
                                          <div className="flex items-center gap-4 mt-1 text-xs text-[#5e6461]/50">
                                            <span className="flex items-center gap-1">
                                              <Clock className="h-3 w-3" />
                                              {item.timeAllocation} min
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <User className="h-3 w-3" />
                                              {item.presenter}
                                            </span>
                                            <Badge variant="secondary" className="text-xs">
                                              {item.type}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Item
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload Documents
                                          </DropdownMenuItem>
                                          <DropdownMenuItem className="text-red-600">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Item
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  ))}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add Agenda Item Dialog */}
              <Dialog open={isAddAgendaOpen} onOpenChange={setIsAddAgendaOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Agenda Item</DialogTitle>
                    <DialogDescription>Add a new item to a meeting agenda.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="agenda-meeting">Meeting</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meeting" />
                        </SelectTrigger>
                        <SelectContent>
                          {meetings
                            .filter((m) => m.status === "Scheduled")
                            .map((meeting) => (
                              <SelectItem key={meeting.id} value={meeting.id.toString()}>
                                {meeting.title} - {new Date(meeting.date).toLocaleDateString()}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agenda-title">Item Title</Label>
                      <Input id="agenda-title" placeholder="Enter agenda item title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agenda-description">Description</Label>
                      <Textarea id="agenda-description" placeholder="Enter item description..." rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="agenda-time">Time Allocation (minutes)</Label>
                        <Input id="agenda-time" type="number" placeholder="15" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agenda-order">Order</Label>
                        <Input id="agenda-order" type="number" placeholder="1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agenda-presenter">Presenter</Label>
                      <Input id="agenda-presenter" placeholder="Enter presenter name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agenda-type">Item Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="administrative">Administrative</SelectItem>
                          <SelectItem value="public-input">Public Input</SelectItem>
                          <SelectItem value="discussion">Discussion</SelectItem>
                          <SelectItem value="ordinance">Ordinance</SelectItem>
                          <SelectItem value="resolution">Resolution</SelectItem>
                          <SelectItem value="report">Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddAgendaOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-[#d36530] hover:bg-[#d36530]/90">Add Item</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Archives Tab */}
            <TabsContent value="archives" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#5e6461]">Meeting Archives</CardTitle>
                    <CardDescription>Access past meeting recordings, minutes, and documents</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Archive
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Meeting</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Minutes</TableHead>
                        <TableHead>Recording</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {archivedMeetings.map((meeting) => (
                        <TableRow key={meeting.id}>
                          <TableCell className="font-medium">{meeting.title}</TableCell>
                          <TableCell>{new Date(meeting.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{meeting.type}</Badge>
                          </TableCell>
                          <TableCell>
                            {meeting.hasMinutes ? (
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            ) : (
                              <span className="text-[#5e6461]/50">Not available</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {meeting.hasRecording ? (
                              <Button variant="ghost" size="sm">
                                <Play className="h-4 w-4 mr-2" />
                                Play
                              </Button>
                            ) : (
                              <span className="text-[#5e6461]/50">Not available</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {meeting.hasDocuments ? (
                              <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                <Paperclip className="h-3 w-3" />
                                {meeting.documentsCount}
                              </Badge>
                            ) : (
                              <span className="text-[#5e6461]/50">None</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download All
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Files
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Archive
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alert Settings Tab */}
            <TabsContent value="alerts" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-[#5e6461]">Default Alert Settings</CardTitle>
                    <CardDescription>Configure default notification preferences for meetings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-alerts">Email Notifications</Label>
                          <p className="text-sm text-[#5e6461]/70">Send email alerts for meeting updates</p>
                        </div>
                        <Switch id="email-alerts" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sms-alerts">SMS Notifications</Label>
                          <p className="text-sm text-[#5e6461]/70">Send text message alerts</p>
                        </div>
                        <Switch id="sms-alerts" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-alerts">Push Notifications</Label>
                          <p className="text-sm text-[#5e6461]/70">Send app push notifications</p>
                        </div>
                        <Switch id="push-alerts" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-[#5e6461]">Alert Timing</CardTitle>
                    <CardDescription>Configure when alerts are sent</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="advance-notice">Advance Notice (hours)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hour</SelectItem>
                          <SelectItem value="2">2 hours</SelectItem>
                          <SelectItem value="4">4 hours</SelectItem>
                          <SelectItem value="24">24 hours</SelectItem>
                          <SelectItem value="48">48 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="once">Once</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="emergency-alerts" />
                      <Label htmlFor="emergency-alerts">Emergency meeting alerts</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Alert Templates</CardTitle>
                  <CardDescription>Customize notification message templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="meeting-scheduled">Meeting Scheduled Template</Label>
                      <Textarea
                        id="meeting-scheduled"
                        placeholder="A new meeting has been scheduled: {meeting_title} on {date} at {time}..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meeting-cancelled">Meeting Cancelled Template</Label>
                      <Textarea
                        id="meeting-cancelled"
                        placeholder="The meeting {meeting_title} scheduled for {date} has been cancelled..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agenda-updated">Agenda Updated Template</Label>
                      <Textarea
                        id="agenda-updated"
                        placeholder="The agenda for {meeting_title} has been updated. View the latest agenda..."
                        rows={3}
                      />
                    </div>
                    <Button className="bg-[#d36530] hover:bg-[#d36530]/90">Save Templates</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}
