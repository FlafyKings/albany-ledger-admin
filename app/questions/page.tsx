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
  User,
  HelpCircle,
  Building,
  Send,
  Star,
  Copy,
  FileQuestion,
  MessageCircle,
  Zap,
  DollarSign,
  Car,
  TreePine,
  Gavel,
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
  { icon: AlertTriangle, label: "Issue Reports", href: "/issues" },
  { icon: MessageSquare, label: "Q&A", href: "/questions", active: true },
  { icon: Mail, label: "Newsletter", href: "/newsletter" },
  { icon: MapPin, label: "Wards & Districts", href: "/wards" },
  { icon: Vote, label: "Elections", href: "/elections" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Shield, label: "User Management", href: "/users" },
  { icon: Settings, label: "System Config", href: "/settings" },
]

const questionCategories = [
  {
    id: 1,
    name: "City Services",
    description: "Questions about municipal services and utilities",
    icon: "Building",
    department: "Administration",
    color: "#d36530",
    questionCount: 45,
    avgResponseTime: "2.3 days",
  },
  {
    id: 2,
    name: "Taxes & Finance",
    description: "Property taxes, billing, and financial questions",
    icon: "DollarSign",
    department: "Finance",
    color: "#059669",
    questionCount: 67,
    avgResponseTime: "1.8 days",
  },
  {
    id: 3,
    name: "Transportation",
    description: "Roads, parking, and transportation issues",
    icon: "Car",
    department: "Public Works",
    color: "#7c3aed",
    questionCount: 23,
    avgResponseTime: "3.1 days",
  },
  {
    id: 4,
    name: "Parks & Recreation",
    description: "Parks, facilities, and recreational programs",
    icon: "TreePine",
    department: "Parks & Recreation",
    color: "#dc2626",
    questionCount: 34,
    avgResponseTime: "2.7 days",
  },
  {
    id: 5,
    name: "Legal & Permits",
    description: "Permits, licenses, and legal inquiries",
    icon: "Gavel",
    department: "Legal",
    color: "#f59e0b",
    questionCount: 28,
    avgResponseTime: "4.2 days",
  },
]

const submittedQuestions = [
  {
    id: "Q-2024-001",
    question: "What are the requirements for a building permit?",
    category: "Legal & Permits",
    categoryColor: "#f59e0b",
    status: "Answered",
    priority: "Medium",
    submitter: {
      name: "John Smith",
      email: "john.smith@email.com",
      anonymous: false,
    },
    department: "Legal",
    assignedTo: "Sarah Johnson",
    submittedDate: "2024-03-15T10:30:00",
    answeredDate: "2024-03-17T14:20:00",
    answer:
      "Building permits require completed application form, site plans, and fee payment. Processing time is typically 5-10 business days.",
    views: 156,
    helpful: 23,
    tags: ["permits", "building", "requirements"],
  },
  {
    id: "Q-2024-002",
    question: "When is the next city council meeting?",
    category: "City Services",
    categoryColor: "#d36530",
    status: "Pending",
    priority: "Low",
    submitter: {
      name: "Anonymous",
      email: "anonymous@system.local",
      anonymous: true,
    },
    department: "Administration",
    assignedTo: "Mike Chen",
    submittedDate: "2024-03-18T08:15:00",
    answeredDate: null,
    answer: null,
    views: 45,
    helpful: 0,
    tags: ["meetings", "council", "schedule"],
  },
  {
    id: "Q-2024-003",
    question: "How do I pay my property tax online?",
    category: "Taxes & Finance",
    categoryColor: "#059669",
    status: "Answered",
    priority: "High",
    submitter: {
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      anonymous: false,
    },
    department: "Finance",
    assignedTo: "Tom Wilson",
    submittedDate: "2024-03-12T16:45:00",
    answeredDate: "2024-03-13T09:30:00",
    answer:
      "You can pay property taxes online through our secure portal at albany.gov/payments. You'll need your account number and property ID.",
    views: 234,
    helpful: 45,
    tags: ["taxes", "payment", "online"],
  },
]

