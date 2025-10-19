"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Send,
  MessageSquare,
  Building,
  RefreshCw,
  Download,
  Clock,
} from "lucide-react"

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
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Header } from "@/components/Header"

// Import our API client
import { 
  issuesApi, 
  issuesUtils,
  type Issue,
  type IssueCategory,
  type IssueUpdate,
  type IssuePhoto,
  type SearchFilters
} from "@/lib/issues-api"

export default function IssueReportsManagement() {
  const router = useRouter()
  
  // State management
  const [activeTab, setActiveTab] = useState("reports")
  const [allIssues, setAllIssues] = useState<Issue[]>([]) // Store all issues
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]) // Filtered issues for display
  const [categories, setCategories] = useState<IssueCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Dialog states
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  
  // Form states
  const [newCategory, setNewCategory] = useState({ name: "", description: "", icon: "❓" })
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    category_id: "",
    location: "",
    photos: [] as File[]
  })
  const [newStatus, setNewStatus] = useState("")
  const [statusDescription, setStatusDescription] = useState("")
  const [messageTitle, setMessageTitle] = useState("")
  const [messageDescription, setMessageDescription] = useState("")
  const [newUpdate, setNewUpdate] = useState<{
    update_type: 'status_change' | 'message' | 'resolution' | 'system'
    title: string
    description: string
    is_public: boolean
    new_status: string
  }>({
    update_type: "message",
    title: "",
    description: "",
    is_public: true,
    new_status: ""
  })
  const [deletingItem, setDeletingItem] = useState<{ type: 'issue' | 'category'; item: any } | null>(null)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  const { toast } = useToast()

  // Load data once on mount
  useEffect(() => {
    loadData()
  }, [])

  // Filter issues when data or filters change (immediate for status/category, debounced for search)
  useEffect(() => {
    filterIssues()
  }, [allIssues, statusFilter, categoryFilter])

  // Debounced search effect for better performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterIssues()
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Filter issues based on search query and filters
  const filterIssues = () => {
    let filtered = [...allIssues]

    // Filter by search query (title only)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(query)
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(issue => issue.status === statusFilter)
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(issue => issue.category_id === parseInt(categoryFilter))
    }

    setFilteredIssues(filtered)
  }

  // Load all data
  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load all issues without filters for client-side filtering
      const issuesResult = await issuesApi.listIssues({
        sort_by: "created_at",
        sort_order: "desc",
        limit: 1000 // Load more issues for client-side filtering
      })

      // Load categories
      const categoriesResult = await issuesApi.listCategories()

      if (issuesResult.success && issuesResult.data) {
        setAllIssues(issuesResult.data.issues)
      } else {
        // Only show error toast if it's not a 404 (endpoints not implemented yet)
        if (!issuesResult.error?.includes('404')) {
          toast({
            title: "Error loading issues",
            description: issuesResult.error || "Failed to load issues",
            variant: "destructive"
          })
        }
        // Set empty array for 404s (graceful fallback)
        setAllIssues([])
      }

      if (categoriesResult.success && categoriesResult.data) {
        setCategories(categoriesResult.data.categories)
      } else {
        // Only show error toast if it's not a 404 (endpoints not implemented yet)
        if (!categoriesResult.error?.includes('404')) {
          toast({
            title: "Error loading categories",
            description: categoriesResult.error || "Failed to load categories",
            variant: "destructive"
          })
        }
        // Set empty array for 404s (graceful fallback)
        setCategories([])
      }

    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Failed to load dashboard data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Issue operations
  const handleUpdateIssueStatus = async (issueId: number, newStatus: string, description: string = "") => {
    setIsUpdating(true)
    try {
      const result = await issuesApi.updateIssueStatus(issueId, { status: newStatus, description })
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Issue status updated successfully"
        })
        loadData()
        // Only close dialog and reset form on success
        setIsStatusDialogOpen(false)
        setNewStatus("")
        setStatusDescription("")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update issue status",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update issue status",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCreateUpdate = async () => {
    if (!selectedIssue || !newUpdate.description.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide an update description",
        variant: "destructive"
      })
      return
    }

    setIsUpdating(true)
    try {
      const result = await issuesApi.shortId.createIssueUpdate(selectedIssue.short_id, newUpdate)
      if (result.success) {
        toast({
          title: "Success",
          description: "Update added successfully"
        })
        
        loadData()
        setIsUpdateOpen(false)
        resetUpdateForm()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add update",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add update",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCreateMessage = async () => {
    if (!selectedIssue || !messageTitle.trim() || !messageDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both title and message",
        variant: "destructive"
      })
      return
    }

    setIsUpdating(true)
    try {
      const result = await issuesApi.shortId.createIssueUpdate(selectedIssue.short_id, {
        update_type: 'message',
        title: messageTitle,
        description: messageDescription
      })
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Message added successfully"
        })
        loadData()
        // Only close dialog and reset form on success
        setIsMessageDialogOpen(false)
        setMessageTitle("")
        setMessageDescription("")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add message",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add message",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Category operations
  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a category name",
        variant: "destructive"
      })
      return
    }

    try {
      const result = await issuesApi.createCategory(newCategory)
      if (result.success) {
        toast({
          title: "Success",
          description: "Category created successfully"
        })
        loadData()
        setIsCategoryOpen(false)
        setNewCategory({ name: "", description: "", icon: "❓" })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create category",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive"
      })
    }
  }

  const handleDeleteItem = async () => {
    if (!deletingItem) return

    try {
      let result
      
      if (deletingItem.type === 'issue') {
        result = await issuesApi.deleteIssue(deletingItem.item.id)
      } else if (deletingItem.type === 'category') {
        result = await issuesApi.deleteCategory(deletingItem.item.id)
      }

      if (result?.success) {
        toast({
          title: "Success",
          description: `${deletingItem.type} deleted successfully`
        })
        loadData()
        
        if (deletingItem.type === 'issue' && selectedIssue?.id === deletingItem.item.id) {
          setIsDetailOpen(false)
          setSelectedIssue(null)
        }
      } else {
        toast({
          title: "Error",
          description: result?.error || `Failed to delete ${deletingItem.type}`,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${deletingItem.type}`,
        variant: "destructive"
      })
    } finally {
      setIsDeleteOpen(false)
      setDeletingItem(null)
    }
  }

  // Helper functions
  const openIssueDetail = (issue: Issue) => {
    // Navigate immediately to avoid waiting using short_id (works with track endpoint)
    router.push(`/issues/${issue.short_id}`)
  }

  const openStatusDialog = (issue: Issue, presetStatus?: string) => {
    setSelectedIssue(issue)
    if (presetStatus) {
      setNewStatus(presetStatus)
    }
    setIsStatusDialogOpen(true)
  }

  const openMessageDialog = (issue: Issue) => {
    setSelectedIssue(issue)
    setIsMessageDialogOpen(true)
  }

  // Issue creation
  const handleCreateIssue = async () => {
    if (!newIssue.title.trim() || !newIssue.description.trim() || !newIssue.category_id) {
      toast({
        title: "Validation Error",
        description: "Title, description, and category are required",
        variant: "destructive"
      })
      return
    }


    try {
      setIsUpdating(true)
      const issueData = {
        title: newIssue.title,
        description: newIssue.description,
        category_id: parseInt(newIssue.category_id),
        location: newIssue.location || undefined,
        reporter_name: "Admin User",
        reporter_email: "admin@albanyledger.com",
        ...(newIssue.photos.length > 0 && { photos: newIssue.photos })
      }


      const result = await issuesApi.createIssue(issueData)


      if (result.success) {
        toast({
          title: "Success",
          description: "Issue created successfully"
        })
        setIsCreateIssueOpen(false)
        setNewIssue({
          title: "",
          description: "",
          category_id: "",
          location: "",
          photos: []
        })
        loadData()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create issue",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create issue",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const openDeleteDialog = (type: 'issue' | 'category', item: any) => {
    setDeletingItem({ type, item })
    setIsDeleteOpen(true)
  }

  const resetUpdateForm = () => {
    setNewUpdate({
      update_type: "message",
      title: "",
      description: "",
      is_public: true,
      new_status: ""
    })
  }


  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <Header 
        title="Issue Reports Management" 
        subtitle="Manage citizen-reported issues and track resolutions"
      />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search Bar */}
          <div className="flex items-center mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5e6461]/50" />
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 border-gray-300 focus:border-[#d36530] focus:ring-[#d36530]"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="reports" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
              <AlertCircle className="h-4 w-4 mr-2" />
                Issue Reports
              </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
              <Building className="h-4 w-4 mr-2" />
                Categories
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
                        <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
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
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.icon} {category.name}
                            </SelectItem>
                          ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsCreateIssueOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Issue
                    </Button>
                  </div>
                </CardContent>
              </Card>

            {/* Issues Table */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Issue Reports</CardTitle>
                  <CardDescription>{filteredIssues.length} issues {statusFilter !== "all" || categoryFilter !== "all" || searchQuery ? "(filtered)" : ""}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Issue ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reporter</TableHead>
                      <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-48" />
                              <Skeleton className="h-3 w-32" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-20 rounded-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-24 rounded-full" />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-8 w-8 rounded ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredIssues.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-[#5e6461]/70">
                          No issues found. Issues will appear here as they are reported.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredIssues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell className="font-mono text-sm">{issue.short_id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-[#5e6461]">{issue.title}</div>
                              {issue.location_address && (
                                <div className="text-sm text-[#5e6461]/70 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {issue.location_address}
                              </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                              <span>{issue.category_icon}</span>
                              {issue.category_name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={issuesUtils.getStatusColor(issue.status)}>
                              {issuesUtils.getStatusLabel(issue.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-[#5e6461]">{issue.reporter_name}</div>
                              <div className="text-sm text-[#5e6461]/70">{issue.reporter_email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{issuesUtils.formatDate(issue.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openIssueDetail(issue)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openStatusDialog(issue)}>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Change Status
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openMessageDialog(issue)}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Add Message
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => openStatusDialog(issue, "resolved")}
                                  disabled={issue.status === "resolved"}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Resolved
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openStatusDialog(issue, "closed")}
                                  disabled={issue.status === "closed"}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Close Issue
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => openDeleteDialog('issue', issue)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Issue
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[#5e6461]">Issue Categories</CardTitle>
                  <CardDescription>Manage issue types and categories</CardDescription>
                </div>
                <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsCategoryOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Card key={index} className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-8 w-8 rounded" />
                              <div>
                                <Skeleton className="h-5 w-32 mb-1" />
                                <Skeleton className="h-4 w-48" />
                              </div>
                            </div>
                            <Skeleton className="h-8 w-8 rounded" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-4 w-24" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-8 text-[#5e6461]/70">
                    No categories found. Create your first category to get started.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <Card key={category.id} className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{category.icon}</div>
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
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setCategoryFilter(category.id.toString())
                                    setActiveTab('reports')
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Issues
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => openDeleteDialog('category', category)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Category
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-[#5e6461]/70">
                            Created: {issuesUtils.formatDate(category.created_at)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        {/* Issue Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                {selectedIssue?.short_id}: {selectedIssue?.title}
                {selectedIssue && (
                  <Badge className={issuesUtils.getStatusColor(selectedIssue.status)}>
                    {issuesUtils.getStatusLabel(selectedIssue.status)}
                  </Badge>
                )}
                      </DialogTitle>
                      <DialogDescription>Issue details and management</DialogDescription>
                    </DialogHeader>
            
            {selectedIssue && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-[#5e6461] mb-2">Issue Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Category:</span>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {selectedIssue.category_icon} {selectedIssue.category_name}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                        <span className="text-[#5e6461]/70">Status:</span>
                        <Badge className={issuesUtils.getStatusColor(selectedIssue.status)}>
                          {issuesUtils.getStatusLabel(selectedIssue.status)}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                        <span className="text-[#5e6461]/70">Views:</span>
                        <span>{selectedIssue.view_count}</span>
                            </div>
                            <div className="flex justify-between">
                        <span className="text-[#5e6461]/70">Created:</span>
                        <span>{issuesUtils.formatDateTime(selectedIssue.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-[#5e6461] mb-2">Reporter Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Name:</span>
                        <span>{selectedIssue.reporter_name}</span>
                            </div>
                                <div className="flex justify-between">
                                  <span className="text-[#5e6461]/70">Email:</span>
                        <span>{selectedIssue.reporter_email}</span>
                                </div>
                          </div>
                        </div>

                  {selectedIssue.location_address && (
                        <div>
                          <h4 className="font-medium text-[#5e6461] mb-2">Location</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Address:</span>
                          <span>{selectedIssue.location_address}</span>
                            </div>
                        {selectedIssue.ward && (
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Ward:</span>
                            <span>{selectedIssue.ward}</span>
                            </div>
                        )}
                            </div>
                          </div>
                  )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-[#5e6461] mb-2">Description</h4>
                          <p className="text-sm text-[#5e6461]/70 bg-gray-50 p-3 rounded-lg">
                            {selectedIssue.description}
                          </p>
                        </div>

                  {selectedIssue.photos && selectedIssue.photos.length > 0 && (
                          <div>
                      <h4 className="font-medium text-[#5e6461] mb-2">Photos ({selectedIssue.photos.length})</h4>
                            <div className="grid grid-cols-2 gap-2">
                        {selectedIssue.photos.map((photo: IssuePhoto) => (
                          <div key={photo.id} className="relative">
                            <img
                              src={photo.file_url}
                              alt={photo.caption || `Photo ${photo.sort_order + 1}`}
                              className="w-full h-24 object-cover rounded-lg border cursor-pointer"
                              onClick={() => window.open(photo.file_url, '_blank')}
                            />
                          </div>
                              ))}
                            </div>
                          </div>
                        )}

                  {selectedIssue.updates && selectedIssue.updates.length > 0 && (
                        <div>
                      <h4 className="font-medium text-[#5e6461] mb-2">Recent Updates ({selectedIssue.updates.length})</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedIssue.updates.slice(0, 5).map((update: IssueUpdate) => (
                          <div key={update.id} className="text-sm p-3 bg-gray-50 rounded-lg">
                                  <div className="flex justify-between items-start mb-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {issuesUtils.getUpdateTypeLabel(update.update_type)}
                                </Badge>
                                {update.is_public && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">Public</Badge>
                                )}
                              </div>
                                    <span className="text-xs text-[#5e6461]/50">
                                {issuesUtils.formatDateTime(update.created_at)}
                                    </span>
                                  </div>
                            {update.title && (
                              <div className="font-medium text-[#5e6461] mb-1">{update.title}</div>
                            )}
                            <p className="text-[#5e6461]/70">{update.description}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                  )}
                      </div>
                    </div>
            )}
            
                    <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                        Close
                      </Button>
              {selectedIssue && (
                <Button 
                  className="bg-[#d36530] hover:bg-[#d36530]/90" 
                  onClick={() => openUpdateDialog(selectedIssue)}
                >
                  <Send className="h-4 w-4 mr-2" />
                        Add Update
                      </Button>
              )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

              {/* Add Update Dialog */}
              <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Issue Update</DialogTitle>
              <DialogDescription>Add a status update or message to the issue.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="update-type">Update Type</Label>
                <Select 
                  value={newUpdate.update_type} 
                  onValueChange={(value) => setNewUpdate({...newUpdate, update_type: value as any})}
                >
                        <SelectTrigger>
                    <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                    <SelectItem value="message">Message</SelectItem>
                    <SelectItem value="status_change">Status Change</SelectItem>
                    <SelectItem value="resolution">Resolution</SelectItem>
                    <SelectItem value="system">System Update</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

              {newUpdate.update_type === "status_change" && (
                    <div className="space-y-2">
                  <Label htmlFor="new-status">New Status</Label>
                  <Select 
                    value={newUpdate.new_status} 
                    onValueChange={(value) => setNewUpdate({...newUpdate, new_status: value})}
                  >
                        <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
              )}

                    <div className="space-y-2">
                <Label htmlFor="update-title">Title (Optional)</Label>
                <Input
                  id="update-title"
                  placeholder="Enter update title..."
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({...newUpdate, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-description">Description</Label>
                      <Textarea
                  id="update-description"
                        placeholder="Enter update message..."
                        rows={4}
                  value={newUpdate.description}
                  onChange={(e) => setNewUpdate({...newUpdate, description: e.target.value})}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                <Switch 
                  id="public-update" 
                  checked={newUpdate.is_public}
                  onCheckedChange={(checked) => setNewUpdate({...newUpdate, is_public: checked})}
                />
                      <Label htmlFor="public-update">Make update visible to reporter</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>
                      Cancel
                    </Button>
              <Button 
                className="bg-[#d36530] hover:bg-[#d36530]/90"
                onClick={handleCreateUpdate}
                disabled={isUpdating || !newUpdate.description.trim()}
              >
                {isUpdating ? "Adding..." : "Add Update"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Create Issue Dialog */}
              <Dialog open={isCreateIssueOpen} onOpenChange={setIsCreateIssueOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Issue</DialogTitle>
                    <DialogDescription>
                      Create a new issue report from the admin perspective
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="issue-title">Title</Label>
                      <Input
                        id="issue-title"
                        value={newIssue.title}
                        onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                        placeholder="Brief description of the issue"
                      />
                    </div>
                    <div>
                      <Label htmlFor="issue-description">Description</Label>
                      <Textarea
                        id="issue-description"
                        value={newIssue.description}
                        onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                        placeholder="Detailed description of the issue"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="issue-category">Category</Label>
                      <Select value={newIssue.category_id} onValueChange={(value) => setNewIssue({ ...newIssue, category_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.icon} {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="issue-location">Location (Optional)</Label>
                      <Input
                        id="issue-location"
                        value={newIssue.location}
                        onChange={(e) => setNewIssue({ ...newIssue, location: e.target.value })}
                        placeholder="Address or location description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="issue-photos">Photos (Optional)</Label>
                      <Input
                        id="issue-photos"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          setNewIssue({ ...newIssue, photos: files })
                        }}
                      />
                      {newIssue.photos.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {newIssue.photos.length} photo(s) selected
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateIssueOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#d36530] hover:bg-[#d36530]/90"
                      onClick={handleCreateIssue}
                      disabled={isUpdating || !newIssue.title.trim() || !newIssue.description.trim() || !newIssue.category_id}
                    >
                      Create Issue
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

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
                <Input 
                  id="category-name" 
                  placeholder="Enter category name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-description">Description</Label>
                <Textarea 
                  id="category-description" 
                  placeholder="Enter category description..." 
                  rows={2}
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                />
                    </div>
                      <div className="space-y-2">
                <Label htmlFor="category-icon">Icon (Emoji)</Label>
                <Input 
                  id="category-icon" 
                  placeholder="Enter emoji (e.g., 🚧)"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCategoryOpen(false)}>
                      Cancel
                    </Button>
              <Button 
                className="bg-[#d36530] hover:bg-[#d36530]/90"
                onClick={handleCreateCategory}
                disabled={!newCategory.name.trim()}
              >
                Add Category
              </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

        {/* Status Change Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Issue Status</DialogTitle>
              <DialogDescription>
                Update the status of issue: {selectedIssue?.short_id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="statusDescription">Description (Optional)</Label>
                <Textarea
                  id="statusDescription"
                  placeholder="Add a description for this status change..."
                  value={statusDescription}
                  onChange={(e) => setStatusDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsStatusDialogOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#d36530] hover:bg-[#d36530]/90"
                onClick={() => {
                  if (selectedIssue && newStatus) {
                    handleUpdateIssueStatus(selectedIssue.id, newStatus, statusDescription)
                  }
                }}
                disabled={!newStatus || isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Message Dialog */}
        <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Message</DialogTitle>
              <DialogDescription>
                Add a message to issue: {selectedIssue?.short_id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="messageTitle">Title</Label>
                <Input
                  id="messageTitle"
                  placeholder="Message title..."
                  value={messageTitle}
                  onChange={(e) => setMessageTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="messageDescription">Message</Label>
                <Textarea
                  id="messageDescription"
                  placeholder="Enter your message..."
                  value={messageDescription}
                  onChange={(e) => setMessageDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-[#d36530] hover:bg-[#d36530]/90"
                onClick={handleCreateMessage}
                disabled={!messageTitle.trim() || !messageDescription.trim() || isUpdating}
              >
                {isUpdating ? "Adding..." : "Add Message"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          title={`Delete ${deletingItem?.type}`}
          description={`Are you sure you want to delete this ${deletingItem?.type}? This action cannot be undone.`}
          onConfirm={handleDeleteItem}
        />
        </main>
      </div>
  )
}

