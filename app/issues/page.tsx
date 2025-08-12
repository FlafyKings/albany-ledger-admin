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
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wrench,
  Car,
  TreePine,
  Lightbulb,
  Building,
  Send,
  MapPinIcon,
} from "lucide-react"
import Link from "next/link"
// Sidebar is provided globally by the layout

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
  { icon: Calendar, label: "Meetings", href: "/meetings" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: AlertTriangle, label: "Issue Reports", href: "/issues", active: true },
  { icon: MessageSquare, label: "Q&A", href: "/questions" },
  { icon: Mail, label: "Newsletter", href: "/newsletter" },
  { icon: MapPin, label: "Wards & Districts", href: "/wards" },
  { icon: Vote, label: "Elections", href: "/elections" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Shield, label: "User Management", href: "/users" },
  { icon: Settings, label: "System Config", href: "/settings" },
]

const issueCategories = [
  {
    id: 1,
    name: "Road & Infrastructure",
    description: "Potholes, road damage, sidewalk issues",
    icon: "Car",
    department: "Public Works",
    priority: "High",
    color: "#dc2626",
    issueCount: 45,
    avgResolutionDays: 7,
  },
  {
    id: 2,
    name: "Street Lighting",
    description: "Broken streetlights, dark areas",
    icon: "Lightbulb",
    department: "Utilities",
    priority: "Medium",
    color: "#f59e0b",
    issueCount: 23,
    avgResolutionDays: 3,
  },
  {
    id: 3,
    name: "Parks & Recreation",
    description: "Park maintenance, playground issues",
    icon: "TreePine",
    department: "Parks & Recreation",
    priority: "Low",
    color: "#059669",
    issueCount: 18,
    avgResolutionDays: 14,
  },
  {
    id: 4,
    name: "Building & Code",
    description: "Building violations, code enforcement",
    icon: "Building",
    department: "Code Enforcement",
    priority: "High",
    color: "#7c3aed",
    issueCount: 31,
    avgResolutionDays: 21,
  },
  {
    id: 5,
    name: "Public Safety",
    description: "Safety hazards, emergency issues",
    icon: "AlertTriangle",
    department: "Public Safety",
    priority: "Critical",
    color: "#dc2626",
    issueCount: 12,
    avgResolutionDays: 1,
  },
]

const issueReports = [
  {
    id: "ISS-2024-001",
    title: "Large pothole on Oak Street",
    category: "Road & Infrastructure",
    categoryColor: "#dc2626",
    status: "In Progress",
    priority: "High",
    reporter: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(518) 555-0123",
      anonymous: false,
    },
    location: {
      address: "Oak Street & 3rd Avenue",
      coordinates: "42.6803, -73.8370",
      ward: "Ward 2",
    },
    department: "Public Works",
    assignedTo: "Mike Johnson",
    submittedDate: "2024-03-15T10:30:00",
    estimatedCompletion: "2024-03-22",
    description: "Large pothole causing vehicle damage. Approximately 3 feet wide and 6 inches deep.",
    photos: ["/placeholder.svg?height=100&width=100"],
    updates: 3,
    lastUpdate: "2024-03-18T14:20:00",
  },
  {
    id: "ISS-2024-002",
    title: "Broken streetlight on Main Street",
    category: "Street Lighting",
    categoryColor: "#f59e0b",
    status: "Pending",
    priority: "Medium",
    reporter: {
      name: "Anonymous",
      email: "anonymous@system.local",
      phone: "",
      anonymous: true,
    },
    location: {
      address: "Main Street near City Hall",
      coordinates: "42.6823, -73.8390",
      ward: "Ward 1",
    },
    department: "Utilities",
    assignedTo: "Sarah Davis",
    submittedDate: "2024-03-18T08:15:00",
    estimatedCompletion: "2024-03-21",
    description: "Streetlight has been out for several days, creating safety concern for pedestrians.",
    photos: [],
    updates: 1,
    lastUpdate: "2024-03-18T08:15:00",
  },
  {
    id: "ISS-2024-003",
    title: "Playground equipment damage",
    category: "Parks & Recreation",
    categoryColor: "#059669",
    status: "Completed",
    priority: "Medium",
    reporter: {
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "(518) 555-0456",
      anonymous: false,
    },
    location: {
      address: "Lincoln Park - Playground Area",
      coordinates: "42.6850, -73.8420",
      ward: "Ward 3",
    },
    department: "Parks & Recreation",
    assignedTo: "Tom Wilson",
    submittedDate: "2024-03-10T16:45:00",
    estimatedCompletion: "2024-03-24",
    description: "Swing set chain is broken, making it unsafe for children to use.",
    photos: ["/placeholder.svg?height=100&width=100"],
    updates: 5,
    lastUpdate: "2024-03-19T11:30:00",
  },
]

