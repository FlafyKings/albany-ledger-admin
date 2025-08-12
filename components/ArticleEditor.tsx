"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bold, Italic, LinkIcon, Image, List, ListOrdered, Quote, Code, Eye, ArrowLeft } from 'lucide-react'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Import content API functions
import { articlesApi, contentUtils, type CreateArticleData, type Article } from "@/lib/content-api"

// Import toast
import { useToast } from "@/hooks/use-toast"

export interface ArticleEditorData {
  id?: number
  title: string
  excerpt?: string
  content?: string
  category?: string
  status?: string
  featured?: boolean
  author: string
  publish_date?: string
  image_url?: string

  meta_description?: string
}

interface ArticleEditorProps {
  mode: 'create' | 'edit'
  initialData?: ArticleEditorData
  onSubmit?: (data: ArticleEditorData) => void
}

export default function ArticleEditor({ mode, initialData, onSubmit }: ArticleEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  // Form state
  const [title, setTitle] = useState(initialData?.title || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [category, setCategory] = useState(initialData?.category || "")
  const [status, setStatus] = useState(initialData?.status || "draft")
  const [author, setAuthor] = useState(initialData?.author || "")

  const [featured, setFeatured] = useState(initialData?.featured || false)

  const [selectedImage, setSelectedImage] = useState<string | null>(initialData?.image_url || null)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("write")
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "")
      setExcerpt(initialData.excerpt || "")
      setContent(initialData.content || "")
      setCategory(initialData.category || "")
      setStatus(initialData.status || "draft")
      setAuthor(initialData.author || "")

      setFeatured(initialData.featured || false)
      setSelectedImage(initialData.image_url || null)
    }
  }, [initialData])

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.getElementById("content-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selectedText = text.substring(start, end)

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
    setContent(newText)

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const insertImage = (url: string, alt = "") => {
    insertMarkdown(`![${alt || 'Image'}](${url})`)
    setShowImageDialog(false)
  }

  const insertLink = (url: string, text = "") => {
    insertMarkdown(`[${text || url}](${url})`)
    setShowLinkDialog(false)
  }

  const handleSave = async () => {
    if (!title.trim() || !author.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Required Fields",
        description: "Please fill in the title and author fields.",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const articleData: CreateArticleData = {
        title: title.trim(),
        excerpt: excerpt.trim() || undefined,
        content: content.trim() || undefined,
        category: category || undefined,
        status: mode === 'edit' ? status : 'Draft',
        featured,
        author: author.trim(),
        publish_date: undefined,
        image_url: selectedImage || undefined,

        meta_description: excerpt.trim() || undefined
      }

      let response
      if (mode === 'edit' && initialData?.id) {
        response = await articlesApi.update(initialData.id, articleData)
      } else {
        response = await articlesApi.create(articleData)
      }
      
      if (response.success && response.data) {
        toast({
          title: mode === 'edit' ? "Article Updated" : "Article Saved",
          description: mode === 'edit' ? "Article updated successfully!" : "Article saved as draft successfully!",
        })
        
        if (mode === 'create') {
          router.push(`/content/articles/${response.data.id}/edit`)
        } else {
          // In edit mode, update the form with the latest data
          if (response.data) {
            setTitle(response.data.title)
            setExcerpt(response.data.excerpt || "")
            setContent(response.data.content || "")
            setCategory(response.data.category || "")
            setStatus(response.data.status)
            setAuthor(response.data.author)

            setFeatured(response.data.featured)
            setSelectedImage(response.data.image_url || null)
          }
          onSubmit?.(articleData)
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || `Failed to ${mode === 'edit' ? 'update' : 'save'} article`,
        })
      }
    } catch (error) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'saving'} article:`, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${mode === 'edit' ? 'update' : 'save'} article. Please try again.`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublish = async () => {
    if (!title.trim() || !author.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Required Fields",
        description: "Please fill in the title and author fields.",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const articleData: CreateArticleData = {
        title: title.trim(),
        excerpt: excerpt.trim() || undefined,
        content: content.trim() || undefined,
        category: category || undefined,
        status: 'Published',
        featured,
        author: author.trim(),
        publish_date: new Date().toISOString(),
        image_url: selectedImage || undefined,

        meta_description: excerpt.trim() || undefined
      }

      let response
      if (mode === 'edit' && initialData?.id) {
        response = await articlesApi.update(initialData.id, articleData)
      } else {
        response = await articlesApi.create(articleData)
      }
      
      if (response.success && response.data) {
        toast({
          title: "Article Published",
          description: "Article published successfully!",
        })
        router.push('/content')
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || 'Failed to publish article',
        })
      }
    } catch (error) {
      console.error('Error publishing article:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to publish article. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderPreview = () => {
    const processedContent = content
      .replace(/^# (.*)$/gim, '<h1 class="text-2xl font-bold text-[#5e6461] mb-4">$1</h1>')
      .replace(/^## (.*)$/gim, '<h2 class="text-xl font-semibold text-[#5e6461] mb-3">$1</h2>')
      .replace(/^### (.*)$/gim, '<h3 class="text-lg font-medium text-[#5e6461] mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-[#d36530] hover:underline">$1</a>')
      .replace(/^- (.*)$/gim, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*)$/gim, '<li class="ml-4">$1</li>')
      .split('\n')
      .map(line => line.trim() ? `<p class="mb-2">${line}</p>` : '<br>')
      .join('')

    return (
      <div 
        className="prose max-w-none text-[#5e6461]"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/content" className="text-sm text-[#5e6461]/70 hover:text-[#d36530] inline-flex items-center gap-2 cursor-pointer">
              <span aria-hidden>←</span>
              Content
            </Link>
            <h1 className="text-2xl font-bold text-[#5e6461] mt-2">
              {mode === 'edit' ? 'Edit Article' : 'Create Article'}
            </h1>
            <p className="text-[#5e6461]/70">
              {mode === 'edit' ? 'Update your article content' : 'Create a new article for your publication'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave} disabled={isSubmitting} className="bg-transparent">
              {isSubmitting ? 'Saving...' : (mode === 'edit' ? 'Update Draft' : 'Save as Draft')}
            </Button>
            <Button onClick={handlePublish} disabled={isSubmitting} className="bg-[#d36530] hover:bg-[#d36530]/90">
              {isSubmitting ? 'Publishing...' : 'Publish Article'}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Article Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Article Details</CardTitle>
                  <CardDescription>Basic information about your article</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter article title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Brief summary of the article..."
                      rows={3}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="community">Community</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        placeholder="Author name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                    </div>
                  </div>


                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                  <CardDescription>Write your article content using Markdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="write">Write</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="write" className="space-y-4">
                      {/* Toolbar */}
                      <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-md bg-gray-50">
                        <Button variant="outline" size="sm" onClick={() => insertMarkdown('**', '**')}>
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => insertMarkdown('*', '*')}>
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => insertMarkdown('`', '`')}>
                          <Code className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => insertMarkdown('\n- ', '')}>
                          <List className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => insertMarkdown('\n1. ', '')}>
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => insertMarkdown('\n> ', '')}>
                          <Quote className="h-4 w-4" />
                        </Button>
                        
                        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Image className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Insert Image</DialogTitle>
                              <DialogDescription>Add an image to your article</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="image-url">Image URL</Label>
                                <Input id="image-url" placeholder="https://example.com/image.jpg" />
                              </div>
                              <div>
                                <Label htmlFor="image-alt">Alt Text</Label>
                                <Input id="image-alt" placeholder="Describe the image" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                                Cancel
                              </Button>
                              <Button onClick={() => {
                                const url = (document.getElementById('image-url') as HTMLInputElement)?.value
                                const alt = (document.getElementById('image-alt') as HTMLInputElement)?.value
                                if (url) insertImage(url, alt)
                              }}>
                                Insert Image
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Insert Link</DialogTitle>
                              <DialogDescription>Add a link to your article</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="link-url">URL</Label>
                                <Input id="link-url" placeholder="https://example.com" />
                              </div>
                              <div>
                                <Label htmlFor="link-text">Link Text</Label>
                                <Input id="link-text" placeholder="Click here" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                                Cancel
                              </Button>
                              <Button onClick={() => {
                                const url = (document.getElementById('link-url') as HTMLInputElement)?.value
                                const text = (document.getElementById('link-text') as HTMLInputElement)?.value
                                if (url) insertLink(url, text)
                              }}>
                                Insert Link
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <Textarea
                        id="content-editor"
                        placeholder="Write your article content here using Markdown..."
                        rows={20}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="font-mono"
                      />
                    </TabsContent>
                    
                    <TabsContent value="preview">
                      <div className="border border-gray-200 rounded-md p-4 min-h-[500px] bg-white">
                        {content ? renderPreview() : (
                          <p className="text-[#5e6461]/60 italic">Nothing to preview yet. Switch to Write tab to add content.</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publishing Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                  <CardDescription>Control when and how your article is published</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Featured Article</Label>
                    <Switch
                      id="featured"
                      checked={featured}
                      onCheckedChange={setFeatured}
                    />
                  </div>

                  {mode === 'edit' && (
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                  <CardDescription>Add a featured image to your article</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedImage ? (
                    <div className="space-y-2">
                      <div className="aspect-video rounded-md overflow-hidden border">
                        <img 
                          src={selectedImage} 
                          alt="Featured" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedImage(null)} className="w-full">
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="aspect-video rounded-md border border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">No image selected</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="image-url-input">Image URL</Label>
                    <Input
                      id="image-url-input"
                      placeholder="https://example.com/image.jpg"
                      value={selectedImage || ""}
                      onChange={(e) => setSelectedImage(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
