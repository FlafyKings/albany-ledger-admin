"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MoreHorizontal, Eye, Trash2, MessageSquare, Plus, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Header } from "@/components/Header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { questionsApi, questionsUtils, type Question, type QuestionCategory } from "@/lib/questions-api"

export default function QuestionsManagement() {
  const router = useRouter()
  const { toast } = useToast()
  
  // State management
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [categories, setCategories] = useState<QuestionCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Dialog states
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isAnswerOpen, setIsAnswerOpen] = useState(false)
  const [isEditAnswerOpen, setIsEditAnswerOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  
  // Form states
  const [answer, setAnswer] = useState("")
  const [deletingItem, setDeletingItem] = useState<Question | null>(null)
  const [newCategory, setNewCategory] = useState({ name: "", description: "", icon: "❓" })
  const [editingCategory, setEditingCategory] = useState<QuestionCategory | null>(null)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<QuestionCategory | null>(null)
  const [isCategoryDeleteOpen, setIsCategoryDeleteOpen] = useState(false)
  const [isCreateQuestionOpen, setIsCreateQuestionOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    category_id: "",
    is_anonymous: false,
    submitter_name: "",
    submitter_email: ""
  })
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Apply filters when search/filter states change
  useEffect(() => {
    applyFilters()
  }, [allQuestions, searchTerm, statusFilter, categoryFilter])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [questionsResult, categoriesResult] = await Promise.all([
        questionsApi.listQuestions(),
        questionsApi.listCategories()
      ])

      if (questionsResult.success && questionsResult.data) {
        setAllQuestions(questionsResult.data.questions)
      }

      if (categoriesResult.success && categoriesResult.data) {
        setCategories(categoriesResult.data.categories)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      toast({
        title: "Error",
        description: "Failed to load questions data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...allQuestions]

    if (searchTerm) {
      filtered = filtered.filter(question =>
        question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (question.answer && question.answer.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(question => question.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(question => question.category_id.toString() === categoryFilter)
    }

    setFilteredQuestions(filtered)
  }

  // Question actions
  const openQuestionDetails = (question: Question) => {
    setSelectedQuestion(question)
    setIsDetailOpen(true)
  }

  const openAnswerDialog = (question: Question) => {
    setSelectedQuestion(question)
    setAnswer(question.answer || "")
    setIsAnswerOpen(true)
  }

  const openEditAnswerDialog = (question: Question) => {
    setSelectedQuestion(question)
    setAnswer(question.answer || "")
    setIsEditAnswerOpen(true)
  }

  const openDeleteDialog = (question: Question) => {
    setDeletingItem(question)
    setIsDeleteOpen(true)
  }

  const handleAnswerQuestion = async () => {
    if (!selectedQuestion || !answer.trim()) {
      toast({
        title: "Validation Error",
        description: "Answer is required",
        variant: "destructive"
      })
      return
    }

    try {
      setIsUpdating(true)
      const result = await questionsApi.answerQuestion(selectedQuestion.id, {
        answer: answer.trim()
      })

      if (result.success && result.data) {
        toast({
          title: "Success",
          description: "Question answered successfully"
        })
        
        setAllQuestions(prev => 
          prev.map(q => 
            q.id === selectedQuestion.id 
              ? { ...q, status: 'answered' as const, answer: answer.trim(), answered_at: new Date().toISOString() }
              : q
          )
        )
        
        setIsAnswerOpen(false)
        setAnswer("")
        setSelectedQuestion(null)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to answer question",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to answer question:', error)
      toast({
        title: "Error",
        description: "Failed to answer question. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEditAnswer = async () => {
    if (!selectedQuestion || !answer.trim()) {
      toast({
        title: "Validation Error",
        description: "Answer is required",
        variant: "destructive"
      })
      return
    }

    try {
      setIsUpdating(true)
      const result = await questionsApi.answerQuestion(selectedQuestion.id, {
        answer: answer.trim()
      })

      if (result.success && result.data) {
        toast({
          title: "Success",
          description: "Answer updated successfully"
        })
        
        setAllQuestions(prev => 
          prev.map(q => 
            q.id === selectedQuestion.id 
              ? { ...q, answer: answer.trim(), answered_at: new Date().toISOString() }
              : q
          )
        )
        
        setIsEditAnswerOpen(false)
        setAnswer("")
        setSelectedQuestion(null)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update answer",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to update answer:', error)
      toast({
        title: "Error",
        description: "Failed to update answer. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteQuestion = async () => {
    if (!deletingItem) return

    try {
      setIsUpdating(true)
      const result = await questionsApi.deleteQuestion(deletingItem.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Question deleted successfully"
        })
        
        setAllQuestions(prev => prev.filter(q => q.id !== deletingItem.id))
        
        setIsDeleteOpen(false)
        setDeletingItem(null)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete question",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to delete question:', error)
      toast({
        title: "Error",
        description: "Failed to delete question. Please try again.",
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
      setIsUpdating(true)
      const result = await questionsApi.createCategory(newCategory)
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
      console.error('Failed to create category:', error)
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEditCategory = (category: QuestionCategory) => {
    setEditingCategory(category)
    setNewCategory({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "❓"
    })
    setIsEditCategoryOpen(true)
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategory.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a category name",
        variant: "destructive"
      })
      return
    }

    try {
      setIsUpdating(true)
      const result = await questionsApi.updateCategory(editingCategory.id, newCategory)
      if (result.success) {
        toast({
          title: "Success",
          description: "Category updated successfully"
        })
        loadData()
        setIsEditCategoryOpen(false)
        setEditingCategory(null)
        setNewCategory({ name: "", description: "", icon: "❓" })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update category",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to update category:', error)
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteCategoryDialog = (category: QuestionCategory) => {
    setDeletingCategory(category)
    setIsCategoryDeleteOpen(true)
  }

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return

    try {
      setIsUpdating(true)
      const result = await questionsApi.deleteCategory(deletingCategory.id)
      if (result.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully"
        })
        loadData()
        setIsCategoryDeleteOpen(false)
        setDeletingCategory(null)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete category",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCreateQuestion = async () => {
    if (!newQuestion.question.trim() || !newQuestion.category_id) {
      toast({
        title: "Missing information",
        description: "Please provide a question and select a category",
        variant: "destructive"
      })
      return
    }

    // Validate submitter info if not anonymous
    if (!newQuestion.is_anonymous && (!newQuestion.submitter_name.trim() || !newQuestion.submitter_email.trim())) {
      toast({
        title: "Missing information",
        description: "Please provide submitter name and email, or mark as anonymous",
        variant: "destructive"
      })
      return
    }

    try {
      setIsUpdating(true)
      const questionData = {
        question: newQuestion.question.trim(),
        category_id: parseInt(newQuestion.category_id),
        is_anonymous: newQuestion.is_anonymous,
        ...(newQuestion.is_anonymous ? {} : {
          submitter_name: newQuestion.submitter_name.trim(),
          submitter_email: newQuestion.submitter_email.trim()
        })
      }

      const result = await questionsApi.createQuestion(questionData)
      if (result.success) {
        toast({
          title: "Success",
          description: `Question created successfully${result.data?.short_id ? ` - Tracking ID: ${result.data.short_id}` : ''}`
        })
        loadData()
        setIsCreateQuestionOpen(false)
        setNewQuestion({
          question: "",
          category_id: "",
          is_anonymous: false,
          submitter_name: "",
          submitter_email: ""
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create question",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to create question:', error)
      toast({
        title: "Error",
        description: "Failed to create question. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <Header 
        title="Questions & Answers" 
        subtitle="Manage citizen questions and provide answers"
      />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="questions" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
              Questions
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-[#d36530] data-[state=active]:text-white">
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-6">
              {/* Filters */}
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5e6461]/50" />
                    <Input
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 border-gray-300 focus:border-[#d36530] focus:ring-[#d36530]"
                    />
                  </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="status-filter">Status:</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="answered">Answered</SelectItem>
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
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsCreateQuestionOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Question
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Questions Table */}
              <Card className="border-gray-200">
                <CardHeader>
              <CardTitle className="text-[#5e6461]">Questions</CardTitle>
                  <CardDescription>{filteredQuestions.length} questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                    <TableHead>ID</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitter</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                  {isLoading ? (
                    Array.from({ length: 7 }).map((_, index) => (
                      <TableRow key={index} className="animate-pulse">
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full max-w-[200px]" />
                              <Skeleton className="h-3 w-3/4 max-w-[150px]" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-24 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 rounded ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredQuestions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <MessageSquare className="h-8 w-8 text-gray-400" />
                          <p className="text-gray-500">No questions found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuestions.map((question) => (
                        <TableRow key={question.id}>
                        <TableCell className="font-medium">{question.short_id}</TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                            <div className="font-medium text-[#5e6461] truncate">
                              {question.question}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                          <Badge variant="secondary">
                            {question.category_name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                          <Badge className={questionsUtils.getStatusColor(question.status)}>
                            {questionsUtils.getStatusIcon(question.status)}
                            <span className="ml-1">{questionsUtils.getStatusLabel(question.status)}</span>
                          </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-[#5e6461]">
                              {question.is_anonymous ? "Anonymous" : (question.submitter_name || "Unknown")}
                              </div>
                            {!question.is_anonymous && question.submitter_email && (
                              <div className="text-sm text-[#5e6461]/70">{question.submitter_email}</div>
                              )}
                            </div>
                          </TableCell>
                        <TableCell>{questionsUtils.formatDate(question.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openQuestionDetails(question)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              {question.status === 'pending' && (
                                <DropdownMenuItem onClick={() => openAnswerDialog(question)}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Answer Question
                                </DropdownMenuItem>
                              )}
                              {question.status === 'answered' && (
                                <DropdownMenuItem onClick={() => openEditAnswerDialog(question)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Answer
                                </DropdownMenuItem>
                              )}
                                <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => openDeleteDialog(question)}
                              >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Question
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

          <TabsContent value="categories" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[#5e6461]">Question Categories</CardTitle>
                  <CardDescription>Categories are shared with Issues</CardDescription>
                </div>
                <Button className="bg-[#d36530] hover:bg-[#d36530]/90" onClick={() => setIsCategoryOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <Card key={idx} className="border border-gray-200">
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
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Skeleton className="h-4 w-12 mb-1" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                            <div>
                              <Skeleton className="h-4 w-14 mb-1" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-8 text-[#5e6461]/70">
                    <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No categories found. Create your first category to get started.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <Card key={category.id} className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg" style={{ backgroundColor: `#d3653020`, color: '#d36530' }}>
                                {/* simple emoji/icon fallback */}
                                <span className="text-base">{category.icon || '❓'}</span>
                              </div>
                              <div>
                                <CardTitle className="text-lg text-[#5e6461]">{category.name}</CardTitle>
                                {category.description && (
                                  <CardDescription>{category.description}</CardDescription>
                                )}
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Category
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteCategoryDialog(category)}
                                >
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
                              <span className="font-medium text-[#5e6461]">Created</span>
                              <p className="text-[#5e6461]/70">{questionsUtils.formatDate(category.created_at)}</p>
                            </div>
                            <div>
                              <span className="font-medium text-[#5e6461]">Updated</span>
                              <p className="text-[#5e6461]/70">{questionsUtils.formatDate(category.updated_at)}</p>
                            </div>
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
      </main>

              {/* Question Details Dialog */}
              {selectedQuestion && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                Question Details - {selectedQuestion.short_id}
                <Badge className={questionsUtils.getStatusColor(selectedQuestion.status)}>
                  {questionsUtils.getStatusIcon(selectedQuestion.status)}
                  <span className="ml-1">{questionsUtils.getStatusLabel(selectedQuestion.status)}</span>
                </Badge>
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
                      <span>{selectedQuestion.category_name}</span>
                            </div>
                            <div className="flex justify-between">
                      <span className="text-[#5e6461]/70">Status:</span>
                      <Badge className={questionsUtils.getStatusColor(selectedQuestion.status)}>
                        {questionsUtils.getStatusLabel(selectedQuestion.status)}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                      <span className="text-[#5e6461]/70">Submitted:</span>
                      <span>{questionsUtils.formatDate(selectedQuestion.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-[#5e6461] mb-2">Submitter Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#5e6461]/70">Name:</span>
                              <span>
                        {selectedQuestion.is_anonymous ? "Anonymous" : (selectedQuestion.submitter_name || "Unknown")}
                              </span>
                            </div>
                    {!selectedQuestion.is_anonymous && selectedQuestion.submitter_email && (
                              <div className="flex justify-between">
                                <span className="text-[#5e6461]/70">Email:</span>
                        <span>{selectedQuestion.submitter_email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {selectedQuestion.answer && (
                        <div>
                          <h4 className="font-medium text-[#5e6461] mb-2">Answer</h4>
                          <p className="text-[#5e6461] bg-green-50 p-3 rounded-lg border border-green-200">
                            {selectedQuestion.answer}
                          </p>
                  {selectedQuestion.answered_at && (
                          <div className="text-sm text-[#5e6461]/70 mt-2">
                      Answered on {questionsUtils.formatDate(selectedQuestion.answered_at)}
                          </div>
                  )}
                        </div>
                      )}
                    </div>
                    <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                        Close
                      </Button>
              {selectedQuestion.status === 'pending' && (
                <Button 
                  className="bg-[#d36530] hover:bg-[#d36530]/90" 
                  onClick={() => {
                    setIsDetailOpen(false)
                    openAnswerDialog(selectedQuestion)
                  }}
                >
                  Answer Question
                      </Button>
              )}
              {selectedQuestion.status === 'answered' && (
                <Button 
                  className="bg-[#d36530] hover:bg-[#d36530]/90" 
                  onClick={() => {
                    setIsDetailOpen(false)
                    openEditAnswerDialog(selectedQuestion)
                  }}
                >
                  Edit Answer
                </Button>
              )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Answer Dialog */}
              <Dialog open={isAnswerOpen} onOpenChange={setIsAnswerOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
            <DialogTitle>Answer Question</DialogTitle>
            <DialogDescription>
              Provide an answer to this question. The question will be marked as answered.
            </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
            {selectedQuestion && (
              <div>
                <Label htmlFor="question-text" className="text-sm font-medium text-gray-500">Question</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedQuestion.question}</p>
                    </div>
              </div>
            )}
            <div>
                      <Label htmlFor="answer-content">Answer</Label>
                      <Textarea
                        id="answer-content"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter your answer..."
                        rows={6}
                        className="resize-none"
                      />
                    </div>
                  </div>
                  <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAnswerOpen(false)}
              disabled={isUpdating}
            >
                      Cancel
                    </Button>
            <Button 
              className="bg-[#d36530] hover:bg-[#d36530]/90"
              onClick={handleAnswerQuestion}
              disabled={!answer.trim() || isUpdating}
            >
              {isUpdating ? "Answering..." : "Answer Question"}
                                </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Edit Answer Dialog */}
              <Dialog open={isEditAnswerOpen} onOpenChange={setIsEditAnswerOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
            <DialogTitle>Edit Answer</DialogTitle>
            <DialogDescription>
              Update the answer to this question.
            </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
            {selectedQuestion && (
              <div>
                <Label htmlFor="question-text-edit" className="text-sm font-medium text-gray-500">Question</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedQuestion.question}</p>
                    </div>
              </div>
            )}
            <div>
                      <Label htmlFor="answer-content-edit">Answer</Label>
                      <Textarea
                        id="answer-content-edit"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter your updated answer..."
                        rows={6}
                        className="resize-none"
                      />
                    </div>
                  </div>
                  <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditAnswerOpen(false)}
              disabled={isUpdating}
            >
                      Cancel
                    </Button>
            <Button 
              className="bg-[#d36530] hover:bg-[#d36530]/90"
              onClick={handleEditAnswer}
              disabled={!answer.trim() || isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Answer"}
                                </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteQuestion}
        title="Delete Question"
        description={`Are you sure you want to delete question ${deletingItem?.short_id}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />

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
            <Button variant="outline" onClick={() => setIsCategoryOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button 
              className="bg-[#d36530] hover:bg-[#d36530]/90"
              onClick={handleCreateCategory}
              disabled={!newCategory.name.trim() || isUpdating}
            >
              {isUpdating ? "Adding..." : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Question Category</DialogTitle>
            <DialogDescription>Update the category information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Category Name</Label>
              <Input 
                id="edit-category-name" 
                placeholder="Enter category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category-description">Description</Label>
              <Textarea 
                id="edit-category-description" 
                placeholder="Enter category description..." 
                rows={2}
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category-icon">Icon (Emoji)</Label>
              <Input 
                id="edit-category-icon" 
                placeholder="Enter emoji (e.g., 🚧)"
                value={newCategory.icon}
                onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button 
              className="bg-[#d36530] hover:bg-[#d36530]/90"
              onClick={handleUpdateCategory}
              disabled={!newCategory.name.trim() || isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation Dialog */}
      <ConfirmationDialog
        open={isCategoryDeleteOpen}
        onOpenChange={setIsCategoryDeleteOpen}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        description={`Are you sure you want to delete the category "${deletingCategory?.name}"? This action cannot be undone and may affect existing questions.`}
        confirmText="Delete"
        variant="destructive"
      />

      {/* Create Question Dialog */}
      <Dialog open={isCreateQuestionOpen} onOpenChange={setIsCreateQuestionOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Question</DialogTitle>
            <DialogDescription>
              Create a new question from the admin perspective
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="question-text">Question</Label>
              <Textarea
                id="question-text"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                placeholder="Enter the question text..."
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="question-category">Category</Label>
              <Select 
                value={newQuestion.category_id} 
                onValueChange={(value) => setNewQuestion({ ...newQuestion, category_id: value })}
              >
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

            <div className="flex items-center space-x-2">
              <Switch
                id="anonymous-mode"
                checked={newQuestion.is_anonymous}
                onCheckedChange={(checked) => setNewQuestion({ ...newQuestion, is_anonymous: checked })}
              />
              <Label htmlFor="anonymous-mode">Submit as anonymous question</Label>
            </div>

            {!newQuestion.is_anonymous && (
              <>
                <div>
                  <Label htmlFor="submitter-name">Submitter Name</Label>
                  <Input
                    id="submitter-name"
                    value={newQuestion.submitter_name}
                    onChange={(e) => setNewQuestion({ ...newQuestion, submitter_name: e.target.value })}
                    placeholder="Enter submitter's name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="submitter-email">Submitter Email</Label>
                  <Input
                    id="submitter-email"
                    type="email"
                    value={newQuestion.submitter_email}
                    onChange={(e) => setNewQuestion({ ...newQuestion, submitter_email: e.target.value })}
                    placeholder="Enter submitter's email"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateQuestionOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button 
              className="bg-[#d36530] hover:bg-[#d36530]/90"
              onClick={handleCreateQuestion}
              disabled={!newQuestion.question.trim() || !newQuestion.category_id || isUpdating}
            >
              {isUpdating ? "Creating..." : "Create Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
  )
}
