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
  Trash2,
  Upload,
  Download,
  File,
  FileImage,
  FileVideo,
  FileIcon as FilePdf,
  FileSpreadsheet,
  Tag,
  Star,
  ExternalLink,
  Copy,
  Archive,
  History,
} from "lucide-react"
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
  { icon: FileText, label: "Documents", href: "/documents", active: true },
  { icon: AlertTriangle, label: "Issue Reports", href: "/issues" },
  { icon: MessageSquare, label: "Q&A", href: "/questions" },
  { icon: Mail, label: "Newsletter", href: "/newsletter" },
  { icon: MapPin, label: "Wards & Districts", href: "/wards" },
  { icon: Vote, label: "Elections", href: "/elections" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Shield, label: "User Management", href: "/users" },
  { icon: Settings, label: "System Config", href: "/settings" },
]

const documentCategories = [
  {
    id: 1,
    name: "Budget & Finance",
    description: "Budget documents, financial reports, and fiscal planning materials",
    documentCount: 45,
    color: "#dc2626",
    order: 1,
  },
  {
    id: 2,
    name: "Ordinances & Resolutions",
    description: "City ordinances, resolutions, and legal documents",
    documentCount: 128,
    color: "#7c3aed",
    order: 2,
  },
  {
    id: 3,
    name: "Meeting Minutes",
    description: "Official meeting minutes and transcripts",
    documentCount: 89,
    color: "#059669",
    order: 3,
  },
  {
    id: 4,
    name: "Planning & Zoning",
    description: "Planning documents, zoning maps, and development plans",
    documentCount: 67,
    color: "#d36530",
    order: 4,
  },
  {
    id: 5,
    name: "Public Safety",
    description: "Police reports, fire department documents, emergency plans",
    documentCount: 34,
    color: "#0891b2",
    order: 5,
  },
]

const documents = [
  {
    id: 1,
    title: "2024 Annual Budget Report",
    category: "Budget & Finance",
    categoryColor: "#dc2626",
    type: "PDF",
    size: "2.4 MB",
    author: "Finance Department",
    department: "Finance",
    uploadDate: "2024-03-15",
    downloads: 156,
    version: "1.2",
    tags: ["budget", "2024", "annual", "finance"],
    description: "Comprehensive annual budget report for fiscal year 2024",
    isQuickAccess: true,
  },
  {
    id: 2,
    title: "Downtown Parking Ordinance",
    category: "Ordinances & Resolutions",
    categoryColor: "#7c3aed",
    type: "DOC",
    size: "1.1 MB",
    author: "Legal Department",
    department: "Legal",
    uploadDate: "2024-03-12",
    downloads: 89,
    version: "2.0",
    tags: ["parking", "ordinance", "downtown", "legal"],
    description: "Updated parking regulations for downtown district",
    isQuickAccess: false,
  },
  {
    id: 3,
    title: "City Council Meeting Minutes - March 2024",
    category: "Meeting Minutes",
    categoryColor: "#059669",
    type: "PDF",
    size: "856 KB",
    author: "City Clerk",
    department: "Administration",
    uploadDate: "2024-03-10",
    downloads: 234,
    version: "1.0",
    tags: ["minutes", "council", "march", "2024"],
    description: "Official minutes from March 2024 city council meeting",
    isQuickAccess: true,
  },
  {
    id: 4,
    title: "Zoning Map Update 2024",
    category: "Planning & Zoning",
    categoryColor: "#d36530",
    type: "PDF",
    size: "5.2 MB",
    author: "Planning Department",
    department: "Planning",
    uploadDate: "2024-03-08",
    downloads: 67,
    version: "1.0",
    tags: ["zoning", "map", "planning", "2024"],
    description: "Updated city zoning map with recent changes",
    isQuickAccess: false,
  },
]

const quickAccessLinks = [
  {
    id: 1,
    title: "City Charter",
    description: "Official city charter and amendments",
    icon: "FileText",
    url: "/documents/city-charter.pdf",
    clicks: 1234,
  },
  {
    id: 2,
    title: "Emergency Contacts",
    description: "Emergency contact information",
    icon: "AlertTriangle",
    url: "/documents/emergency-contacts.pdf",
    clicks: 567,
  },
  {
    id: 3,
    title: "Public Records Request",
    description: "Form for requesting public records",
    icon: "File",
    url: "/forms/public-records-request",
    clicks: 890,
  },
  {
    id: 4,
    title: "Meeting Calendar",
    description: "Upcoming meetings and events",
    icon: "Calendar",
    url: "/calendar",
    clicks: 2345,
  },
]