const issueUpdates = [
  {
    id: 1,
    issueId: "ISS-2024-001",
    timestamp: "2024-03-18T14:20:00",
    author: "Mike Johnson",
    department: "Public Works",
    type: "Status Update",
    message: "Work crew dispatched to assess the damage. Materials ordered for repair.",
    status: "In Progress",
    isPublic: true,
  },
  {
    id: 2,
    issueId: "ISS-2024-001",
    timestamp: "2024-03-16T09:15:00",
    author: "Mike Johnson",
    department: "Public Works",
    type: "Assignment",
    message: "Issue assigned to Public Works crew. Scheduled for assessment on March 18th.",
    status: "In Progress",
    isPublic: true,
  },
  {
    id: 3,
    issueId: "ISS-2024-001",
    timestamp: "2024-03-15T10:30:00",
    author: "System",
    department: "System",
    type: "Created",
    message: "Issue reported by John Smith. Awaiting department assignment.",
    status: "Pending",
    isPublic: false,
  },
]

export default function IssueReportsManagement() {
  const [activeTab, setActiveTab] = useState("reports")
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-600 text-white"
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIconComponent = (iconName: string) => {
    const icons = {
      Car,
      Lightbulb,
      TreePine,
      Building,
      AlertTriangle,
      Wrench,
    }
    const IconComponent = icons[iconName] || AlertTriangle
    return <IconComponent className="h-5 w-5" />
  }

  const filteredReports = issueReports.filter((report) => {
    if (statusFilter !== "all" && report.status !== statusFilter) return false
    if (priorityFilter !== "all" && report.priority !== priorityFilter) return false
    if (departmentFilter !== "all" && report.department !== departmentFilter) return false
    return true
  })

  return (
    <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#5e6461]">Issue Reports Management</h2>
              <p className="text-[#5e6461]/70">Manage citizen-reported issues and track resolutions</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5e6461]/50" />
                <Input
                  placeholder="Search issues..."
                  className="pl-10 w-64 border-gray-300 focus:border-[#d36530] focus:ring-[#d36530]"
                />
              </div>

              <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsCategoryOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="reports" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                Issue Reports
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger value="tracking" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                Issue Tracking
              </TabsTrigger>
              <TabsTrigger value="updates" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                Updates & History
              </TabsTrigger>
            </TabsList>

            {/* Issue Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              {/* Filters */}
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="status-filter">Status:</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="priority-filter">Priority:</Label>
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="department-filter">Department:</Label>
                        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Public Works">Public Works</SelectItem>
                            <SelectItem value="Utilities">Utilities</SelectItem>
                            <SelectItem value="Parks & Recreation">Parks & Recreation</SelectItem>
                            <SelectItem value="Code Enforcement">Code Enforcement</SelectItem>
                            <SelectItem value="Public Safety">Public Safety</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Advanced Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issue Reports Table */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Issue Reports</CardTitle>
                  <CardDescription>{filteredReports.length} active reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Issue ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell className="font-medium">{issue.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-[#5e6461]">{issue.title}</div>
                              <div className="text-sm text-[#5e6461]/70 flex items-center gap-1">
                                <MapPinIcon className="h-3 w-3" />
                                {issue.location.address}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge style={{ backgroundColor: issue.categoryColor, color: "white" }}>
                              {issue.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-[#5e6461]">
                                {issue.reporter.anonymous ? "Anonymous" : issue.reporter.name}
                              </div>
                              {!issue.reporter.anonymous && (
                                <div className="text-sm text-[#5e6461]/70">{issue.reporter.email}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-[#5e6461]">{issue.assignedTo}</div>
                              <div className="text-sm text-[#5e6461]/70">{issue.department}</div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(issue.submittedDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedIssue(issue)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Issue
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsUpdateOpen(true)}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Add Update
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <User className="h-4 w-4 mr-2" />
                                  Reassign
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Complete
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancel Issue
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

              {/* Issue Details Dialog */}
              {selectedIssue && (
                <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {selectedIssue.id}: {selectedIssue.title}
                        <Badge className={getStatusColor(selectedIssue.status)}>{selectedIssue.status}</Badge>
                      </DialogTitle>
                      <DialogDescription>Issue details and management</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-6 py-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-[#5e6461] mb-2">Issue Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Category:</span>
                              <Badge style={{ backgroundColor: selectedIssue.categoryColor, color: "white" }}>
                                {selectedIssue.category}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Priority:</span>
                              <Badge className={getPriorityColor(selectedIssue.priority)}>
                                {selectedIssue.priority}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Department:</span>
                              <span>{selectedIssue.department}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Assigned To:</span>
                              <span>{selectedIssue.assignedTo}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Estimated Completion:</span>
                              <span>{new Date(selectedIssue.estimatedCompletion).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-[#5e6461] mb-2">Reporter Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Name:</span>
                              <span>
                                {selectedIssue.reporter.anonymous ? "Anonymous" : selectedIssue.reporter.name}
                              </span>
                            </div>
                            {!selectedIssue.reporter.anonymous && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-[#5e6461]/70">Email:</span>
                                  <span>{selectedIssue.reporter.email}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#5e6461]/70">Phone:</span>
                                  <span>{selectedIssue.reporter.phone}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-[#5e6461] mb-2">Location</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Address:</span>
                              <span>{selectedIssue.location.address}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Ward:</span>
                              <span>{selectedIssue.location.ward}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Coordinates:</span>
                              <span className="font-mono text-xs">{selectedIssue.location.coordinates}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-[#5e6461] mb-2">Description</h4>
                          <p className="text-sm text-[#5e6461]/70 bg-gray-50 p-3 rounded-lg">
                            {selectedIssue.description}
                          </p>
                        </div>

                        {selectedIssue.photos.length > 0 && (
                          <div>
                            <h4 className="font-medium text-[#5e6461] mb-2">Photos</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {selectedIssue.photos.map((photo, index) => (
                                <img
                                  key={index}
                                  src={photo || "/placeholder.svg"}
                                  alt={`Issue photo ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="font-medium text-[#5e6461] mb-2">Recent Updates</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {issueUpdates
                              .filter((update) => update.issueId === selectedIssue.id)
                              .slice(0, 3)
                              .map((update) => (
                                <div key={update.id} className="text-sm p-2 bg-gray-50 rounded">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium">{update.author}</span>
                                    <span className="text-xs text-[#5e6461]/50">
                                      {new Date(update.timestamp).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-[#5e6461]/70">{update.message}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSelectedIssue(null)}>
                        Close
                      </Button>
                      <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsUpdateOpen(true)}>
                        Add Update
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Add Update Dialog */}
              <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Issue Update</DialogTitle>
                    <DialogDescription>Add a status update or response to the issue.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="update-type">Update Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select update type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="status">Status Update</SelectItem>
                          <SelectItem value="response">Department Response</SelectItem>
                          <SelectItem value="assignment">Assignment Change</SelectItem>
                          <SelectItem value="completion">Completion Update</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="update-status">New Status</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="update-message">Update Message</Label>
                      <Textarea
                        id="update-message"
                        placeholder="Enter update message..."
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimated-completion">Estimated Completion Date</Label>
                      <Input id="estimated-completion" type="date" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="public-update" defaultChecked />
                      <Label htmlFor="public-update">Make update visible to reporter</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-[#d36530] hover:bg-[#d36530]/90">
                      <Send className="h-4 w-4 mr-2" />
                      Add Update
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#5e6461]">Issue Categories</CardTitle>
                    <CardDescription>Manage issue types and department assignments</CardDescription>
                  </div>
                  <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsCategoryOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {issueCategories.map((category) => (
                      <Card key={category.id} className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${category.color}20`, color: category.color }}
                              >
                                {getIconComponent(category.icon)}
                              </div>
                              <div>
                                <CardTitle className="text-lg text-[#5e6461]">{category.name}</CardTitle>
                                <CardDescription>{category.description}</CardDescription>
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
                                  Edit Category
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Issues
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Category
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-[#5e6461]">Department:</span>
                              <p className="text-[#5e6461]/70">{category.department}</p>
                            </div>
                            <div>
                              <span className="font-medium text-[#5e6461]">Default Priority:</span>
                              <Badge className={getPriorityColor(category.priority)}>{category.priority}</Badge>
                            </div>
                            <div>
                              <span className="font-medium text-[#5e6461]">Active Issues:</span>
                              <p className="text-[#5e6461]/70">{category.issueCount}</p>
                            </div>
                            <div>
                              <span className="font-medium text-[#5e6461]">Avg Resolution:</span>
                              <p className="text-[#5e6461]/70">{category.avgResolutionDays} days</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add Category Dialog */}
              <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Issue Category</DialogTitle>
                    <DialogDescription>Create a new category for organizing issue reports.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="category-name">Category Name</Label>
                      <Input id="category-name" placeholder="Enter category name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-description">Description</Label>
                      <Textarea id="category-description" placeholder="Enter category description..." rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-icon">Icon</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Car">Road & Infrastructure</SelectItem>
                            <SelectItem value="Lightbulb">Street Lighting</SelectItem>
                            <SelectItem value="TreePine">Parks & Recreation</SelectItem>
                            <SelectItem value="Building">Building & Code</SelectItem>
                            <SelectItem value="AlertTriangle">Public Safety</SelectItem>
                            <SelectItem value="Wrench">Utilities</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category-color">Color</Label>
                        <Input id="category-color" type="color" defaultValue="#d36530" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-department">Department</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public-works">Public Works</SelectItem>
                            <SelectItem value="utilities">Utilities</SelectItem>
                            <SelectItem value="parks-recreation">Parks & Recreation</SelectItem>
                            <SelectItem value="code-enforcement">Code Enforcement</SelectItem>
                            <SelectItem value="public-safety">Public Safety</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category-priority">Default Priority</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCategoryOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-[#d36530] hover:bg-[#d36530]/90">Add Category</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Issue Tracking Tab */}
            <TabsContent value="tracking" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-[#5e6461] flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Issue Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-[#5e6461]">23</div>
                      <div className="text-sm text-[#5e6461]/70">Pending Issues</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-[#5e6461]">45</div>
                      <div className="text-sm text-[#5e6461]/70">In Progress</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-[#5e6461]">156</div>
                      <div className="text-sm text-[#5e6461]/70">Completed This Month</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-[#5e6461] flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Response Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-[#5e6461]/70">Average Response:</span>
                        <span className="font-medium">2.3 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#5e6461]/70">Average Resolution:</span>
                        <span className="font-medium">8.7 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#5e6461]/70">Critical Issues:</span>
                        <span className="font-medium">4.2 hours</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <h4 className="font-medium text-[#5e6461] mb-2">By Department</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Public Works:</span>
                          <span>7.2 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Utilities:</span>
                          <span>3.1 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Parks & Rec:</span>
                          <span>12.5 days</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-[#5e6461] flex items-center gap-2">
                      <MapPinIcon className="h-5 w-5" />
                      Location Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-[#5e6461]">Issues by Ward</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Ward 1:</span>
                          <span>18 issues</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ward 2:</span>
                          <span>25 issues</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ward 3:</span>
                          <span>15 issues</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ward 4:</span>
                          <span>22 issues</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <h4 className="font-medium text-[#5e6461] mb-2">Hot Spots</h4>
                      <div className="space-y-1 text-sm text-[#5e6461]/70">
                        <div>• Main Street (8 issues)</div>
                        <div>• Oak Avenue (6 issues)</div>
                        <div>• Lincoln Park (4 issues)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Issue ID Generation Settings</CardTitle>
                  <CardDescription>Configure automatic issue ID generation and tracking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="id-prefix">ID Prefix</Label>
                      <Input id="id-prefix" defaultValue="ISS" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="id-format">ID Format</Label>
                      <Select defaultValue="year-sequential">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="year-sequential">YYYY-###</SelectItem>
                          <SelectItem value="sequential">######</SelectItem>
                          <SelectItem value="date-sequential">YYYYMMDD-##</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-assignment" defaultChecked />
                    <Label htmlFor="auto-assignment">Auto-assign to departments based on category</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="location-validation" defaultChecked />
                    <Label htmlFor="location-validation">Validate addresses against city database</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Updates & History Tab */}
            <TabsContent value="updates" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Recent Issue Updates</CardTitle>
                  <CardDescription>Latest updates and responses across all issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {issueUpdates.map((update) => (
                      <Card key={update.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{update.issueId}</Badge>
                                <Badge className={getStatusColor(update.status)}>{update.status}</Badge>
                                <Badge variant="secondary">{update.type}</Badge>
                                {update.isPublic && <Badge className="bg-green-100 text-green-800">Public</Badge>}
                              </div>
                              <p className="text-[#5e6461] mb-2">{update.message}</p>
                              <div className="flex items-center gap-4 text-sm text-[#5e6461]/70">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {update.author}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {update.department}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(update.timestamp).toLocaleString()}
                                </span>
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
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Issue
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Update
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Update
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}