const faqEntries = [
  {
    id: 1,
    question: "How do I report a pothole?",
    answer:
      "You can report potholes through our online issue reporting system, by calling (518) 555-0123, or using our mobile app.",
    category: "Transportation",
    categoryColor: "#7c3aed",
    views: 1234,
    helpful: 89,
    lastUpdated: "2024-03-10",
    featured: true,
    searchTerms: ["pothole", "road", "damage", "report"],
  },
  {
    id: 2,
    question: "What are the city office hours?",
    answer:
      "City offices are open Monday-Friday 8:00 AM to 5:00 PM. Some departments have extended hours on certain days.",
    category: "City Services",
    categoryColor: "#d36530",
    views: 2345,
    helpful: 156,
    lastUpdated: "2024-03-08",
    featured: true,
    searchTerms: ["hours", "office", "open", "schedule"],
  },
  {
    id: 3,
    question: "How do I register to vote?",
    answer:
      "Voter registration can be completed online at the state website, at city hall, or at the DMV when renewing your license.",
    category: "Legal & Permits",
    categoryColor: "#f59e0b",
    views: 567,
    helpful: 34,
    lastUpdated: "2024-03-05",
    featured: false,
    searchTerms: ["vote", "register", "election", "voting"],
  },
]

const responseTemplates = [
  {
    id: 1,
    name: "Standard Acknowledgment",
    category: "General",
    subject: "Thank you for your question",
    content:
      "Dear {name},\n\nThank you for contacting the City of Albany. We have received your question regarding {topic} and will respond within {response_time}.\n\nBest regards,\n{department}",
    variables: ["name", "topic", "response_time", "department"],
    usage: 45,
  },
  {
    id: 2,
    name: "Permit Information",
    category: "Legal & Permits",
    subject: "Permit Information Request",
    content:
      "Dear {name},\n\nRegarding your inquiry about {permit_type} permits:\n\n{permit_details}\n\nRequired documents:\n- {required_docs}\n\nProcessing time: {processing_time}\nFee: {fee}\n\nFor questions, contact us at {contact_info}.\n\nSincerely,\n{staff_name}",
    variables: [
      "name",
      "permit_type",
      "permit_details",
      "required_docs",
      "processing_time",
      "fee",
      "contact_info",
      "staff_name",
    ],
    usage: 23,
  },
  {
    id: 3,
    name: "Service Request Follow-up",
    category: "City Services",
    subject: "Service Request Update",
    content:
      "Dear {name},\n\nThis is an update on your service request #{request_id}.\n\nStatus: {status}\nExpected completion: {completion_date}\n\n{additional_info}\n\nThank you for your patience.\n\n{department}",
    variables: ["name", "request_id", "status", "completion_date", "additional_info", "department"],
    usage: 67,
  },
]

