"use client"

import { useState, useEffect } from "react"
import { BreakingNewsAlert } from "@/lib/content-api"
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
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/Header"

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/", active: true },
  { icon: FileText, label: "Content", href: "/content" },
  { icon: Users, label: "Officials", href: "/officials" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
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
  const [activeBreakingNews, setActiveBreakingNews] = useState<BreakingNewsAlert | null>(null)
  const [isLoadingBreakingNews, setIsLoadingBreakingNews] = useState(true)

  // Fetch active breaking news on component mount
  useEffect(() => {
    const fetchActiveBreakingNews = async () => {
      try {
        setIsLoadingBreakingNews(true)
        const response = await fetch('/api/public/breaking-news/active')
        if (response.ok) {
          const alerts = await response.json()
          // Since we ensure only one active alert, take the first one
          setActiveBreakingNews(alerts.length > 0 ? alerts[0] : null)
        }
      } catch (error) {
        console.error('Error fetching active breaking news:', error)
      } finally {
        setIsLoadingBreakingNews(false)
      }
    }

    fetchActiveBreakingNews()
  }, [])

  return (
    <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header 
          title="Dashboard" 
          subtitle="Welcome back, Admin"
        />

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
                      <CardDescription>Current active announcement</CardDescription>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-[#d36530] hover:bg-[#d36530]/90"
                      onClick={() => window.location.href = '/content'}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Manage Alerts
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isLoadingBreakingNews ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#d36530]" />
                        <span className="ml-2 text-[#5e6461]/60">Loading...</span>
                      </div>
                    ) : activeBreakingNews ? (
                      <div className="space-y-3">
                        <div className={`flex items-center justify-between p-3 rounded-lg border ${
                          activeBreakingNews.priority === 'Critical' ? 'bg-red-50 border-red-200' :
                          activeBreakingNews.priority === 'High' ? 'bg-orange-50 border-orange-200' :
                          activeBreakingNews.priority === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-green-50 border-green-200'
                        }`}>
                          <div>
                            <p className="font-medium text-[#5e6461]">{activeBreakingNews.title}</p>
                            <p className="text-sm text-[#5e6461]/70">
                              {activeBreakingNews.expiration_date 
                                ? `Expires: ${new Date(activeBreakingNews.expiration_date).toLocaleDateString()}`
                                : 'No expiration set'
                              }
                            </p>
                          </div>
                          <Badge className={
                            activeBreakingNews.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                            activeBreakingNews.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                            activeBreakingNews.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {activeBreakingNews.priority}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-[#5e6461]/60">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No active breaking news alert</p>
                        <p className="text-sm">Create one to display on the website and mobile app</p>
                      </div>
                    )}
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
