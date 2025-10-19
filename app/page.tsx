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

// Import API clients
import { issuesApi, type Issue } from "@/lib/issues-api"
import { questionsApi, type Question } from "@/lib/questions-api"
import { calendarApi, type CalendarEventAPI } from "@/lib/calendar-api"
import { statsApi, type NewsletterStats } from "@/lib/newsletter-api"

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

// Dashboard data types
interface DashboardData {
  pendingIssues: number
  upcomingMeetings: number
  pendingQuestions: number
  newsletterSubscribers: number
  recentIssues: Issue[]
  recentQuestions: Question[]
  upcomingEvents: CalendarEventAPI[]
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("Dashboard")
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    pendingIssues: 0,
    upcomingMeetings: 0,
    pendingQuestions: 0,
    newsletterSubscribers: 0,
    recentIssues: [],
    recentQuestions: [],
    upcomingEvents: []
  })
  const [isLoading, setIsLoading] = useState(true)

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch all data in parallel
        const [
          issuesResponse,
          questionsResponse,
          calendarResponse,
          newsletterResponse
        ] = await Promise.all([
          issuesApi.getStatistics(),
          questionsApi.listQuestions({ limit: 10 }),
          calendarApi.getEvents({ limit: 10 }),
          statsApi.get()
        ])

        // Process issues data
        const issuesStats = issuesResponse.success ? issuesResponse.data : null
        const pendingIssues = issuesStats?.issues_by_status?.find(s => s.status === 'submitted')?.count || 0
        const recentIssues = issuesStats?.recent_issues || []

        // Process questions data
        const questions = questionsResponse.success ? 
          questionsResponse.data?.questions || [] : []
        const pendingQuestions = questions.filter(q => q.status === 'pending').length
        const recentQuestions = questions.slice(0, 5)

        // Process calendar data
        const upcomingEvents = calendarResponse.success ? 
          calendarResponse.data?.events || [] : []
        const upcomingMeetings = upcomingEvents.length

        // Process newsletter data
        const newsletterSubscribers = newsletterResponse.success ? 
          newsletterResponse.data?.total_subscribers || 0 : 0

        setDashboardData({
          pendingIssues,
          upcomingMeetings,
          pendingQuestions,
          newsletterSubscribers,
          recentIssues,
          recentQuestions,
          upcomingEvents
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
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
                <CardTitle className="text-sm font-medium text-[#5e6461]">Pending Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-[#d36530]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#5e6461]">
                  {isLoading ? "..." : dashboardData.pendingIssues}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#5e6461]">Upcoming Meetings</CardTitle>
                <Calendar className="h-4 w-4 text-[#d36530]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#5e6461]">
                  {isLoading ? "..." : dashboardData.upcomingMeetings}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#5e6461]">Pending Questions</CardTitle>
                <MessageSquare className="h-4 w-4 text-[#d36530]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#5e6461]">
                  {isLoading ? "..." : dashboardData.pendingQuestions}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#5e6461]">Newsletter Subscribers</CardTitle>
                <Mail className="h-4 w-4 text-[#d36530]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#5e6461]">
                  {isLoading ? "..." : dashboardData.newsletterSubscribers.toLocaleString()}
                </div>
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
              {/* Quick Actions */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/officials/new">
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col gap-2 border-gray-300 hover:border-[#d36530] hover:text-[#d36530] bg-transparent w-full"
                      >
                        <Plus className="h-5 w-5" />
                        <span className="text-sm">Add Official</span>
                      </Button>
                    </Link>
                    <Link href="/calendar">
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col gap-2 border-gray-300 hover:border-[#d36530] hover:text-[#d36530] bg-transparent w-full"
                      >
                        <Calendar className="h-5 w-5" />
                        <span className="text-sm">Schedule Meeting</span>
                      </Button>
                    </Link>
                    <Link href="/documents">
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col gap-2 border-gray-300 hover:border-[#d36530] hover:text-[#d36530] bg-transparent w-full"
                      >
                        <FileText className="h-5 w-5" />
                        <span className="text-sm">Upload Document</span>
                      </Button>
                    </Link>
                    <Link href="/newsletter/create">
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col gap-2 border-gray-300 hover:border-[#d36530] hover:text-[#d36530] bg-transparent w-full"
                      >
                        <Mail className="h-5 w-5" />
                        <span className="text-sm">Send Newsletter</span>
                      </Button>
                    </Link>
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
                  <Link href="/content/articles/new">
                    <Button className="bg-[#d36530] hover:bg-[#d36530]/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Story
                    </Button>
                  </Link>
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
                          <Link href="/content/articles/1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
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
                          <Link href="/content/articles/2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
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
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Recent Issue Reports</CardTitle>
                  <CardDescription>Latest citizen-reported issues</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 text-[#5e6461]/70">Loading recent issues...</div>
                  ) : dashboardData.recentIssues.length === 0 ? (
                    <div className="text-center py-8 text-[#5e6461]/70">No recent issues found</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Issue ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ward</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dashboardData.recentIssues.slice(0, 5).map((issue) => (
                          <TableRow key={issue.id}>
                            <TableCell className="font-medium">#{issue.short_id}</TableCell>
                            <TableCell>{issue.category_name || 'General'}</TableCell>
                            <TableCell>{issue.location_address || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  issue.status === 'submitted' 
                                    ? "bg-red-100 text-red-800"
                                    : issue.status === 'in_progress'
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }
                              >
                                {issue.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {issue.ward || 'N/A'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(issue.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/issues/${issue.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}
