"use client"

import { useState } from "react"
import {
  Bell,
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
  ChevronDown,
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/", active: true },
  { icon: FileText, label: "Content", href: "/content" },
  { icon: Users, label: "Officials", href: "/officials" },
  { icon: Calendar, label: "Meetings", href: "/meetings" },
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

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("Dashboard")

  return (
    <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#5e6461]">Dashboard</h2>
              <p className="text-[#5e6461]/70">Welcome back, Admin</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5e6461]/50" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 border-gray-300 focus:border-[#d36530] focus:ring-[#d36530]"
                />
              </div>

              <Button variant="outline" size="icon" className="relative bg-transparent">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-[#d36530] text-white text-xs">
                  3
                </Badge>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <div className="w-8 h-8 bg-[#d36530] rounded-full flex items-center justify-center text-white text-sm font-medium">
                      A
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem>System Logs</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#5e6461]">Active Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-[#d36530]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#5e6461]">23</div>
                <p className="text-xs text-[#5e6461]/70">
                  <span className="text-red-600">+2</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#5e6461]">Upcoming Meetings</CardTitle>
                <Calendar className="h-4 w-4 text-[#d36530]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#5e6461]">8</div>
                <p className="text-xs text-[#5e6461]/70">Next: City Council (Today 7PM)</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#5e6461]">Pending Questions</CardTitle>
                <MessageSquare className="h-4 w-4 text-[#d36530]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#5e6461]">12</div>
                <p className="text-xs text-[#5e6461]/70">Avg response: 2.3 days</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#5e6461]">Newsletter Subscribers</CardTitle>
                <Mail className="h-4 w-4 text-[#d36530]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#5e6461]">1,247</div>
                <p className="text-xs text-[#5e6461]/70">
                  <span className="text-green-600">+15</span> this week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                Content Management
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                Recent Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Breaking News Management */}
                <Card className="border-gray-200">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-[#5e6461]">Breaking News</CardTitle>
                      <CardDescription>Manage urgent announcements</CardDescription>
                    </div>
                    <Button size="sm" className="bg-[#d36530] hover:bg-[#d36530]/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add News
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <p className="font-medium text-[#5e6461]">Water Main Break - Downtown</p>
                          <p className="text-sm text-[#5e6461]/70">Expires: Today 6PM</p>
                        </div>
                        <Badge variant="destructive">Urgent</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div>
                          <p className="font-medium text-[#5e6461]">Road Closure - Main St</p>
                          <p className="text-sm text-[#5e6461]/70">Expires: Tomorrow 8AM</p>
                        </div>
                        <Badge variant="secondary">Important</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-[#5e6461]">Recent Activity</CardTitle>
                    <CardDescription>Latest system activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#5e6461]">New issue report submitted</p>
                          <p className="text-xs text-[#5e6461]/70">Ward 3 - Pothole on Oak Street</p>
                        </div>
                        <span className="text-xs text-[#5e6461]/70">2m ago</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#5e6461]">Meeting agenda updated</p>
                          <p className="text-xs text-[#5e6461]/70">City Council - March 15</p>
                        </div>
                        <span className="text-xs text-[#5e6461]/70">15m ago</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#d36530] rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#5e6461]">Document uploaded</p>
                          <p className="text-xs text-[#5e6461]/70">Budget Report 2024.pdf</p>
                        </div>
                        <span className="text-xs text-[#5e6461]/70">1h ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2 border-gray-300 hover:border-[#d36530] hover:text-[#d36530] bg-transparent"
                    >
                      <Plus className="h-5 w-5" />
                      <span className="text-sm">Add Official</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2 border-gray-300 hover:border-[#d36530] hover:text-[#d36530] bg-transparent"
                    >
                      <Calendar className="h-5 w-5" />
                      <span className="text-sm">Schedule Meeting</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2 border-gray-300 hover:border-[#d36530] hover:text-[#d36530] bg-transparent"
                    >
                      <FileText className="h-5 w-5" />
                      <span className="text-sm">Upload Document</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2 border-gray-300 hover:border-[#d36530] hover:text-[#d36530] bg-transparent"
                    >
                      <Mail className="h-5 w-5" />
                      <span className="text-sm">Send Newsletter</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              {/* Featured Stories Management */}
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#5e6461]">Featured Stories</CardTitle>
                    <CardDescription>Manage homepage featured content</CardDescription>
                  </div>
                  <Button className="bg-[#d36530] hover:bg-[#d36530]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Story
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Featured Until</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">New Community Center Opens</TableCell>
                        <TableCell>Sarah Johnson</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Community</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </TableCell>
                        <TableCell>March 20, 2024</TableCell>
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
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Budget Meeting Results</TableCell>
                        <TableCell>Mike Chen</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Business</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </TableCell>
                        <TableCell>March 18, 2024</TableCell>
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
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              {/* Issue Reports */}
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#5e6461]">Recent Issue Reports</CardTitle>
                    <CardDescription>Latest citizen-reported issues</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Issue ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">#2024-001</TableCell>
                        <TableCell>Pothole</TableCell>
                        <TableCell>Oak Street & 3rd Ave</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">High</Badge>
                        </TableCell>
                        <TableCell>2 hours ago</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">#2024-002</TableCell>
                        <TableCell>Streetlight</TableCell>
                        <TableCell>Main Street</TableCell>
                        <TableCell>
                          <Badge className="bg-red-100 text-red-800">Pending</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Medium</Badge>
                        </TableCell>
                        <TableCell>4 hours ago</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">#2024-003</TableCell>
                        <TableCell>Graffiti</TableCell>
                        <TableCell>City Hall</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Low</Badge>
                        </TableCell>
                        <TableCell>1 day ago</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}