export default function DocumentsManagement() {
  const [activeTab, setActiveTab] = useState("library")
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false)
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FilePdf className="h-5 w-5 text-red-600" />
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "xls":
      case "xlsx":
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />
      case "jpg":
      case "jpeg":
      case "png":
        return <FileImage className="h-5 w-5 text-purple-600" />
      case "mp4":
      case "avi":
        return <FileVideo className="h-5 w-5 text-orange-600" />
      default:
        return <File className="h-5 w-5 text-gray-600" />
    }
  }

  const getIconComponent = (iconName: string) => {
    const icons = {
      FileText,
      AlertTriangle,
      File,
      Calendar,
    }
    const IconComponent = icons[iconName] || FileText
    return <IconComponent className="h-5 w-5" />
  }

  const filteredDocuments = documents.filter((doc) => {
    if (selectedCategory === "all") return true
    return doc.category === selectedCategory
  })

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let aValue, bValue
    switch (sortBy) {
      case "title":
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case "date":
        aValue = new Date(a.uploadDate)
        bValue = new Date(b.uploadDate)
        break
      case "downloads":
        aValue = a.downloads
        bValue = b.downloads
        break
      case "size":
        aValue = Number.parseFloat(a.size)
        bValue = Number.parseFloat(b.size)
        break
      default:
        return 0
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return (
    <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#5e6461]">Documents Management</h2>
              <p className="text-[#5e6461]/70">Manage document library, categories, and access</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5e6461]/50" />
                <Input
                  placeholder="Search documents..."
                  className="pl-10 w-64 border-gray-300 focus:border-[#d36530] focus:ring-[#d36530]"
                />
              </div>

              <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsUploadOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="library" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                Document Library
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger
                value="quick-access"
                className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white"
              >
                Quick Access
              </TabsTrigger>
              <TabsTrigger value="search" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
                Search Config
              </TabsTrigger>
            </TabsList>

            {/* Document Library Tab */}
            <TabsContent value="library" className="space-y-6">
              {/* Filters and Controls */}
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="category-filter">Category:</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {documentCategories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="sort-by">Sort by:</Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                            <SelectItem value="downloads">Downloads</SelectItem>
                            <SelectItem value="size">Size</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {sortOrder === "asc" ? "Ascending" : "Descending"}
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Advanced Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export List
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Table */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Document Library</CardTitle>
                  <CardDescription>
                    {filteredDocuments.length} documents
                    {selectedCategory !== "all" && ` in ${selectedCategory}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Downloads</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedDocuments.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {getFileIcon(document.type)}
                              <div>
                                <div className="font-medium text-[#5e6461] flex items-center gap-2">
                                  {document.title}
                                  {document.isQuickAccess && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                                </div>
                                <div className="text-sm text-[#5e6461]/70">{document.description}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {document.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {document.tags.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{document.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge style={{ backgroundColor: document.categoryColor, color: "white" }}>
                              {document.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-[#5e6461]">{document.author}</div>
                              <div className="text-sm text-[#5e6461]/70">{document.department}</div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(document.uploadDate).toLocaleDateString()}</TableCell>
                          <TableCell>{document.size}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4 text-[#5e6461]/50" />
                              {document.downloads}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">v{document.version}</Badge>
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
                                  <Upload className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Edit Metadata
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <History className="h-4 w-4 mr-2" />
                                  Version History
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Archive className="h-4 w-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
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

              {/* Upload Document Dialog */}
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>Upload a new document to the library with metadata.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="file-upload">File</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Drag and drop your file here, or{" "}
                          <button className="text-[#d36530] hover:underline">browse</button>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Supports PDF, DOC, XLS, images, and more</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doc-title">Title</Label>
                        <Input id="doc-title" placeholder="Enter document title" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doc-category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {documentCategories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doc-author">Author</Label>
                        <Input id="doc-author" placeholder="Enter author name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doc-department">Department</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="administration">Administration</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="legal">Legal</SelectItem>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="public-safety">Public Safety</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doc-description">Description</Label>
                      <Textarea id="doc-description" placeholder="Enter document description..." rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doc-tags">Tags</Label>
                      <Input id="doc-tags" placeholder="Enter tags separated by commas" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="quick-access" />
                      <Label htmlFor="quick-access">Add to quick access</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-[#d36530] hover:bg-[#d36530]/90">Upload Document</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-[#5e6461]">Document Categories</CardTitle>
                    <CardDescription>Organize documents with categories and manage their settings</CardDescription>
                  </div>
                  <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsCategoryOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documentCategories
                      .sort((a, b) => a.order - b.order)
                      .map((category) => (
                        <Card key={category.id} className="border border-gray-200">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                                <div>
                                  <CardTitle className="text-lg text-[#5e6461]">{category.name}</CardTitle>
                                  <CardDescription>{category.description}</CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {category.documentCount} docs
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <FileText className="h-4 w-4 mr-2" />
                                      Edit Category
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Upload className="h-4 w-4 mr-2" />
                                      Reorder
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Upload className="h-4 w-4 mr-2" />
                                      View Documents
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Category
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between text-sm text-[#5e6461]/70">
                              <span>Order: #{category.order}</span>
                              <span>Last updated: 2 days ago</span>
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
                    <DialogTitle>Add Document Category</DialogTitle>
                    <DialogDescription>Create a new category for organizing documents.</DialogDescription>
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
                    <div className="space-y-2">
                      <Label htmlFor="category-color">Color</Label>
                      <Input id="category-color" type="color" defaultValue="#d36530" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-order">Display Order</Label>
                      <Input id="category-order" type="number" placeholder="1" />
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

            {/* Quick Access Tab */}
            <TabsContent value="quick-access" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#5e6461]">Quick Access Links</CardTitle>
                    <CardDescription>Manage frequently accessed documents and links</CardDescription>
                  </div>
                  <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsQuickAccessOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Quick Link
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickAccessLinks.map((link) => (
                      <Card key={link.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#d36530]/10 rounded-lg">{getIconComponent(link.icon)}</div>
                              <div>
                                <CardTitle className="text-lg text-[#5e6461]">{link.title}</CardTitle>
                                <CardDescription>{link.description}</CardDescription>
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
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Open Link
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Edit Link
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy URL
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove Link
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-[#5e6461]/70">
                            <span className="flex items-center gap-1">
                              <Upload className="h-4 w-4" />
                              {link.url}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {link.clicks} clicks
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add Quick Access Dialog */}
              <Dialog open={isQuickAccessOpen} onOpenChange={setIsQuickAccessOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Quick Access Link</DialogTitle>
                    <DialogDescription>
                      Create a quick access link for frequently used documents or pages.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="link-title">Title</Label>
                      <Input id="link-title" placeholder="Enter link title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="link-description">Description</Label>
                      <Input id="link-description" placeholder="Enter link description" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="link-url">URL</Label>
                      <Input id="link-url" placeholder="Enter URL or document path" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="link-icon">Icon</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FileText">Document</SelectItem>
                          <SelectItem value="AlertTriangle">Emergency</SelectItem>
                          <SelectItem value="File">File</SelectItem>
                          <SelectItem value="Calendar">Calendar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsQuickAccessOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-[#d36530] hover:bg-[#d36530]/90">Add Link</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Search Configuration Tab */}
            <TabsContent value="search" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-[#5e6461]">Search Index Settings</CardTitle>
                    <CardDescription>Configure document search and indexing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="full-text-search">Full-text Search</Label>
                        <p className="text-sm text-[#5e6461]/70">Enable searching within document content</p>
                      </div>
                      <Switch id="full-text-search" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-tagging">Auto-tagging</Label>
                        <p className="text-sm text-[#5e6461]/70">Automatically generate tags from content</p>
                      </div>
                      <Switch id="auto-tagging" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="ocr-enabled">OCR Processing</Label>
                        <p className="text-sm text-[#5e6461]/70">Extract text from images and scanned documents</p>
                      </div>
                      <Switch id="ocr-enabled" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="index-frequency">Index Update Frequency</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-[#5e6461]">Tag Management</CardTitle>
                    <CardDescription>Manage document tags and search terms</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="common-tags">Common Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {["budget", "ordinance", "meeting", "planning", "legal", "finance", "public-safety"].map(
                          (tag) => (
                            <Badge key={tag} variant="outline" className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {tag}
                              <button className="ml-1 hover:text-red-600">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-tag">Add New Tag</Label>
                      <div className="flex gap-2">
                        <Input id="new-tag" placeholder="Enter tag name" />
                        <Button size="sm" className="bg-[#d36530] hover:bg-[#d36530]/90">
                          Add
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tag-suggestions">Tag Suggestions</Label>
                      <div className="text-sm text-[#5e6461]/70">
                        Suggested tags based on recent uploads: "zoning", "emergency", "budget-2024"
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Search Analytics</CardTitle>
                  <CardDescription>Monitor search usage and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-[#5e6461]">1,234</div>
                      <div className="text-sm text-[#5e6461]/70">Total Searches</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-[#5e6461]">89%</div>
                      <div className="text-sm text-[#5e6461]/70">Success Rate</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-[#5e6461]">0.3s</div>
                      <div className="text-sm text-[#5e6461]/70">Avg Response Time</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium text-[#5e6461] mb-2">Popular Search Terms</h4>
                    <div className="flex flex-wrap gap-2">
                      {["budget", "ordinance", "meeting minutes", "zoning", "permits"].map((term) => (
                        <Badge key={term} variant="secondary">
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}
