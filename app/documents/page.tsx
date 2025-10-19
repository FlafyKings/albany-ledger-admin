"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Upload,
  Download,
  File,
  FileIcon as FilePdf,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  Archive as ArchiveIcon,
  Tag,
  ExternalLink,
  Copy,
  Edit,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
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
import { useToast } from "@/hooks/use-toast"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Header } from "@/components/Header"

// Import our API client
import { 
  documentsApi, 
  categoriesApi,
  documentsUtils,
  type Document,
  type DocumentCategory,
  type CreateDocumentData,
  type UpdateDocumentData,
  type CreateCategoryData,
  type UpdateCategoryData 
} from "@/lib/documents-api"

export default function DocumentsManagement() {
  // State management
  const [activeTab, setActiveTab] = useState("library")
  const [documents, setDocuments] = useState<Document[]>([])
  const [categories, setCategories] = useState<DocumentCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  // Dialog states
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isEditDocumentOpen, setIsEditDocumentOpen] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  // Loading states
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isCategoryCreating, setIsCategoryCreating] = useState(false)
  const [isCategoryUpdating, setIsCategoryUpdating] = useState(false)
  
  // Form states
  const [newDocument, setNewDocument] = useState<CreateDocumentData>({
    title: "",
    description: "",
    category_id: 0,
    document_type: "file"
  })
  const [newCategory, setNewCategory] = useState<CreateCategoryData>({
    display_name: "",
    description: "",
    color_hex: "#d36530",
    sort_order: 0
  })
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [editingCategory, setEditingCategory] = useState<DocumentCategory | null>(null)
  const [deletingItem, setDeletingItem] = useState<{ type: 'document' | 'category', item: Document | DocumentCategory } | null>(null)
  
  // Filter states
  const [sortBy, setSortBy] = useState<'title' | 'upload_date' | 'view_count'>('upload_date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  const { toast } = useToast()

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Load documents and categories
  const loadData = async () => {
    setIsLoading(true)
    try {
      const [documentsResult, categoriesResult] = await Promise.all([
        documentsApi.list({
          sort_by: sortBy,
          sort_order: sortOrder,
          ...(selectedCategory !== "all" && { category_id: parseInt(selectedCategory) }),
          ...(searchQuery && { search: searchQuery })
        }),
        categoriesApi.list()
      ])

      if (documentsResult.success && documentsResult.data) {
        setDocuments(documentsResult.data)
      } else {
        toast({
          title: "Error loading documents",
          description: documentsResult.error || "Unknown error",
          variant: "destructive"
        })
      }

      if (categoriesResult.success && categoriesResult.data) {
        setCategories(categoriesResult.data)
      } else {
        toast({
          title: "Error loading categories",
          description: categoriesResult.error || "Unknown error",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Failed to load documents and categories",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Reload data when filters change
  useEffect(() => {
    if (!isLoading) {
      loadData()
    }
  }, [sortBy, sortOrder, selectedCategory, searchQuery])

  // File input handling
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size must be less than 50MB",
          variant: "destructive"
        })
        return
      }
      
      // Check if file has content
      if (file.size === 0) {
        toast({
          title: "Invalid file",
          description: "File is empty",
          variant: "destructive"
        })
        return
      }
      
      setSelectedFile(file)
    }
  }

  // Document operations
  const handleCreateDocument = async () => {
    if (!newDocument.title || !newDocument.category_id) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    // Validate file is selected for file type documents
    if (newDocument.document_type === 'file' && !selectedFile) {
      toast({
        title: "Missing file",
        description: "Please select a file to upload",
        variant: "destructive"
      })
      return
    }

    // Validate external URL for external link documents
    if (newDocument.document_type === 'external_link' && !newDocument.external_url) {
      toast({
        title: "Missing URL",
        description: "Please provide an external URL",
        variant: "destructive"
      })
      return
    }

    setIsCreating(true)
    try {
      // Pass the selected file to the create API call
      const result = await documentsApi.create(newDocument, selectedFile || undefined)
      
      if (result.success && result.data) {
        toast({
          title: "Success",
          description: "Document created successfully"
        })
        
        setIsUploadOpen(false)
        resetNewDocumentForm()
        loadData()
    } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create document",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditDocument = async () => {
    if (!editingDocument) return

    setIsUpdating(true)
    try {
      const updateData: UpdateDocumentData = {
        title: editingDocument.title,
        description: editingDocument.description || undefined,
        category_id: editingDocument.category_id,
        ...(editingDocument.document_type === 'external_link' && { external_url: editingDocument.external_url })
      }

      const result = await documentsApi.update(editingDocument.id, updateData)
      if (result.success) {
        toast({
          title: "Success",
          description: "Document updated successfully"
        })
        
        setIsEditDocumentOpen(false)
        setEditingDocument(null)
        loadData()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update document",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteDocument = async (document: Document) => {
    try {
      const result = await documentsApi.delete(document.id)
      if (result.success) {
        toast({
          title: "Success",
          description: "Document deleted successfully"
        })
        loadData()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete document",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      })
    }
  }

  // Category operations
  const handleCreateCategory = async () => {
    if (!newCategory.display_name) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setIsCategoryCreating(true)
    try {
      const result = await categoriesApi.create(newCategory)
      if (result.success) {
        toast({
          title: "Success",
          description: "Category created successfully"
        })
        
        setIsCategoryOpen(false)
        resetNewCategoryForm()
        loadData()
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
    } finally {
      setIsCategoryCreating(false)
    }
  }

  const handleEditCategory = async () => {
    if (!editingCategory) return

    setIsCategoryUpdating(true)
    try {
      const updateData: UpdateCategoryData = {
        display_name: editingCategory.display_name,
        description: editingCategory.description || undefined,
        color_hex: editingCategory.color_hex,
        sort_order: editingCategory.sort_order
      }

      const result = await categoriesApi.update(editingCategory.id, updateData)
      if (result.success) {
        toast({
          title: "Success",
          description: "Category updated successfully"
        })
        
        setIsEditCategoryOpen(false)
        setEditingCategory(null)
        loadData()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update category",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive"
      })
    } finally {
      setIsCategoryUpdating(false)
    }
  }

  const handleDeleteCategory = async (category: DocumentCategory) => {
    try {
      const result = await categoriesApi.delete(category.id)
      if (result.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully"
        })
        loadData()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete category",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      })
    }
  }

  // Form reset functions
  const resetNewDocumentForm = () => {
    setNewDocument({
      title: "",
      description: "",
      category_id: 0,
      document_type: "file"
    })
    setSelectedFile(null)
  }

  const resetNewCategoryForm = () => {
    setNewCategory({
      display_name: "",
      description: "",
      color_hex: "#d36530",
      sort_order: Math.max(...categories.map(c => c.sort_order), 0) + 1
    })
  }

  // Helper functions
  const getFileIcon = (document: Document) => {
    if (document.document_type === 'external_link') {
      return <ExternalLink className="h-5 w-5 text-blue-600" />
    }
    
    if (!document.file_name) {
      return <File className="h-5 w-5 text-gray-600" />
    }
    
    const extension = document.file_name.split('.').pop()?.toLowerCase()
    const colorClass = documentsUtils.getFileIconColor(document.file_name, document.document_type)
    
    switch (extension) {
      case 'pdf':
        return <FilePdf className={`h-5 w-5 ${colorClass}`} />
      case 'doc':
      case 'docx':
        return <FileText className={`h-5 w-5 ${colorClass}`} />
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className={`h-5 w-5 ${colorClass}`} />
      case 'ppt':
      case 'pptx':
        return <FileText className={`h-5 w-5 ${colorClass}`} />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'webp':
        return <FileImage className={`h-5 w-5 ${colorClass}`} />
      case 'mp4':
      case 'avi':
      case 'mov':
        return <FileVideo className={`h-5 w-5 ${colorClass}`} />
      case 'zip':
      case 'rar':
      case '7z':
        return <ArchiveIcon className={`h-5 w-5 ${colorClass}`} />
      default:
        return <File className={`h-5 w-5 ${colorClass}`} />
    }
  }

  const openEditDocumentDialog = (document: Document) => {
    setEditingDocument(document)
    setIsEditDocumentOpen(true)
  }

  const openEditCategoryDialog = (category: DocumentCategory) => {
    setEditingCategory(category)
    setIsEditCategoryOpen(true)
  }

  const openDeleteDialog = (type: 'document' | 'category', item: Document | DocumentCategory) => {
    setDeletingItem({ type, item })
    setIsDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingItem) return

    if (deletingItem.type === 'document') {
      await handleDeleteDocument(deletingItem.item as Document)
    } else {
      await handleDeleteCategory(deletingItem.item as DocumentCategory)
    }
    
    setIsDeleteOpen(false)
    setDeletingItem(null)
  }

  return (
    <div className="flex-1 flex flex-col">
        {/* Header */}
      <Header 
        title="Documents Management" 
        subtitle="Manage document library, categories, and access"
      />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5e6461]/50" />
                <Input
                  placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 border-gray-300 focus:border-[#d36530] focus:ring-[#d36530]"
                />
            </div>
              </div>

          <Button 
            className="bg-[#d36530] hover:bg-[#d36530]/90" 
            onClick={() => {
              resetNewDocumentForm()
              setIsUploadOpen(true)
            }}
          >
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="library" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
                Document Library
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white"
              >
              <Tag className="h-4 w-4 mr-2" />
                Categories
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
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.display_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>


                      <div className="flex items-center gap-2">
                        <Label htmlFor="sort-by">Sort by:</Label>
                      <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="upload_date">Date</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                          <SelectItem value="view_count">Views</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      >
                      {sortOrder === "asc" ? (
                        <ArrowUp className="h-4 w-4 mr-2" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-2" />
                      )}
                        {sortOrder === "asc" ? "Ascending" : "Descending"}
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
                  {documents.length} documents total
                  {selectedCategory !== "all" && ` (filtered by category)`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                                <div>
                                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-1" />
                                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : documents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-[#5e6461]/70">
                            No documents found. Upload your first document to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        documents.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {getFileIcon(document)}
                              <div>
                                <div className="font-medium text-[#5e6461] flex items-center gap-2">
                                  {document.title}
                                </div>
                                {document.file_name && (
                                  <div className="text-sm text-[#5e6461]/70">
                                    {document.file_name}
                                  </div>
                                )}
                                {document.document_type === 'external_link' && document.external_url && (
                                  <div className="text-sm text-[#5e6461]/70">
                                    External Link
                                </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              style={{ 
                                backgroundColor: document.category_color || "#6B7280", 
                                color: "white" 
                              }}
                            >
                              {document.category_name || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>{documentsUtils.formatDate(document.upload_date)}</TableCell>
                          <TableCell>
                            {document.document_type === 'file' ? documentsUtils.formatFileSize(document.file_size) : 'External Link'}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {document.document_type === 'file' && document.file_url && (
                                  <DropdownMenuItem 
                                    onClick={() => window.open(document.file_url, '_blank')}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View File
                                </DropdownMenuItem>
                                )}
                                {document.document_type === 'external_link' && document.external_url && (
                                  <DropdownMenuItem 
                                    onClick={() => window.open(document.external_url, '_blank')}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Open Link
                                </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => openEditDocumentDialog(document)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Document
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => openDeleteDialog('document', document)}
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-[#5e6461]">Document Categories</CardTitle>
                    <CardDescription>Organize documents with categories and manage their settings</CardDescription>
                  </div>
                <Button 
                  className="bg-[#d36530] hover:bg-[#d36530]/90" 
                  onClick={() => {
                    resetNewCategoryForm()
                    setIsCategoryOpen(true)
                  }}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </CardHeader>
                <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Card key={index} className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                              <div>
                                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-1" />
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-8 bg-gray-200 rounded-full animate-pulse" />
                              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-8 text-[#5e6461]/70">
                    No categories found. Create your first category to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {categories
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((category) => (
                        <Card key={category.id} className="border border-gray-200">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: category.color_hex }}
                                ></div>
                                <div>
                                  <CardTitle className="text-lg text-[#5e6461]">{category.display_name}</CardTitle>
                                  <CardDescription>{category.description}</CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {category.document_count || 0} docs
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openEditCategoryDialog(category)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Category
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setSelectedCategory(category.id.toString())
                                        setActiveTab('library')
                                      }}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Documents
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
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between text-sm text-[#5e6461]/70">
                              <span>Order: #{category.sort_order}</span>
                              <span>Created: {documentsUtils.formatDate(category.created_at)}</span>
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

        {/* Dialogs */}
        {/* Upload Document Dialog */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="max-w-2xl">
                  <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>Upload a new document to the library with metadata.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                <Label htmlFor="document-type">Document Type</Label>
                <Select 
                  value={newDocument.document_type} 
                  onValueChange={(value) => setNewDocument({...newDocument, document_type: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">File Upload</SelectItem>
                    <SelectItem value="external_link">External Link</SelectItem>
                  </SelectContent>
                </Select>
                    </div>

              {newDocument.document_type === 'file' && (
                    <div className="space-y-2">
                  <Label htmlFor="file-upload">Document File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.xls,.xlsx,.csv,.ods,.ppt,.pptx,.odp,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.zip,.rar,.7z,.tar,.gz,.xml,.json,.md,.tex"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                      <span className="text-sm text-gray-600">
                        {selectedFile ? selectedFile.name : 'Click to select document file'}
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports documents, spreadsheets, presentations, images, archives and more. Maximum: 50MB
                    </p>
                    </div>
                </div>
              )}

              {newDocument.document_type === 'external_link' && (
                    <div className="space-y-2">
                  <Label htmlFor="external-url">External URL</Label>
                  <Input 
                    id="external-url" 
                    placeholder="https://example.com/document.pdf" 
                    value={newDocument.external_url || ''}
                    onChange={(e) => setNewDocument({...newDocument, external_url: e.target.value})}
                  />
                    </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                  <Label htmlFor="doc-title">Title *</Label>
                  <Input 
                    id="doc-title" 
                    placeholder="Enter document title" 
                    value={newDocument.title}
                    onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-category">Category *</Label>
                  <Select 
                    value={newDocument.category_id.toString()}
                    onValueChange={(value) => setNewDocument({...newDocument, category_id: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-description">Description</Label>
                <Textarea 
                  id="doc-description" 
                  placeholder="Enter document description..." 
                  rows={2}
                  value={newDocument.description || ''}
                  onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                />
                    </div>
                  </div>
                  <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                      Cancel
                    </Button>
              <Button 
                className="bg-[#d36530] hover:bg-[#d36530]/90"
                onClick={handleCreateDocument}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Document"}
              </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

        {/* Add Category Dialog */}
        <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                <DialogContent>
                  <DialogHeader>
              <DialogTitle>Add Document Category</DialogTitle>
              <DialogDescription>Create a new category for organizing documents.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                <Label htmlFor="category-name">Category Name *</Label>
                <Input 
                  id="category-name" 
                  placeholder="Meeting Minutes" 
                  value={newCategory.display_name}
                  onChange={(e) => setNewCategory({...newCategory, display_name: e.target.value})}
                />
                    </div>
                    <div className="space-y-2">
                <Label htmlFor="category-description">Description</Label>
                <Textarea 
                  id="category-description" 
                  placeholder="Enter category description..." 
                  rows={2}
                  value={newCategory.description || ''}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                />
                    </div>
                    <div className="space-y-2">
                <Label htmlFor="category-color">Color</Label>
                <Input 
                  id="category-color" 
                  type="color" 
                  value={newCategory.color_hex}
                  onChange={(e) => setNewCategory({...newCategory, color_hex: e.target.value})}
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
                disabled={isCategoryCreating}
              >
                {isCategoryCreating ? "Creating..." : "Add Category"}
              </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

        {/* Edit Document Dialog */}
        <Dialog open={isEditDocumentOpen} onOpenChange={setIsEditDocumentOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Document</DialogTitle>
              <DialogDescription>Update document information.</DialogDescription>
            </DialogHeader>
            {editingDocument && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title *</Label>
                    <Input 
                      id="edit-title" 
                      value={editingDocument.title}
                      onChange={(e) => setEditingDocument({...editingDocument, title: e.target.value})}
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="edit-category">Category *</Label>
                    <Select 
                      value={editingDocument.category_id.toString()}
                      onValueChange={(value) => setEditingDocument({...editingDocument, category_id: parseInt(value)})}
                    >
                        <SelectTrigger>
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.display_name}
                          </SelectItem>
                        ))}
                        </SelectContent>
                      </Select>
                    </div>
                </div>
                
                {editingDocument.document_type === 'external_link' && (
                    <div className="space-y-2">
                    <Label htmlFor="edit-external-url">External URL</Label>
                    <Input 
                      id="edit-external-url" 
                      value={editingDocument.external_url || ''}
                      onChange={(e) => setEditingDocument({...editingDocument, external_url: e.target.value})}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea 
                    id="edit-description" 
                    rows={2}
                    value={editingDocument.description || ''}
                    onChange={(e) => setEditingDocument({...editingDocument, description: e.target.value})}
                  />
                      </div>
                    </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDocumentOpen(false)}>
                Cancel
                        </Button>
              <Button 
                className="bg-[#d36530] hover:bg-[#d36530]/90"
                onClick={handleEditDocument}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Document"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update category information.</DialogDescription>
            </DialogHeader>
            {editingCategory && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category-name">Category Name *</Label>
                  <Input 
                    id="edit-category-name" 
                    value={editingCategory.display_name}
                    onChange={(e) => setEditingCategory({...editingCategory, display_name: e.target.value})}
                  />
                    </div>
                    <div className="space-y-2">
                  <Label htmlFor="edit-category-description">Description</Label>
                  <Textarea 
                    id="edit-category-description" 
                    rows={2}
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                  />
                      </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category-color">Color</Label>
                  <Input 
                    id="edit-category-color" 
                    type="color" 
                    value={editingCategory.color_hex}
                    onChange={(e) => setEditingCategory({...editingCategory, color_hex: e.target.value})}
                  />
                    </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-[#d36530] hover:bg-[#d36530]/90"
                onClick={handleEditCategory}
                disabled={isCategoryUpdating}
              >
                {isCategoryUpdating ? "Updating..." : "Update Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          title={`Delete ${deletingItem?.type === 'document' ? 'Document' : 'Category'}`}
          description={
            deletingItem?.type === 'document' 
              ? `Are you sure you want to delete "${(deletingItem.item as Document).title}"? This action cannot be undone.`
              : `Are you sure you want to delete the "${(deletingItem?.item as DocumentCategory)?.display_name}" category? All documents in this category will need to be moved to another category first.`
          }
          onConfirm={confirmDelete}
        />
        </main>
      </div>
  )
}