export default function QuestionsManagement() {
  const [activeTab, setActiveTab] = useState("questions")
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isAnswerOpen, setIsAnswerOpen] = useState(false)
  const [isFaqOpen, setIsFaqOpen] = useState(false)
  const [isTemplateOpen, setIsTemplateOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Answered":
        return "bg-green-100 text-green-800"
      case "In Review":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
      Building,
      DollarSign,
      Car,
      TreePine,
      Gavel,
      HelpCircle,
    }
    const IconComponent = icons[iconName] || HelpCircle
    return <IconComponent className="h-5 w-5" />
  }

  const filteredQuestions = submittedQuestions.filter((question) => {
    if (statusFilter !== "all" && question.status !== statusFilter) return false
    if (categoryFilter !== "all" && question.category !== categoryFilter) return false
    return true
  })

  return (
    <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#5e6461]">Questions & Answers</h2>
              <p className="text-[#5e6461]/70">Manage citizen questions, FAQs, and response templates</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5e6461]/50" />
                <Input
                  placeholder="Search questions..."
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
              <TabsTrigger
                value="questions"
                className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white"
              >
                Submitted Questions
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger value="faq" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                FAQ Management
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white"
              >
                Response Templates
              </TabsTrigger>
            </TabsList>

            {/* Submitted Questions Tab */}
            <TabsContent value="questions" className="space-y-6">
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
                            <SelectItem value="Answered">Answered</SelectItem>
                            <SelectItem value="In Review">In Review</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="category-filter">Category:</Label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {questionCategories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
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

              {/* Questions Table */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Submitted Questions</CardTitle>
                  <CardDescription>{filteredQuestions.length} questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question ID</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Submitter</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuestions.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell className="font-medium">{question.id}</TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <div className="font-medium text-[#5e6461] truncate">{question.question}</div>
                              <div className="flex items-center gap-1 mt-1">
                                <Eye className="h-3 w-3 text-[#5e6461]/50" />
                                <span className="text-xs text-[#5e6461]/50">{question.views} views</span>
                                {question.helpful > 0 && (
                                  <>
                                    <Star className="h-3 w-3 text-yellow-500 ml-2" />
                                    <span className="text-xs text-[#5e6461]/50">{question.helpful} helpful</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge style={{ backgroundColor: question.categoryColor, color: "white" }}>
                              {question.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(question.status)}>{question.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(question.priority)}>{question.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-[#5e6461]">
                                {question.submitter.anonymous ? "Anonymous" : question.submitter.name}
                              </div>
                              {!question.submitter.anonymous && (
                                <div className="text-sm text-[#5e6461]/70">{question.submitter.email}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-[#5e6461]">{question.assignedTo}</div>
                              <div className="text-sm text-[#5e6461]/70">{question.department}</div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(question.submittedDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedQuestion(question)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsAnswerOpen(true)}>
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  {question.status === "Answered" ? "Edit Answer" : "Add Answer"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <User className="h-4 w-4 mr-2" />
                                  Reassign
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileQuestion className="h-4 w-4 mr-2" />
                                  Convert to FAQ
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Question
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

              {/* Question Details Dialog */}
              {selectedQuestion && (
                <Dialog open={!!selectedQuestion} onOpenChange={() => setSelectedQuestion(null)}>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {selectedQuestion.id}: Question Details
                        <Badge className={getStatusColor(selectedQuestion.status)}>{selectedQuestion.status}</Badge>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <h4 className="font-medium text-[#5e6461] mb-2">Question</h4>
                        <p className="text-[#5e6461] bg-gray-50 p-3 rounded-lg">{selectedQuestion.question}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-[#5e6461] mb-2">Question Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Category:</span>
                              <Badge style={{ backgroundColor: selectedQuestion.categoryColor, color: "white" }}>
                                {selectedQuestion.category}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Priority:</span>
                              <Badge className={getPriorityColor(selectedQuestion.priority)}>
                                {selectedQuestion.priority}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Department:</span>
                              <span>{selectedQuestion.department}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Assigned To:</span>
                              <span>{selectedQuestion.assignedTo}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-[#5e6461] mb-2">Submitter Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Name:</span>
                              <span>
                                {selectedQuestion.submitter.anonymous ? "Anonymous" : selectedQuestion.submitter.name}
                              </span>
                            </div>
                            {!selectedQuestion.submitter.anonymous && (
                              <div className="flex justify-between">
                                <span className="text-[#5e6461]/70">Email:</span>
                                <span>{selectedQuestion.submitter.email}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Submitted:</span>
                              <span>{new Date(selectedQuestion.submittedDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedQuestion.answer && (
                        <div>
                          <h4 className="font-medium text-[#5e6461] mb-2">Answer</h4>
                          <p className="text-[#5e6461] bg-green-50 p-3 rounded-lg border border-green-200">
                            {selectedQuestion.answer}
                          </p>
                          <div className="text-sm text-[#5e6461]/70 mt-2">
                            Answered on {new Date(selectedQuestion.answeredDate).toLocaleDateString()}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium text-[#5e6461] mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedQuestion.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSelectedQuestion(null)}>
                        Close
                      </Button>
                      <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsAnswerOpen(true)}>
                        {selectedQuestion.status === "Answered" ? "Edit Answer" : "Add Answer"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Answer Dialog */}
              <Dialog open={isAnswerOpen} onOpenChange={setIsAnswerOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Answer</DialogTitle>
                    <DialogDescription>Provide an answer to the submitted question.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="answer-template">Use Template</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {responseTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id.toString()}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="answer-content">Answer</Label>
                      <Textarea
                        id="answer-content"
                        placeholder="Enter your answer..."
                        rows={6}
                        className="resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="answer-tags">Tags</Label>
                      <Input id="answer-tags" placeholder="Enter tags separated by commas" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="publish-faq" />
                      <Label htmlFor="publish-faq">Add to FAQ after answering</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="notify-submitter" defaultChecked />
                      <Label htmlFor="notify-submitter">Notify submitter via email</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAnswerOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-[#d36530] hover:bg-[#d36530]/90">
                      <Send className="h-4 w-4 mr-2" />
                      Send Answer
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
                    <CardTitle className="text-[#5e6461]">Question Categories</CardTitle>
                    <CardDescription>Organize questions by category and assign to departments</CardDescription>
                  </div>
                  <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsCategoryOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {questionCategories.map((category) => (
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
                                  View Questions
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
                              <span className="font-medium text-[#5e6461]">Questions:</span>
                              <p className="text-[#5e6461]/70">{category.questionCount}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium text-[#5e6461]">Avg Response Time:</span>
                              <p className="text-[#5e6461]/70">{category.avgResponseTime}</p>
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
                    <DialogTitle>Add Question Category</DialogTitle>
                    <DialogDescription>Create a new category for organizing questions.</DialogDescription>
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
                            <SelectItem value="Building">City Services</SelectItem>
                            <SelectItem value="DollarSign">Finance</SelectItem>
                            <SelectItem value="Car">Transportation</SelectItem>
                            <SelectItem value="TreePine">Parks & Recreation</SelectItem>
                            <SelectItem value="Gavel">Legal</SelectItem>
                            <SelectItem value="HelpCircle">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category-color">Color</Label>
                        <Input id="category-color" type="color" defaultValue="#d36530" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-department">Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="administration">Administration</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                          <SelectItem value="public-works">Public Works</SelectItem>
                          <SelectItem value="parks-recreation">Parks & Recreation</SelectItem>
                        </SelectContent>
                      </Select>
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

            {/* FAQ Management Tab */}
            <TabsContent value="faq" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#5e6461]">FAQ Management</CardTitle>
                    <CardDescription>Manage frequently asked questions and answers</CardDescription>
                  </div>
                  <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsFaqOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add FAQ
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faqEntries.map((faq) => (
                      <Card key={faq.id} className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-lg text-[#5e6461]">{faq.question}</CardTitle>
                                {faq.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                              </div>
                              <Badge style={{ backgroundColor: faq.categoryColor, color: "white" }}>
                                {faq.category}
                              </Badge>
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
                                  Edit FAQ
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Star className="h-4 w-4 mr-2" />
                                  {faq.featured ? "Remove from Featured" : "Add to Featured"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete FAQ
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[#5e6461] mb-4">{faq.answer}</p>
                          <div className="flex items-center justify-between text-sm text-[#5e6461]/70">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {faq.views} views
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {faq.helpful} helpful
                              </span>
                            </div>
                            <span>Updated {new Date(faq.lastUpdated).toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {faq.searchTerms.slice(0, 4).map((term) => (
                              <Badge key={term} variant="secondary" className="text-xs">
                                {term}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add FAQ Dialog */}
              <Dialog open={isFaqOpen} onOpenChange={setIsFaqOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add FAQ Entry</DialogTitle>
                    <DialogDescription>Create a new frequently asked question and answer.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="faq-question">Question</Label>
                      <Input id="faq-question" placeholder="Enter the question" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="faq-answer">Answer</Label>
                      <Textarea id="faq-answer" placeholder="Enter the answer..." rows={4} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="faq-category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {questionCategories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="faq-priority">Priority</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="faq-search-terms">Search Terms</Label>
                      <Input id="faq-search-terms" placeholder="Enter search terms separated by commas" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="faq-featured" />
                      <Label htmlFor="faq-featured">Feature this FAQ</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsFaqOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-[#d36530] hover:bg-[#d36530]/90">Add FAQ</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Response Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#5e6461]">Response Templates</CardTitle>
                    <CardDescription>Create and manage response templates with variable substitution</CardDescription>
                  </div>
                  <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsTemplateOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Template
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {responseTemplates.map((template) => (
                      <Card key={template.id} className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-lg text-[#5e6461]">{template.name}</CardTitle>
                                <Badge variant="outline">{template.category}</Badge>
                              </div>
                              <p className="text-sm text-[#5e6461]/70 font-medium">Subject: {template.subject}</p>
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
                                  Edit Template
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate Template
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview Template
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Template
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-gray-50 p-3 rounded-lg mb-4">
                            <p className="text-sm text-[#5e6461] whitespace-pre-line">{template.content}</p>
                          </div>
                          <div className="flex items-center justify-between text-sm text-[#5e6461]/70">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                {template.usage} uses
                              </span>
                              <span>Variables: {template.variables.length}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {template.variables.slice(0, 3).map((variable) => (
                                <Badge key={variable} variant="secondary" className="text-xs">
                                  {`{${variable}}`}
                                </Badge>
                              ))}
                              {template.variables.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{template.variables.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add Template Dialog */}
              <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Add Response Template</DialogTitle>
                    <DialogDescription>
                      Create a new response template with variable substitution for common responses.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input id="template-name" placeholder="Enter template name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template-category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="legal-permits">Legal & Permits</SelectItem>
                            <SelectItem value="city-services">City Services</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="transportation">Transportation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template-subject">Email Subject</Label>
                      <Input id="template-subject" placeholder="Enter email subject line" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template-content">Template Content</Label>
                      <Textarea
                        id="template-content"
                        placeholder="Enter template content with variables like {name}, {topic}, etc."
                        rows={8}
                        className="resize-none font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template-variables">Available Variables</Label>
                      <Input
                        id="template-variables"
                        placeholder="Enter variable names separated by commas (e.g., name, topic, department)"
                      />
                      <p className="text-xs text-[#5e6461]/70">
                        Variables will be available as {`{variable_name}`} in the template
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsTemplateOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-[#d36530] hover:bg-[#d36530]/90">Add Template</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}
